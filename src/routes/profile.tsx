import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Truck } from "lucide-react";
import { Card } from "@/components/shell";
import { StepBar } from "@/components/journey";
import { useReadiness } from "@/lib/readiness-state";
import { BUSINESS_AGES, BUSINESS_TYPES, EMPTY_PROFILE, LOAN_PURPOSES, TURNOVER_RANGES, validateProfile, type Profile, type ProfileErrors } from "@/lib/readiness";
import { useLanguage, text, type CopyKey } from "@/lib/language";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Business Details — SME Loan Ready" },
      { name: "description", content: "Share basic business details to prepare a sample small-business loan document checklist." },
      { property: "og:title", content: "Business Details — SME Loan Ready" },
      { property: "og:description", content: "Share basic business details and explore a sample preparation list." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { language } = useLanguage();
  const t = (key: CopyKey) => text(language, key);
  const { loaded, profile, saveProfile } = useReadiness();
  const navigate = useNavigate();
  const [form, setForm] = useState<Profile>(EMPTY_PROFILE);
  const [errors, setErrors] = useState<ProfileErrors>({});

  useEffect(() => { if (loaded && profile) setForm(profile); }, [loaded, profile]);

  const set = (k: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateProfile(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(`f-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    saveProfile({ ...form, years: form.years.trim(), amount: form.amount.replace(/[,\s₹]/g, "") });
    navigate({ to: "/checklist" });
  };

  return (
    <div className="space-y-6">
      <StepBar current={0} />
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold"><Truck className="h-6 w-6 text-primary" /> {t("profileTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("profileSubtitle")}</p>
      </div>
      <Card className="border-primary/20 bg-tint">
        <h2 className="font-semibold">{t("profileHelpTitle")}</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{t("profileHelp")}</p>
      </Card>
      <Card>
        <form onSubmit={submit} noValidate className="space-y-4">
          <Select id="businessType" label={t("businessType")} value={form.businessType} onChange={set("businessType")} options={BUSINESS_TYPES.map(({ value }) => ({ value, label: t(value as CopyKey) }))} error={errors.businessType ? t("errBusiness") : undefined} emptyLabel={t("choose")} />
          <Select id="years" label={t("businessAge")} value={form.years} onChange={set("years")} options={BUSINESS_AGES.map(({ value }) => ({ value, label: t(({ "0": "ageUnder1", "2": "age1to3", "4": "age3to5", "6": "ageOver5" } as Record<string, CopyKey>)[value]) }))} error={errors.years ? t("errAge") : undefined} emptyLabel={t("choose")} />
          <Select id="purpose" label={t("loanPurpose")} value={form.purpose} onChange={set("purpose")} options={LOAN_PURPOSES.map(({ value }) => ({ value, label: t(({ expansion: "purposeExpansion", equipment: "purposeEquipment", working_capital: "purposeWorking", stock: "purposeStock", other: "purposeOther" } as Record<string, CopyKey>)[value]) }))} error={errors.purpose ? t("errPurpose") : undefined} emptyLabel={t("choose")} />
          <Select id="turnover" label={t("turnover")} value={form.turnover} onChange={set("turnover")} options={TURNOVER_RANGES.map(({ value }) => ({ value, label: t(({ lt10: "turnoverLt10", "10to40": "turnover10to40", "40to100": "turnover40to100", gt100: "turnoverGt100" } as Record<string, CopyKey>)[value]) }))} error={errors.turnover ? t("errTurnover") : undefined} emptyLabel={t("choose")} />
          <Field id="amount" label={t("amount")} error={errors.amount ? t("errAmount") : undefined} hint={t("amountHint")}>
            <input id="f-amount" inputMode="numeric" value={form.amount} onChange={set("amount")} placeholder={language === "mr" ? "उदा. ८०००००" : "e.g. 800000"} className={inputCls(errors.amount)} aria-invalid={!!errors.amount} aria-describedby={errors.amount ? "e-amount" : undefined} />
          </Field>
          <button type="submit" className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:w-auto">
            {profile ? t("profileUpdate") : t("profileContinue")}
          </button>
        </form>
      </Card>
    </div>
  );
}

const inputCls = (err?: string) =>
  `mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${err ? "border-destructive" : "border-input"}`;

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string | undefined; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={`f-${id}`} className="text-sm font-medium">{label} <span className="text-destructive">*</span></label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {error && <p id={`e-${id}`} className="mt-1 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

function Select({ id, label, value, onChange, options, error, emptyLabel }: {
  id: string; label: string; value: string; error?: string | undefined;
  emptyLabel?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: readonly { value: string; label: string }[];
}) {
  const { language } = useLanguage();
  return (
    <Field id={id} label={label} error={error}>
      <select id={`f-${id}`} value={value} onChange={onChange} className={inputCls(error)} aria-invalid={!!error} aria-describedby={error ? `e-${id}` : undefined}>
        <option value="">{emptyLabel ?? text(language, "choose")}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Field>
  );
}
