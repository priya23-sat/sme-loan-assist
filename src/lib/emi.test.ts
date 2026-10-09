import { describe, expect, it } from "vitest";
import { emi } from "./emi";

describe("emi", () => {
  it("computes standard EMI", () => {
    expect(Math.round(emi(1000000, 12, 12))).toBe(88849);
  });
  it("handles zero rate", () => {
    expect(emi(1200, 0, 12)).toBe(100);
  });
});
