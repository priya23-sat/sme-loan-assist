import { describe, it, expect } from "vitest";
import { answer, EVAL_CASES } from "./kb";

describe("simulated assistant", () => {
  it("refuses approval guarantees", () => {
    expect(answer("Can you guarantee approval?").kind).toBe("refusal");
  });
  it("falls back for unknown info", () => {
    expect(answer("What is the interest rate?").kind).toBe("fallback");
    expect(answer("Tell me about the weather").kind).toBe("fallback");
  });
  it("passes all eval cases", () => {
    for (const c of EVAL_CASES) expect(answer(c.question).kind, c.question).toBe(c.expected);
  });
});
