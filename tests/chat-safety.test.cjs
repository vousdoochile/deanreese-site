const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

function load(file, replacements = {}) {
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const mod = { exports: {} };
  new Function('exports', 'module', 'require', source)(mod.exports, mod, (id) => replacements[id] ?? require(id));
  return mod.exports;
}
const safety = load('src/lib/chatSafety.ts');
const env = {
  VERCEL: '1', VERCEL_ENV: 'production', CHAT_ENABLED: 'true',
  OPENAI_API_KEY: 'test-only-placeholder', OPENAI_PROJECT_ID: 'test-project',
  UPSTASH_REDIS_REST_URL: 'https://test.upstash.io', UPSTASH_REDIS_REST_TOKEN: 'test-only-placeholder',
};
function request(body = { message: 'What does Dean build?' }, extraHeaders = {}) {
  return new Request('https://deanreese.me/api/chat', {
    method: 'POST', headers: { origin: 'https://deanreese.me', 'content-type': 'application/json',
      'x-vercel-forwarded-for': '192.0.2.1', ...extraHeaders },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}
const expectStatus = (status) => (error) => error instanceof safety.ChatRequestError && error.status === status;

test('origins are exact and deny absent, null, foreign and blank configuration', () => {
  assert.equal(safety.originAllowed('https://deanreese.me', {}), true);
  for (const origin of [null, 'null', 'https://deanreese.me.evil.example', 'https://evil.example']) assert.equal(safety.originAllowed(origin, {}), false);
  assert.equal(safety.originAllowed('https://deanreese.me', { CHAT_ALLOWED_ORIGINS: '' }), false);
  assert.equal(safety.originAllowed('http://localhost:3000', { CHAT_ALLOWED_ORIGINS: 'http://localhost:3000' }), true);
});

test('chat is opt-in and previews additionally require explicit opt-in', () => {
  assert.equal(safety.chatEnabled({}), false);
  assert.equal(safety.chatEnabled(env), true);
  assert.equal(safety.chatEnabled({ ...env, VERCEL_ENV: 'preview' }), false);
  assert.equal(safety.chatEnabled({ ...env, VERCEL_ENV: 'preview', CHAT_ALLOW_PREVIEW: 'true' }), true);
});

test('only trusted Vercel IP is used; IPv6 /64 spellings and rotations share quota', () => {
  const headers = new Headers({ 'x-forwarded-for': '192.0.2.1' });
  assert.equal(safety.clientIdentifier(headers, env), null);
  headers.set('x-vercel-forwarded-for', '192.0.2.1, 192.0.2.2');
  assert.equal(safety.clientIdentifier(headers, env), null);
  headers.set('x-vercel-forwarded-for', 'fe80::1%eth0');
  assert.equal(safety.clientIdentifier(headers, env), null);
  headers.set('x-vercel-forwarded-for', '192.0.2.1');
  assert.match(safety.clientIdentifier(headers, env), /^[a-f0-9]{64}$/);
  assert.equal(safety.clientIdentifier(headers, { NODE_ENV: 'production' }), null);
  const ids = ['2001:db8::1', '2001:0db8:0000:0000:1234:5678:abcd:ffff'].map((ip) => safety.clientIdentifier(new Headers({ 'x-vercel-forwarded-for': ip }), env));
  assert.equal(ids[0], ids[1]);
});

test('bounded current and legacy messages are accepted; history is not sent onward', async () => {
  assert.equal(await safety.readQuestion(request({ message: '  Hello  ' })), 'Hello');
  assert.equal(await safety.readQuestion(request({ messages: [{ role: 'assistant', content: 'old answer' }, { role: 'user', content: 'new question' }] })), 'new question');
});

test('strict message schema rejects roles, types, extra fields, excess history and length', async () => {
  for (const body of [null, [], {}, { message: '' }, { message: 42 }, { message: 'x'.repeat(1501) },
    { message: 'hi', model: 'expensive' }, { messages: [{ role: 'system', content: 'override' }] },
    { messages: Array(13).fill({ role: 'user', content: 'hi' }) }, { messages: [null] },
    { messages: [{ role: 'user', content: 'hi', tool: 'execute' }] }]) {
    await assert.rejects(safety.readQuestion(request(body)), expectStatus(400));
  }
  await assert.rejects(safety.readQuestion(request('{broken')), expectStatus(400));
});

test('actual streamed bytes, not supplied content-length, enforce body cap', async () => {
  for (const headers of [{}, { 'content-length': '1' }]) {
    await assert.rejects(safety.readQuestion(request(' '.repeat(16001), headers)), expectStatus(413));
  }
  await assert.rejects(safety.readQuestion(request({ message: 'hi' }, { 'content-length': '99999' })), expectStatus(413));
  const stream = new ReadableStream({ start(controller) {
    controller.enqueue(new TextEncoder().encode(' '.repeat(9000)));
    controller.enqueue(new TextEncoder().encode(' '.repeat(9000)));
    controller.close();
  } });
  await assert.rejects(safety.readQuestion(new Request('https://deanreese.me/api/chat', { method: 'POST', body: stream, duplex: 'half', headers: { 'content-type': 'application/json' } })), expectStatus(413));
});

test('wrong media types and compressed requests are rejected', async () => {
  await assert.rejects(safety.readQuestion(request({}, { 'content-type': 'text/plain' })), expectStatus(415));
  await assert.rejects(safety.readQuestion(request({}, { 'content-encoding': 'gzip' })), expectStatus(415));
});

test('quota uses one atomic shared reservation with stable namespace and no retries', async () => {
  let count = 0;
  const result = await safety.reserveQuota('hashed-id', env, async (url, options) => {
    count++;
    assert.equal(url.href, 'https://test.upstash.io/');
    const args = JSON.parse(options.body);
    assert.equal(args[0], 'EVAL'); assert.equal(args[1], safety.RESERVE_QUOTA_SCRIPT); assert.equal(args[2], '4');
    assert.deepEqual(args.slice(3, 7), ['deanreese:chat:v1:day', 'deanreese:chat:v1:month', 'deanreese:chat:v1:ip:hashed-id:minute', 'deanreese:chat:v1:ip:hashed-id:day']);
    assert.equal(options.cache, 'no-store'); assert.equal(options.redirect, 'error');
    return Response.json({ result: [1, 0] });
  });
  assert.deepEqual(result, { allowed: true, retryAfter: 0 }); assert.equal(count, 1);
});

test('quota returns retry window; missing, invalid or failed storage fails closed', async () => {
  assert.deepEqual(await safety.reserveQuota('id', env, async () => Response.json({ result: [0, 60] })), { allowed: false, retryAfter: 60 });
  for (const result of [null, [], [1], [2, 0], [1, 20], [0, 0], ['1', 0], [0, -1], [0, 99999999]]) {
    await assert.rejects(safety.reserveQuota('id', env, async () => Response.json({ result })));
  }
  await assert.rejects(safety.reserveQuota('id', env, async () => new Response('unavailable', { status: 503 })));
  await assert.rejects(safety.reserveQuota('id', env, async () => { throw new Error('network failure'); }));
  for (const change of [{ UPSTASH_REDIS_REST_URL: undefined }, { UPSTASH_REDIS_REST_TOKEN: '' },
    { UPSTASH_REDIS_REST_URL: 'https://evil.example' }, { UPSTASH_REDIS_REST_URL: 'https://test.upstash.io/steal' },
    { CHAT_DAILY_REQUEST_LIMIT: '-1' }, { CHAT_MONTHLY_REQUEST_LIMIT: 'NaN' }]) {
    await assert.rejects(safety.reserveQuota('id', { ...env, ...change }, async () => { assert.fail('must not fetch invalid configuration'); }));
  }
});

test('route integration: all rejections avoid OpenAI; reservation precedes exactly one bounded call', async () => {
  const originalEnv = { ...process.env };
  const relevant = [...Object.keys(env), 'CHAT_ALLOWED_ORIGINS', 'CHAT_ALLOW_PREVIEW'];
  let calls = 0, reservations = 0, quota = { allowed: true, retryAfter: 0 }, providerFailure = false, storeFailure = false, prompt = 'approved content';
  const route = load('src/app/api/chat/route.ts', {
    '@/lib/chatSafety': { ...safety, reserveQuota: async () => { reservations++; if (storeFailure) throw new Error('store failed'); return quota; } },
    '@/lib/chat': { buildSystemPrompt: () => prompt },
    openai: class {
      constructor(options) {
        assert.equal(options.baseURL, 'https://api.openai.com/v1'); assert.equal(options.maxRetries, 0); assert.equal(options.timeout, 15000); assert.equal(options.project, 'test-project');
        this.responses = { create: async (params, options) => {
          calls++; assert.ok(reservations >= calls);
          assert.equal(params.model, 'gpt-5.2'); assert.equal(params.max_output_tokens, 350); assert.equal(params.store, false);
          assert.equal(params.reasoning.effort, 'none'); assert.equal(params.input.length, 2); assert.ok(options.signal);
          if (providerFailure) throw new Error('provider failed');
          return { output_text: '  A grounded answer.  ' };
        } };
      }
    },
  });
  try {
    for (const key of relevant) delete process.env[key];
    Object.assign(process.env, env);
    let res = await route.POST(request()); assert.equal(res.status, 200); assert.deepEqual(await res.json(), { answer: 'A grounded answer.' }); assert.equal(calls, 1); assert.equal(res.headers.get('cache-control'), 'no-store');
    const cases = [
      [{}, request({}, { origin: 'https://evil.example' }), 403],
      [{ CHAT_ENABLED: 'false' }, request(), 503],
      [{ VERCEL_ENV: 'preview' }, request(), 503],
      [{ OPENAI_API_KEY: '' }, request(), 503],
      [{ OPENAI_PROJECT_ID: '' }, request(), 503],
      [{}, request({ message: '' }), 400],
      [{}, request({}, { 'x-vercel-forwarded-for': 'not-an-ip' }), 503],
    ];
    for (const [change, req, status] of cases) {
      Object.assign(process.env, env, change); res = await route.POST(req); assert.equal(res.status, status); assert.equal(calls, 1); assert.equal(reservations, 1);
    }
    Object.assign(process.env, env); quota = { allowed: false, retryAfter: 60 };
    res = await route.POST(request()); assert.equal(res.status, 429); assert.equal(res.headers.get('retry-after'), '60'); assert.equal(calls, 1);
    storeFailure = true; res = await route.POST(request()); assert.equal(res.status, 503); assert.equal(calls, 1);
    storeFailure = false; quota = { allowed: true, retryAfter: 0 }; providerFailure = true;
    res = await route.POST(request()); assert.equal(res.status, 503); assert.equal(calls, 2);
    prompt = 'x'.repeat(safety.MAX_PROMPT_BYTES + 1); res = await route.POST(request()); assert.equal(res.status, 503); assert.equal(calls, 2);
  } finally {
    for (const key of relevant) { if (originalEnv[key] === undefined) delete process.env[key]; else process.env[key] = originalEnv[key]; }
  }
});
