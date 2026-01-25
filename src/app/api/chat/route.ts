@'
import OpenAI from "openai";
import { buildSystemPrompt } from "@/lib/chat";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ChatRequestBody = {
  messages: { role: "user" | "assistant"; content: string }[];
};

function getAllowedOrigins(): string[] {
  const raw = process.env.CHAT_ALLOWED_ORIGINS || "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  const allowed = getAllowedOrigins();
  if (allowed.length === 0) return true;
  return allowed.includes(origin);
}

const RATE = { windowMs: 60_000, max: 25 };
const hits = new Map<string, { count: number; resetAt: number }>();

function getIP(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  return xff ? xff.split(",")[0].trim() : "unknown";
}

function allowRequest(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);

  if (!rec || now > rec.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE.windowMs });
    return true;
  }

  if (rec.count >= RATE.max) return false;

  rec.count += 1;
  hits.set(ip, rec);
  return true;
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");

  if (!isOriginAllowed(origin)) {
    return new Response("Forbidden", { status: 403 });
  }

  const ip = getIP(req);
  if (!allowRequest(ip)) {
    return new Response("Too Many Requests", { status: 429 });
  }

  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return new Response("Bad Request", { status: 400 });
  }

  const userLast =
    [...(body.messages || [])].reverse().find((m) => m.role === "user")?.content || "";

  if (!userLast.trim()) {
    return Response.json({ answer: "Ask a question to get started." });
  }

  try {
    const response = await client.responses.create({
      model: "gpt-5.2",
      input: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: userLast },
      ],
      temperature: 0.2,
      max_output_tokens: 350,
    });

    const answer =
      response.output_text?.trim() || "I don’t have that information on the site yet.";

    return Response.json({ answer });
  } catch {
    return Response.json({ answer: "I don’t have that information on the site yet." });
  }
}
'@ | Set-Content -Encoding UTF8 src\app\api\chat\route.ts
