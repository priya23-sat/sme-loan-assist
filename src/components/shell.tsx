import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight, FileText, ShieldAlert, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage, text } from "@/lib/language";

export function Shell({ children }: { children: ReactNode }) {
  const { language, setLanguage } = useLanguage();
  const t = (key: Parameters<typeof text>[1]) => text(language, key);
  const nav = [
    { to: "/profile" as const, label: t("navProfile") },
    { to: "/documents" as const, label: language === "mr" ? "कागदपत्रे" : "Documents" },
    { to: "/checklist" as const, label: t("navChecklist") },
    { to: "/bank-visit" as const, label: t("navVisit") },
    { to: "/finance" as const, label: t("navFinance") },
    { to: "/report" as const, label: t("navReport") },
  ];
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex items-center justify-center gap-2 bg-warning-soft px-4 py-2 text-center text-xs text-warning">
        <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden />
        <span>{t("safetyBanner")}</span>
      </div>
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-tint text-primary"><Landmark className="h-5 w-5" /></span>
              {t("brand")}
            </Link>
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-muted-foreground sm:inline">{t("language")}</span>
              <div className="flex items-center rounded-md border p-0.5" aria-label={t("language")}>
                <Button type="button" size="sm" variant={language === "en" ? "secondary" : "ghost"} aria-pressed={language === "en"} onClick={() => setLanguage("en")}>{t("english")}</Button>
                <Button type="button" size="sm" variant={language === "mr" ? "secondary" : "ghost"} aria-pressed={language === "mr"} onClick={() => setLanguage("mr")}>{t("marathi")}</Button>
              </div>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto text-sm" aria-label={t("brand")}>
            <Link to="/" activeOptions={{ exact: true }} className="shrink-0 rounded-md px-3 py-2 text-muted-foreground hover:bg-tint hover:text-foreground" activeProps={{ className: "bg-tint font-medium text-primary" }}>{t("navHome")}</Link>
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: true }}
                className="shrink-0 rounded-md px-3 py-2 text-muted-foreground hover:bg-tint hover:text-foreground"
                activeProps={{ className: "bg-tint font-medium text-primary" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border bg-card p-5 shadow-sm ${className}`}>{children}</div>;
}

export function DemoBadge() {
  const { language } = useLanguage();
  return <span className="rounded-full border border-primary/30 bg-tint px-2.5 py-0.5 text-xs font-medium text-primary">{text(language, "demoMode")}</span>;
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
