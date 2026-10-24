import { describe, expect, it } from "vitest";
import { buildChecklist, summarize, validateProfile, type Profile } from "./readiness";

const base: Profile = { businessType: "kirana", years: "5", purpose: "working_capital", turnover: "10to40", amount: "800000" };

const CATEGORY_IDS: Record<string, string[]> = {
  kirana: ["stock"],
  trading: ["trade_invoices", "import_export"],
  manufacturing: ["machinery", "factory_licence"],
  services: ["service_contracts", "professional_licence"],
  food: ["fssai", "food_sales"],
  transport: ["vehicle_rc", "insurance", "permits", "contracts"],
  other: ["income_records"],
};

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
  it("adds a supplier quotation when the loan is to buy an asset", () => {
    expect(ids({ ...base, purpose: "equipment" })).toContain("quotation");
    expect(ids(base)).not.toContain("quotation");
  });
});

describe("business categories", () => {
  const ids = (businessType: string) => buildChecklist({ ...base, businessType }).map((i) => i.id);

  it("supports every offered business category", () => {
    const offered = ["kirana", "trading", "manufacturing", "services", "food", "transport", "other"];
    expect(Object.keys(CATEGORY_IDS).sort()).toEqual([...offered].sort());
  });

  for (const [category, expected] of Object.entries(CATEGORY_IDS)) {
    it(`gives ${category} its category-specific documents`, () => {
      const got = ids(category);
      for (const id of expected) expect(got, `${category} should include ${id}`).toContain(id);
    });
  }

  it("always includes the general business documents", () => {
    for (const category of Object.keys(CATEGORY_IDS)) {
      const got = ids(category);
      expect(got).toContain("registration");
      expect(got).toContain("premises");
      expect(got).toContain("financials");
    }
  });

  it("does not give one category another category's documents", () => {
    expect(ids("kirana")).not.toContain("vehicle_rc");
    expect(ids("kirana")).not.toContain("trade_invoices");
    expect(ids("manufacturing")).not.toContain("fssai");
    expect(ids("manufacturing")).not.toContain("stock");
    expect(ids("services")).not.toContain("machinery");
    expect(ids("food")).not.toContain("service_contracts");
    expect(ids("other")).not.toContain("vehicle_rc");
  });

  it("falls back to general guidance for an unknown category", () => {
    expect(ids("something-new")).toContain("income_records");
    expect(ids("something-new")).not.toContain("vehicle_rc");
  });

  it("never asks for sensitive documents like Aadhaar, PAN or bank statements", () => {
    const names = Object.keys(CATEGORY_IDS)
      .flatMap((category) => buildChecklist({ ...base, businessType: category, purpose: "refinance", turnover: "gt100", amount: "5000000" }))
      .map((i) => i.name.toLowerCase())
      .join(" ");
    expect(names).not.toMatch(/aadhaar|pan card|\bpan\b|bank statement/);
  });

  it("lets the user mark documents as not applicable instead of forcing every item", () => {
    const items = buildChecklist({ ...base, businessType: "transport" });
    const s = summarize(items, Object.fromEntries(items.map((i) => [i.id, "na" as const])));
    expect(s.applicable).toBe(0);
    expect(s.percent).toBe(0);
  });
});

describe("progress", () => {
  it("excludes Not Applicable items from the percentage", () => {
    const items = buildChecklist(base);
    const a = items[0]!, b = items[1]!;
    const s = summarize(items, { [a.id]: "ready", [b.id]: "na" });
    expect(s.applicable).toBe(items.length - 1);
    expect(s.percent).toBe(Math.round((1 / (items.length - 1)) * 100));
    expect(s.nextSteps).toHaveLength(items.length - 2);
  });
});
