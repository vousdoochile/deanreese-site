// Optional integration test: REDIS_SERVER_BIN=/path/to/redis-server node --test tests/chat-quota-redis.test.cjs
// No cloud credentials or API calls. The server uses a loopback-only ephemeral port, no persistence.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const net = require('node:net');
const { spawn } = require('node:child_process');
const ts = require('typescript');
const binary = process.env.REDIS_SERVER_BIN;

function command(port, ...args) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host: '127.0.0.1', port });
    let data = Buffer.alloc(0);
    socket.setTimeout(5000, () => socket.destroy(new Error('Redis test command timeout')));
    socket.on('error', reject);
    socket.on('connect', () => {
      const parts = [Buffer.from(`*${args.length}\r\n`)];
      for (const arg of args) {
        const value = Buffer.from(String(arg));
        parts.push(Buffer.from(`$${value.length}\r\n`), value, Buffer.from('\r\n'));
      }
      socket.write(Buffer.concat(parts));
    });
    socket.on('data', (chunk) => {
      data = Buffer.concat([data, chunk]);
      let offset = 0;
      function parse() {
        const end = data.indexOf('\r\n', offset);
        if (end < 0) throw null; // Incomplete RESP frame, wait for more bytes.
        const type = String.fromCharCode(data[offset]);
        const value = data.toString('utf8', offset + 1, end);
        offset = end + 2;
        if (type === '-') throw new Error(value);
        if (type === '+') return value;
        if (type === ':') return Number(value);
        if (type === '*') return Array.from({ length: Number(value) }, parse);
        if (type === '$') {
          const length = Number(value);
          if (length < 0) return null;
          if (offset + length + 2 > data.length) throw null;
          const result = data.toString('utf8', offset, offset + length);
          offset += length + 2;
          return result;
        }
        throw new Error('Invalid Redis test response');
      }
      try { const result = parse(); socket.end(); resolve(result); }
      catch (error) { if (error !== null) { socket.destroy(); reject(error); } }
    });
    socket.on('end', () => reject(new Error('Redis closed connection without a response')));
  });
}

test('real Redis atomic reservation, concurrency, expiry and failures', {
  skip: binary ? false : 'Set REDIS_SERVER_BIN to a locally installed redis-server to run real Redis tests.',
  timeout: 20000,
}, async (t) => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'chat-quota-test-'));
  const probe = net.createServer();
  await new Promise((resolve, reject) => { probe.once('error', reject); probe.listen(0, '127.0.0.1', resolve); });
  const port = probe.address().port;
  await new Promise((resolve) => probe.close(resolve));
  const server = spawn(binary, ['--bind', '127.0.0.1', '--port', String(port),
    '--save', '', '--appendonly', 'no', '--dir', temp], { stdio: 'ignore' });
  let startupError;
  server.on('error', (error) => { startupError = error; });
  t.after(async () => {
    if (server.exitCode === null && !startupError) {
      const exited = new Promise((resolve) => server.once('exit', resolve));
      server.kill('SIGTERM');
      await exited;
    }
    fs.rmSync(temp, { recursive: true, force: true });
  });
  for (let attempt = 0; attempt < 100; attempt++) {
    if (startupError) throw startupError;
    if (server.exitCode !== null) throw new Error(`Redis exited during startup: ${server.exitCode}`);
    try { if (await command(port, 'PING') === 'PONG') break; } catch { /* Server is starting. */ }
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  const cmd = (...args) => command(port, ...args);
  assert.equal(await cmd('PING'), 'PONG');
  // Before any writes/FLUSHDB, verify this is our isolated server, not a port-race occupant.
  assert.deepEqual(await cmd('CONFIG', 'GET', 'dir'), ['dir', temp]);
  const source = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../src/lib/chatSafety.ts'), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const mod = { exports: {} };
  new Function('exports', 'module', 'require', source)(mod.exports, mod, require);
  const script = mod.exports.RESERVE_QUOTA_SCRIPT;
  const keys = (ip) => ['test:day', 'test:month', `test:ip:${ip}:minute`, `test:ip:${ip}:day`];
  const reserve = (ip, daily = 100, monthly = 1000) => cmd('EVAL', script, 4, ...keys(ip), daily, monthly);

  await t.test('200 concurrent distinct IPs cannot exceed global cap', async () => {
    const results = await Promise.all(Array.from({ length: 200 }, (_, i) => reserve(i, 25, 50)));
    assert.equal(results.reduce((sum, value) => sum + value[0], 0), 25);
    assert.deepEqual(await cmd('MGET', 'test:day', 'test:month'), ['25', '25']);
  });
  await t.test('100 same-IP admissions respect all counters and TTLs', async () => {
    await cmd('FLUSHDB');
    const results = await Promise.all(Array.from({ length: 100 }, () => reserve('same')));
    assert.equal(results.reduce((sum, value) => sum + value[0], 0), 5);
    assert.deepEqual(await cmd('MGET', ...keys('same')), ['5', '5', '5', '5']);
    for (const [i, expected] of [86400, 2592000, 60, 86400].entries()) {
      const ttl = await cmd('TTL', keys('same')[i]);
      assert.ok(ttl <= expected && ttl >= expected - 3, `TTL ${ttl} near ${expected}`);
    }
    const before = await Promise.all(keys('same').map((key) => cmd('PTTL', key)));
    assert.equal((await reserve('same'))[0], 0);
    const after = await Promise.all(keys('same').map((key) => cmd('PTTL', key)));
    after.forEach((ttl, i) => assert.ok(ttl <= before[i]));
    assert.deepEqual(await cmd('MGET', ...keys('same')), ['5', '5', '5', '5']);
  });
  await t.test('expiry resets only the expiring counter', async () => {
    await cmd('FLUSHDB'); await reserve('a');
    await cmd('PEXPIRE', 'test:ip:a:minute', 20);
    await new Promise((resolve) => setTimeout(resolve, 50));
    assert.deepEqual(await reserve('a'), [1, 0]);
    assert.deepEqual(await cmd('MGET', ...keys('a')), ['2', '2', '1', '2']);
  });
  await t.test('monthly and IP daily denials do not charge other counters', async () => {
    await cmd('FLUSHDB'); await reserve('a', 100, 1);
    assert.equal((await reserve('b', 100, 1))[0], 0);
    assert.equal(await cmd('EXISTS', ...keys('b').slice(2)), 0);
    assert.deepEqual(await cmd('MGET', 'test:day', 'test:month'), ['1', '1']);
    await cmd('FLUSHDB'); await cmd('SET', 'test:ip:a:day', 20, 'EX', 200);
    const result = await reserve('a');
    assert.equal(result[0], 0); assert.ok(result[1] >= 199 && result[1] <= 200);
    assert.equal(await cmd('EXISTS', 'test:day', 'test:month', 'test:ip:a:minute'), 0);
  });
  await t.test('corrupt counters and full counters without TTL fail closed', async () => {
    await cmd('FLUSHDB'); await cmd('SET', 'test:day', 'corrupt');
    await assert.rejects(reserve('a'));
    assert.equal(await cmd('EXISTS', 'test:month', ...keys('a').slice(2)), 0);
    await cmd('FLUSHDB'); await cmd('SET', 'test:day', 100);
    assert.deepEqual(await reserve('a'), [0, 86400]);
  });
});
