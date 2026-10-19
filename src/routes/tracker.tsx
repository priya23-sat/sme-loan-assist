import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardList } from "lucide-react";
import { Card, Progress } from "@/components/shell";
import { GuidanceNote, NeedsProfile, StepBar } from "@/components/journey";
import { useReadiness } from "@/lib/readiness-state";
import { summarize, type Status } from "@/lib/readiness";
import { PriorityBadge } from "./checklist";

export const Route = createFileRoute("/tracker")({
  head: () => ({
    meta: [
      { title: "Readiness Tracker — SME Loan Ready" },
      { name: "description", content: "Mark each loan document as Ready, Missing or Not Applicable and watch your progress update." },
      { property: "og:title", content: "Readiness Tracker — SME Loan Ready" },
      { property: "og:description", content: "Step 3: track which documents you have ready." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TrackerPage,
});

const OPTIONS: { v: Status; label: string; on: string }[] = [
  { v: "ready", label: "Ready", on: "bg-success text-primary-foreground border-success" },
  { v: "missing", label: "Missing", on: "bg-warning text-primary-foreground border-warning" },
  { v: "na", label: "Not applicable", on: "bg-muted-foreground text-primary-foreground border-muted-foreground" },
];

function TrackerPage() {
  const { items, statuses, setStatus } = useReadiness();
  const s = summarize(items, statuses);
  return (
    <div className="space-y-6">
      <StepBar current={2} />
      <h1 className="flex items-center gap-2 text-2xl font-semibold"><ClipboardList className="h-6 w-6 text-primary" /> Readiness tracker</h1>
      <Card className="border-primary/20 bg-tint">
        <h2 className="font-semibold">How to update your progress</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          For each document, choose “Ready” if you have it, “Missing” if you still need it, or “Not applicable” if it does not apply to your business. Your progress summary updates as you mark items. This is a preparation aid, not a bank approval score.
        </p>
      </Card>
      <NeedsProfile>
        <Card className="bg-tint">
          <div className="flex justify-between text-sm font-medium"><span>{s.ready.length} of {s.applicable} applicable ready</span><span>{s.percent}%</span></div>
          <div className="mt-2"><Progress value={s.percent} /></div>
          <div className="mt-3 grid grid-cols-4 gap-2 text-center text-xs">
            <Stat n={s.ready.length} l="Ready" /><Stat n={s.missing.length} l="Missing" /><Stat n={s.na.length} l="N/A" /><Stat n={s.unmarked.length} l="Unmarked" />
          </div>
        </Card>
        <Card>
          <ul className="divide-y">
            {items.map((i) => (
              <li key={i.id} className="py-3">
                <div className="flex items-start justify-between gap-3"><span className="text-sm font-medium">{i.name}</span><PriorityBadge p={i.priority} /></div>
                <div className="mt-2 grid grid-cols-3 gap-2" role="radiogroup" aria-label={`Status for ${i.name}`}>
                  {OPTIONS.map((o) => {
                    const active = statuses[i.id] === o.v;
                    return (
                      <button key={o.v} type="button" role="radio" aria-checked={active} onClick={() => setStatus(i.id, o.v)}
                        className={`rounded-md border px-2 py-2 text-xs font-medium ${active ? o.on : "border-input hover:bg-tint"}`}>{o.label}</button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        </Card>
        <GuidanceNote />
        <Link to="/report" className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:w-auto">See preparation report <ArrowRight className="h-4 w-4" /></Link>
      </NeedsProfile>
    </div>
  );
}

function Stat({ n, l }: { n: number; l: string }) {
  return <div className="rounded-md bg-card p-2"><div className="text-lg font-semibold text-primary">{n}</div><div className="text-muted-foreground">{l}</div></div>;
}
