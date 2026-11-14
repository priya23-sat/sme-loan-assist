// Loan readiness rules for small businesses.
// General guidance only — NOT verified lender-specific requirements.

export const BUSINESS_TYPES = [
  { value: "food", label: "Food stall / Food business" },
  { value: "grocery", label: "Grocery shop" },
  { value: "retail", label: "Retail shop" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "trading", label: "Trading" },
  { value: "transport", label: "Transport" },
  { value: "other", label: "Other" },
] as const;

export const BUSINESS_AGES = [
  { value: "0", label: "Less than 1 year" },
  { value: "2", label: "1–3 years" },
  { value: "4", label: "3–5 years" },
  { value: "6", label: "More than 5 years" },
] as const;

export const LOAN_PURPOSES = [
  { value: "expansion", label: "Business expansion" },
  { value: "equipment", label: "Equipment purchase" },
  { value: "working_capital", label: "Working capital" },
  { value: "stock", label: "Stock purchase" },
  { value: "other", label: "Other" },
] as const;

export const TURNOVER_RANGES = [
  { value: "lt10", label: "Under ₹10 lakh a year" },
  { value: "10to40", label: "₹10 – 40 lakh a year" },
  { value: "40to100", label: "₹40 lakh – 1 crore a year" },
  { value: "gt100", label: "Over ₹1 crore a year" },
] as const;

export type Profile = {
  businessType: string;
  years: string;
  purpose: string;
  turnover: string;
  amount: string;
};

export const EMPTY_PROFILE: Profile = { businessType: "", years: "", purpose: "", turnover: "", amount: "" };

export const MIN_AMOUNT = 50_000;
export const MAX_AMOUNT = 50_000_000;

export type ProfileErrors = Partial<Record<keyof Profile, string>>;

export function validateProfile(p: Profile): ProfileErrors {
  const e: ProfileErrors = {};
  if (![...BUSINESS_TYPES.map((b) => b.value), "goods", "passenger", "logistics"].includes(p.businessType)) e.businessType = "Please choose your business type.";
  if (![...LOAN_PURPOSES.map((b) => b.value), "vehicle", "refinance"].includes(p.purpose)) e.purpose = "Please choose what the loan is for.";
  if (!TURNOVER_RANGES.some((b) => b.value === p.turnover)) e.turnover = "Please choose an approximate turnover range.";
  const y = p.years.trim();
  if (!y) e.years = "Please enter how many years the business has operated.";
  else if (!/^\d{1,2}$/.test(y) || +y > 75) e.years = "Enter a whole number of years between 0 and 75.";
  const a = p.amount.replace(/[,\s₹]/g, "");
  if (!a) e.amount = "Please enter the loan amount you plan to request.";
  else if (!/^\d+$/.test(a)) e.amount = "Enter the amount in rupees using digits only.";
  else if (+a < MIN_AMOUNT || +a > MAX_AMOUNT) e.amount = "Enter an amount between ₹50,000 and ₹5,00,00,000.";
  return e;
}

export function parseAmount(p: Profile) {
  return Number(p.amount.replace(/[,\s₹]/g, "")) || 0;
}

export type Priority = "High" | "Medium" | "Low";
export type ChecklistItem = { id: string; name: string; why: string; rule: string; priority: Priority };

const PRIORITY_ORDER: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };

export function buildChecklist(p: Profile): ChecklistItem[] {
  const years = Number(p.years) || 0;
  const amount = parseAmount(p);
  const items: ChecklistItem[] = [
    { id: "registration", name: "Business registration proof (e.g. Udyam certificate or shop licence)", priority: "High",
      rule: "A common business-document example", why: "May help show that the business operates as described." },
    { id: "financials", name: "Business income and expense records", priority: "High",
      rule: "A common business-document example", why: "May help the lender understand the business's financial activity." },
  ];
  if (["transport", "goods", "passenger", "logistics"].includes(p.businessType)) {
    items.push({ id: "vehicle_rc", name: "Vehicle registration certificates (RC)", priority: "High",
      rule: "Because the business involves transport", why: "May describe the vehicles used in the transport business." });
    items.push({ id: "insurance", name: "Current vehicle insurance policies", priority: "Medium",
      rule: "Because the business involves transport", why: "A lender may ask about cover for vehicles used by the business." });
  }
  if (p.businessType === "goods" || p.businessType === "passenger" || p.businessType === "transport")
    items.push({ id: "permits", name: "Commercial permits and fitness certificates", priority: "Medium",
      rule: "Because the business involves commercial vehicles", why: "May help explain whether commercial vehicles can operate on intended routes." });
  if (["food", "grocery", "retail", "manufacturing", "trading", "goods", "logistics"].includes(p.businessType))
    items.push({ id: "contracts", name: "Customer contracts, orders, or work agreements", priority: "Medium",
      rule: "A common example where the business works with customers or suppliers", why: "May help explain expected business activity and customer work." });
  if (p.turnover === "40to100" || p.turnover === "gt100")
    items.push({ id: "gst", name: "GST registration certificate and recent GST returns", priority: "High",
      rule: "Because your turnover is ₹40 lakh or more", why: "Businesses above GST thresholds are generally expected to be registered; returns show reported sales." });
  if (years < 2)
    items.push({ id: "plan", name: "Simple business plan with expected income and costs", priority: "High",
      rule: "Because the business is under 2 years old", why: "With a short track record, a plan helps explain how the loan will be repaid." });
  if (p.purpose === "equipment" || p.purpose === "vehicle")
    items.push({ id: "quotation", name: "Equipment quotation or proforma invoice", priority: "High",
      rule: "Because the funding may be used to buy equipment", why: "May show the estimated cost of equipment you plan to buy." });
  if (p.purpose === "working_capital")
    items.push({ id: "receivables", name: "Summary of pending customer payments (receivables)", priority: "Medium",
      rule: "Because the funding may be for working capital", why: "May help describe short-term working-capital needs." });
  if (p.purpose === "expansion" || p.purpose === "stock")
    items.push({ id: "cost_estimate", name: "Cost estimate for the expansion", priority: "Medium",
      rule: p.purpose === "stock" ? "Because the funding may be used to buy stock" : "Because the funding may be used for expansion", why: "May explain how the funds could be used for the planned business need." });
  if (p.purpose === "other")
    items.push({ id: "business_use", name: "Brief note describing the planned use of funds", priority: "Medium",
      rule: "Because the planned use is described as other", why: "May help connect the requested funding with the business need." });
  if (p.purpose === "refinance" || amount > 1_000_000)
    items.push({ id: "existing_loans", name: "List of existing loans and EMIs", priority: p.purpose === "refinance" ? "High" : "Medium",
      rule: p.purpose === "refinance" ? "Because you want to refinance" : "Because the amount is over ₹10 lakh", why: "Lenders usually review current repayments before adding new ones." });
  items.push({ id: "photos", name: "Recent photos of vehicles and business premises", priority: "Low",
    rule: "Optional but helpful", why: "Can make the application easier to understand for the lender." });
  return items.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
}

export type Status = "ready" | "missing" | "help" | "na";
export type Statuses = Record<string, Status | undefined>;

export function summarize(items: ChecklistItem[], statuses: Statuses) {
  const ready = items.filter((i) => statuses[i.id] === "ready");
  const missing = items.filter((i) => statuses[i.id] === "missing");
  const help = items.filter((i) => statuses[i.id] === "help");
  const na = items.filter((i) => statuses[i.id] === "na");
  const unmarked = items.filter((i) => !statuses[i.id]);
  const applicable = items.length - na.length;
  const percent = applicable === 0 ? 0 : Math.round((ready.length / applicable) * 100);
  const pending = [...missing, ...unmarked].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  const nextSteps = [...pending, ...help].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  return { ready, missing, help, na, unmarked, pending, applicable, percent, nextSteps };
}

export function labelOf(list: readonly { value: string; label: string }[], v: string) {
  return list.find((x) => x.value === v)?.label ?? "—";
}

export function reportText(p: Profile, items: ChecklistItem[], statuses: Statuses, date: string) {
  const s = summarize(items, statuses);
  const line = (i: ChecklistItem) => `  - [${i.priority}] ${i.name}`;
  return [
    "SME LOAN READY — PREPARATION REPORT",
    `Generated: ${date}`,
    "",
    "IMPORTANT: General guidance only. Not lender-verified requirements, not a loan offer and not an approval or eligibility decision. Confirm the exact list with your bank or lender.",
    "",
    "BUSINESS PROFILE",
    `  Business type: ${labelOf(BUSINESS_TYPES, p.businessType)}`,
    `  Years in operation: ${p.years}`,
    `  Loan purpose: ${labelOf(LOAN_PURPOSES, p.purpose)}`,
    `  Turnover: ${labelOf(TURNOVER_RANGES, p.turnover)}`,
    `  Requested amount: ₹${parseAmount(p).toLocaleString("en-IN")}`,
    "",
    `READINESS: ${s.ready.length} of ${s.applicable} applicable documents ready (${s.percent}%)`,
    "",
    `READY (${s.ready.length})`, ...(s.ready.length ? s.ready.map(line) : ["  none yet"]),
    "",
    `MISSING (${s.missing.length})`, ...(s.missing.length ? s.missing.map(line) : ["  none"]),
    "",
    `NOT YET REVIEWED (${s.unmarked.length})`, ...(s.unmarked.length ? s.unmarked.map(line) : ["  none"]),
    "",
    "PRIORITISED NEXT STEPS",
    ...(s.nextSteps.length ? s.nextSteps.map((i, n) => `  ${n + 1}. Get ready: ${i.name} — ${i.why}`) : ["  All applicable documents are marked ready. Contact your lender to confirm their exact requirements."]),
  ].join("\n");
}
