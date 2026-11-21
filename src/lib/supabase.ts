export type SupabaseSession = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  token_type: string;
  user: { id: string; email?: string };
};

const SESSION_KEY = "sme-loan-buddy.supabase-session.v1";
const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const isSupabaseConfigured = Boolean(url && anonKey);

function config() {
  if (!url || !anonKey) throw new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your deployment environment.");
  return { url, anonKey };
}

function readSession(): SupabaseSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SupabaseSession) : null;
  } catch { return null; }
}

function writeSession(session: SupabaseSession | null) {
  if (typeof window === "undefined") return;
  if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else window.localStorage.removeItem(SESSION_KEY);
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body.msg || body.message || body.error_description || body.error || "Supabase request failed.";
    throw new Error(String(message));
  }
  return body as T;
}

async function refreshSession(session: SupabaseSession): Promise<SupabaseSession> {
  const { url, anonKey } = config();
  const response = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: { apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  const data = await parseResponse<Omit<SupabaseSession, "expires_at"> & { expires_in: number }>(response);
  const next = { ...data, expires_at: Math.floor(Date.now() / 1000) + data.expires_in };
  writeSession(next);
  return next;
}

export async function getSupabaseSession(): Promise<SupabaseSession | null> {
  let session = readSession();
  if (!session) return null;
  if (session.expires_at <= Math.floor(Date.now() / 1000) + 60) {
    try { session = await refreshSession(session); }
    catch { writeSession(null); return null; }
  }
  return session;
}

export async function authenticatedFetch(path: string, init: RequestInit = {}) {
  const { url, anonKey } = config();
  const session = await getSupabaseSession();
  if (!session) throw new Error("Please sign in again to continue.");
  const headers = new Headers(init.headers);
  headers.set("apikey", anonKey);
  headers.set("Authorization", `Bearer ${session.access_token}`);
  return fetch(`${url}${path}`, { ...init, headers });
}

export async function signInWithPassword(email: string, password: string): Promise<SupabaseSession> {
  const { url, anonKey } = config();
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await parseResponse<Omit<SupabaseSession, "expires_at"> & { expires_in: number }>(response);
  const session = { ...data, expires_at: Math.floor(Date.now() / 1000) + data.expires_in };
  writeSession(session);
  return session;
}

export async function signUpWithPassword(email: string, password: string): Promise<SupabaseSession | null> {
  const { url, anonKey } = config();
  const response = await fetch(`${url}/auth/v1/signup`, {
    method: "POST",
    headers: { apikey: anonKey, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await parseResponse<{ access_token?: string; refresh_token?: string; expires_in?: number; token_type?: string; user?: SupabaseSession["user"] }>(response);
  if (!data.access_token || !data.refresh_token || !data.user) return null;
  const session: SupabaseSession = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + (data.expires_in ?? 3600),
    token_type: data.token_type ?? "bearer",
    user: data.user,
  };
  writeSession(session);
  return session;
}

export async function signOutSupabase() {
  const session = await getSupabaseSession();
  if (session) {
    const { url, anonKey } = config();
    await fetch(`${url}/auth/v1/logout`, {
      method: "POST",
      headers: { apikey: anonKey, Authorization: `Bearer ${session.access_token}` },
    });
  }
  writeSession(null);
}
