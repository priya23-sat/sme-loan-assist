import { createFileRoute } from "@tanstack/react-router";
import { Card, DemoBadge, Progress } from "@/components/shell";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Document Checklist — SME Loan Application Copilot" },
      { name: "description", content: "Demo checklist of common SME loan documents with submission status." },
      { property: "og:title", content: "Document Checklist — SME Loan Copilot" },
      { property: "og:description", content: "Track sample SME loan documents: PAN, KYC, GST, bank and financial statements." },
    ],
  }),
  component: Documents,
});

function Documents() {
  const { docs, markSubmitted, reset } = useAppState();
  const done = docs.filter((d) => d.submitted).length;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Document Checklist</h1>
        <DemoBadge />
      </div>
      <Card className="bg-secondary">
        <p className="text-sm">Requirements vary by bank and loan product. This list is an illustrative sample only. No files are uploaded — marking an item only updates this demo.</p>
      </Card>
      <Card>
        <div className="mb-2 flex justify-between text-sm"><span>{done} of {docs.length} submitted</span><span>{Math.round((done / docs.length) * 100)}%</span></div>
        <Progress value={(done / docs.length) * 100} />
        <ul className="mt-5 divide-y">
          {docs.map((d) => (
            <li key={d.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-medium">{d.name}</div>
                <div className="text-sm text-muted-foreground">{d.note}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${d.submitted ? "bg-primary text-primary-foreground" : "border border-destructive text-destructive"}`}>
                  {d.submitted ? "Submitted" : "Pending"}
                </span>
                {!d.submitted && (
                  <button onClick={() => markSubmitted(d.id)} className="rounded-md border border-primary px-3 py-1 text-sm text-primary hover:bg-secondary">
                    Mark as submitted
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
        {done === docs.length && (
          <p className="mt-4 text-sm font-medium text-primary">All demo documents submitted. The application can move to bank review — this is not a loan approval.</p>
        )}
        <button onClick={reset} className="mt-4 text-sm text-muted-foreground underline">Reset demo</button>
      </Card>
    </div>
  );
}
