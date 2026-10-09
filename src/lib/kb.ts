// Fixed demo knowledge base for the simulated assistant. No live AI is used.
export type KbEntry = { id: string; topic: string; keywords: string[]; answer: string };

export const KB: KbEntry[] = [
  {
    id: "documents",
    topic: "Required documents",
    keywords: ["document", "documents", "checklist", "papers", "what do i need", "what to submit", "required", "upload"],
    answer:
      "The demo checklist includes: PAN, Business KYC, GST returns, bank statements and financial statements. Requirements vary by bank and loan product, so confirm the final list with your bank.",
  },
  {
    id: "gst",
    topic: "GST returns",
    keywords: ["gst", "gstr", "tax return"],
    answer:
      "In this demo, GST returns are listed as a required document. The number of months or filings needed varies by bank and loan product — please check with the bank's authorized representative.",
  },
  {
    id: "bank-statements",
    topic: "Bank statements",
    keywords: ["bank statement", "statements", "account statement", "passbook"],
    answer:
      "In this demo, business bank statements are a required document. The period covered varies by bank and loan product.",
  },
  {
    id: "pan-kyc",
    topic: "PAN and KYC",
    keywords: ["pan", "kyc", "identity", "id proof", "know your customer"],
    answer:
      "The demo checklist includes PAN and Business KYC. These help the lender verify the identity of the business. Accepted KYC documents vary by bank.",
  },
  {
    id: "stages",
    topic: "Application stages",
    keywords: ["stage", "stages", "steps", "process", "how does it work", "timeline", "next step", "what happens"],
    answer:
      "The demo application follows these stages: 1) Application Submitted, 2) Documents Pending, 3) Under Review, 4) Decision by the bank. Submitting documents does not mean the loan is approved.",
  },
  {
    id: "status",
    topic: "Application status",
    keywords: ["status", "where is my", "progress", "current", "track"],
    answer:
      "The demo application SME-2026-1042 for ABC Traders is currently at 'Documents Pending'. Submit the pending items on the Document Checklist page to move toward review.",
  },
  {
    id: "documents-pending",
    topic: "Meaning of 'Documents Pending'",
    keywords: ["pending", "documents pending", "missing"],
    answer:
      "'Documents Pending' means some checklist items have not yet been submitted. Once all items are submitted, the application can move to review by the bank. This is not an approval.",
  },
];

const GUARANTEE = ["guarantee", "guaranteed", "will i get", "will my loan be approved", "approve my", "approval chance", "eligible", "eligibility", "sure to get", "definitely", "credit score", "cibil"];
const OFF_KB = ["interest", "rate", "emi", "fee", "fees", "charges", "collateral", "tenure", "limit", "how much can i"];

export const GUARANTEE_REPLY =
  "I can't predict, guarantee or make loan approval or eligibility decisions. Only the bank can make credit decisions after its own review. Please contact the bank's authorized representative.";
export const FALLBACK_REPLY =
  "That information is not available in this demo knowledge base. Please contact the bank's authorized representative for accurate details.";

export type Reply = { kind: "grounded" | "refusal" | "fallback"; text: string; source?: string };

export function answer(question: string): Reply {
  const q = question.toLowerCase();
  if (GUARANTEE.some((k) => q.includes(k))) return { kind: "refusal", text: GUARANTEE_REPLY };
  if (OFF_KB.some((k) => new RegExp(`\\b${k}\\b`).test(q))) return { kind: "fallback", text: FALLBACK_REPLY };
  let best: KbEntry | null = null;
  let bestScore = 0;
  for (const e of KB) {
    const score = e.keywords.reduce((s, k) => (new RegExp(`\\b${k}`).test(q) ? s + k.length : s), 0);
    if (score > bestScore) { best = e; bestScore = score; }
  }
  if (!best) return { kind: "fallback", text: FALLBACK_REPLY };
  return { kind: "grounded", text: best.answer, source: best.topic };
}

export type EvalCase = { question: string; category: string; expected: Reply["kind"]; expectedText: string };
export const EVAL_CASES: EvalCase[] = [
  { question: "What documents do I need to submit?", category: "Supported", expected: "grounded", expectedText: "Lists demo checklist and notes requirements vary" },
  { question: "Which papers are required?", category: "Supported (paraphrase)", expected: "grounded", expectedText: "Same grounded document answer" },
  { question: "What are the stages of the application?", category: "Supported", expected: "grounded", expectedText: "Explains demo stages; not an approval" },
  { question: "What does documents pending mean?", category: "Supported", expected: "grounded", expectedText: "Explains pending status" },
  { question: "What is the interest rate on this loan?", category: "Missing information", expected: "fallback", expectedText: "Says info unavailable; refers to bank representative" },
  { question: "Is collateral needed?", category: "Missing information", expected: "fallback", expectedText: "Says info unavailable; refers to bank representative" },
  { question: "Can you guarantee my loan will be approved?", category: "Approval guarantee attempt", expected: "refusal", expectedText: "Refuses; no credit decisions or guarantees" },
];
