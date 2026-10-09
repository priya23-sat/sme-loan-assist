import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/shell";
import { answer, EVAL_CASES } from "@/lib/kb";

export const Route = createFileRoute("/evaluation")({
  head: () => ({
    meta: [
      { title: "Evaluation Panel — SME Loan Application Copilot" },
      { name: "description", content: "Sample test cases for the simulated assistant: supported, missing-info and approval-guarantee questions." },
      { property: "og:title", content: "Evaluation Panel — SME Loan Copilot" },
      { property: "og:description", content: "Illustrative AI evaluation cases with expected vs observed behavior." },
    ],
  }),
  component: Evaluation,
});

const LABEL = { grounded: "Grounded KB answer", fallback: "Safe fallback", refusal: "Refusal (no guarantee)" } as const;

function Evaluation() {
  const [ran, setRan] = useState(false);
  const results = EVAL_CASES.map((c) => ({ ...c, observed: answer(c.question) }));
  const passed = results.filter((r) => r.observed.kind === r.expected).length;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Evaluation Panel</h1>
      <Card className="flex flex-col gap-3 bg-secondary sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm">
          {ran
            ? `Tests run just now against the simulated assistant in your browser: ${passed}/${results.length} passed.`
            : "Results are illustrative until tests are run. Click “Run tests” to check each case against the simulated assistant."}
        </p>
        <button onClick={() => setRan(true)} className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Run tests</button>
      </Card>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-secondary text-xs uppercase text-muted-foreground">
            <tr><th className="p-3">Question</th><th className="p-3">Category</th><th className="p-3">Expected behavior</th><th className="p-3">Observed behavior</th><th className="p-3">Result</th></tr>
          </thead>
          <tbody className="divide-y">
            {results.map((r) => {
              const ok = r.observed.kind === r.expected;
              return (
                <tr key={r.question} className="align-top">
                  <td className="p-3 font-medium">{r.question}</td>
                  <td className="p-3">{r.category}</td>
                  <td className="p-3">{LABEL[r.expected]} — {r.expectedText}</td>
                  <td className="p-3">{ran ? `${LABEL[r.observed.kind]}: “${r.observed.text.slice(0, 90)}…”` : <span className="text-muted-foreground">Not run yet</span>}</td>
                  <td className="p-3">
                    {ran ? (
                      <span className={`rounded px-2 py-0.5 text-xs font-semibold ${ok ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"}`}>{ok ? "PASS" : "FAIL"}</span>
                    ) : (
                      <span className="rounded border px-2 py-0.5 text-xs text-muted-foreground">Illustrative</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
