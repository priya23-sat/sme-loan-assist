import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  LayoutDashboard,
  FileText,
  Bot,
  ClipboardCheck,
  ShieldAlert,
  Landmark,
  Languages,
} from "lucide-react";
import { useLanguage } from "@/lib/language";
import { LANGUAGES, type Lang } from "@/lib/i18n";

const NAV = [
  { to: "/", label: "navDashboard", icon: LayoutDashboard },
  { to: "/documents", label: "navDocuments", icon: FileText },
  { to: "/assistant", label: "navAssistant", icon: Bot },
  { to: "/evaluation", label: "navEvaluation", icon: ClipboardCheck },
] as const;

export function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();
  return (
    <div
      className="flex items-center gap-1.5 print:hidden"
      role="group"
      aria-label={t("languageLabel")}
    >
      <Languages className="h-4 w-4 text-primary-foreground/80" aria-hidden />
      {LANGUAGES.map((l) => (
        <button
          key={l.value}
          type="button"
          lang={l.value}
          aria-pressed={lang === l.value}
          onClick={() => setLang(l.value as Lang)}
          className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
            lang === l.value
              ? "border-primary-foreground/70 bg-primary-foreground/25 text-primary-foreground"
              : "border-primary-foreground/25 text-primary-foreground/75 hover:bg-primary-foreground/10"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex items-center justify-center gap-2 bg-warning-soft px-4 py-2 text-center text-xs text-warning">
        <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden />
        <span>{t("banner")}</span>
      </div>
      <header className="bg-hero text-primary-foreground">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/15">
              <Landmark className="h-4 w-4" />
            </span>
            {t("brand")}
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <nav className="flex flex-wrap gap-1 text-sm">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: true }}
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-primary-foreground/80 hover:bg-primary-foreground/10"
                  activeProps={{
                    className: "bg-primary-foreground/20 !text-primary-foreground font-medium",
                  }}
                >
                  <n.icon className="h-4 w-4" aria-hidden />
                  {t(n.label)}
                </Link>
              ))}
            </nav>
            <LanguageSwitcher />
          </div>
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
  const { lang } = useLanguage();
  return (
    <span className="rounded-full border border-primary/30 bg-tint px-2.5 py-0.5 text-xs font-medium text-primary">
      {lang === "mr" ? "डेमो माहिती" : "DEMO DATA"}
    </span>
  );
}

export function StatusBadge({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${ok ? "bg-success-soft text-success" : "bg-warning-soft text-warning"}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? "bg-success" : "bg-warning"}`} />
      {children}
    </span>
  );
}

export function Progress({ value }: { value: number }) {
  return (
    <div
      className="h-2 w-full rounded-full bg-muted"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-2 rounded-full bg-hero transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}
