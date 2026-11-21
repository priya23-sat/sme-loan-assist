import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Clock3, Download, FileImage, FileText, Loader2, Trash2, UploadCloud, X } from "lucide-react";
import { Card, Progress } from "@/components/shell";
import { useReadiness } from "@/lib/readiness-state";
import { useLanguage } from "@/lib/language";
import { removeDocument, saveDocument, listDocuments, validateDocument, type StoredDocument } from "@/lib/document-vault";

export const Route = createFileRoute("/documents")({
  head: () => ({ meta: [{ title: "Document Vault — SME Loan Buddy" }, { name: "description", content: "Upload and organise SME loan preparation documents by priority." }] }),
  component: Documents,
});

const PRIORITY_LABEL: Record<string, { en: string; mr: string }> = {
  High: { en: "P1 · Essential", mr: "P1 · अत्यावश्यक" },
  Medium: { en: "P2/P3 · Supporting", mr: "P2/P3 · पूरक" },
  Low: { en: "P4 · Conditional", mr: "P4 · अटींनुसार" },
};

function Documents() {
  const { items, profile, setStatus } = useReadiness();
  const { language } = useLanguage();
  const mr = language === "mr";
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<StoredDocument | null>(null);
  const [filter, setFilter] = useState("all");
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const labels = {
    title: mr ? "कागदपत्र अपलोड केंद्र" : "Document upload centre",
    intro: mr ? "तुमच्या व्यवसायाच्या प्रोफाइलनुसार कागदपत्रे अपलोड करा. प्रत्येक फाइल या ब्राउझरमध्ये तुमच्या डिव्हाइसवर साठवली जाते." : "Upload documents against your personalised checklist. Files are stored locally in this browser on this device.",
    warning: mr ? "गोपनीयता: सध्या फाइल्स क्लाउड किंवा बँकेकडे पाठवल्या जात नाहीत. सार्वजनिक/सामायिक डिव्हाइसवर संवेदनशील कागदपत्रे अपलोड करू नका." : "Privacy: files are not sent to a cloud service or bank. Avoid uploading sensitive documents on a shared or public device.",
    noProfile: mr ? "कागदपत्रांची वैयक्तिक यादी तयार करण्यासाठी आधी व्यवसाय प्रोफाइल पूर्ण करा." : "Complete your business profile first to generate a personalised document list.",
    upload: mr ? "फाइल निवडा" : "Choose file",
    uploaded: mr ? "अपलोड केले" : "Uploaded",
    pending: mr ? "प्रलंबित" : "Not uploaded",
    view: mr ? "पहा" : "Preview",
    all: mr ? "सर्व" : "All",
    done: mr ? "अपलोड केलेली" : "Uploaded",
    missing: mr ? "बाकी" : "Missing",
    count: mr ? "कागदपत्रे अपलोड" : "documents uploaded",
    types: mr ? "PDF, JPG, PNG · कमाल 10 MB प्रति फाइल" : "PDF, JPG, PNG · up to 10 MB per file",
    empty: mr ? "या फिल्टरमध्ये कागदपत्रे नाहीत." : "No documents match this filter.",
    storage: mr ? "ब्राउझरमधील स्थानिक साठवण" : "Browser-local storage",
    noFile: mr ? "फाइल उपलब्ध नाही" : "No file selected",
  };
  const refresh = async () => {
    try { setDocuments(await listDocuments()); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not load documents."); }
    finally { setLoading(false); }
  };
  useEffect(() => { void refresh(); }, []);
  const uploadedIds = useMemo(() => new Set(documents.map((d) => d.checklistId)), [documents]);
  const grouped = items.filter((item) => filter === "all" || (filter === "uploaded" ? uploadedIds.has(item.id) : !uploadedIds.has(item.id)));
  const uploadedCount = uploadedIds.size;
  const percent = items.length ? Math.round((uploadedCount / items.length) * 100) : 0;

  async function upload(checklistId: string, file?: File) {
    if (!file) return;
    const issue = validateDocument(file);
    if (issue) { setError(issue); return; }
    setError(""); setBusyId(checklistId);
    try { await saveDocument(checklistId, file); setStatus(checklistId, "ready"); await refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : "Upload failed."); }
    finally { setBusyId(null); if (inputRefs.current[checklistId]) inputRefs.current[checklistId]!.value = ""; }
  }

  async function deleteFile(doc: StoredDocument) {
    await removeDocument(doc.id);
    if (!documents.some((d) => d.id !== doc.id && d.checklistId === doc.checklistId)) setStatus(doc.checklistId, "missing");
    if (preview?.id === doc.id) setPreview(null);
    await refresh();
  }

  function download(doc: StoredDocument) {
    const url = URL.createObjectURL(doc.blob);
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = doc.name; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  if (!profile) return <div className="space-y-5"><h1 className="text-2xl font-semibold">{labels.title}</h1><Card>{labels.noProfile}</Card></div>;

  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><p className="text-xs font-semibold uppercase tracking-wider text-primary">SME LOAN BUDDY 2.0</p><h1 className="mt-1 text-2xl font-semibold">{labels.title}</h1><p className="mt-1 max-w-2xl text-sm text-muted-foreground">{labels.intro}</p></div>
      <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">{labels.storage}</span>
    </div>
    <Card className="border-warning/30 bg-warning-soft"><div className="flex gap-2 text-sm"><AlertCircle className="h-5 w-5 shrink-0 text-warning"/><p>{labels.warning}</p></div></Card>
    <Card><div className="flex items-center justify-between gap-3 text-sm"><span className="font-medium">{uploadedCount} / {items.length} {labels.count}</span><span className="font-semibold">{percent}%</span></div><Progress value={percent}/><p className="mt-2 text-xs text-muted-foreground">{labels.types}</p></Card>
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter documents">
      {(["all", "uploaded", "missing"] as const).map((key) => <button key={key} onClick={() => setFilter(key)} className={`rounded-full border px-3 py-1.5 text-sm ${filter === key ? "border-primary bg-tint text-primary" : "hover:bg-muted"}`}>{key === "all" ? labels.all : key === "uploaded" ? labels.done : labels.missing}</button>)}
    </div>
    {error && <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>}
    {loading ? <Card><Loader2 className="mr-2 inline h-4 w-4 animate-spin"/>Loading saved documents…</Card> : !items.length ? <Card>{labels.noProfile}</Card> : <div className="space-y-4">
      {grouped.length === 0 && <Card>{labels.empty}</Card>}
      {grouped.map((item) => {
        const matching = documents.filter((d) => d.checklistId === item.id);
        const uploaded = matching.length > 0;
        return <Card key={item.id} className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{item.name}</h2><span className="rounded-full bg-tint px-2 py-0.5 text-xs font-medium text-primary">{PRIORITY_LABEL[item.priority]?.[language] ?? item.priority}</span></div><p className="mt-1 text-sm text-muted-foreground">{item.why}</p><p className="mt-1 text-xs text-muted-foreground">{item.rule}</p></div>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${uploaded ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"}`}>{uploaded ? <CheckCircle2 className="h-3.5 w-3.5"/> : <Clock3 className="h-3.5 w-3.5"/>}{uploaded ? labels.uploaded : labels.pending}</span>
          </div>
          {matching.map((doc) => <div key={doc.id} className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/30 p-2">
            {doc.mimeType.startsWith("image/") ? <FileImage className="h-5 w-5 text-primary"/> : <FileText className="h-5 w-5 text-primary"/>}
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{doc.name}</p><p className="text-xs text-muted-foreground">{(doc.size / 1024).toFixed(0)} KB · {new Date(doc.uploadedAt).toLocaleDateString()}</p></div>
            <button onClick={() => setPreview(doc)} className="rounded-md border px-2 py-1 text-xs hover:bg-background">{labels.view}</button>
            <button onClick={() => download(doc)} aria-label={`Download ${doc.name}`} className="rounded-md border p-1.5 hover:bg-background"><Download className="h-4 w-4"/></button>
            <button onClick={() => void deleteFile(doc)} aria-label={`Delete ${doc.name}`} className="rounded-md border p-1.5 text-destructive hover:bg-background"><Trash2 className="h-4 w-4"/></button>
          </div>)}
          <div className="flex flex-wrap items-center gap-2">
            <input ref={(el) => { inputRefs.current[item.id] = el; }} type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" className="sr-only" id={`upload-${item.id}`} onChange={(e) => void upload(item.id, e.target.files?.[0])}/>
            <button disabled={busyId === item.id} onClick={() => inputRefs.current[item.id]?.click()} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"><UploadCloud className="h-4 w-4"/>{busyId === item.id ? "Saving…" : labels.upload}</button>
            <span className="text-xs text-muted-foreground">{matching.length ? `${matching.length} file(s)` : labels.noFile}</span>
          </div>
        </Card>;
      })}
    </div>}
    {preview && <PreviewModal doc={preview} onClose={() => setPreview(null)}/>}
  </div>;
}

function PreviewModal({ doc, onClose }: { doc: StoredDocument; onClose: () => void }) {
  const [url, setUrl] = useState("");
  useEffect(() => { const objectUrl = URL.createObjectURL(doc.blob); setUrl(objectUrl); return () => URL.revokeObjectURL(objectUrl); }, [doc]);
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3" role="dialog" aria-modal="true" aria-label={doc.name} onClick={onClose}>
    <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-card" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between border-b p-3"><span className="truncate font-medium">{doc.name}</span><button onClick={onClose} aria-label="Close preview"><X className="h-5 w-5"/></button></div>
      <div className="min-h-0 flex-1 overflow-auto p-3">{url && (doc.mimeType === "application/pdf" || doc.name.toLowerCase().endsWith(".pdf") ? <iframe title={doc.name} className="h-[70vh] w-full" src={url}/> : <img alt={doc.name} className="mx-auto max-h-[70vh] object-contain" src={url}/>)}</div>
    </div>
  </div>;
}
