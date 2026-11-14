import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpenCheck, FileCheck2, ShieldCheck, Sparkles } from "lucide-react";
import { Card } from "@/components/shell";
import { useLanguage, text } from "@/lib/language";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "SME Loan Ready — Prepare for Your Bank Visit" },
    { name: "description", content: "A bilingual preparation guide for small businesses to understand possible loan documents and prepare for a bank visit." },
    { property: "og:title", content: "SME Loan Ready — Prepare for Your Bank Visit" },
    { property: "og:description", content: "Understand your preparation steps, documents, and what to expect before approaching a bank." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: HomePage,
});

function HomePage() {
  const { language } = useLanguage();
  const t = (key: Parameters<typeof text>[1]) => text(language, key);
  return <div className="mx-auto max-w-5xl space-y-12">
    <section className="relative overflow-hidden rounded-lg bg-hero px-6 py-10 text-primary-foreground sm:px-10 sm:py-14">
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/85"><Sparkles className="h-4 w-4" />{t("homeEyebrow")}</span>
          <span className="rounded-full border border-primary-foreground/30 px-2.5 py-1 text-xs font-medium">{t("demoMode")}</span>
        </div>
        <h1 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">{t("homeTitle")}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-primary-foreground/85">{t("homeSubtitle")}</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link to="/profile" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-background px-5 py-3 text-sm font-semibold text-foreground hover:opacity-90">{t("start")}<ArrowRight className="h-4 w-4" /></Link>
          <Link to="/finance" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-primary-foreground/40 px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10">{t("exploreFinance")}<BookOpenCheck className="h-4 w-4" /></Link>
        </div>
        <p className="mt-4 text-xs text-primary-foreground/75">{t("homeNote")}</p>
      </div>
    </section>
    <section className="grid gap-10 md:grid-cols-2 md:items-start">
      <div className="space-y-3"><h2 className="text-2xl font-semibold">{t("homeHow")}</h2><p className="leading-7 text-muted-foreground">{t("homeHowText")}</p></div>
      <div className="space-y-5">
        <div className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-tint text-primary"><FileCheck2 className="h-5 w-5" /></span><div><h3 className="font-semibold">{t("checklistTitle")}</h3><p className="mt-1 text-sm text-muted-foreground">{t("checklistIntro")}</p></div></div>
        <div className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-success-soft text-success"><ShieldCheck className="h-5 w-5" /></span><div><h3 className="font-semibold">{t("safetyTitle")}</h3><p className="mt-1 text-sm text-muted-foreground">{t("safetyText")}</p></div></div>
      </div>
    </section>
    <Card className="border-warning/30 bg-warning-soft"><p className="text-sm leading-6"><strong>{t("guidanceLabel")}.</strong> {t("varyNote")} {t("noRecommendation")}</p></Card>
    <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-primary"><Link to="/bank-visit" className="inline-flex items-center gap-2 hover:underline">{t("visitLink")}<ArrowRight className="h-4 w-4" /></Link><Link to="/finance" className="inline-flex items-center gap-2 hover:underline">{t("financeLink")}<ArrowRight className="h-4 w-4" /></Link></div>
  </div>;
}