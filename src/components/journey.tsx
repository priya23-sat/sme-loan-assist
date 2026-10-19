import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { Card } from "@/components/shell";
import { useReadiness } from "@/lib/readiness-state";

const STEPS = [
  { to: "/profile", label: "Profile" },
  { to: "/checklist", label: "Checklist" },
  { to: "/tracker", label: "Tracker" },
  { to: "/report", label: "Report" },
] as const;

export function StepBar({ current }: { current: number }) {
  return (
    <ol className="grid grid-cols-4 gap-2 print:hidden" aria-label="Loan readiness steps">
      {STEPS.map((s, i) => (
        <li key={s.to}>
          <Link to={s.to} className="block text-center" aria-current={i === current ? "step" : undefined}>
            <div className={`h-1.5 rounded-full ${i <= current ? "bg-hero" : "bg-muted"}`} />
            <span className={`mt-1 block text-xs ${i === current ? "font-semibold text-primary" : "text-muted-foreground"}`}>{i + 1}. {s.label}</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

export function GuidanceNote() {
  return (
    <div className="flex gap-2 rounded-lg border border-warning/30 bg-warning-soft p-3 text-sm text-warning">
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <p><strong>General guidance, not lender-verified.</strong> Each bank sets its own list. Use this to prepare, then confirm the exact requirements with your lender. This is not a loan offer, approval or eligibility check.</p>
    </div>
  );
}

/** Renders children only once a valid profile exists; otherwise prompts the user to fill it in. */
export function NeedsProfile({ children }: { children: ReactNode }) {
  const { loaded, profile } = useReadiness();
  if (!loaded) return <p className="text-sm text-muted-foreground">Loading your saved progress…</p>;
  if (!profile)
    return (
      <Card className="bg-tint text-center">
        <p className="font-medium">Start with your business profile</p>
        <p className="mt-1 text-sm text-muted-foreground">We need a few details to build your personalised checklist.</p>
        <Link to="/profile" className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Go to business profile</Link>
      </Card>
    );
  return <>{children}</>;
}
