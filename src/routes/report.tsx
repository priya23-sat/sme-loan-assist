import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, FileBarChart, Printer, RotateCcw } from "lucide-react";
import { Card, Progress } from "@/components/shell";
import { GuidanceNote, NeedsProfile, StepBar } from "@/components/journey";
import { useReadiness } from "@/lib/readiness-state";
import { BUSINESS_TYPES, LOAN_PURPOSES, TURNOVER_RANGES, labelOf, parseAmount, reportText, summarize, type ChecklistItem } from "@/lib/readiness";
import { PriorityBadge } from "./checklist";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Preparation Report — SME Loan Ready" },
      { name: "description", content: "Summary of ready and missing loan documents with prioritised next steps. Print or download." },
      { property: "og:title", content: "Preparation Report — SME Loan Ready" },
      { property: "og:description", content: "Step 4: your loan preparation summary and next steps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  const { items, statuses, profile, resetAll } = useReadiness();
  const s = summarize(items, statuses);

  const download = () => {
    if (!profile) return;
    const date = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const blob = new Blob([reportText(profile, items, statuses, date)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "loan-preparation-report.txt";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
  };

  const reset = () => {
    if (window.confirm("Clear your profile and all document statuses?")) resetAll();
  };

  return (
    <div className="space-y-6">
      <StepBar current={3} />
      <h1 className="flex items-center gap-2 text-2xl font-semibold"><FileBarChart className="h-6 w-6 text-primary" /> Preparation report</h1>
      <NeedsProfile>
        {profile && (
          <>
            <GuidanceNote />
            <Card>
              <h2 className="font-semibold">Business profile</h2>
              <dl className="mt-2 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-2">
                <Row k="Business type" v={labelOf(BUSINESS_TYPES, profile.businessType)} />
                <Row k="Years in operation" v={profile.years} />
                <Row k="Loan purpose" v={labelOf(LOAN_PURPOSES, profile.purpose)} />
                <Row k="Turnover" v={labelOf(TURNOVER_RANGES, profile.turnover)} />
                <Row k="Requested amount" v={`₹${parseAmount(profile).toLocaleString("en-IN")}`} />
              </dl>
            </Card>
            <Card className="bg-tint">
              <div className="flex justify-between text-sm font-medium"><span>{s.ready.length} of {s.applicable} applicable documents ready</span><span>{s.percent}%</span></div>
              <div className="mt-2"><Progress value={s.percent} /></div>
              <p className="mt-2 text-xs text-muted-foreground">Being fully prepared does not mean a loan will be approved. Only the lender decides.</p>
            </Card>
            <Card>
              <h2 className="font-semibold">Prioritised next steps</h2>
              {s.nextSteps.length ? (
                <ol className="mt-2 space-y-2">
                  {s.nextSteps.map((i, n) => (
                    <li key={i.id} className="flex gap-3 text-sm">
                      <span className="font-semibold text-primary">{n + 1}.</span>
                      <span className="flex-1">{statuses[i.id] === "missing" ? "Get" : "Check whether you have"}: <strong>{i.name}</strong><span className="block text-muted-foreground">{i.why}</span></span>
                      <PriorityBadge p={i.priority} />
                    </li>
                  ))}
                </ol>
              ) : <p className="mt-2 text-sm text-success">All applicable documents are marked ready. Next, contact your lender to confirm their exact list.</p>}
            </Card>
            <div className="grid gap-4 sm:grid-cols-2">
              <ListCard title="Ready" items={s.ready} empty="None marked ready yet." />
              <ListCard title="Missing" items={s.missing} empty="Nothing marked missing." />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row print:hidden">
              <button onClick={() => window.print()} className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"><Printer className="h-4 w-4" /> Print / save as PDF</button>
              <button onClick={download} className="inline-flex items-center justify-center gap-2 rounded-md border border-primary px-4 py-2.5 text-sm font-medium text-primary hover:bg-tint"><Download className="h-4 w-4" /> Download report</button>
              <Link to="/tracker" className="inline-flex items-center justify-center rounded-md border px-4 py-2.5 text-sm hover:bg-tint">Update statuses</Link>
              <button onClick={reset} className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm text-muted-foreground underline"><RotateCcw className="h-4 w-4" /> Start over</button>
            </div>
          </>
        )}
      </NeedsProfile>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-2 border-b py-1"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{v}</dd></div>;
}

function ListCard({ title, items, empty }: { title: string; items: ChecklistItem[]; empty: string }) {
  return (
    <Card>
      <h2 className="font-semibold">{title} ({items.length})</h2>
      {items.length ? <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{items.map((i) => <li key={i.id}>{i.name}</li>)}</ul> : <p className="mt-2 text-sm text-muted-foreground">{empty}</p>}
    </Card>
  );
}
