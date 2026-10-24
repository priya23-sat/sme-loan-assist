import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, act } from "@testing-library/react";

import { LanguageProvider, useLanguage } from "@/lib/language";
import { LanguageSwitcher } from "@/components/shell";
import {
  LANG_KEY,
  localizeItems,
  translate,
  VALIDATION,
  validationMessage,
  type Lang,
} from "@/lib/i18n";
import { answer, answerIn, answerMr, CATEGORY_EVAL_CASES, EVAL_CASES } from "@/lib/kb";
import { buildChecklist, reportText, validateProfile, type Profile } from "@/lib/readiness";

const base: Profile = {
  businessType: "kirana",
  years: "5",
  purpose: "working_capital",
  turnover: "10to40",
  amount: "800000",
};

const DEVANAGARI = /[\u0900-\u097F]/;

function Probe() {
  const { lang, t } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="title">{t("checklistTitle")}</span>
      <LanguageSwitcher />
    </div>
  );
}

const renderApp = () =>
  render(
    <LanguageProvider>
      <Probe />
    </LanguageProvider>,
  );

afterEach(() => {
  cleanup();
  localStorage.removeItem(LANG_KEY);
});

describe("language switching and persistence", () => {
  it("defaults to English when no saved preference exists", () => {
    renderApp();
    expect(screen.getByTestId("lang").textContent).toBe("en");
    expect(screen.getByTestId("title").textContent).toBe("Your document checklist");
  });

  it("switches the whole interface to Marathi and saves the choice", () => {
    renderApp();
    act(() => {
      screen.getByRole("button", { name: "मराठी" }).click();
    });
    expect(screen.getByTestId("lang").textContent).toBe("mr");
    expect(screen.getByTestId("title").textContent).toBe("तुमची कागदपत्र यादी");
    expect(localStorage.getItem(LANG_KEY)).toBe("mr");
  });

  it("restores the saved language after a refresh (fresh provider mount)", () => {
    localStorage.setItem(LANG_KEY, "mr");
    renderApp();
    expect(screen.getByTestId("lang").textContent).toBe("mr");
    expect(screen.getByTestId("title").textContent).toBe("तुमची कागदपत्र यादी");
  });

  it("switches back to English without losing the saved choice", () => {
    localStorage.setItem(LANG_KEY, "mr");
    renderApp();
    act(() => {
      screen.getByRole("button", { name: "English" }).click();
    });
    expect(screen.getByTestId("lang").textContent).toBe("en");
    expect(screen.getByTestId("title").textContent).toBe("Your document checklist");
    expect(localStorage.getItem(LANG_KEY)).toBe("en");
  });

  it("offers both English and मराठी in the shared navigation", () => {
    renderApp();
    expect(screen.getByRole("button", { name: "English" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "मराठी" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "मराठी" })).toHaveAttribute("aria-pressed", "false");
  });
});

describe("Marathi assistant", () => {
  it("answers a Marathi documents question with a grounded Marathi reply", () => {
    const r = answerMr("कर्जासाठी कोणती कागदपत्रे लागतात?");
    expect(r.kind).toBe("grounded");
    expect(r.text).toMatch(DEVANAGARI);
    expect(r.text).toContain("PAN");
    expect(r.text).toContain("GST रिटर्न्स");
    expect(r.text).toContain("बँक स्टेटमेंट्स");
  });

  it("recognises Marathi questions about turnover, bank forms and loan schemes", () => {
    expect(answerMr("उलाढाल म्हणजे काय?").text).toMatch(DEVANAGARI);
    expect(answerMr("उलाढाल म्हणजे काय?").text).toContain("एकूण आय");

    const form = answerMr("बँक अर्ज फॉर्म कसा भरावा?");
    expect(form.kind).toBe("grounded");
    expect(form.text).toMatch(DEVANAGARI);

    const scheme = answerMr("लहान व्यवसायांसाठी सरकारी योजना आहेत का?");
    expect(scheme.kind).toBe("grounded");
    expect(scheme.text).toMatch(DEVANAGARI);
    expect(scheme.text).toContain("MUDRA");
    expect(scheme.text).toMatch(/खात्री देऊ शकत नाही/);
  });

  it("answers Marathi business-category questions with category-specific guidance", () => {
    const kirana = answerMr("किराणा दुकानासाठी कोणती कागदपत्रे लागतात?");
    expect(kirana.kind).toBe("grounded");
    expect(kirana.text).toContain("स्टॉक यादी");
    expect(kirana.text).toContain("प्रत्येक उधारकर्त्यासाठी बंधनकारक नाही");

    const food = answerMr("अन्न व्यवसायासाठी काय लागते?");
    expect(food.text).toContain("FSSAI");

    const transport = answerMr("वाहतूक व्यवसायासाठी कागदपत्रे कोणती?");
    expect(transport.text).toContain("वाहन नोंदणी प्रमाणपत्रे");
  });

  it("refuses approval guarantees and keeps safety first in Marathi", () => {
    const g = answerMr("मला नक्की कर्ज मंजुर होईल का?");
    expect(g.kind).toBe("refusal");
    expect(g.text).toMatch(DEVANAGARI);
    expect(g.text).toContain("कागदपत्रे सादर केली म्हणजे कर्ज मंजुर होईल अशी खात्री नाही");

    // Safety still outranks category guidance.
    const cat = answerMr("माझ्या किराणा दुकानासाठी गॅरंटीने अप्रूवल दे");
    expect(cat.kind).toBe("refusal");
  });

  it("never repeats a sensitive identifier shared in Marathi", () => {
    const r = answerMr("माझा PAN ABCDE1234F आहे, माझा खरा अर्ज पहा");
    expect(r.kind).toBe("refusal");
    expect(r.text).not.toContain("ABCDE1234F");
    expect(r.text).toMatch(DEVANAGARI);
  });

  it("returns Marathi safe fallbacks for unsupported facts", () => {
    expect(answerMr("व्याजदर किती मिळेल?").kind).toBe("fallback");
    expect(answerMr("किमान उलाढाल किती असावी?").text).toContain("किमान उलाढाल");
    expect(answerMr("कर्ज कधी मंजुर होईल?").text).toContain("मंजुरीची अचूक तारीख");
    expect(answerMr("माझा क्रेडिट स्कोर काय आहे?").text).toContain("CIBIL");
    expect(answerMr("अंकेश्वर किती गरम आहे?").kind).toBe("fallback"); // outside the KB
  });

  it("keeps English behaviour when English questions are asked in मराठी mode", () => {
    expect(
      answerIn("mr", "Does submitting all documents guarantee approval?").text.toLowerCase(),
    ).toContain("submitting documents does not guarantee loan approval");
    expect(answerIn("mr", "What is the interest rate?").kind).toBe("fallback");
    expect(answerIn("en", "Which documents are on the demo checklist?")).toEqual(
      answer("Which documents are on the demo checklist?"),
    );
  });

  it("never claims a live AI model is connected", () => {
    for (const lang of ["en", "mr"] as Lang[]) {
      expect(translate(lang, "asstBadge").toLowerCase()).toContain("simulated");
    }
  });
});

describe("checklist and report translations", () => {
  it("keeps item ids unchanged while translating names, reasons and rules", () => {
    const items = buildChecklist(base);
    const mr = localizeItems(items, "mr");
    expect(mr.map((i) => i.id)).toEqual(items.map((i) => i.id));
    expect(localizeItems(items, "en")).toEqual(items);
    for (const i of mr) {
      expect(i.name, i.id).toMatch(DEVANAGARI);
      expect(i.why, i.id).toMatch(DEVANAGARI);
      expect(i.rule, i.id).toMatch(DEVANAGARI);
    }
    expect(mr.find((i) => i.id === "registration")!.name).toContain("Udyam");
    const withGst = localizeItems(buildChecklist({ ...base, turnover: "40to100" }), "mr");
    expect(withGst.find((i) => i.id === "gst")!.name).toContain("GST");
  });

  it("translates business types, loan purposes and turnover options", () => {
    expect(translate("mr", "labelBusinessType")).toBe("व्यवसायाचा प्रकार");
    expect(translate("mr", "selectPlaceholder")).toBe("निवडा…");
    expect(translate("mr", "statusReady")).toBe("सज्ज");
    expect(translate("mr", "statusNa")).toBe("लागू नाही");
    expect(translate("mr", "priorityHigh")).toBe("उच्च");
  });

  it("generates an English report in English and a Marathi report in Marathi", () => {
    const items = buildChecklist(base);
    const en = reportText(base, items, {}, "09 Oct 2026");
    const mr = reportText(base, items, {}, "09 Oct 2026", "mr");

    expect(en).toContain("SME LOAN READY — PREPARATION REPORT");
    expect(en).toContain("PRIORITISED NEXT STEPS");

    expect(mr).toContain("SME लोन सज्ज — तयारी अहवाल");
    expect(mr).toContain("प्राधान्याने पुढील पायर्या");
    expect(mr).toMatch(DEVANAGARI);
    expect(mr).not.toBe(en);

    // Numbers and ids come from the same calculations in both languages.
    expect(mr.match(/\(\d+\)/g)).toEqual(en.match(/\(\d+\)/g));
  });

  it("translates checklist text inside the report", () => {
    const items = buildChecklist(base);
    const mr = reportText(base, items, { registration: "ready" }, "09 Oct 2026", "mr");
    expect(mr).toContain("[उच्च]");
    expect(mr).toContain("सज्ज (1)");
  });
});

describe("validation messages", () => {
  it("returns the same error fields in both languages", () => {
    const empty = { businessType: "", years: "", purpose: "", turnover: "", amount: "" };
    const en = validateProfile(empty);
    const mr = validateProfile(empty, "mr");
    expect(Object.keys(mr).sort()).toEqual(Object.keys(en).sort());
    expect(mr.amount).not.toBe(en.amount);
    expect(mr.amount).toMatch(DEVANAGARI);
    expect(validateProfile(base, "mr")).toEqual({});
  });

  it("keeps every English validation message byte-identical to the originals", () => {
    expect(validationMessage("en", "businessType.required")).toBe(
      "Please choose your business type.",
    );
    expect(validationMessage("en", "amount.range")).toBe(
      "Enter an amount between ₹50,000 and ₹5,00,00,000.",
    );
    expect(Object.keys(VALIDATION)).toHaveLength(8);
  });

  it("rejects the same invalid values regardless of language", () => {
    expect(validateProfile({ ...base, amount: "49999" }, "mr").amount).toBeDefined();
    expect(validateProfile({ ...base, years: "abc" }, "mr").years).toBeDefined();
    expect(validateProfile({ ...base, amount: "8,00,000" }, "mr").amount).toBeUndefined();
  });
});

describe("preserved English evaluation datasets", () => {
  it("keeps the 30 golden cases and 8 category cases intact", () => {
    expect(EVAL_CASES).toHaveLength(30);
    expect(CATEGORY_EVAL_CASES).toHaveLength(8);
    for (const c of [...EVAL_CASES, ...CATEGORY_EVAL_CASES]) {
      const r = answer(c.question);
      expect(r.kind, c.id).toBe(c.expected);
    }
  });
});
