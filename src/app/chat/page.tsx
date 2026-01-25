"use client";

import { useMemo, useState } from "react";
import Container from "../../components/Container";


type Msg = { role: "user" | "assistant"; content: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Ask questions about Dean’s work, writing, or resume. If it is not on the site yet, you will see a clear not available message.",
    },
  ]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const canSend = useMemo(() => text.trim().length > 0 && !loading, [text, loading]);

  async function send() {
    if (!canSend) return;

    const nextMessages: Msg[] = [...messages, { role: "user", content: text.trim() }];
    setMessages(nextMessages);
    setText("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = (await res.json()) as { answer?: string };
      const answer = (data.answer || "I don’t have that information on the site yet.").trim();

      setMessages([...nextMessages, { role: "assistant", content: answer }]);
    } catch {
      setMessages([
        ...nextMessages,
        { role: "assistant", content: "I don’t have that information on the site yet." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <h1 className="text-2xl font-semibold tracking-tight">Q&A</h1>
      <p className="mt-2 text-neutral-700">
        Grounded answers only. If it is not on the site, you will see the not available response.
      </p>

      <div className="mt-6 rounded-xl border border-neutral-200">
        <div className="max-h-[60vh] space-y-4 overflow-auto p-5">
          {messages.map((m, idx) => (
            <div key={idx} className="text-sm">
              <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {m.role === "user" ? "You" : "Dean site"}
              </div>
              <div className="mt-1 whitespace-pre-wrap text-neutral-900">{m.content}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-200 p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
              placeholder="Example: What did you build at KlariVis?"
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-400"
            />

            <button
              onClick={send}
              disabled={!canSend}
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}
