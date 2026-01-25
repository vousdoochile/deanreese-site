import OpenAI from "openai";
import { buildSystemPrompt } from "@/lib/chat";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ChatRequestBody = {
  messages: { role: "user" | "assistant"; content: string }[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestBody;

    const userLast =
      [...(body.messages || [])].reverse().find((m) => m.role === "user")?.content || "";

    if (!userLast.trim()) {
      return Response.json({ answer: "Ask a question to get started." });
    }

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
    return Response.json(
      { answer: "I don’t have that information on the site yet." },
      { status: 200 }
    );
  }
}
