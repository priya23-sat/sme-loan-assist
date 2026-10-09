import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Dashboard" },
  { to: "/documents", label: "Documents" },
  { to: "/assistant", label: "AI Assistant" },
  { to: "/evaluation", label: "Evaluation" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="bg-primary px-4 py-2 text-center text-xs text-primary-foreground">
        Educational portfolio prototype — not a real banking service or loan eligibility tool. All data is fictional demo data. Do not enter personal information.
      </div>
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="font-semibold text-primary">SME Loan Application Copilot</Link>
          <nav className="flex flex-wrap gap-1 text-sm">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: true }}
                className="rounded-md px-3 py-1.5 text-muted-foreground hover:bg-secondary"
                activeProps={{ className: "bg-secondary !text-primary font-medium" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border bg-card p-5 ${className}`}>{children}</div>;
}

export function DemoBadge() {
  return <span className="rounded border border-primary/30 bg-secondary px-2 py-0.5 text-xs font-medium text-primary">DEMO DATA</span>;
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-muted" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}
