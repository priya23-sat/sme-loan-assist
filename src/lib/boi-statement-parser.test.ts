import { describe, expect, it } from "vitest";
import { parseBoiStatementText } from "./boi-statement-parser";
const fixture = [
"BANK OF INDIA","SME CURRENT ACCOUNT - SYNTHETIC TEST STATEMENT",
"Account Name: AARAV FOODS (FICTIONAL)","Account Number: XXXX-XXXX-1234",
"Statement Period: 01/04/2026 to 30/04/2026","Currency: INR","Opening Balance: 125,000.00",
"DATE PARTICULARS / NARRATION DEBIT CREDIT BALANCE",
"01/04/2026 UPI CREDIT FROM OMKAR STORES UTR BOI260401001 - 45,000.00 170,000.00",
"02/04/2026 SUPPLIER PAYMENT NEFT BOI260402002 18,500.00 - 151,500.00",
"03/04/2026 CASH DEPOSIT BRANCH REF BOI260403003 - 20,000.00 171,500.00",
"05/04/2026 GST PAYMENT CHALLAN BOI260405004 8,500.00 - 163,000.00",
"07/04/2026 POS PURCHASE PACKAGING BOI260407005 12,500.00 - 150,500.00",
"Closing Balance: 150,500.00"].join("\n");
describe("BOI-inspired synthetic statement parser", () => {
  it("extracts transactions and reconciles closing balance", () => {
    const result = parseBoiStatementText(fixture);
    expect(result.accountHolder).toBe("AARAV FOODS (FICTIONAL)");
    expect(result.transactions).toHaveLength(5);
    expect(result.transactions[0]).toMatchObject({ transactionDate:"2026-04-01", debit:"0.00", credit:"45000.00", balance:"170000.00", sourcePage:1, sourceRowIndex:1 });
    expect(result.transactions[1]?.referenceHint).toContain("NEFT BOI260402002");
    expect(result.reconciliation).toMatchObject({ status:"matched", expectedClosingBalance:"150500.00", actualClosingBalance:"150500.00", delta:"0.00" });
    expect(result.warnings).toEqual([]);
  });
  it("flags closing balance mismatch", () => {
    const result = parseBoiStatementText(fixture.replace("Closing Balance: 150,500.00","Closing Balance: 151,000.00"));
    expect(result.reconciliation.status).toBe("mismatch");
  });
  it("surfaces malformed rows instead of silently accepting them", () => {
    const result = parseBoiStatementText(fixture.replace("8,500.00 - 163,000.00","UNKNOWN - 163,000.00"));
    expect(result.transactions).toHaveLength(4);
    expect(result.warnings.some(warning => warning.includes("unrecognised transaction row"))).toBe(true);
  });
  it("uses paise arithmetic for decimal values", () => {
    const result = parseBoiStatementText(fixture.replace("125,000.00","100.10").replace("45,000.00","0.20").replace("170,000.00","100.30").replace("18,500.00","0.10").replace("151,500.00","100.20").replace("20,000.00","0.05").replace("171,500.00","100.25").replace("8,500.00","0.15").replace("163,000.00","100.10").replace("12,500.00","0.10").replace("150,500.00","100.00"));
    expect(result.reconciliation.status).toBe("matched");
  });
});
