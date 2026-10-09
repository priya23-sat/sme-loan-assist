import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, DemoBadge, Progress } from "@/components/shell";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — SME Loan Application Copilot" },
      { name: "description", content: "Demo SME loan application dashboard with status and progress tracker." },
      { property: "og:title", content: "SME Loan Application Copilot — Dashboard" },
      { property: "og:description", content: "Portfolio prototype: track a fictional SME loan application." },
    ],
  }),
  component: Dashboard,
});

const STAGES = ["Application Submitted", "Documents Pending", "Under Review", "Bank Decision"];

function Dashboard() {
  const { docs } = useAppState();
  const done = docs.filter((d) => d.submitted).length;
  const allDone = done === docs.length;
  const current = allDone ? 2 : 1;
  const status = allDone ? "Ready for Review" : "Documents Pending";
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Application Dashboard</h1>
        <DemoBadge />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Applicant", "ABC Traders"],
          ["Application ID", "SME-2026-1042"],
          ["Requested amount", "₹25,00,000"],
          ["Status", status],
        ].map(([k, v]) => (
          <Card key={k}>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{k}</div>
            <div className="mt-1 text-lg font-semibold text-primary">{v}</div>
          </Card>
        ))}
      </div>
      <Card>
        <h2 className="font-semibold">Application progress</h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-4">
          {STAGES.map((s, i) => (
            <li key={s} className="flex items-center gap-2 text-sm">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  i < current ? "bg-primary text-primary-foreground" : i === current ? "border-2 border-primary text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
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
        <p className="mt-4 text-sm text-muted-foreground">
          Submitting documents does not mean the loan is approved. Only the bank makes credit decisions.
        </p>
        <Link to="/documents" className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          View document checklist
        </Link>
      </Card>
    </div>
  );
}
