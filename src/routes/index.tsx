import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ClipboardCheck,
  FileText,
  MessageCircle,
  ShieldCheck,
  Store,
} from "lucide-react";
import { Card } from "@/components/shell";
import { useLanguage } from "@/lib/language";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SME Loan Ready — Prepare Before You Visit the Bank" },
      {
        name: "description",
        content:
          "A simple guide for small businesses in India to explore possible loan options, understand documents, and prepare for a bank visit.",
      },
      { property: "og:title", content: "SME Loan Ready" },
      {
        property: "og:description",
        content: "Understand your options. Prepare your documents. Get ready to talk to your bank.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

const FEATURES = [
  { icon: ClipboardCheck, title: "feat1Title", text: "feat1Text" },
  { icon: FileText, title: "feat2Title", text: "feat2Text" },
  { icon: MessageCircle, title: "feat3Title", text: "feat3Text" },
] as const;

function HomePage() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="overflow-hidden rounded-2xl bg-hero p-6 text-primary-foreground sm:p-10">
        <div className="flex items-center gap-2 text-sm font-medium text-primary-foreground/80">
          <Store className="h-5 w-5" aria-hidden />
          {t("homeKicker")}
        </div>
        <h1 className="mt-4 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
          {t("homeTitle")}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-primary-foreground/85">
          {t("homeSub")}
        </p>
        <Link
          to="/profile"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-background px-5 py-3 text-sm font-semibold text-foreground hover:opacity-90"
        >
          {t("homeCta")} <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-3 text-xs text-primary-foreground/75">{t("homePrivacy")}</p>
      </section>

      <Card className="border-primary/20 bg-tint">
        <h2 className="font-semibold">{t("simpleWordsTitle")}</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{t("simpleWordsBody")}</p>
      </Card>

      <section className="grid gap-4 md:grid-cols-3" aria-label={t("howHelpsAria")}>
        {FEATURES.map((feature, index) => (
          <Card key={feature.title} className="h-full">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-tint text-primary">
              <feature.icon className="h-5 w-5" aria-hidden />
            </div>
            <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("featureStep")} {index + 1}
            </div>
            <h2 className="mt-1 font-semibold">{t(feature.title)}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{t(feature.text)}</p>
          </Card>
        ))}
      </section>

      <Card className="border-primary/20 bg-tint">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
          <div>
            <h2 className="font-semibold">{t("safetyTitle")}</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{t("safetyBody")}</p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          to="/assistant"
          className="inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium hover:bg-tint"
        >
          {t("homeAsk")} <MessageCircle className="h-4 w-4" />
        </Link>
        <Link
          to="/report"
          className="inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium hover:bg-tint"
        >
          {t("homeReport")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
