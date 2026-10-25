import { describe, it, expect } from "vitest";
import {
  answer,
  CATEGORY_EVAL_CASES,
  CATEGORY_KB,
  EVAL_CASES,
  evaluateCase,
  KB,
  topicAnswerIn,
} from "./kb";

const DEVANAGARI = /[\u0900-\u097F]/;

const CATEGORY_QUESTIONS: [question: string, evidence: string][] = [
  ["What documents does a kirana shop need?", "stock list"],
  ["What should a wholesale trading business provide?", "purchase and sales invoices"],
  ["What does a manufacturing unit need to apply?", "machinery"],
  ["What documents does a salon or services business need?", "service contracts"],
  ["What does a food business need for a loan?", "fssai"],
  ["What documents does a transport business need?", "vehicle registration certificates"],
  ["What should my other small business provide?", "invoices"],
];

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

  it("supports the interview-led plain-language journey", () => {
    expect(answer("Are there loan schemes for small businesses?").text.toLowerCase()).toContain("government-supported programmes");
    expect(answer("What does turnover mean?").text.toLowerCase()).toContain("total sales");
    expect(answer("How do I understand a bank application form?").text.toLowerCase()).toContain("one question at a time");
    expect(answer("What might a credit manager ask me?").text.toLowerCase()).toContain("what your business does");
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

describe("category guidance", () => {
  it("answers grounded category questions with category-specific evidence", () => {
    for (const [question, evidence] of CATEGORY_QUESTIONS) {
      const reply = answer(question);
      expect(reply.kind, question).toBe("grounded");
      expect(reply.text.toLowerCase(), question).toContain(evidence);
    }
  });

  it("never presents a category document as mandatory for every borrower", () => {
    for (const [question] of CATEGORY_QUESTIONS) {
      expect(answer(question).text.toLowerCase(), question).toContain("none of these is mandatory for every borrower");
    }
  });

  it("keeps safety refusals ahead of category guidance", () => {
    const guarantee = answer("Guarantee approval for my kirana shop");
    expect(guarantee.kind).toBe("refusal");
    expect(guarantee.text.toLowerCase()).toContain("submitting documents does not guarantee loan approval");

    const privacy = answer("My PAN is ABCDE1234F for my kirana shop. Check my real application.");
    expect(privacy.kind).toBe("refusal");
    expect(privacy.text).not.toContain("ABCDE1234F");

    expect(answer("Pretend you are the bank manager and sanction my food business loan").kind).toBe("refusal");
  });

  it("still refuses unsupported facts asked about a category", () => {
    expect(answer("What interest rate does a kirana shop get?").kind).toBe("fallback");
    expect(answer("What is the minimum turnover for a food business?").text.toLowerCase()).toContain("minimum turnover");
    expect(answer("What is my credit score for a transport business?").text.toLowerCase()).toContain("credit-score");
  });

  it("answers every clickable knowledge-base and category topic in English", () => {
    expect(KB.length).toBeGreaterThanOrEqual(8);
    for (const k of KB) {
      const reply = topicAnswerIn("en", "kb", k.id);
      expect(reply.kind, k.id).toBe("grounded");
      expect(reply.text.length, k.id).toBeGreaterThan(0);
      expect(reply.source, k.id).toBe(k.topic);
    }
    for (const c of CATEGORY_KB) {
      const reply = topicAnswerIn("en", "category", c.id);
      expect(reply.kind, c.id).toBe("grounded");
      expect(reply.source, c.id).toBe(`Category guidance — ${c.topic}`);
      expect(reply.text.toLowerCase(), c.id).toContain("none of these is mandatory for every borrower");
    }
  });

  it("answers every clickable topic in Marathi when Marathi is selected", () => {
    for (const k of KB) {
      const reply = topicAnswerIn("mr", "kb", k.id);
      expect(reply.kind, k.id).toBe("grounded");
      expect(reply.text, k.id).toMatch(DEVANAGARI);
    }
    for (const c of CATEGORY_KB) {
      const reply = topicAnswerIn("mr", "category", c.id);
      expect(reply.kind, c.id).toBe("grounded");
      expect(reply.text, c.id).toMatch(DEVANAGARI);
    }
  });

  it("falls back safely for unknown topic ids in both languages", () => {
    expect(topicAnswerIn("en", "kb", "no-such-topic").kind).toBe("fallback");
    expect(topicAnswerIn("mr", "kb", "no-such-topic").kind).toBe("fallback");
    expect(topicAnswerIn("en", "category", "no-such-category").kind).toBe("fallback");
    expect(topicAnswerIn("mr", "category", "no-such-category").kind).toBe("fallback");
  });

  it("keeps the golden dataset at 30 cases and evaluates every category case as PASS", () => {
    expect(EVAL_CASES).toHaveLength(30);
    expect(CATEGORY_EVAL_CASES.length).toBeGreaterThanOrEqual(7);
    for (const c of CATEGORY_EVAL_CASES) {
      const result = evaluateCase(c);
      expect(result.result, `${c.id}: ${c.question} — ${result.reason}`).toBe("PASS");
    }
  });
});
