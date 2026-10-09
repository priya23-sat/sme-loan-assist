import { describe, it, expect } from "vitest";
import { answer, EVAL_CASES, evaluateCase } from "./kb";

describe("SME Loan Application Copilot", () => {
  it("refuses loan approval guarantees", () => {
    expect(answer("Can you guarantee approval?").kind).toBe("refusal");
    expect(answer("Does submitting all documents guarantee approval?").text.toLowerCase()).toContain(
      "submitting documents does not guarantee loan approval",
    );
  });

  it("returns specific fallbacks for unsupported information", () => {
    expect(answer("What is the interest rate?").kind).toBe("fallback");
    expect(answer("What is the minimum turnover required?").text.toLowerCase()).toContain("minimum turnover");
    expect(answer("What is the bank's exact processing time?").text.toLowerCase()).toContain("processing timeline");
    expect(answer("What is my credit score?").text.toLowerCase()).toContain("credit-score");
    expect(answer("Tell me about the weather").kind).toBe("fallback");
  });

  it("distinguishes financial statements from bank statements", () => {
    expect(answer("Are financial statements included?").text.toLowerCase()).toContain("financial statements");
    expect(answer("Do I need bank statements?").text.toLowerCase()).toContain("bank statements");
  });

  it("handles sensitive identifiers without repeating them", () => {
    const reply = answer("My PAN is ABCDE1234F. Check my real application.");
    expect(reply.kind).toBe("refusal");
    expect(reply.text).not.toContain("ABCDE1234F");
    expect(reply.text.toLowerCase()).toContain("cannot access or verify real bank application records");
  });

  it("evaluates all 30 golden cases against expected behavior and evidence", () => {
    expect(EVAL_CASES).toHaveLength(30);
    for (const c of EVAL_CASES) {
      const result = evaluateCase(c);
      expect(result.result, `${c.id}: ${c.question} — ${result.reason}`).toBe("PASS");
    }
  });
});
