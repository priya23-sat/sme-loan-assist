export type StatementExtractionMethod = "pdf_text" | "ocr" | "mixed";
export interface BankStatementTransaction {
  transactionDate: string; description: string; referenceHint: string | null;
  debit: string; credit: string; balance: string; confidence: number;
  sourcePage: number; sourceRowIndex: number;
}
export interface BankStatementParseResult {
  bankFormatKey: "boi_retail_sme_v1"; currency: "INR"; accountHolder: string | null;
  statementPeriod: { from: string | null; to: string | null };
  openingBalance: string | null; closingBalance: string | null;
  transactions: BankStatementTransaction[];
  reconciliation: { status: "matched" | "mismatch" | "not_available"; expectedClosingBalance: string | null; actualClosingBalance: string | null; delta: string | null };
  warnings: string[];
}
const DATE = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const AMOUNT = /^(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{1,2})?$/;
function toIsoDate(value: string): string | null {
  const match = DATE.exec(value); if (!match) return null;
  const [, day, month, year] = match;
  const date = new Date(Date.UTC(Number(year), Number(month)-1, Number(day)));
  if (date.getUTCFullYear() !== Number(year) || date.getUTCMonth() !== Number(month)-1 || date.getUTCDate() !== Number(day)) return null;
  return (year ?? "") + "-" + (month ?? "") + "-" + (day ?? "");
}
function amountToPaise(value: string): bigint {
  const [rupees, fraction = ""] = value.replaceAll(",", "").split(".");
  return BigInt(rupees ?? "0") * 100n + BigInt(fraction.padEnd(2, "0"));
}
function paiseToAmount(value: bigint): string {
  const negative = value < 0n, absolute = negative ? -value : value;
  return (negative ? "-" : "") + (absolute / 100n).toString() + "." + (absolute % 100n).toString().padStart(2, "0");
}
function normaliseAmount(value: string): string { return paiseToAmount(amountToPaise(value)); }
function extractReference(description: string): string | null {
  const match = /\b(?:UTR|NEFT|RTGS|IMPS|UPI|REF|CHQ)[\s:#-]*([A-Z0-9-]{5,})\b/i.exec(description);
  return match?.[0]?.replace(/\s+/g, " ").trim() ?? null;
}
/** Deterministic parser for the synthetic BOI-inspired v1 text layout. Unknown rows are surfaced, never silently repaired. */
export function parseBoiStatementText(text: string, sourcePage = 1): BankStatementParseResult {
  const lines = text.replace(/\r/g, "").split("\n").map(line => line.trim()).filter(Boolean);
  const warnings: string[] = [];
  const openingLine = lines.find(line => /^Opening Balance\s*:/i.test(line));
  const closingLine = lines.find(line => /^Closing Balance\s*:/i.test(line));
  const periodLine = lines.find(line => /^Statement Period\s*:/i.test(line));
  const holderLine = lines.find(line => /^Account Name\s*:/i.test(line));
  const readMetaAmount = (line: string | undefined): string | null => {
    if (!line) return null;
    const value = line.split(":").slice(1).join(":").trim().replace(/^INR\s*/i, "");
    return AMOUNT.test(value) ? normaliseAmount(value) : null;
  };
  let periodFrom: string | null = null, periodTo: string | null = null;
  if (periodLine) {
    const match = /Statement Period\s*:\s*(\d{2}\/\d{2}\/\d{4})\s+to\s+(\d{2}\/\d{2}\/\d{4})/i.exec(periodLine);
    if (match) { periodFrom = toIsoDate(match[1] ?? ""); periodTo = toIsoDate(match[2] ?? ""); }
  }
  const transactions: BankStatementTransaction[] = [];
  let rowIndex = 0;
  for (const line of lines) {
    if (!/^\d{2}\/\d{2}\/\d{4}\s/.test(line)) continue;
    rowIndex += 1;
    const parts = line.split(/\s+/), dateText = parts.shift() ?? "", transactionDate = toIsoDate(dateText);
    const trailing = parts.slice(-3), debitText = trailing[0] ?? "", creditText = trailing[1] ?? "", balanceText = trailing[2] ?? "";
    const description = parts.slice(0, -3).join(" ").trim();
    if (!transactionDate || !description || !AMOUNT.test(balanceText) ||
      (debitText !== "-" && !AMOUNT.test(debitText)) || (creditText !== "-" && !AMOUNT.test(creditText)) ||
      (debitText === "-" && creditText === "-")) {
      warnings.push("Page " + sourcePage + ", row " + rowIndex + ": unrecognised transaction row; review required.");
      continue;
    }
    transactions.push({ transactionDate, description, referenceHint: extractReference(description),
      debit: debitText === "-" ? "0.00" : normaliseAmount(debitText),
      credit: creditText === "-" ? "0.00" : normaliseAmount(creditText),
      balance: normaliseAmount(balanceText), confidence: 0.98, sourcePage, sourceRowIndex: rowIndex });
  }
  if (transactions.length === 0) warnings.push("No transaction rows were recognised in the BOI v1 layout.");
  const openingBalance = readMetaAmount(openingLine), closingBalance = readMetaAmount(closingLine);
  if (openingLine && openingBalance === null) warnings.push("Opening balance could not be parsed.");
  if (closingLine && closingBalance === null) warnings.push("Closing balance could not be parsed.");
  let expectedClosing: string | null = null, delta: string | null = null;
  let reconciliation: BankStatementParseResult["reconciliation"]["status"] = "not_available";
  if (openingBalance !== null && closingBalance !== null && transactions.length > 0) {
    let running = amountToPaise(openingBalance);
    for (const transaction of transactions) running += amountToPaise(transaction.credit) - amountToPaise(transaction.debit);
    expectedClosing = paiseToAmount(running);
    const difference = running - amountToPaise(closingBalance);
    delta = paiseToAmount(difference); reconciliation = difference === 0n ? "matched" : "mismatch";
    if (reconciliation === "mismatch") warnings.push("Closing balance does not reconcile with opening balance and extracted transactions.");
  }
  if (!periodFrom || !periodTo) warnings.push("Statement period was not recognised.");
  if (transactions.length > 0 && openingBalance !== null) {
    let previous = amountToPaise(openingBalance);
    for (const transaction of transactions) {
      const calculated = previous + amountToPaise(transaction.credit) - amountToPaise(transaction.debit);
      if (calculated !== amountToPaise(transaction.balance)) warnings.push("Page " + transaction.sourcePage + ", row " + transaction.sourceRowIndex + ": running balance mismatch.");
      previous = amountToPaise(transaction.balance);
    }
  }
  return { bankFormatKey: "boi_retail_sme_v1", currency: "INR",
    accountHolder: holderLine?.split(":").slice(1).join(":").trim() || null,
    statementPeriod: { from: periodFrom, to: periodTo }, openingBalance, closingBalance, transactions,
    reconciliation: { status: reconciliation, expectedClosingBalance: expectedClosing, actualClosingBalance: closingBalance, delta }, warnings };
}
