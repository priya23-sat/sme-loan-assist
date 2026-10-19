import { describe, expect, it } from "vitest";
import { buildChecklist, summarize, validateProfile, type Profile } from "./readiness";

const base: Profile = { businessType: "goods", years: "5", purpose: "vehicle", turnover: "10to40", amount: "800000" };

describe("profile validation", () => {
  it("flags every empty required field", () => {
    const e = validateProfile({ businessType: "", years: "", purpose: "", turnover: "", amount: "" });
    expect(Object.keys(e).sort()).toEqual(["amount", "businessType", "purpose", "turnover", "years"]);
  });
  it("rejects amounts outside ₹50,000 – ₹5 crore", () => {
    expect(validateProfile({ ...base, amount: "49999" }).amount).toBeDefined();
    expect(validateProfile({ ...base, amount: "50000001" }).amount).toBeDefined();
    expect(validateProfile({ ...base, amount: "8,00,000" }).amount).toBeUndefined();
  });
  it("rejects non-numeric years", () => {
    expect(validateProfile({ ...base, years: "abc" }).years).toBeDefined();
  });
});

describe("checklist rules", () => {
  const ids = (p: Profile) => buildChecklist(p).map((i) => i.id);
  it("never asks for sensitive documents like Aadhaar, PAN or bank statements", () => {
    const names = buildChecklist({ ...base, purpose: "refinance", turnover: "gt100", amount: "5000000" }).map((i) => i.name.toLowerCase()).join(" ");
    expect(names).not.toMatch(/aadhaar|pan card|\bpan\b|bank statement/);
  });
  it("adds GST only for turnover of ₹40 lakh or more", () => {
    expect(ids(base)).not.toContain("gst");
    expect(ids({ ...base, turnover: "40to100" })).toContain("gst");
  });
  it("asks for a business plan instead of financials when under 2 years old", () => {
    expect(ids({ ...base, years: "1" })).toContain("plan");
    expect(ids({ ...base, years: "1" })).not.toContain("financials");
  });
  it("adds existing loans list when amount exceeds ₹10 lakh", () => {
    expect(ids(base)).not.toContain("existing_loans");
    expect(ids({ ...base, amount: "1500000" })).toContain("existing_loans");
  });
});

describe("progress", () => {
  it("excludes Not Applicable items from the percentage", () => {
    const items = buildChecklist(base);
    const [a, b] = items;
    const s = summarize(items, { [a.id]: "ready", [b.id]: "na" });
    expect(s.applicable).toBe(items.length - 1);
    expect(s.percent).toBe(Math.round((1 / (items.length - 1)) * 100));
    expect(s.nextSteps).toHaveLength(items.length - 2);
  });
});
