import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Store } from "lucide-react";
import { Card } from "@/components/shell";
import { StepBar } from "@/components/journey";
import { useReadiness } from "@/lib/readiness-state";
import { useLanguage } from "@/lib/language";
import {
  BUSINESS_TYPES,
  EMPTY_PROFILE,
  LOAN_PURPOSES,
  TURNOVER_RANGES,
  validateProfile,
  type Profile,
  type ProfileErrors,
} from "@/lib/readiness";
import { MR_BUSINESS_TYPES, MR_LOAN_PURPOSES, MR_TURNOVER_RANGES } from "@/lib/i18n";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Business Profile — SME Loan Ready" },
      {
        name: "description",
        content: "Tell us about your business to get a personalised loan document checklist.",
      },
      { property: "og:title", content: "Business Profile — SME Loan Ready" },
      { property: "og:description", content: "Step 1: describe your business and loan need." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { loaded, profile, saveProfile } = useReadiness();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState<Profile>(EMPTY_PROFILE);
  const [errors, setErrors] = useState<ProfileErrors>({});

  useEffect(() => {
    if (loaded && profile) setForm(profile);
  }, [loaded, profile]);

  const set =
    (k: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
      if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
    };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateProfile(form, lang);
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
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <Store className="h-6 w-6 text-primary" /> {t("profileTitle")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("profileIntro")}</p>
      </div>
      <Card className="border-primary/20 bg-tint">
        <h2 className="font-semibold">{t("profileHelpTitle")}</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{t("profileHelpBody")}</p>
      </Card>
      <Card>
        <form onSubmit={submit} noValidate className="space-y-4">
          <Select
            id="businessType"
            label={t("labelBusinessType")}
            value={form.businessType}
            onChange={set("businessType")}
            options={BUSINESS_TYPES}
            error={errors.businessType}
            placeholder={t("selectPlaceholder")}
          />
          <Field id="years" label={t("labelYears")} error={errors.years}>
            <input
              id="f-years"
              inputMode="numeric"
              value={form.years}
              onChange={set("years")}
              placeholder={t("placeholderYears")}
              className={inputCls(errors.years)}
              aria-invalid={!!errors.years}
              aria-describedby={errors.years ? "e-years" : undefined}
            />
          </Field>
          <Select
            id="purpose"
            label={t("labelPurpose")}
            value={form.purpose}
            onChange={set("purpose")}
            options={LOAN_PURPOSES}
            error={errors.purpose}
            placeholder={t("selectPlaceholder")}
          />
          <Select
            id="turnover"
            label={t("labelTurnover")}
            value={form.turnover}
            onChange={set("turnover")}
            options={TURNOVER_RANGES}
            error={errors.turnover}
            placeholder={t("selectPlaceholder")}
          />
          <Field id="amount" label={t("labelAmount")} error={errors.amount} hint={t("amountHint")}>
            <input
              id="f-amount"
              inputMode="numeric"
              value={form.amount}
              onChange={set("amount")}
              placeholder={t("placeholderAmount")}
              className={inputCls(errors.amount)}
              aria-invalid={!!errors.amount}
              aria-describedby={errors.amount ? "e-amount" : undefined}
            />
          </Field>
          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:w-auto"
          >
            {profile ? t("btnUpdate") : t("btnBuild")}
          </button>
        </form>
      </Card>
    </div>
  );
}

const inputCls = (err?: string) =>
  `mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${err ? "border-destructive" : "border-input"}`;

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={`f-${id}`} className="text-sm font-medium">
        {label} <span className="text-destructive">*</span>
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p id={`e-${id}`} className="mt-1 text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function Select({
  id,
  label,
  value,
  onChange,
  options,
  error,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  error?: string | undefined;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: readonly { value: string; label: string }[];
}) {
  const { lang } = useLanguage();
  const text = (o: { value: string; label: string }) =>
    lang === "en"
      ? o.label
      : (MR_BUSINESS_TYPES[o.value] ??
        MR_LOAN_PURPOSES[o.value] ??
        MR_TURNOVER_RANGES[o.value] ??
        o.label);
  return (
    <Field id={id} label={label} error={error}>
      <select
        id={`f-${id}`}
        value={value}
        onChange={onChange}
        className={inputCls(error)}
        aria-invalid={!!error}
        aria-describedby={error ? `e-${id}` : undefined}
      >
        <option value="">{placeholder ?? "Select…"}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {text(o)}
          </option>
        ))}
      </select>
    </Field>
  );
}
