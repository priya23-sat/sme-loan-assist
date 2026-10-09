import { createContext, useContext, useState, type ReactNode } from "react";

export type Doc = { id: string; name: string; note: string; submitted: boolean };
const INITIAL: Doc[] = [
  { id: "pan", name: "PAN (Business / Proprietor)", note: "Identity of the business", submitted: true },
  { id: "kyc", name: "Business KYC", note: "Registration / address proof", submitted: true },
  { id: "gst", name: "GST returns", note: "Recent filings", submitted: false },
  { id: "bank", name: "Bank statements", note: "Business current account", submitted: false },
  { id: "fin", name: "Financial statements", note: "P&L and balance sheet", submitted: false },
];

type Ctx = { docs: Doc[]; markSubmitted: (id: string) => void; reset: () => void };
const C = createContext<Ctx | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [docs, setDocs] = useState(INITIAL);
  return (
    <C.Provider
      value={{
        docs,
        markSubmitted: (id) => setDocs((d) => d.map((x) => (x.id === id ? { ...x, submitted: true } : x))),
        reset: () => setDocs(INITIAL),
      }}
    >
      {children}
    </C.Provider>
  );
}

export function useAppState() {
  const v = useContext(C);
  if (!v) throw new Error("AppStateProvider missing");
  return v;
}
