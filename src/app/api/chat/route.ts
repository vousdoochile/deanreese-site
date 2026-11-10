import OpenAI from "openai";
import { buildSystemPrompt } from "@/lib/chat";
import {
  CHAT_MODEL, MAX_OUTPUT_TOKENS, MAX_PROMPT_BYTES, ChatRequestError,
  chatEnabled, clientIdentifier, originAllowed, readQuestion, reserveQuota,
} from "@/lib/chatSafety";

export const runtime = "nodejs";
export const maxDuration = 30;

function reply(answer: string, status: number, retryAfter?: number) {
  return Response.json({ answer }, {
    status,
    headers: { "Cache-Control": "no-store", ...(retryAfter ? { "Retry-After": String(retryAfter) } : {}) },
  });
}

export async function POST(req: Request) {
  if (!originAllowed(req.headers.get("origin"), process.env)) return reply("Forbidden", 403);
  if (!chatEnabled(process.env)) return reply("Q&A is temporarily unavailable. You can still explore the site.", 503);
  const identifier = clientIdentifier(req.headers, process.env);
  if (!identifier) return reply("Q&A is temporarily unavailable.", 503);
  let message: string;
  try { message = await readQuestion(req); }
  catch (error) {
    if (error instanceof ChatRequestError) return reply(error.message, error.status);
    return reply("Please send a valid question.", 400);
  }
  const apiKey = process.env.OPENAI_API_KEY;
  const project = process.env.OPENAI_PROJECT_ID;
  const prompt = buildSystemPrompt();
  // Project selection is explicit; verify it belongs to the credited OpenAI organization.
  if (!apiKey || !project || Buffer.byteLength(prompt, "utf8") > MAX_PROMPT_BYTES) return reply("Q&A is temporarily unavailable.", 503);
  try {
    const quota = await reserveQuota(identifier, process.env);
    if (!quota.allowed) return reply("Q&A has reached its request limit. Please try again later.", 429, quota.retryAfter);
    if (req.signal.aborted) return reply("The request was cancelled.", 408);
    const client = new OpenAI({
      baseURL: "https://api.openai.com/v1",
      apiKey, project, organization: process.env.OPENAI_ORG_ID,
      maxRetries: 0, timeout: 15_000,
    });
    const response = await client.responses.create({
      model: CHAT_MODEL,
      input: [{ role: "system", content: prompt }, { role: "user", content: message }],
      reasoning: { effort: "none" }, temperature: 0.2,
      max_output_tokens: MAX_OUTPUT_TOKENS, store: false,
    }, { signal: req.signal });
    return reply(response.output_text?.trim() || "I don’t have that information on the site yet.", 200);
  } catch {
    // Do not log prompts, secrets, provider error bodies, or visitor identifiers.
    return reply("Q&A is temporarily unavailable. Please try again later.", 503);
  }
}
