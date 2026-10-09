import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/shell";
import { answer, KB, type Reply } from "@/lib/kb";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant (Simulated) — SME Loan Application Copilot" },
      { name: "description", content: "Simulated assistant answering common SME loan process questions from a fixed demo knowledge base." },
      { property: "og:title", content: "Simulated AI Assistant — SME Loan Copilot" },
      { property: "og:description", content: "Grounded, rule-based answers with safe fallbacks. No live AI connected." },
    ],
  }),
  component: Assistant,
});

type Msg = { role: "user" | "assistant"; text: string; reply?: Reply };
const SUGGESTIONS = ["What documents do I need?", "What are the application stages?", "What does documents pending mean?", "Will my loan be approved?"];

function Assistant() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", text: "Hi! I'm a simulated assistant. I answer questions about the demo document checklist and application stages using a fixed knowledge base." },
  ]);
  const [input, setInput] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [msgs]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    const r = answer(t);
    setMsgs((m) => [...m, { role: "user", text: t }, { role: "assistant", text: r.text, reply: r }]);
    setInput("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">AI Assistant</h1>
        <span className="rounded border border-primary/30 bg-secondary px-2 py-0.5 text-xs font-medium text-primary">SIMULATED — NO LIVE AI CONNECTED</span>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col lg:col-span-2">
          <div className="h-[26rem] space-y-3 overflow-y-auto pr-1" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                <div className={m.role === "user" ? "max-w-[80%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground" : "max-w-[90%] text-sm"}>
                  {m.role === "assistant" && <div className="mb-1 text-xs font-semibold text-primary">Copilot (simulated)</div>}
                  <p>{m.text}</p>
                  {m.reply && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {m.reply.kind === "grounded" ? `Source: demo KB — ${m.reply.source}` : m.reply.kind === "refusal" ? "Safety response" : "Not in knowledge base"}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={end} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-full border px-3 py-1 text-xs hover:bg-secondary">{s}</button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="mt-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about documents or stages (no personal info)"
              aria-label="Your question"
              className="flex-1 rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Send</button>
          </form>
        </Card>
        <Card>
          <h2 className="font-semibold">Demo knowledge base</h2>
          <p className="mt-1 text-xs text-muted-foreground">The assistant only answers from these topics. Anything else returns a safe fallback. It never guarantees approval or makes credit decisions.</p>
          <ul className="mt-3 space-y-2 text-sm">
            {KB.map((k) => (
              <li key={k.id} className="rounded-md bg-secondary px-3 py-2">{k.topic}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
