export type StoredDocument = {
  id: string;
  checklistId: string;
  name: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  blob: Blob;
};

const DB_NAME = "sme-loan-buddy-documents";
const STORE_NAME = "documents";
const DB_VERSION = 1;
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_DOCUMENT_TYPES = ["application/pdf", "image/jpeg", "image/png"];

function openDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") return Promise.reject(new Error("Document storage is unavailable in this browser."));
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open document storage."));
  });
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

export async function saveDocument(checklistId: string, file: File): Promise<StoredDocument> {
  const issue = validateDocument(file);
  if (issue) throw new Error(issue);
  const record: StoredDocument = {
    id: crypto.randomUUID(),
    checklistId,
    name: file.name,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    uploadedAt: new Date().toISOString(),
    blob: file,
  };
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Could not save this document."));
    tx.onabort = () => reject(tx.error ?? new Error("Document save was cancelled."));
  });
  db.close();
  return record;
}

export async function listDocuments(): Promise<StoredDocument[]> {
  const db = await openDatabase();
  const records = await new Promise<StoredDocument[]>((resolve, reject) => {
    const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result as StoredDocument[]);
    request.onerror = () => reject(request.error ?? new Error("Could not read saved documents."));
  });
  db.close();
  return records.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

export async function removeDocument(id: string): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Could not delete this document."));
  });
  db.close();
}
