import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { LayoutDashboard, FileText, Bot, ClipboardCheck, ShieldAlert, Landmark } from "lucide-react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/assistant", label: "AI Assistant", icon: Bot },
  { to: "/evaluation", label: "Evaluation", icon: ClipboardCheck },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex items-center justify-center gap-2 bg-warning-soft px-4 py-2 text-center text-xs text-warning">
        <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden />
        <span>Educational portfolio prototype — not a real banking service or loan eligibility tool. All data is fictional demo data. Do not enter personal information.</span>
      </div>
      <header className="bg-hero text-primary-foreground">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/15"><Landmark className="h-4 w-4" /></span>
            SME Loan Application Copilot
          </Link>
          <nav className="flex flex-wrap gap-1 text-sm">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: true }}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-primary-foreground/80 hover:bg-primary-foreground/10"
                activeProps={{ className: "bg-primary-foreground/20 !text-primary-foreground font-medium" }}
              >
                <n.icon className="h-4 w-4" aria-hidden />
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
  return <div className={`rounded-xl border bg-card p-5 shadow-sm ${className}`}>{children}</div>;
}

export function DemoBadge() {
  return <span className="rounded-full border border-primary/30 bg-tint px-2.5 py-0.5 text-xs font-medium text-primary">DEMO DATA</span>;
}

export function StatusBadge({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${ok ? "bg-success-soft text-success" : "bg-warning-soft text-warning"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-success" : "bg-warning"}`} />
      {children}
    </span>
  );
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-muted" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-2 rounded-full bg-hero transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}
