import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardList } from "lucide-react";
import { Card, Progress } from "@/components/shell";
import { GuidanceNote, NeedsProfile, StepBar } from "@/components/journey";
import { useReadiness } from "@/lib/readiness-state";
import { useLanguage } from "@/lib/language";
import { localizeItems } from "@/lib/i18n";
import { summarize, type Status } from "@/lib/readiness";
import { PriorityBadge } from "./checklist";

export const Route = createFileRoute("/tracker")({
  head: () => ({
    meta: [
      { title: "Readiness Tracker — SME Loan Ready" },
      {
        name: "description",
        content:
          "Mark each loan document as Ready, Missing or Not Applicable and watch your progress update.",
      },
      { property: "og:title", content: "Readiness Tracker — SME Loan Ready" },
      { property: "og:description", content: "Step 3: track which documents you have ready." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TrackerPage,
});

const OPTIONS: { v: Status; labelKey: "statusReady" | "statusMissing" | "statusNa"; on: string }[] =
  [
    {
      v: "ready",
      labelKey: "statusReady",
      on: "bg-success text-primary-foreground border-success",
    },
    {
      v: "missing",
      labelKey: "statusMissing",
      on: "bg-warning text-primary-foreground border-warning",
    },
    {
      v: "na",
      labelKey: "statusNa",
      on: "bg-muted-foreground text-primary-foreground border-muted-foreground",
    },
  ];

function TrackerPage() {
  const { items, statuses, setStatus } = useReadiness();
  const { lang, t } = useLanguage();
  const localized = localizeItems(items, lang);
  const s = summarize(items, statuses);
  return (
    <div className="space-y-6">
      <StepBar current={2} />
      <h1 className="flex items-center gap-2 text-2xl font-semibold">
        <ClipboardList className="h-6 w-6 text-primary" /> {t("trackerTitle")}
      </h1>
      <Card className="border-primary/20 bg-tint">
        <h2 className="font-semibold">{t("trackerHowTitle")}</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{t("trackerHowBody")}</p>
      </Card>
      <NeedsProfile>
        <Card className="bg-tint">
          <div className="flex justify-between text-sm font-medium">
            <span>{t("trackerOfReady", { r: s.ready.length, a: s.applicable })}</span>
            <span>{s.percent}%</span>
          </div>
          <div className="mt-2">
            <Progress value={s.percent} />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
            <Stat n={s.ready.length} l={t("statReady")} />
            <Stat n={s.missing.length} l={t("statMissing")} />
            <Stat n={s.na.length} l={t("statNA")} />
            <Stat n={s.unmarked.length} l={t("statUnmarked")} />
          </div>
        </Card>
        <Card>
          <ul className="divide-y">
            {localized.map((i) => (
              <li key={i.id} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-medium">{i.name}</span>
                  <PriorityBadge p={i.priority} />
                </div>
                <div
                  className="mt-2 grid grid-cols-3 gap-2"
                  role="radiogroup"
                  aria-label={t("statusFor", { name: i.name })}
                >
                  {OPTIONS.map((o) => {
                    const active = statuses[i.id] === o.v;
                    return (
                      <button
                        key={o.v}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setStatus(i.id, o.v)}
                        className={`rounded-md border px-2 py-2 text-xs font-medium ${active ? o.on : "border-input hover:bg-tint"}`}
                      >
                        {t(o.labelKey)}
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <GuidanceNote />
        <Link
          to="/report"
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:w-auto"
        >
          {t("btnSeeReport")} <ArrowRight className="h-4 w-4" />
        </Link>
      </NeedsProfile>
    </div>
  );
}

function Stat({ n, l }: { n: number; l: string }) {
  return (
    <div className="rounded-md bg-card p-2">
      <div className="text-lg font-semibold text-primary">{n}</div>
      <div className="text-muted-foreground">{l}</div>
    </div>
  );
}
