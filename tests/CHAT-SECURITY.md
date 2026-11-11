# Chat guard verification

## Default suite

Run `npm test` for the request-validation and mocked route tests plus the game regression tests. The chat tests replace OpenAI and quota HTTP calls; they never spend API credits.

## Optional real Redis suite

Install Redis from an official source, then run:

```sh
REDIS_SERVER_BIN=/absolute/path/to/redis-server node --test tests/chat-quota-redis.test.cjs
```

Without `REDIS_SERVER_BIN`, the integration test explicitly reports a skip. It creates its own loopback-only server on an ephemeral port with persistence disabled and a temporary working directory. It verifies the server directory before any write or flush, stops that server, and deletes its temporary files. Do not point it at a cloud database; the variable names the local executable, not a server address.

Verified locally against official Redis 7.4.6:

- 200 concurrent requests with different IP identifiers admitted exactly 25 against a daily limit of 25.
- 100 concurrent requests for one IP admitted exactly 5, with all four counters equal.
- The minute, day, and 30-day TTLs were set correctly; rejection neither incremented counts nor extended TTLs.
- Expiring a minute counter reset only that counter, not the longer quotas.
- Monthly and per-IP daily denials did not charge or create other counters.
- Corrupt counters produced errors; a full counter without a TTL remained blocked.

This verifies the actual Lua against real Redis, not the production Upstash REST deployment. It does not verify Vercel's incoming IP header handling, OpenAI account/project ownership, credits, live model compatibility, or cloud credentials. Those require separate activation checks. No real OpenAI calls, production changes, or cloud resources were used.

The quotas are fixed windows, not rolling windows or monetary budgets. Failed upstream calls keep their reservations. Store eviction, deletion, or replacement can reset allowance; production counters must be retained for their entire TTL. An attacker can consume available quota and can still generate hosting or quota-store traffic after model access is blocked.
