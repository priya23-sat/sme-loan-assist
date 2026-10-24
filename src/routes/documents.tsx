import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, CheckCircle2, Clock, X, Eye, Landmark } from "lucide-react";
import { Card, DemoBadge, Progress, StatusBadge } from "@/components/shell";
import { useAppState, type Doc } from "@/lib/app-state";
import { useLanguage } from "@/lib/language";
import { localizeDoc } from "@/lib/i18n";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Document Checklist — SME Loan Application Copilot" },
      {
        name: "description",
        content: "Demo checklist of common SME loan documents with submission status and previews.",
      },
      { property: "og:title", content: "Document Checklist — SME Loan Copilot" },
      {
        property: "og:description",
        content: "Track sample SME loan documents: PAN, KYC, GST, bank and financial statements.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Documents,
});

function Documents() {
  const { docs, markSubmitted, reset } = useAppState();
  const { lang, t } = useLanguage();
  const [openId, setOpenId] = useState<string | null>(null);
  const open = docs.find((d) => d.id === openId);
  const done = docs.filter((d) => d.submitted).length;
  const view = (d: Doc) => localizeDoc(d, lang);
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">{t("docsTitle")}</h1>
        <DemoBadge />
      </div>
      <Card className="bg-tint">
        <p className="text-sm">{t("docsIntro")}</p>
      </Card>
      <Card>
        <div className="mb-2 flex justify-between text-sm">
          <span>{t("docsSubmittedLine", { d: done, t: docs.length })}</span>
          <span>{Math.round((done / docs.length) * 100)}%</span>
        </div>
        <Progress value={(done / docs.length) * 100} />
        <ul className="mt-5 divide-y">
          {docs.map((raw) => {
            const d = view(raw);
            return (
              <li
                key={d.id}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <button
                  onClick={() => setOpenId(d.id)}
                  className="flex items-center gap-3 rounded-md text-left hover:opacity-80"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${d.submitted ? "bg-success-soft text-success" : "bg-warning-soft text-warning"}`}
                  >
                    {d.submitted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Clock className="h-5 w-5" />
                    )}
                  </span>
                  <span>
                    <span className="block font-medium">{d.name}</span>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      {d.note} · <Eye className="h-3.5 w-3.5" /> {t("previewLabel")}
                    </span>
                  </span>
                </button>
                <div className="flex items-center gap-3">
                  <StatusBadge ok={d.submitted}>
                    {d.submitted ? t("statusSubmitted") : t("statusPending")}
                  </StatusBadge>
                  {!d.submitted && (
                    <button
                      onClick={() => markSubmitted(d.id)}
                      className="rounded-md border border-primary px-3 py-1 text-sm text-primary hover:bg-tint"
                    >
                      {t("btnMarkSubmitted")}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        {done === docs.length && (
          <p className="mt-4 rounded-md bg-success-soft p-3 text-sm font-medium text-success">
            {t("allSubmittedMsg")}
          </p>
        )}
        <button onClick={reset} className="mt-4 text-sm text-muted-foreground underline">
          {t("resetDemo")}
        </button>
      </Card>
      {open && (
        <Preview
          doc={view(open)}
          onClose={() => setOpenId(null)}
          onSubmit={() => markSubmitted(open.id)}
        />
      )}
    </div>
  );
}

function Preview({
  doc,
  onClose,
  onSubmit,
}: {
  doc: Doc;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const { t } = useLanguage();
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t("previewAria", { name: doc.name })}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-hero px-5 py-3 text-primary-foreground">
          <span className="font-semibold">{doc.name}</span>
          <button onClick={onClose} aria-label={t("closeLabel")}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 p-5">
          <div className="flex h-36 flex-col items-center justify-center rounded-lg border-2 border-dashed bg-tint text-muted-foreground">
            <FileText className="h-10 w-10 text-primary" />
            <span className="mt-2 text-xs">{doc.submitted ? t("sampleFile") : t("noFile")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {t("statusLabel")}{" "}
            <StatusBadge ok={doc.submitted}>
              {doc.submitted
                ? `${t("statusSubmitted")} ${doc.submittedOn ?? ""}`
                : t("statusPending")}
            </StatusBadge>
          </div>
          <div>
            <div className="rounded-md bg-tint p-3 text-sm">
              <h3 className="font-semibold">{t("simpleExpTitle")}</h3>
              <p className="mt-1">{t("simpleExpBody")}</p>
            </div>
            <h3 className="mt-3 text-sm font-semibold">{t("typicalReq")}</h3>
            <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground">
              {doc.requirements.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-md bg-tint p-3 text-sm">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <Landmark className="h-4 w-4" /> {t("whatBankChecks")}
            </div>
            <p className="mt-1">{doc.bankChecks}</p>
          </div>
          <p className="text-xs text-muted-foreground">{t("docsIllustrative")}</p>
          {!doc.submitted && (
            <button
              onClick={onSubmit}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {t("btnMarkSubmittedDemo")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
