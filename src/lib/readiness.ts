// Loan readiness rules for small businesses across India.
// General guidance only — NOT verified lender-specific requirements.
// Every item is a suggestion, never a requirement: the tracker lets the user
// mark anything "Not applicable", and no item is mandatory for every borrower.
// Ids, rules, calculations and stored status values never change with language;
// only the displayed text does (see ./i18n for Marathi strings).

export const BUSINESS_TYPES = [
  { value: "kirana", label: "Kirana / retail shop" },
  { value: "trading", label: "Wholesale / trading business" },
  { value: "manufacturing", label: "Manufacturing / production unit" },
  { value: "services", label: "Services (salon, repair, professional, home service)" },
  { value: "food", label: "Food business (restaurant, tiffin, catering, bakery)" },
  { value: "transport", label: "Transport / logistics" },
  { value: "other", label: "Other small business" },
] as const;

export const LOAN_PURPOSES = [
  { value: "equipment", label: "Buy equipment, machinery or a vehicle" },
  { value: "working_capital", label: "Working capital (stock, salaries, utilities)" },
  { value: "expansion", label: "Expansion (new outlet, unit, vehicle or office)" },
  { value: "refinance", label: "Refinance an existing loan" },
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

export const EMPTY_PROFILE: Profile = {
  businessType: "",
  years: "",
  purpose: "",
  turnover: "",
  amount: "",
};

export const MIN_AMOUNT = 50_000;
export const MAX_AMOUNT = 50_000_000;

export type ProfileErrors = Partial<Record<keyof Profile, string>>;

export function validateProfile(p: Profile, lang: Lang = "en"): ProfileErrors {
  const e: ProfileErrors = {};
  const msg = (k: ValidationKey) => validationMessage(lang, k);
  if (!BUSINESS_TYPES.some((b) => b.value === p.businessType))
    e.businessType = msg("businessType.required");
  if (!LOAN_PURPOSES.some((b) => b.value === p.purpose)) e.purpose = msg("purpose.required");
  if (!TURNOVER_RANGES.some((b) => b.value === p.turnover)) e.turnover = msg("turnover.required");
  const y = p.years.trim();
  if (!y) e.years = msg("years.required");
  else if (!/^\d{1,2}$/.test(y) || +y > 75) e.years = msg("years.invalid");
  const a = p.amount.replace(/[,\s₹]/g, "");
  if (!a) e.amount = msg("amount.required");
  else if (!/^\d+$/.test(a)) e.amount = msg("amount.invalid");
  else if (+a < MIN_AMOUNT || +a > MAX_AMOUNT) e.amount = msg("amount.range");
  return e;
}

export function parseAmount(p: Profile) {
  return Number(p.amount.replace(/[,\s₹]/g, "")) || 0;
}

import {
  localizedLabel,
  localizeItems,
  priorityLabel,
  reportHeadings,
  validationMessage,
  type Lang,
  type ValidationKey,
} from "./i18n";

export type Priority = "High" | "Medium" | "Low";
export type ChecklistItem = {
  id: string;
  name: string;
  why: string;
  rule: string;
  priority: Priority;
};

const PRIORITY_ORDER: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };

// Category-specific guidance. Each business category only ever sees its own
// items, on top of the general items below.
const BY_CATEGORY: Record<string, ChecklistItem[]> = {
  kirana: [
    {
      id: "stock",
      name: "Stock list with recent purchase and sale invoices",
      priority: "Medium",
      rule: "Because you run a Kirana / retail shop",
      why: "Shows the goods you buy and sell regularly and how quickly stock turns into sales.",
    },
  ],
  trading: [
    {
      id: "trade_invoices",
      name: "Purchase and sales invoices with supplier and buyer details",
      priority: "Medium",
      rule: "Because you run a wholesale or trading business",
      why: "Repeat buying and selling is the core of trading, so invoices show the volume of business you do.",
    },
    {
      id: "import_export",
      name: "Import / export documents (IEC, shipping bills), if you trade abroad",
      priority: "Low",
      rule: "Only if your trading business imports or exports",
      why: "Cross-border trade needs extra paperwork; a lender would ask for this only when it applies to you.",
    },
  ],
  manufacturing: [
    {
      id: "machinery",
      name: "List of machinery and equipment (with invoices if available)",
      priority: "Medium",
      rule: "Because you run a manufacturing unit",
      why: "Shows what you produce with, which helps a lender understand your production capacity.",
    },
    {
      id: "factory_licence",
      name: "Factory licence and pollution-control consent, if applicable",
      priority: "Medium",
      rule: "Because you run a manufacturing unit — only where these apply",
      why: "Some licences apply only above certain thresholds, so confirm which ones your unit needs.",
    },
  ],
  services: [
    {
      id: "service_contracts",
      name: "Service contracts, retainers or work orders from clients",
      priority: "Medium",
      rule: "Because you provide services",
      why: "Regular client work suggests repeat income a lender can expect while the loan is repaid.",
    },
    {
      id: "professional_licence",
      name: "Professional or trade licence, if your service needs one",
      priority: "Low",
      rule: "Only where your service is regulated",
      why: "Some services need a licence to operate legally; ask your lender which ones matter for you.",
    },
  ],
  food: [
    {
      id: "fssai",
      name: "Valid FSSAI food licence",
      priority: "High",
      rule: "Because you run a food business",
      why: "Food businesses are generally expected to hold a current FSSAI licence, and lenders check that it is valid.",
    },
    {
      id: "food_sales",
      name: "Supplier invoices and daily sales / POS records",
      priority: "Medium",
      rule: "Because you run a food business",
      why: "Daily sales records show steady customer demand and how much the business earns each week.",
    },
  ],
  transport: [
    {
      id: "vehicle_rc",
      name: "Vehicle registration certificates (RC) for your fleet",
      priority: "High",
      rule: "Suggested for transport businesses",
      why: "Shows the vehicles you own and run, which are the core asset of a transport business.",
    },
    {
      id: "insurance",
      name: "Current vehicle insurance policies",
      priority: "Medium",
      rule: "Suggested for transport businesses",
      why: "Lenders often check that operating vehicles are insured and active.",
    },
    {
      id: "permits",
      name: "Commercial permits and fitness certificates",
      priority: "Medium",
      rule: "Because you carry goods or passengers for hire",
      why: "Shows your vehicles are legally allowed to carry goods or passengers on your routes.",
    },
    {
      id: "contracts",
      name: "Client contracts or work orders",
      priority: "Medium",
      rule: "Because you carry goods or cargo for clients",
      why: "Regular contracts suggest steady future income, which helps a lender understand repayment ability.",
    },
  ],
  other: [
    {
      id: "income_records",
      name: "Service or trade invoices showing regular income",
      priority: "Medium",
      rule: "Because you chose Other small business",
      why: "Regular invoices show a pattern of income that a lender can assess.",
    },
  ],
};

export function buildChecklist(p: Profile): ChecklistItem[] {
  const years = Number(p.years) || 0;
  const amount = parseAmount(p);
  const items: ChecklistItem[] = [
    {
      id: "registration",
      name: "Business registration proof (e.g. Udyam certificate or shop licence)",
      priority: "High",
      rule: "Suggested for every business",
      why: "Lenders usually want to see that the business formally exists and where it operates.",
    },
    {
      id: "premises",
      name: "Proof of business premises (rent agreement, electricity bill or property papers)",
      priority: "Medium",
      rule: "Suggested for every business",
      why: "Confirms where the business actually operates, which a lender may want to check.",
    },
  ];
  const categoryItems = BY_CATEGORY[p.businessType] ?? BY_CATEGORY["other"] ?? [];
  items.push(...categoryItems);
  if (p.turnover === "40to100" || p.turnover === "gt100")
    items.push({
      id: "gst",
      name: "GST registration certificate and recent GST returns",
      priority: "High",
      rule: "Because your turnover is ₹40 lakh or more",
      why: "Businesses above GST thresholds are generally expected to be registered; returns show reported sales.",
    });
  if (years >= 2)
    items.push({
      id: "financials",
      name: "Profit & loss statement and balance sheet (last 2 years)",
      priority: "High",
      rule: "Because the business is 2+ years old",
      why: "Helps a lender see how profitable the business has been over time.",
    });
  else
    items.push({
      id: "plan",
      name: "Simple business plan with expected income and costs",
      priority: "High",
      rule: "Because the business is under 2 years old",
      why: "With a short track record, a plan helps explain how the loan will be repaid.",
    });
  if (p.purpose === "equipment")
    items.push({
      id: "quotation",
      name: "Dealer or supplier quotation / proforma invoice for what you plan to buy",
      priority: "High",
      rule: "Because the loan is to buy an asset",
      why: "Shows the exact cost of the equipment, machinery or vehicle you plan to buy.",
    });
  if (p.purpose === "working_capital")
    items.push({
      id: "receivables",
      name: "Summary of pending customer payments (receivables)",
      priority: "Medium",
      rule: "Because the loan is for working capital",
      why: "Shows money you expect to receive and why short-term funds are needed.",
    });
  if (p.purpose === "expansion")
    items.push({
      id: "cost_estimate",
      name: "Cost estimate for the expansion",
      priority: "Medium",
      rule: "Because the loan is for expansion",
      why: "Explains how the requested amount will be used.",
    });
  if (p.purpose === "refinance" || amount > 1_000_000)
    items.push({
      id: "existing_loans",
      name: "List of existing loans and EMIs",
      priority: p.purpose === "refinance" ? "High" : "Medium",
      rule:
        p.purpose === "refinance"
          ? "Because you want to refinance"
          : "Because the amount is over ₹10 lakh",
      why: "Lenders usually review current repayments before adding new ones.",
    });
  items.push({
    id: "photos",
    name: "Recent photos of your business premises, equipment or vehicles",
    priority: "Low",
    rule: "Optional but helpful",
    why: "Can make the application easier to understand for the lender.",
  });
  return items.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
}

export type Status = "ready" | "missing" | "na";
export type Statuses = Record<string, Status | undefined>;

export function summarize(items: ChecklistItem[], statuses: Statuses) {
  const ready = items.filter((i) => statuses[i.id] === "ready");
  const missing = items.filter((i) => statuses[i.id] === "missing");
  const na = items.filter((i) => statuses[i.id] === "na");
  const unmarked = items.filter((i) => !statuses[i.id]);
  const applicable = items.length - na.length;
  const percent = applicable === 0 ? 0 : Math.round((ready.length / applicable) * 100);
  const nextSteps = [...missing, ...unmarked].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
  );
  return { ready, missing, na, unmarked, applicable, percent, nextSteps };
}

export function labelOf(list: readonly { value: string; label: string }[], v: string) {
  return list.find((x) => x.value === v)?.label ?? "—";
}

/** Localised option label for the report and summary rows. */
export function optionLabel(
  kind: "business" | "purpose" | "turnover",
  list: readonly { value: string; label: string }[],
  v: string,
  lang: Lang,
) {
  return localizedLabel(kind, v, lang, labelOf(list, v));
}

export function reportText(
  p: Profile,
  items: ChecklistItem[],
  statuses: Statuses,
  date: string,
  lang: Lang = "en",
) {
  const local = lang === "en" ? items : localizeItems(items, lang);
  const s = summarize(local, statuses);
  const h = reportHeadings(lang).headings;
  const line = (i: ChecklistItem) => `  - [${priorityLabel(i.priority, lang)}] ${i.name}`;
  const readiness =
    lang === "en"
      ? `READINESS: ${s.ready.length} of ${s.applicable} applicable documents ready (${s.percent}%)`
      : `सज्जता: लागू असलेल्या ${s.applicable} पैकी ${s.ready.length} कागदपत्रे सज्ज (${s.percent}%)`;
  return [
    h.title,
    `${h.generated} ${date}`,
    "",
    h.important,
    "",
    h.profile,
    `  ${h.businessType} ${optionLabel("business", BUSINESS_TYPES, p.businessType, lang)}`,
    `  ${h.years} ${p.years}`,
    `  ${h.purpose} ${optionLabel("purpose", LOAN_PURPOSES, p.purpose, lang)}`,
    `  ${h.turnover} ${optionLabel("turnover", TURNOVER_RANGES, p.turnover, lang)}`,
    `  ${h.amount} ₹${parseAmount(p).toLocaleString("en-IN")}`,
    "",
    readiness,
    "",
    `${h.ready} (${s.ready.length})`,
    ...(s.ready.length ? s.ready.map(line) : [h.noneYet]),
    "",
    `${h.missing} (${s.missing.length})`,
    ...(s.missing.length ? s.missing.map(line) : [h.none]),
    "",
    `${h.unreviewed} (${s.unmarked.length})`,
    ...(s.unmarked.length ? s.unmarked.map(line) : [h.none]),
    "",
    h.nextSteps,
    ...(s.nextSteps.length
      ? s.nextSteps.map((i, n) => `  ${n + 1}. ${h.getReady} ${i.name} — ${i.why}`)
      : [h.allReady]),
  ].join("\n");
}
