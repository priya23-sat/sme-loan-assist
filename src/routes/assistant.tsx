import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/shell";
import { answerIn, KB, CATEGORY_KB, type Reply } from "@/lib/kb";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant (Simulated) — SME Loan Application Copilot" },
      {
        name: "description",
        content:
          "Simulated assistant answering common SME loan process questions from a fixed demo knowledge base.",
      },
      { property: "og:title", content: "Simulated AI Assistant — SME Loan Copilot" },
      {
        property: "og:description",
        content: "Grounded, rule-based answers with safe fallbacks. No live AI connected.",
      },
    ],
  }),
  component: Assistant,
});

type Msg = { role: "user" | "assistant"; text: string; reply?: Reply };
const SUGGESTIONS_EN = [
  "Are there loan schemes for small businesses?",
  "What does turnover mean?",
  "How do I understand a bank application form?",
  "What documents does a kirana shop need?",
  "What does a food business need?",
  "What might a credit manager ask me?",
  "What documents do I need?",
  "Translate the checklist into Marathi.",
];
const SUGGESTIONS_MR = [
  "लहान व्यवसायांसाठी कर्ज योजना आहेत का?",
  "उलाढाल म्हणजे काय?",
  "बँक अर्ज फॉर्म कसा समजावून घ्यावा?",
  "किराणा दुकानासाठी कोणती कागदपत्रे लागतात?",
  "अन्न व्यवसायासाठी काय लागते?",
  "क्रेडिट मॅनेजर मला काय विचारू शकतो?",
  "मला कोणती कागदपत्रे लागतात?",
  "चेकलिस्ट मराठीत सांगा.",
];

function Assistant() {
  const { lang, t } = useLanguage();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const end = useRef<HTMLDivElement>(null);

  // Reset the conversation to a single greeting in the selected language.
  useEffect(() => {
    setMsgs([{ role: "assistant", text: t("asstGreeting") }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [msgs]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    const r = answerIn(lang, q);
    setMsgs((m) => [
      ...m,
      { role: "user", text: q },
      { role: "assistant", text: r.text, reply: r },
    ]);
    setInput("");
  };

  const suggestions = lang === "mr" ? SUGGESTIONS_MR : SUGGESTIONS_EN;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">{t("asstTitle")}</h1>
        <span className="rounded border border-primary/30 bg-secondary px-2 py-0.5 text-xs font-medium text-primary">
          {t("asstBadge")}
        </span>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col lg:col-span-2">
          <div className="h-[26rem] space-y-3 overflow-y-auto pr-1" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[80%] rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
                      : "max-w-[90%] text-sm"
                  }
                >
                  {m.role === "assistant" && (
                    <div className="mb-1 text-xs font-semibold text-primary">
                      {t("asstCopilot")}
                    </div>
                  )}
                  <p>{m.text}</p>
                  {m.reply && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {m.reply.kind === "grounded"
                        ? t("asstSource", { src: m.reply.source ?? "" })
                        : m.reply.kind === "refusal"
                          ? t("asstSafety")
                          : t("asstNotInKb")}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={end} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border px-3 py-1 text-xs hover:bg-secondary"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="mt-3 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={lang === "mr" ? t("asstPlaceholderMr") : t("asstPlaceholder")}
              aria-label={t("asstAria")}
              className="flex-1 rounded-md border border-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              {t("asstSend")}
            </button>
          </form>
        </Card>
        <Card>
          <h2 className="font-semibold">{t("asstKbTitle")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{t("asstKbBody")}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {KB.map((k) => (
              <li key={k.id} className="rounded-md bg-secondary px-3 py-2">
                {k.topic}
              </li>
            ))}
          </ul>
          <h3 className="mt-5 font-semibold">{t("asstCatTitle")}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{t("asstCatBody")}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {CATEGORY_KB.map((k) => (
              <li key={k.id} className="rounded-md bg-secondary px-3 py-2">
                {k.topic}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
