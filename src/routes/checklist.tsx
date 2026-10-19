import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ListChecks } from "lucide-react";
import { Card } from "@/components/shell";
import { GuidanceNote, NeedsProfile, StepBar } from "@/components/journey";
import { useReadiness } from "@/lib/readiness-state";
import type { Priority } from "@/lib/readiness";

export const Route = createFileRoute("/checklist")({
  head: () => ({
    meta: [
      { title: "Personalised Document Checklist — SME Loan Ready" },
      { name: "description", content: "Documents a transport business may need for an SME loan, with a reason for each." },
      { property: "og:title", content: "Document Checklist — SME Loan Ready" },
      { property: "og:description", content: "Step 2: see which documents may be relevant and why." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ChecklistPage,
});

export function PriorityBadge({ p }: { p: Priority }) {
  const cls = p === "High" ? "bg-primary text-primary-foreground" : p === "Medium" ? "bg-tint text-primary" : "bg-muted text-muted-foreground";
  return <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>{p}</span>;
}

function ChecklistPage() {
  const { items } = useReadiness();
  return (
    <div className="space-y-6">
      <StepBar current={1} />
      <h1 className="flex items-center gap-2 text-2xl font-semibold"><ListChecks className="h-6 w-6 text-primary" /> Your document checklist</h1>
      <Card className="border-primary/20 bg-tint">
        <h2 className="font-semibold">How to use this list</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          These are documents a lender may ask for based on the details you entered. The reason beside each item explains why it may be needed. Requirements differ by bank and loan type, so confirm the final list with your lender.
        </p>
      </Card>
      <NeedsProfile>
        <GuidanceNote />
        <Card>
          <p className="text-sm text-muted-foreground">{items.length} documents may be relevant based on your profile.</p>
          <ul className="mt-3 divide-y">
            {items.map((i) => (
              <li key={i.id} className="py-3">
                <div className="flex items-start justify-between gap-3">
                  <span className="font-medium">{i.name}</span>
                  <PriorityBadge p={i.priority} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{i.why}</p>
                <p className="mt-1 text-xs text-primary">Rule: {i.rule}</p>
              </li>
            ))}
          </ul>
        </Card>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link to="/tracker" className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Track my documents <ArrowRight className="h-4 w-4" /></Link>
          <Link to="/profile" className="inline-flex items-center justify-center rounded-md border px-4 py-2.5 text-sm hover:bg-tint">Edit profile</Link>
        </div>
      </NeedsProfile>
    </div>
  );
}
