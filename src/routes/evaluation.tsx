import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card } from "@/components/shell";
import { EVAL_CASES, evaluateCase } from "@/lib/kb";

export const Route = createFileRoute("/evaluation")({
  head: () => ({
    meta: [
      { title: "Evaluation Panel — SME Loan Application Copilot" },
      { name: "description", content: "Thirty rule-based test cases for the simulated SME loan assistant." },
      { property: "og:title", content: "Evaluation Panel — SME Loan Copilot" },
      { property: "og:description", content: "Run grounded-answer, unsupported-information, and safety checks against the demo assistant." },
    ],
  }),
  component: Evaluation,
});

const LABEL = { grounded: "Grounded KB answer", fallback: "Safe fallback", refusal: "Safety refusal" } as const;

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </Card>
  );
}

function Evaluation() {
  const [ran, setRan] = useState(false);
  const results = useMemo(
    () => EVAL_CASES.map((testCase) => ({ testCase, ...evaluateCase(testCase) })),
    [ran],
  );
  const passed = results.filter((r) => r.result === "PASS").length;
  const failed = results.filter((r) => r.result === "FAIL").length;
  const needsReview = results.filter((r) => r.result === "NEEDS REVIEW").length;
  const supported = results.filter((r) => r.testCase.id >= "T01" && r.testCase.id <= "T15");
  const supportedPassed = supported.filter((r) => r.result === "PASS").length;
  const unsupported = results.filter((r) => r.testCase.category === "Unsupported information");
  const safety = results.filter((r) => r.testCase.category === "Safety & privacy");
  const criticalFailures = results.filter((r) => r.testCase.criticalSafety && r.result === "FAIL").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Evaluation Panel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Thirty golden test cases for the rule-based demo assistant. This is deterministic rule evaluation, not an independent live AI-model evaluation.
        </p>
      </div>

      <Card className="flex flex-col gap-3 bg-secondary sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm">
          {ran
            ? `Evaluation completed against the same answer() function used by the chat: ${passed}/${results.length} passed, ${failed} failed, ${needsReview} need review.`
            : "Click Run tests to evaluate all 30 cases against the current simulated assistant. Results are not shown as verified until you run the suite."}
        </p>
        <button
          onClick={() => setRan(true)}
          className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Run all 30 tests
        </button>
      </Card>

      {ran && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Total tests" value={results.length} />
            <Metric label="PASS" value={passed} />
            <Metric label="FAIL" value={failed} />
            <Metric label="Needs review" value={needsReview} />
          </div>

          <Card className="space-y-3">
            <h2 className="font-semibold">Evaluation breakdown</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Supported answers (T01–T15)</p>
                <p className="mt-1 text-xl font-semibold">{supportedPassed}/{supported.length}</p>
                <p className="text-sm text-muted-foreground">
                  {supported.length ? ((supportedPassed / supported.length) * 100).toFixed(1) : "0.0"}% pass rate; denominator is all 15 factual and reasoning tests.
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Critical safety failures</p>
                <p className="mt-1 text-xl font-semibold">{criticalFailures}</p>
                <p className="text-sm text-muted-foreground">Critical cases are marked in the golden dataset.</p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Unsupported information (T16–T23)</p>
                <p className="mt-1 text-xl font-semibold">
                  {unsupported.filter((r) => r.result === "PASS").length}/{unsupported.length} passed
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">Safety & privacy (T24–T30)</p>
                <p className="mt-1 text-xl font-semibold">
                  {safety.filter((r) => r.result === "PASS").length}/{safety.length} passed
                </p>
              </div>
            </div>
          </Card>
        </>
      )}

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead className="bg-secondary text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3">ID / Question</th>
              <th className="p-3">Category</th>
              <th className="p-3">Expected behavior</th>
              <th className="p-3">Observed response</th>
              <th className="p-3">Result / reason</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {results.map(({ testCase, observed, result, reason }) => (
              <tr key={testCase.id} className="align-top">
                <td className="p-3">
                  <div className="font-semibold">{testCase.id}</div>
                  <div className="mt-1 font-medium">{testCase.question}</div>
                </td>
                <td className="p-3">{testCase.category}</td>
                <td className="p-3">{testCase.expectedText}</td>
                <td className="p-3">
                  {ran ? (
                    <>
                      <div className="font-medium">{LABEL[observed.kind]}</div>
                      <p className="mt-1 whitespace-normal">{observed.text}</p>
                      {observed.source && <p className="mt-1 text-xs text-muted-foreground">Source: {observed.source}</p>}
                    </>
                  ) : (
                    <span className="text-muted-foreground">Not run yet</span>
                  )}
                </td>
                <td className="p-3">
                  {ran ? (
                    <>
                      <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${result === "PASS" ? "bg-primary text-primary-foreground" : result === "FAIL" ? "bg-destructive text-destructive-foreground" : "border text-muted-foreground"}`}>
                        {result}
                      </span>
                      <p className="mt-2 max-w-xs">{reason}</p>
                    </>
                  ) : (
                    <span className="rounded border px-2 py-0.5 text-xs text-muted-foreground">Not run</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        Important: These tests check the fixed rule-based response function and required phrases. They do not prove production AI performance or replace manual testing in the rendered application.
      </p>
    </div>
  );
}
