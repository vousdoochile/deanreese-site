import { createHash } from "node:crypto";
import { isIP } from "node:net";

export const MAX_BODY_BYTES = 16_000;
export const MAX_QUESTION_CHARACTERS = 1_500;
export const MAX_PROMPT_BYTES = 100_000;
export const CHAT_MODEL = "gpt-5.2";
export const MAX_OUTPUT_TOKENS = 350;
type Environment = Record<string, string | undefined>;

export class ChatRequestError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export function originAllowed(origin: string | null, env: Environment): boolean {
  if (!origin) return false;
  const allowed = env.CHAT_ALLOWED_ORIGINS?.split(",").map((value) => value.trim()).filter(Boolean)
    ?? ["https://deanreese.me", "https://www.deanreese.me"];
  // No wildcard or request-host fallback. Origin is defense in depth, not authentication.
  return allowed.includes(origin);
}

export function chatEnabled(env: Environment): boolean {
  return env.CHAT_ENABLED === "true"
    && (env.VERCEL_ENV !== "preview" || env.CHAT_ALLOW_PREVIEW === "true");
}

export function clientIdentifier(headers: Headers, env: Environment): string | null {
  // Trust only the header supplied by Vercel. Other hosting requires a reviewed adapter.
  if (env.VERCEL !== "1") return env.NODE_ENV === "development" ? "local-development" : null;
  const address = headers.get("x-vercel-forwarded-for")?.trim();
  if (!address || address.includes("%") || !isIP(address)) return null;
  let normalized = address;
  if (isIP(address) === 6) {
    // Normalize equivalent IPv6 spellings and group /64s to curb address rotation.
    const canonical = new URL(`http://[${address}]/`).hostname.slice(1, -1);
    const [left, right = ""] = canonical.split("::");
    const start = left ? left.split(":") : [];
    const end = right ? right.split(":") : [];
    const groups = canonical.includes("::")
      ? [...start, ...Array(8 - start.length - end.length).fill("0"), ...end]
      : start;
    normalized = `${groups.slice(0, 4).map((value) => value.padStart(4, "0")).join(":")}::/64`;
  }
  // Pseudonymous, not anonymous: never store raw IPs or question text in the quota store.
  return createHash("sha256").update(`deanreese-chat:${normalized}`).digest("hex");
}

export async function readQuestion(request: Request): Promise<string> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    throw new ChatRequestError(415, "Please send a JSON question.");
  }
  const declaredLength = request.headers.get("content-length");
  if (declaredLength && (!/^\d+$/.test(declaredLength) || Number(declaredLength) > MAX_BODY_BYTES)) {
    throw new ChatRequestError(413, "That question is too large.");
  }
  if (request.headers.has("content-encoding")) throw new ChatRequestError(415, "Compressed requests are not supported.");
  if (!request.body) throw new ChatRequestError(400, "Please enter a question.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new ChatRequestError(408, "The question took too long to arrive.")), 5_000);
  });
  try {
    while (true) {
      const { done, value } = await Promise.race([reader.read(), deadline]);
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) throw new ChatRequestError(413, "That question is too large.");
      chunks.push(value);
    }
  } finally {
    clearTimeout(timer);
    void reader.cancel().catch(() => {});
  }
  let body: unknown;
  try { body = JSON.parse(Buffer.concat(chunks).toString("utf8")); }
  catch { throw new ChatRequestError(400, "Please send a valid question."); }
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new ChatRequestError(400, "Please send a valid question.");
  const input = body as Record<string, unknown>;
  let question: unknown;
  if (Object.keys(input).length === 1 && "message" in input) {
    question = input.message;
  } else if (Object.keys(input).length === 1 && Array.isArray(input.messages)
      && input.messages.length > 0 && input.messages.length <= 12) {
    // Bounded compatibility for a previously loaded version of the chat page.
    for (const message of input.messages) {
      if (!message || typeof message !== "object" || Array.isArray(message)
          || !["user", "assistant"].includes(message.role)
          || typeof message.content !== "string" || message.content.length > MAX_QUESTION_CHARACTERS
          || Object.keys(message).some((key) => key !== "role" && key !== "content")) {
        throw new ChatRequestError(400, "Please refresh the page and send a question.");
      }
      if (message.role === "user") question = message.content;
    }
  }
  if (typeof question !== "string" || !question.trim() || question.length > MAX_QUESTION_CHARACTERS) {
    throw new ChatRequestError(400, "Questions must be 1 to 1500 characters.");
  }
  return question.trim();
}

// One atomic admission across all four counters; no process-local fallback.
// Failed/upstream-timeout requests stay reserved, and the SDK never retries them.
export const RESERVE_QUOTA_SCRIPT = `
local limits = {tonumber(ARGV[1]), tonumber(ARGV[2]), 5, 20}
local windows = {86400, 2592000, 60, 86400}
local retry = 0
for i = 1, #KEYS do
  local used = tonumber(redis.call('GET', KEYS[i]) or '0')
  if used >= limits[i] then
    local ttl = redis.call('TTL', KEYS[i])
    if ttl < 1 then ttl = windows[i] end
    retry = math.max(retry, ttl)
  end
end
if retry > 0 then return {0, retry} end
for i = 1, #KEYS do
  local count = redis.call('INCR', KEYS[i])
  if count == 1 then redis.call('EXPIRE', KEYS[i], windows[i]) end
end
return {1, 0}
`;

function quotaLimit(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 10_000) throw new Error("Invalid chat quota configuration");
  return Number(value);
}

export async function reserveQuota(identifier: string, env: Environment, fetcher: typeof fetch = fetch): Promise<{ allowed: boolean; retryAfter: number }> {
  const endpoint = new URL(env.UPSTASH_REDIS_REST_URL || "");
  if (endpoint.protocol !== "https:" || !endpoint.hostname.endsWith(".upstash.io")
      || endpoint.username || endpoint.password || endpoint.port || endpoint.search || endpoint.hash
      || endpoint.pathname !== "/" || !env.UPSTASH_REDIS_REST_TOKEN) throw new Error("Shared chat quota store is not configured");
  const daily = quotaLimit(env.CHAT_DAILY_REQUEST_LIMIT, 100);
  const monthly = quotaLimit(env.CHAT_MONTHLY_REQUEST_LIMIT, 1_000);
  // Keep this namespace stable across regions, redeploys, and any enabled previews.
  const prefix = "deanreese:chat:v1";
  const response = await fetcher(endpoint, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(["EVAL", RESERVE_QUOTA_SCRIPT, "4", `${prefix}:day`, `${prefix}:month`,
      `${prefix}:ip:${identifier}:minute`, `${prefix}:ip:${identifier}:day`, String(daily), String(monthly)]),
    cache: "no-store", redirect: "error", signal: AbortSignal.timeout(3_000),
  });
  if (!response.ok) throw new Error("Shared chat quota store is unavailable");
  const data: unknown = await response.json();
  const result = data && typeof data === "object" && "result" in data ? data.result : null;
  if (!Array.isArray(result) || result.length !== 2 || ![0, 1].includes(result[0])
      || !Number.isInteger(result[1]) || result[1] < 0 || result[1] > 2_592_000
      || (result[0] === 0 && result[1] === 0) || (result[0] === 1 && result[1] !== 0)) throw new Error("Invalid chat quota response");
  return { allowed: result[0] === 1, retryAfter: result[1] };
}
