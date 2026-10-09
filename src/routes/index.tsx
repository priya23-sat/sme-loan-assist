import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Hash, IndianRupee, Activity, Calculator, CalendarClock, ArrowRight } from "lucide-react";
import { Card, DemoBadge, Progress, StatusBadge } from "@/components/shell";
import { useAppState } from "@/lib/app-state";
import { emi, inr } from "@/lib/emi";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — SME Loan Application Copilot" },
      { name: "description", content: "Demo SME loan application dashboard with status, timeline and illustrative EMI estimator." },
      { property: "og:title", content: "SME Loan Application Copilot — Dashboard" },
      { property: "og:description", content: "Portfolio prototype: track a fictional SME loan application." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const STAGES = ["Application Submitted", "Documents Pending", "Under Review", "Bank Decision"];
const RATE = 11; // fictional example rate

function Dashboard() {
  const { docs } = useAppState();
  const done = docs.filter((d) => d.submitted).length;
  const allDone = done === docs.length;
  const current = allDone ? 2 : 1;
  const status = allDone ? "Ready for Review" : "Documents Pending";
  const [amount, setAmount] = useState(2500000);
  const [months, setMonths] = useState(36);
  const monthly = emi(amount, RATE, months);

  const timeline = [
    { date: "01 Oct 2026", text: "Application submitted (demo)" },
    { date: "02 Oct 2026", text: "Documents requested by bank (demo)" },
    ...docs.filter((d) => d.submittedOn).map((d) => ({ date: d.submittedOn!, text: `${d.name} marked submitted` })),
    ...(allDone ? [{ date: "09 Oct 2026", text: "All documents in — ready for bank review (not an approval)" }] : []),
  ];

  const stats = [
    { k: "Applicant", v: "ABC Traders", icon: Building2 },
    { k: "Application ID", v: "SME-2026-1042", icon: Hash },
    { k: "Requested amount", v: "₹25,00,000", icon: IndianRupee },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Application Dashboard</h1>
        <DemoBadge />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.k} className="bg-tint">
            <s.icon className="h-5 w-5 text-primary" aria-hidden />
            <div className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">{s.k}</div>
            <div className="mt-1 text-lg font-semibold text-primary">{s.v}</div>
          </Card>
        ))}
        <Card className={allDone ? "bg-success-soft" : "bg-warning-soft"}>
          <Activity className={`h-5 w-5 ${allDone ? "text-success" : "text-warning"}`} aria-hidden />
          <div className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">Status</div>
          <div className="mt-1"><StatusBadge ok={allDone}>{status}</StatusBadge></div>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold">Application progress</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-4">
          {STAGES.map((s, i) => (
            <li key={s} className="flex items-center gap-2 text-sm">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                i < current ? "bg-success text-primary-foreground" : i === current ? "border-2 border-warning bg-warning-soft text-warning" : "bg-muted text-muted-foreground"}`}>
                {i + 1}
              </span>
              <span className={i === current ? "font-medium" : "text-muted-foreground"}>{s}</span>
            </li>
          ))}
        </ol>
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm"><span>Documents submitted</span><span>{done} of {docs.length}</span></div>
          <Progress value={(done / docs.length) * 100} />
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Submitting documents does not mean the loan is approved. Only the bank makes credit decisions.</p>
        <Link to="/documents" className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          View document checklist <ArrowRight className="h-4 w-4" />
        </Link>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="flex items-center gap-2 font-semibold"><CalendarClock className="h-5 w-5 text-primary" /> Application timeline</h2>
          <ol className="mt-4 space-y-4 border-l-2 border-tint pl-5">
            {timeline.map((t, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-card bg-primary" />
                <div className="text-xs font-medium text-muted-foreground">{t.date}</div>
                <div className="text-sm">{t.text}</div>
              </li>
            ))}
          </ol>
        </Card>

        <Card>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="flex items-center gap-2 font-semibold"><Calculator className="h-5 w-5 text-primary" /> Repayment estimator</h2>
            <span className="rounded-full bg-warning-soft px-2 py-0.5 text-xs font-medium text-warning">ILLUSTRATIVE EXAMPLE</span>
          </div>
          <label className="mt-4 block text-sm">
            <div className="flex justify-between"><span>Sample amount</span><span className="font-medium">{inr(amount)}</span></div>
            <input type="range" min={100000} max={5000000} step={100000} value={amount} onChange={(e) => setAmount(+e.target.value)} className="mt-2 w-full accent-primary" />
          </label>
          <label className="mt-4 block text-sm">
            <div className="flex justify-between"><span>Sample tenure</span><span className="font-medium">{months} months</span></div>
            <input type="range" min={6} max={84} step={6} value={months} onChange={(e) => setMonths(+e.target.value)} className="mt-2 w-full accent-primary" />
          </label>
          <div className="mt-5 rounded-lg bg-hero p-4 text-primary-foreground">
            <div className="text-xs opacity-80">Example monthly EMI at a fictional {RATE}% p.a.</div>
            <div className="text-2xl font-semibold">{inr(monthly)}</div>
            <div className="text-xs opacity-80">Total example repayment {inr(monthly * months)}</div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">This is an example calculation only — not a loan offer, rate quote, or eligibility check. Actual terms are set by the bank.</p>
        </Card>
      </div>
    </div>
  );
}
