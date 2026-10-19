import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { buildChecklist, EMPTY_PROFILE, validateProfile, type Profile, type Status, type Statuses } from "./readiness";

const KEY = "sme-loan-ready.v1";
type Saved = { profile: Profile | null; statuses: Statuses };

type Ctx = {
  loaded: boolean;
  profile: Profile | null;
  statuses: Statuses;
  items: ReturnType<typeof buildChecklist>;
  saveProfile: (p: Profile) => void;
  setStatus: (id: string, s: Status) => void;
  resetAll: () => void;
};
const C = createContext<Ctx | null>(null);

export function ReadinessProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState<Saved>({ profile: null, statuses: {} });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Saved;
        const ok = parsed.profile && Object.keys(validateProfile({ ...EMPTY_PROFILE, ...parsed.profile })).length === 0;
        setData({ profile: ok ? parsed.profile : null, statuses: parsed.statuses ?? {} });
      }
    } catch { /* ignore corrupt storage */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(data));
  }, [data, loaded]);

  const items = useMemo(() => (data.profile ? buildChecklist(data.profile) : []), [data.profile]);

  const value: Ctx = {
    loaded, items, profile: data.profile, statuses: data.statuses,
    saveProfile: (p) => setData((d) => {
      const ids = new Set(buildChecklist(p).map((i) => i.id));
      const kept = Object.fromEntries(Object.entries(d.statuses).filter(([k]) => ids.has(k)));
      return { profile: p, statuses: kept };
    }),
    setStatus: (id, s) => setData((d) => ({ ...d, statuses: { ...d.statuses, [id]: s } })),
    resetAll: () => setData({ profile: null, statuses: {} }),
  };
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useReadiness() {
  const v = useContext(C);
  if (!v) throw new Error("ReadinessProvider missing");
  return v;
}
