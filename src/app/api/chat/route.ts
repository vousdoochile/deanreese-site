import OpenAI from "openai";
import { buildSystemPrompt } from "@/lib/chat";

export const runtime = "nodejs";

type ChatRequestBody = {
  messages?: { role: "user" | "assistant"; content: string }[];
};

const RATE = { windowMs: 60_000, max: 25 };
const hits = new Map<string, { count: number; resetAt: number }>();

function originAllowed(origin: string | null): boolean {
  if (!origin) return false;
  const allowed = (process.env.CHAT_ALLOWED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return allowed.length === 0 || allowed.includes(origin);
}

function rateAllowed(ip: string): boolean {
  const now = Date.now();
  const record = hits.get(ip);
  if (!record || now >= record.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE.windowMs });
    return true;
  }
  if (record.count >= RATE.max) return false;
  record.count += 1;
  return true;
}

export async function POST(req: Request) {
  if (!originAllowed(req.headers.get("origin"))) {
    return new Response("Forbidden", { status: 403 });
  }

  const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateAllowed(clientIP)) {
    return new Response("Too Many Requests", { status: 429 });
  }

  const length = Number(req.headers.get("content-length") || "0");
  if (length > 16000) {
    return new Response("Request too large", { status: 413 });
  }

  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return new Response("Bad Request", { status: 400 });
  }

  const messages = Array.isArray(body?.messages) ? body.messages : [];
  const message = [...messages].reverse().find((item) => item?.role === "user")?.content;
  if (typeof message !== "string" || !message.trim() || message.length > 1500) {
    return new Response("Question must be 1 to 1500 characters", { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json({ answer: "Chat is temporarily unavailable." }, { status: 503 });
  }

  try {
    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: "gpt-5.2",
      input: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: message.trim() },
      ],
      temperature: 0.2,
      max_output_tokens: 350,
    });

    return Response.json({
      answer: response.output_text?.trim() || "I don’t have that information on the site yet.",
    });
  } catch {
    return Response.json({ answer: "Chat is temporarily unavailable." }, { status: 503 });
  }
}
