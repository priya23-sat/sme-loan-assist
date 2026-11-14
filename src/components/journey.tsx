import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { Card } from "@/components/shell";
import { useReadiness } from "@/lib/readiness-state";
import { useLanguage, text } from "@/lib/language";

const STEPS = [
  { to: "/profile", label: "Profile" },
  { to: "/checklist", label: "Checklist" },
  { to: "/tracker", label: "Tracker" },
  { to: "/report", label: "Report" },
] as const;

export function StepBar({ current }: { current: number }) {
  const { language } = useLanguage();
  const labels = [text(language, "profileStep"), text(language, "checklistStep"), text(language, "trackerStep"), text(language, "reportStep")];
  return (
    <ol className="grid grid-cols-4 gap-2 print:hidden" aria-label={text(language, "progress")}>
      {STEPS.map((s, i) => (
        <li key={s.to}>
          <Link to={s.to} className="block text-center" aria-current={i === current ? "step" : undefined}>
            <div className={`h-1.5 rounded-full ${i <= current ? "bg-hero" : "bg-muted"}`} />
            <span className={`mt-1 block text-xs ${i === current ? "font-semibold text-primary" : "text-muted-foreground"}`}>{i + 1}. {labels[i]}</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

export function GuidanceNote() {
  const { language } = useLanguage();
  return (
    <div className="flex gap-2 rounded-lg border border-warning/30 bg-warning-soft p-3 text-sm text-warning">
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <p><strong>{text(language, "guidanceLabel")}.</strong> {text(language, "varyNote")} {text(language, "safetyText")}</p>
    </div>
  );
}

/** Renders children only once a valid profile exists; otherwise prompts the user to fill it in. */
export function NeedsProfile({ children }: { children: ReactNode }) {
  const { loaded, profile } = useReadiness();
  const { language } = useLanguage();
  if (!loaded) return <p className="text-sm text-muted-foreground">Loading your saved progress…</p>;
  if (!profile)
    return (
      <Card className="bg-tint text-center">
        <p className="font-medium">{text(language, "pageUnavailable")}</p>
        <Link to="/profile" className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">{text(language, "goProfile")}</Link>
      </Card>
    );
  return <>{children}</>;
}
