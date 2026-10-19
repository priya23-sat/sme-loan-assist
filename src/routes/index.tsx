import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardCheck, FileText, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { Card } from "@/components/shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SME Loan Ready — Prepare Before You Visit the Bank" },
      { name: "description", content: "A simple guide for small transport businesses to explore possible loan options, understand documents, and prepare for a bank visit." },
      { property: "og:title", content: "SME Loan Ready" },
      { property: "og:description", content: "Understand your options. Prepare your documents. Get ready to talk to your bank." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: HomePage,
});

const FEATURES = [
  {
    icon: ClipboardCheck,
    title: "Explore possible loan options",
    text: "Learn about possible routes to finance and what to verify with a lender. No promise of eligibility or approval.",
  },
  {
    icon: FileText,
    title: "Understand your documents",
    text: "See what common documents mean, why a bank may ask for them, and what to do next if you do not have one.",
  },
  {
    icon: MessageCircle,
    title: "Practise your bank conversation",
    text: "Prepare simple, truthful answers to common questions before you visit a branch.",
  },
];

function HomePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="overflow-hidden rounded-2xl bg-hero p-6 text-primary-foreground sm:p-10">
        <div className="flex items-center gap-2 text-sm font-medium text-primary-foreground/80">
          <Truck className="h-5 w-5" aria-hidden />
          Made for small transport businesses
        </div>
        <h1 className="mt-4 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
          Get ready for a business loan — one simple step at a time.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-primary-foreground/85">
          Not sure which loan to ask about? Worried about documents or what a bank manager may ask?
          Prepare at your own pace before you visit the branch.
        </p>
        <Link
          to="/profile"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-background px-5 py-3 text-sm font-semibold text-foreground hover:opacity-90"
        >
          Start my preparation <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-3 text-xs text-primary-foreground/75">No account needed. Do not enter PAN, Aadhaar, account numbers, or upload private documents.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3" aria-label="How SME Loan Ready helps">
        {FEATURES.map((feature, index) => (
          <Card key={feature.title} className="h-full">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-tint text-primary">
              <feature.icon className="h-5 w-5" aria-hidden />
            </div>
            <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Step {index + 1}</div>
            <h2 className="mt-1 font-semibold">{feature.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.text}</p>
          </Card>
        ))}
      </section>

      <Card className="border-primary/20 bg-tint">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
          <div>
            <h2 className="font-semibold">Guidance, not a loan decision</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              This is an educational prototype. Loan schemes, eligibility and document lists can change and vary by lender.
              Confirm current details with an authorised bank or scheme representative. Only the lender decides whether to approve a loan.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to="/assistant" className="inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium hover:bg-tint">
          Ask a simple question <MessageCircle className="h-4 w-4" />
        </Link>
        <Link to="/report" className="inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium hover:bg-tint">
          View preparation report <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
