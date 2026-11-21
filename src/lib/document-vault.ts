import { authenticatedFetch, getSupabaseSession } from "./supabase";

export type StoredDocument = {
  id: string;
  checklistId: string;
  name: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  storagePath: string;
};

const BUCKET = "sme-loan-documents";
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/png"];

function encodePath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

export function validateDocument(file: File): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const allowed = ACCEPTED_DOCUMENT_TYPES.includes(file.type) ||
    (file.type === "" && ["pdf", "jpg", "jpeg", "png"].includes(extension ?? ""));
  if (!allowed) return "Choose a PDF, JPG or PNG file.";
  if (file.size === 0) return "The selected file is empty.";
  if (file.size > MAX_DOCUMENT_BYTES) return "Each document must be 10 MB or smaller.";
  return null;
}

async function responseError(response: Response) {
  if (response.ok) return;
  const body = await response.json().catch(() => ({}));
  throw new Error(String(body.message || body.error || body.msg || "Document service request failed."));
}

type DocumentRow = { id: string; checklist_id: string; file_name: string; mime_type: string; size_bytes: number; storage_path: string; created_at: string };
function fromRow(row: DocumentRow): StoredDocument {
  return { id: row.id, checklistId: row.checklist_id, name: row.file_name, mimeType: row.mime_type, size: row.size_bytes, storagePath: row.storage_path, uploadedAt: row.created_at };
}

export async function saveDocument(checklistId: string, file: File): Promise<StoredDocument> {
  const issue = validateDocument(file);
  if (issue) throw new Error(issue);
  const session = await getSupabaseSession();
  if (!session) throw new Error("Sign in to upload documents.");
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100) || "document";
  const storagePath = `${session.user.id}/${crypto.randomUUID()}/${safeName}`;
  const upload = await authenticatedFetch(`/storage/v1/object/${BUCKET}/${encodePath(storagePath)}`, {
    method: "POST",
    headers: { "Content-Type": file.type || "application/octet-stream", "x-upsert": "false" },
    body: file,
  });
  await responseError(upload);
  const metadata = await authenticatedFetch("/rest/v1/loan_documents", {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify({ owner_id: session.user.id, checklist_id: checklistId, file_name: file.name, mime_type: file.type || "application/octet-stream", size_bytes: file.size, storage_path: storagePath }),
  });
  try { await responseError(metadata); }
  catch (error) {
    await authenticatedFetch(`/storage/v1/object/${BUCKET}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prefixes: [storagePath] }) }).catch(() => undefined);
    throw error;
  }
  const rows = await metadata.json() as DocumentRow[];
  if (!rows[0]) throw new Error("The file was uploaded but its document record was not returned.");
  return fromRow(rows[0]);
}

export async function listDocuments(): Promise<StoredDocument[]> {
  const response = await authenticatedFetch("/rest/v1/loan_documents?select=id,checklist_id,file_name,mime_type,size_bytes,storage_path,created_at&order=created_at.desc");
  await responseError(response);
  return (await response.json() as DocumentRow[]).map(fromRow);
}

export async function downloadDocument(doc: StoredDocument): Promise<Blob> {
  const response = await authenticatedFetch(`/storage/v1/object/${BUCKET}/${encodePath(doc.storagePath)}`);
  await responseError(response);
  return response.blob();
}

export async function removeDocument(doc: StoredDocument): Promise<void> {
  const metadata = await authenticatedFetch(`/rest/v1/loan_documents?id=eq.${encodeURIComponent(doc.id)}`, { method: "DELETE" });
  await responseError(metadata);
  const storage = await authenticatedFetch(`/storage/v1/object/${BUCKET}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prefixes: [doc.storagePath] }) });
  await responseError(storage);
}
