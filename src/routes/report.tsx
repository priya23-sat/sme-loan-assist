import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, FileBarChart, Printer, RotateCcw } from "lucide-react";
import { Card, Progress } from "@/components/shell";
import { GuidanceNote, NeedsProfile, StepBar } from "@/components/journey";
import { useReadiness } from "@/lib/readiness-state";
import { useLanguage } from "@/lib/language";
import { localizeItems } from "@/lib/i18n";
import {
  BUSINESS_TYPES,
  LOAN_PURPOSES,
  TURNOVER_RANGES,
  optionLabel,
  parseAmount,
  reportText,
  summarize,
  type ChecklistItem,
} from "@/lib/readiness";
import { PriorityBadge } from "./checklist";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Preparation Report — SME Loan Ready" },
      {
        name: "description",
        content:
          "Summary of ready and missing loan documents with prioritised next steps. Print or download.",
      },
      { property: "og:title", content: "Preparation Report — SME Loan Ready" },
      {
        property: "og:description",
        content: "Step 4: your loan preparation summary and next steps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  const { items, statuses, profile, resetAll } = useReadiness();
  const { lang, t } = useLanguage();
  const localized = localizeItems(items, lang);
  const s = summarize(items, statuses);
  const sNames = new Map(localized.map((i) => [i.id, i]));
  const at = (i: ChecklistItem) => sNames.get(i.id) ?? i;

  const download = () => {
    if (!profile) return;
    const date = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const blob = new Blob([reportText(profile, items, statuses, date, lang)], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = lang === "mr" ? "loan-preparation-report-mr.txt" : "loan-preparation-report.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
  };

  const reset = () => {
    if (window.confirm(t("resetConfirm"))) resetAll();
  };

  return (
    <div className="space-y-6">
      <StepBar current={3} />
      <h1 className="flex items-center gap-2 text-2xl font-semibold">
        <FileBarChart className="h-6 w-6 text-primary" /> {t("reportTitle")}
      </h1>
      <NeedsProfile>
        {profile && (
          <>
            <GuidanceNote />
            <Card>
              <h2 className="font-semibold">{t("reportProfileTitle")}</h2>
              <dl className="mt-2 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
                <Row
                  k={t("rowBusinessType")}
                  v={optionLabel("business", BUSINESS_TYPES, profile.businessType, lang)}
                />
                <Row k={t("rowYears")} v={profile.years} />
                <Row
                  k={t("rowPurpose")}
                  v={optionLabel("purpose", LOAN_PURPOSES, profile.purpose, lang)}
                />
                <Row
                  k={t("rowTurnover")}
                  v={optionLabel("turnover", TURNOVER_RANGES, profile.turnover, lang)}
                />
                <Row k={t("rowAmount")} v={`₹${parseAmount(profile).toLocaleString("en-IN")}`} />
              </dl>
            </Card>
            <Card className="bg-tint">
              <div className="flex justify-between text-sm font-medium">
                <span>{t("reportReadyLine", { r: s.ready.length, a: s.applicable })}</span>
                <span>{s.percent}%</span>
              </div>
              <div className="mt-2">
                <Progress value={s.percent} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{t("reportNoApproval")}</p>
            </Card>
            <Card>
              <h2 className="font-semibold">{t("reportNextTitle")}</h2>
              {s.nextSteps.length ? (
                <ol className="mt-2 space-y-2">
                  {s.nextSteps.map((i, n) => (
                    <li key={i.id} className="flex gap-3 text-sm">
                      <span className="font-semibold text-primary">{n + 1}.</span>
                      <span className="flex-1">
                        {statuses[i.id] === "missing" ? t("nextGet") : t("nextCheck")}:{" "}
                        <strong>{at(i).name}</strong>
                        <span className="block text-muted-foreground">{at(i).why}</span>
                      </span>
                      <PriorityBadge p={i.priority} />
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-2 text-sm text-success">{t("reportAllReady")}</p>
              )}
            </Card>
            <div className="grid gap-4 sm:grid-cols-2">
              <ListCard title={t("listReady")} items={s.ready.map(at)} empty={t("emptyReady")} />
              <ListCard
                title={t("listMissing")}
                items={s.missing.map(at)}
                empty={t("emptyMissing")}
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row print:hidden">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Printer className="h-4 w-4" /> {t("btnPrint")}
              </button>
              <button
                onClick={download}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-primary px-4 py-2.5 text-sm font-medium text-primary hover:bg-tint"
              >
                <Download className="h-4 w-4" /> {t("btnDownload")}
              </button>
              <Link
                to="/tracker"
                className="inline-flex items-center justify-center rounded-md border px-4 py-2.5 text-sm hover:bg-tint"
              >
                {t("btnUpdateStatuses")}
              </Link>
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm text-muted-foreground underline"
              >
                <RotateCcw className="h-4 w-4" /> {t("btnStartOver")}
              </button>
            </div>
          </>
        )}
      </NeedsProfile>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2 border-b py-1">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}

function ListCard({
  title,
  items,
  empty,
}: {
  title: string;
  items: ChecklistItem[];
  empty: string;
}) {
  return (
    <Card>
      <h2 className="font-semibold">
        {title} ({items.length})
      </h2>
      {items.length ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {items.map((i) => (
            <li key={i.id}>{i.name}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">{empty}</p>
      )}
    </Card>
  );
}
