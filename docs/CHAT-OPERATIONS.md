# Chat security review and activation

## Review-only changes

This branch does not change the production environment or create a service. **Do not merge to production until the activation checklist below is resolved, or the owner explicitly chooses to deploy with Q&A disabled.** The rest of the site, writing and game work without chat configuration.

The old endpoint used a per-process rate counter, permissive default origins, a declared Content-Length check, and SDK retry defaults. The new endpoint has shared atomic admission, explicit enablement, bounded request reading, strict input, no provider retries, and no stored Responses API result. Only the latest question is sent; conversation history is not retained by this app.

Next.js 16.4.6 / React 19.3.1 replace Next.js 14.2.25 / React 18. The writing route awaits params, and the game uses React-compatible state/event initialization. Node.js 20.9 or newer is required; local verification used 24.19.0. The Next.js November security patch floor is 16.4.5: https://github.com/vercel/next.js/security/advisories/GHSA-7qx7-33qx-rqx2.

## Activation checklist (not performed by this change)

1. In OpenAI Platform, verify the intended organization's active credit grant, expiry, and project usage. Match the deployed key to that organization/project without displaying or committing its value. Having an OPENAI_API_KEY does **not** prove that a promotional credit grant pays for it.
2. Use an existing authorized Upstash Redis database, or obtain approval before creating a service or credential. Verify its plan, quota, eviction/durability behavior and billing controls. No new paid service or credential is authorized by this patch.
3. Configure the server-only variables below in Vercel for the intended environment. Keep chat off until project ownership and the shared store are verified. Credentials must use secure setup, never source files or chat messages.
4. Set an owner-approved request allowance and check the actual OpenAI and hosting spend controls. These application quotas are **not a provider-enforced dollar budget**. They do not inspect credit balances, stop other apps using the key/project, or cover Vercel/Redis costs.
5. After approval, perform one controlled end-to-end request, inspect OpenAI usage for the intended project/organization, verify a shared limit across separate instances, and verify outage/kill-switch behavior. Offline tests do not establish live credentials, credit grants, or managed-store behavior.
6. Keep previews off by default, review the complete preview site/game, then obtain separate approval before merging/deploying production.

## Server-only environment variables

- `CHAT_ENABLED=true`: required to admit a request. Unset/false is the kill switch. A Vercel variable change takes effect in deployments that receive the updated environment; already running requests may finish.
- `OPENAI_API_KEY`: existing authorized API key. Never use a NEXT_PUBLIC variable.
- `OPENAI_PROJECT_ID`: required explicit project that owns the billed usage.
- `OPENAI_ORG_ID`: optional explicit organization when required by the account.
- `UPSTASH_REDIS_REST_URL`: HTTPS root URL of the authorized `.upstash.io` database.
- `UPSTASH_REDIS_REST_TOKEN`: existing authorized token for that database.
- `CHAT_DAILY_REQUEST_LIMIT`: default `100`, integer 1–10000.
- `CHAT_MONTHLY_REQUEST_LIMIT`: default `1000`, integer 1–10000. The window is 30 days, not a calendar billing month.
- `CHAT_ALLOWED_ORIGINS`: optional comma-separated exact origins; default only `https://deanreese.me` and `https://www.deanreese.me`. Empty denies all origins. Do not use wildcards. Origin headers are not authentication and can be spoofed by non-browser clients.
- `CHAT_ALLOW_PREVIEW=true`: additionally required for paid chat in Vercel preview. Avoid enabling it casually. Approved previews must use the same shared database/namespace as production so they do not multiply the model-call allowance; add only their exact preview origin when needed.

Local development additionally needs an explicit localhost origin. Non-Vercel production hosting fails closed until its trusted proxy/IP adapter is reviewed. On Vercel only `x-vercel-forwarded-for` is trusted. IPv6 addresses are grouped by /64; a hash of the IP/group is stored for rate limits. Hashes are pseudonymous, not anonymous. Raw addresses and question text are not sent to Redis.

## Limits and failure behavior

- 16,000 actual body bytes, read with a 5-second deadline; checking a forged/missing Content-Length does not bypass the stream cap.
- One trimmed question, maximum 1,500 characters; bounded compatibility for at most 12 legacy user/assistant messages. Visitors cannot choose roles, tools, models, or output limits.
- Approved public system prompt maximum 100,000 UTF-8 bytes (currently 81,161); no unbounded user history.
- Fixed `gpt-5.2` through `https://api.openai.com/v1`, no tools, reasoning effort `none`, at most 350 output tokens, `store:false`, one attempt, 15-second provider timeout. The request's cancellation signal is forwarded; a timeout/cancel does not guarantee zero provider billing.
- Redis admission checks and increments four counters in a single Lua EVAL: global 24-hour and 30-day windows, per-IP 5 requests/60 seconds and 20/24 hours. Windows start with the first admitted request after expiry. These are **fixed windows**, not rolling windows or calendar days; bursts can straddle a reset. Concurrent requests share one allowance.
- Failed provider requests remain counted. An uncertain Redis response fails closed rather than retrying or falling back to an in-memory allowance. Provider errors/outages, missing settings and invalid store results return 503. Limits return 429 and Retry-After. Error responses do not expose secret/provider data and are not cached.
- Keep the `deanreese:chat:v1` namespace stable. Separate databases, deleting/evicting counters, namespace changes or rollback to the old endpoint reset/bypass these application protections. Do not treat the database as an expendable cache.

## Cost scope

No live OpenAI request or paid cloud resource is needed for the automated tests. The retained model's published standard prices checked November 10, 2026 are $1.75 per million input tokens and $14 per million output tokens (cached input can cost less): https://developers.openai.com/api/docs/models/gpt-5.2.

For illustration, 20,000 input tokens plus 350 output tokens is about $0.0399 per request before any applicable taxes/other charges. That would be about $39.90 for 1,000 such requests, **not a bill guarantee**. Actual token counts, prompt caching, prices, other API users and reset boundaries can change the bill. The 81 KB approved prompt is significant; reducing content or changing model should be a separately evaluated quality/cost decision.

Distributed abusive requests can still exhaust the legitimate-user allowance and generate Redis/hosting traffic after the model limit. Configure appropriate Vercel WAF/bot controls and provider spend controls under separate approval. Check whether each provider setting is an enforced stop or merely an alert; do not call a notification threshold a hard budget. A compromised key used outside this endpoint is not protected by these counters.

## Verification

Run `npm ci`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, and `npm audit --omit=dev`. The chat unit/integration tests use dummy credentials and mocked external requests. They do not send user data to third parties or consume API credits.

At preparation time the production audit had no findings. Full audit retained seven moderate development-only findings in the minimatch/typescript-eslint chain; no incompatible forced major override was applied. Recheck advisories before merge.

See `tests/DEANVADERS.md` for game QA and `tests/CHAT-SECURITY.md` for the independent quota checks. A successful build and local quota simulation do not replace the controlled live activation checks above.
