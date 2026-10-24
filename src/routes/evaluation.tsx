import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/shell";
import { EVAL_CASES, CATEGORY_EVAL_CASES, evaluateCase } from "@/lib/kb";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/evaluation")({
  head: () => ({
    meta: [
      { title: "Evaluation Panel — SME Loan Application Copilot" },
      {
        name: "description",
        content: "Thirty rule-based test cases for the simulated SME loan assistant.",
      },
      { property: "og:title", content: "Evaluation Panel — SME Loan Copilot" },
      {
        property: "og:description",
        content:
          "Run grounded-answer, unsupported-information, and safety checks against the demo assistant.",
      },
    ],
  }),
  component: Evaluation,
});

const LABEL = {
  grounded: "labelGrounded",
  fallback: "labelFallback",
  refusal: "labelRefusal",
} as const;

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </Card>
  );
}

function Evaluation() {
  const { t } = useLanguage();
  const [ran, setRan] = useState(false);
  const [ranCategories, setRanCategories] = useState(false);
  const results = EVAL_CASES.map((testCase) => ({ testCase, ...evaluateCase(testCase) }));
  const passed = results.filter((r) => r.result === "PASS").length;
  const failed = results.filter((r) => r.result === "FAIL").length;
  const needsReview = results.filter((r) => r.result === "NEEDS REVIEW").length;
  const supported = results.filter((r) => r.testCase.id >= "T01" && r.testCase.id <= "T15");
  const supportedPassed = supported.filter((r) => r.result === "PASS").length;
  const unsupported = results.filter((r) => r.testCase.category === "Unsupported information");
  const safety = results.filter((r) => r.testCase.category === "Safety & privacy");
  const criticalFailures = results.filter(
    (r) => r.testCase.criticalSafety && r.result === "FAIL",
  ).length;

  const categoryResults = CATEGORY_EVAL_CASES.map((testCase) => ({
    testCase,
    ...evaluateCase(testCase),
  }));
  const categoryPassed = categoryResults.filter((r) => r.result === "PASS").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t("evalTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("evalIntro")}</p>
      </div>

      <Card className="flex flex-col gap-3 bg-secondary sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm">
          {ran
            ? t("evalRan", { p: passed, t: results.length, f: failed, n: needsReview })
            : t("evalPrompt")}
        </p>
        <button
          onClick={() => setRan(true)}
          className="shrink-0 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t("evalRunBtn")}
        </button>
      </Card>

      {ran && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label={t("evalTotal")} value={results.length} />
            <Metric label={t("evalPass")} value={passed} />
            <Metric label={t("evalFail")} value={failed} />
            <Metric label={t("evalNeedsReview")} value={needsReview} />
          </div>

          <Card className="space-y-3">
            <h2 className="font-semibold">{t("evalBreakdown")}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">{t("evalSupported")}</p>
                <p className="mt-1 text-xl font-semibold">
                  {supportedPassed}/{supported.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("evalSupportedNote", {
                    r: supported.length
                      ? ((supportedPassed / supported.length) * 100).toFixed(1)
                      : "0.0",
                  })}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">{t("evalCritical")}</p>
                <p className="mt-1 text-xl font-semibold">{criticalFailures}</p>
                <p className="text-sm text-muted-foreground">{t("evalCriticalNote")}</p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">{t("evalUnsupported")}</p>
                <p className="mt-1 text-xl font-semibold">
                  {t("evalPassedShort", {
                    a: unsupported.filter((r) => r.result === "PASS").length,
                    b: unsupported.length,
                  })}
                </p>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-sm text-muted-foreground">{t("evalSafety")}</p>
                <p className="mt-1 text-xl font-semibold">
                  {t("evalPassedShort", {
                    a: safety.filter((r) => r.result === "PASS").length,
                    b: safety.length,
                  })}
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
              <th className="p-3">{t("evalThId")}</th>
              <th className="p-3">{t("evalThCategory")}</th>
              <th className="p-3">{t("evalThExpected")}</th>
              <th className="p-3">{t("evalThObserved")}</th>
              <th className="p-3">{t("evalThResult")}</th>
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
                      <div className="font-medium">{t(LABEL[observed.kind])}</div>
                      <p className="mt-1 whitespace-normal">{observed.text}</p>
                      {observed.source && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {t("evalSource", { src: observed.source })}
                        </p>
                      )}
                    </>
                  ) : (
                    <span className="text-muted-foreground">{t("evalNotRunYet")}</span>
                  )}
                </td>
                <td className="p-3">
                  {ran ? (
                    <>
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${result === "PASS" ? "bg-primary text-primary-foreground" : result === "FAIL" ? "bg-destructive text-destructive-foreground" : "border text-muted-foreground"}`}
                      >
                        {result}
                      </span>
                      <p className="mt-2 max-w-xs">{reason}</p>
                    </>
                  ) : (
                    <span className="rounded border px-2 py-0.5 text-xs text-muted-foreground">
                      {t("evalNotRun")}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Card className="flex flex-col gap-3 bg-secondary sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div>
          <h2 className="font-semibold">
            {t("evalCatTitle")} ({CATEGORY_EVAL_CASES.length})
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("evalCatBody")}</p>
          {ranCategories && (
            <p className="mt-2 text-sm font-medium">
              {t("evalCatRan", { a: categoryPassed, b: categoryResults.length })}
            </p>
          )}
        </div>
        <button
          onClick={() => setRanCategories(true)}
          className="shrink-0 rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-tint"
        >
          {t("evalCatBtn")}
        </button>
      </Card>

      {ranCategories && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-secondary text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3">{t("evalThId")}</th>
                <th className="p-3">{t("evalThExpected")}</th>
                <th className="p-3">{t("evalThObserved")}</th>
                <th className="p-3">{t("evalThResult")}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categoryResults.map(({ testCase, observed, result, reason }) => (
                <tr key={testCase.id} className="align-top">
                  <td className="p-3">
                    <div className="font-semibold">{testCase.id}</div>
                    <div className="mt-1 font-medium">{testCase.question}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{testCase.category}</div>
                  </td>
                  <td className="p-3">{testCase.expectedText}</td>
                  <td className="p-3">
                    <div className="font-medium">{t(LABEL[observed.kind])}</div>
                    <p className="mt-1 whitespace-normal">{observed.text}</p>
                    {observed.source && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t("evalSource", { src: observed.source })}
                      </p>
                    )}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${result === "PASS" ? "bg-primary text-primary-foreground" : result === "FAIL" ? "bg-destructive text-destructive-foreground" : "border text-muted-foreground"}`}
                    >
                      {result}
                    </span>
                    <p className="mt-2 max-w-xs">{reason}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-muted-foreground">{t("evalFooter")}</p>
    </div>
  );
}
