import { createContext, useContext, useState, type ReactNode } from "react";

export type Doc = { id: string; name: string; note: string; submitted: boolean; requirements: string[]; bankChecks: string; submittedOn?: string };
const INITIAL: Doc[] = [
  { id: "pan", name: "PAN (Business / Proprietor)", note: "Identity of the business", submitted: true, submittedOn: "02 Oct 2026",
    requirements: ["Clear copy of PAN card", "Name matches business records"], bankChecks: "The bank would typically verify that the PAN is valid and matches the applicant name." },
  { id: "kyc", name: "Business KYC", note: "Registration / address proof", submitted: true, submittedOn: "02 Oct 2026",
    requirements: ["Registration certificate (e.g. Udyam)", "Recent address proof"], bankChecks: "The bank would typically confirm the business is registered and the address is current." },
  { id: "gst", name: "GST returns", note: "Recent filings", submitted: false,
    requirements: ["Recent GST return filings", "GSTIN matches the business"], bankChecks: "The bank would typically review filing regularity and reported turnover." },
  { id: "bank", name: "Bank statements", note: "Business current account", submitted: false,
    requirements: ["Statements for recent months", "Issued by the bank (not edited)"], bankChecks: "The bank would typically look at cash flow patterns and account conduct." },
  { id: "fin", name: "Financial statements", note: "P&L and balance sheet", submitted: false,
    requirements: ["Profit & loss statement", "Balance sheet"], bankChecks: "The bank would typically assess profitability and existing obligations." },
];

type Ctx = { docs: Doc[]; markSubmitted: (id: string) => void; reset: () => void };
const C = createContext<Ctx | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [docs, setDocs] = useState(INITIAL);
  return (
    <C.Provider
      value={{
        docs,
        markSubmitted: (id) => setDocs((d) => d.map((x) => (x.id === id ? { ...x, submitted: true, submittedOn: "09 Oct 2026" } : x))),
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
