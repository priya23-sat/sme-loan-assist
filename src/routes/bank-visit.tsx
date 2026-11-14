import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, CircleHelp, MessageSquareText } from "lucide-react";
import { Card } from "@/components/shell";
import { useLanguage, text } from "@/lib/language";

export const Route = createFileRoute("/bank-visit")({
  head: () => ({ meta: [
    { title: "Before Visiting the Bank — SME Loan Ready" },
    { name: "description", content: "Learn what may happen during a first bank visit and prepare for common business-loan questions." },
    { property: "og:title", content: "Before Visiting the Bank — SME Loan Ready" },
    { property: "og:description", content: "A simple guide to your first bank conversation and common credit-officer questions." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: BankVisitPage,
});

function BankVisitPage() {
  const { language } = useLanguage();
  const t = (key: Parameters<typeof text>[1]) => text(language, key);
  const visitSteps = ["visit1", "visit2", "visit3", "visit4", "visit5"] as const;
  const questions = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;
  return <div className="mx-auto max-w-3xl space-y-8">
    <header className="space-y-3">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />{t("returnHome")}</Link>
      <p className="text-sm font-medium text-primary">{t("guidanceLabel")}</p>
      <h1 className="text-3xl font-semibold">{t("visitTitle")}</h1>
      <p className="text-muted-foreground">{t("visitIntro")}</p>
    </header>
    <section className="space-y-4" aria-labelledby="first-visit-heading">
      <h2 id="first-visit-heading" className="flex items-center gap-2 text-xl font-semibold"><CheckCircle2 className="h-5 w-5 text-success" />{t("firstVisit")}</h2>
      <ol className="divide-y border-y">
        {visitSteps.map((key, i) => <li key={key} className="flex gap-4 py-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tint text-sm font-semibold text-primary">{i + 1}</span><span className="pt-1">{t(key)}</span></li>)}
      </ol>
    </section>
    <section className="space-y-4" aria-labelledby="questions-heading">
      <h2 id="questions-heading" className="flex items-center gap-2 text-xl font-semibold"><MessageSquareText className="h-5 w-5 text-primary" />{t("officerQuestions")}</h2>
      <ul className="grid gap-x-8 sm:grid-cols-2">
        {questions.map((key, i) => <li key={key} className="flex gap-3 border-b py-3"><span className="text-sm font-medium text-muted-foreground">0{i + 1}</span><span>{t(key)}</span></li>)}
      </ul>
    </section>
    <Card className="border-warning/30 bg-warning-soft">
      <h2 className="flex items-center gap-2 font-semibold"><CircleHelp className="h-5 w-5 text-warning" />{t("dontKnowTitle")}</h2>
      <p className="mt-2 text-sm leading-6">{t("dontKnow")}</p>
    </Card>
    <Link to="/finance" className="inline-flex items-center gap-2 font-medium text-primary">{t("financeLink")}<ArrowRight className="h-4 w-4" /></Link>
  </div>;
}