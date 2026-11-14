import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CircleHelp, Coins, Landmark, RefreshCw } from "lucide-react";
import { Card } from "@/components/shell";
import { useLanguage, text } from "@/lib/language";

export const Route = createFileRoute("/finance")({
  head: () => ({ meta: [
    { title: "Understand Business Finance — SME Loan Ready" },
    { name: "description", content: "Plain-language introductions to term loans, cash credit, and overdrafts for small businesses." },
    { property: "og:title", content: "Understand Business Finance — SME Loan Ready" },
    { property: "og:description", content: "Learn about common business-finance facilities and questions to ask your bank." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: FinancePage,
});

function FinancePage() {
  const { language } = useLanguage();
  const t = (key: Parameters<typeof text>[1]) => text(language, key);
  const options = [
    { title: "termLoan", meaning: "termMeaning", use: "termUse", repay: "termRepay", ask: "termAsk", icon: Landmark },
    { title: "cc", meaning: "ccMeaning", use: "ccUse", repay: "ccRepay", ask: "ccAsk", icon: Coins },
    { title: "od", meaning: "odMeaning", use: "odUse", repay: "odRepay", ask: "odAsk", icon: RefreshCw },
  ] as const;
  return <div className="mx-auto max-w-4xl space-y-8">
    <header className="space-y-3">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />{t("returnHome")}</Link>
      <p className="text-sm font-medium text-primary">{t("guidanceLabel")}</p>
      <h1 className="text-3xl font-semibold">{t("financeTitle")}</h1>
      <p className="max-w-2xl text-muted-foreground">{t("financeIntro")}</p>
    </header>
    <div className="divide-y border-y">
      {options.map(({ title, meaning, use, repay, ask, icon: Icon }) => <section key={title} className="grid gap-4 py-6 sm:grid-cols-[minmax(10rem,0.8fr)_2fr] sm:gap-8">
        <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-tint text-primary"><Icon className="h-5 w-5" /></span><h2 className="text-lg font-semibold">{t(title)}</h2></div>
        <div className="space-y-3 text-sm leading-6">
          <p>{t(meaning)}</p>
          <p className="text-muted-foreground">{t(use)}</p>
          <p className="text-muted-foreground">{t(repay)}</p>
          <p className="flex gap-2 rounded-md bg-tint p-3 text-foreground"><CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{t(ask)}</p>
        </div>
      </section>)}
    </div>
    <Card className="border-warning/30 bg-warning-soft"><p className="text-sm leading-6">{t("noRecommendation")}</p></Card>
    <Link to="/profile" className="inline-flex items-center gap-2 font-medium text-primary">{t("start")}<ArrowRight className="h-4 w-4" /></Link>
  </div>;
}