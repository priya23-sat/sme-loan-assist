import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Clock3, Download, FileImage, FileText, Loader2, LogOut, Trash2, UploadCloud, X } from "lucide-react";
import { Card, Progress } from "@/components/shell";
import { useReadiness } from "@/lib/readiness-state";
import { useLanguage } from "@/lib/language";
import { removeDocument, saveDocument, listDocuments, downloadDocument, validateDocument, type StoredDocument } from "@/lib/document-vault";
import { getSupabaseSession, isSupabaseConfigured, signInWithPassword, signOutSupabase, signUpWithPassword, type SupabaseSession } from "@/lib/supabase";

export const Route = createFileRoute("/documents")({
  head: () => ({ meta: [{ title: "Document Vault — SME Loan Buddy" }, { name: "description", content: "Securely upload and organise SME loan preparation documents by priority." }] }),
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
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<StoredDocument | null>(null);
  const [filter, setFilter] = useState("all");
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const labels = {
    title: mr ? "कागदपत्र अपलोड केंद्र" : "Document upload centre",
    intro: mr ? "तुमच्या व्यवसायाच्या प्रोफाइलनुसार कागदपत्रे सुरक्षित क्लाउडमध्ये अपलोड करा." : "Upload documents against your personalised checklist to your private cloud vault.",
    warning: mr ? "गोपनीयता: प्रत्येक वापरकर्ता फक्त स्वतःची कागदपत्रे पाहू, डाउनलोड करू किंवा हटवू शकतो." : "Privacy: each signed-in user can access, download and delete only their own documents.",
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
    storage: mr ? "खाजगी Supabase क्लाउड" : "Private Supabase cloud",
    noFile: mr ? "फाइल उपलब्ध नाही" : "No file selected",
  };

  async function refresh() {
    if (!session) { setDocuments([]); setLoading(false); return; }
    try { setDocuments(await listDocuments()); setError(""); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not load documents."); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    let active = true;
    void getSupabaseSession().then((value) => { if (active) { setSession(value); setAuthReady(true); } })
      .catch(() => { if (active) setAuthReady(true); });
    return () => { active = false; };
  }, []);

  useEffect(() => { if (authReady) void refresh(); }, [session, authReady]);

  async function handleAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthBusy(true); setAuthMessage(""); setError("");
    try {
      if (authMode === "signup") {
        const next = await signUpWithPassword(email.trim(), password);
        if (next) { setSession(next); setAuthMessage(mr ? "खाते तयार झाले. तुम्ही लॉग इन आहात." : "Account created and signed in."); }
        else { setAuthMessage(mr ? "खाते तयार झाले. ईमेलमधील पुष्टीकरण लिंक उघडा, नंतर लॉग इन करा." : "Account created. Check your email for the confirmation link, then sign in."); setAuthMode("signin"); }
      } else {
        const next = await signInWithPassword(email.trim(), password);
        setSession(next); setAuthMessage(mr ? "यशस्वी लॉग इन." : "Signed in successfully.");
      }
    } catch (e) { setError(e instanceof Error ? e.message : "Authentication failed."); }
    finally { setAuthBusy(false); }
  }

  async function handleSignOut() {
    await signOutSupabase(); setSession(null); setDocuments([]); setPreview(null); setLoading(false);
  }

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
    try {
      await removeDocument(doc);
      if (!documents.some((d) => d.id !== doc.id && d.checklistId === doc.checklistId)) setStatus(doc.checklistId, "missing");
      if (preview?.id === doc.id) setPreview(null);
      await refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "Could not delete document."); }
  }

  async function download(doc: StoredDocument) {
    try {
      const blob = await downloadDocument(doc);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a"); anchor.href = url; anchor.download = doc.name; anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) { setError(e instanceof Error ? e.message : "Could not download document."); }
  }

  if (!profile) return <div className="space-y-5"><h1 className="text-2xl font-semibold">{labels.title}</h1><Card>{labels.noProfile}</Card></div>;

  return <div className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><p className="text-xs font-semibold uppercase tracking-wider text-primary">SME LOAN BUDDY 2.0</p><h1 className="mt-1 text-2xl font-semibold">{labels.title}</h1><p className="mt-1 max-w-2xl text-sm text-muted-foreground">{labels.intro}</p></div>
      <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">{labels.storage}</span>
    </div>
    <Card className="border-warning/30 bg-warning-soft"><div className="flex gap-2 text-sm"><AlertCircle className="h-5 w-5 shrink-0 text-warning"/><p>{labels.warning}</p></div></Card>
    {!isSupabaseConfigured ? <Card className="space-y-2">
      <h2 className="font-semibold">{mr ? "Supabase कॉन्फिगरेशन आवश्यक" : "Supabase setup required"}</h2>
      <p className="text-sm text-muted-foreground">{mr ? "डिप्लॉयमेंटमध्ये VITE_SUPABASE_URL आणि VITE_SUPABASE_ANON_KEY जोडल्यानंतरच क्लाउड अपलोड सुरू होतील." : "Cloud uploads are disabled until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are added to your deployment environment."}</p>
      <p className="text-xs text-muted-foreground">Never add a Supabase service-role key to frontend environment variables.</p>
    </Card> : !authReady ? <Card><Loader2 className="mr-2 inline h-4 w-4 animate-spin"/>Checking sign-in…</Card> : !session ? <Card className="mx-auto w-full max-w-lg space-y-4">
      <div><h2 className="text-lg font-semibold">{authMode === "signin" ? (mr ? "लॉग इन करा" : "Sign in to your document vault") : (mr ? "नवीन खाते तयार करा" : "Create your borrower account")}</h2><p className="mt-1 text-sm text-muted-foreground">{mr ? "तुमची कागदपत्रे खाजगी ठेवण्यासाठी ईमेल आणि पासवर्ड वापरा." : "Use your email and password to keep your uploaded documents private to your account."}</p></div>
      <form onSubmit={(e) => void handleAuth(e)} className="space-y-3">
        <label className="block space-y-1 text-sm"><span>Email</span><input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2" placeholder="you@example.com"/></label>
        <label className="block space-y-1 text-sm"><span>{mr ? "पासवर्ड (किमान ८ अक्षरे)" : "Password (at least 8 characters)"}</span><input required minLength={8} type="password" autoComplete={authMode === "signin" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2"/></label>
        <button disabled={authBusy} className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{authBusy ? (mr ? "कृपया थांबा…" : "Please wait…") : authMode === "signin" ? (mr ? "लॉग इन" : "Sign in") : (mr ? "खाते तयार करा" : "Create account")}</button>
      </form>
      <button onClick={() => { setAuthMode(authMode === "signin" ? "signup" : "signin"); setAuthMessage(""); setError(""); }} className="text-sm font-medium text-primary underline">{authMode === "signin" ? (mr ? "नवीन खाते तयार करा" : "New here? Create an account") : (mr ? "आधीच खाते आहे? लॉग इन" : "Already have an account? Sign in")}</button>
      {authMessage && <p role="status" className="text-sm text-success">{authMessage}</p>}
    </Card> : <Card className="flex flex-wrap items-center justify-between gap-2">
      <div><p className="text-xs text-muted-foreground">{mr ? "लॉग इन केलेले खाते" : "Signed in account"}</p><p className="text-sm font-medium">{session.user.email}</p></div>
      <button onClick={() => void handleSignOut()} className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted"><LogOut className="h-4 w-4"/>{mr ? "लॉग आउट" : "Sign out"}</button>
    </Card>}
    {error && <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>}
    {session && <>
      <Card><div className="flex items-center justify-between gap-3 text-sm"><span className="font-medium">{documents.length} {labels.count}</span><span className="font-semibold">{items.length ? Math.round((new Set(documents.map((d) => d.checklistId)).size / items.length) * 100) : 0}%</span></div><Progress value={items.length ? Math.round((new Set(documents.map((d) => d.checklistId)).size / items.length) * 100) : 0}/><p className="mt-2 text-xs text-muted-foreground">{labels.types}</p></Card>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter documents">
        {(["all", "uploaded", "missing"] as const).map((key) => <button key={key} onClick={() => setFilter(key)} className={`rounded-full border px-3 py-1.5 text-sm ${filter === key ? "border-primary bg-tint text-primary" : "hover:bg-muted"}`}>{key === "all" ? labels.all : key === "uploaded" ? labels.done : labels.missing}</button>)}
      </div>
      {loading ? <Card><Loader2 className="mr-2 inline h-4 w-4 animate-spin"/>Loading saved documents…</Card> : <div className="space-y-4">
        {items.filter((item) => filter === "all" || (filter === "uploaded" ? documents.some((d) => d.checklistId === item.id) : !documents.some((d) => d.checklistId === item.id))).map((item) => {
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
              <button onClick={() => void download(doc)} aria-label={`Download ${doc.name}`} className="rounded-md border p-1.5 hover:bg-background"><Download className="h-4 w-4"/></button>
              <button onClick={() => void deleteFile(doc)} aria-label={`Delete ${doc.name}`} className="rounded-md border p-1.5 text-destructive hover:bg-background"><Trash2 className="h-4 w-4"/></button>
            </div>)}
            <div className="flex flex-wrap items-center gap-2">
              <input ref={(el) => { inputRefs.current[item.id] = el; }} type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" className="sr-only" id={`upload-${item.id}`} onChange={(e) => void upload(item.id, e.target.files?.[0])}/>
              <button disabled={busyId === item.id} onClick={() => inputRefs.current[item.id]?.click()} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"><UploadCloud className="h-4 w-4"/>{busyId === item.id ? "Uploading…" : labels.upload}</button>
              <span className="text-xs text-muted-foreground">{matching.length ? `${matching.length} file(s)` : labels.noFile}</span>
            </div>
          </Card>;
        })}
      </div>}
    </>}
    {preview && <PreviewModal doc={preview} onClose={() => setPreview(null)}/>}
  </div>;
}

function PreviewModal({ doc, onClose }: { doc: StoredDocument; onClose: () => void }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let objectUrl = "";
    let active = true;
    void downloadDocument(doc).then((blob) => {
      if (!active) return;
      objectUrl = URL.createObjectURL(blob); setUrl(objectUrl);
    }).catch((e) => { if (active) setError(e instanceof Error ? e.message : "Could not load preview."); });
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [doc]);
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3" role="dialog" aria-modal="true" aria-label={doc.name} onClick={onClose}>
    <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-card" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between border-b p-3"><span className="truncate font-medium">{doc.name}</span><button onClick={onClose} aria-label="Close preview"><X className="h-5 w-5"/></button></div>
      <div className="min-h-0 flex-1 overflow-auto p-3">{error ? <p role="alert" className="text-sm text-destructive">{error}</p> : !url ? <p className="text-sm text-muted-foreground">Loading preview…</p> : doc.mimeType === "application/pdf" || doc.name.toLowerCase().endsWith(".pdf") ? <iframe title={doc.name} className="h-[70vh] w-full" src={url}/> : <img alt={doc.name} className="mx-auto max-h-[70vh] object-contain" src={url}/>}</div>
    </div>
  </div>;
}
