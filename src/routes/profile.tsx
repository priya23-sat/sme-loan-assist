import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Truck } from "lucide-react";
import { Card } from "@/components/shell";
import { StepBar } from "@/components/journey";
import { useReadiness } from "@/lib/readiness-state";
import { BUSINESS_TYPES, EMPTY_PROFILE, LOAN_PURPOSES, TURNOVER_RANGES, validateProfile, type Profile, type ProfileErrors } from "@/lib/readiness";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Business Profile — SME Loan Ready" },
      { name: "description", content: "Tell us about your transport business to get a personalised loan document checklist." },
      { property: "og:title", content: "Business Profile — SME Loan Ready" },
      { property: "og:description", content: "Step 1: describe your transport business and loan need." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
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
        <h1 className="flex items-center gap-2 text-2xl font-semibold"><Truck className="h-6 w-6 text-primary" /> Business profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">For small transport businesses preparing to approach a bank or lender. No personal or ID details are needed. Your answers stay in this browser.</p>
      </div>
      <Card>
        <form onSubmit={submit} noValidate className="space-y-4">
          <Select id="businessType" label="Business type" value={form.businessType} onChange={set("businessType")} options={BUSINESS_TYPES} error={errors.businessType} />
          <Field id="years" label="Years in operation" error={errors.years}>
            <input id="f-years" inputMode="numeric" value={form.years} onChange={set("years")} placeholder="e.g. 4" className={inputCls(errors.years)} aria-invalid={!!errors.years} aria-describedby={errors.years ? "e-years" : undefined} />
          </Field>
          <Select id="purpose" label="Loan purpose" value={form.purpose} onChange={set("purpose")} options={LOAN_PURPOSES} error={errors.purpose} />
          <Select id="turnover" label="Approximate yearly turnover" value={form.turnover} onChange={set("turnover")} options={TURNOVER_RANGES} error={errors.turnover} />
          <Field id="amount" label="Requested loan amount (₹)" error={errors.amount} hint="Between ₹50,000 and ₹5 crore">
            <input id="f-amount" inputMode="numeric" value={form.amount} onChange={set("amount")} placeholder="e.g. 800000" className={inputCls(errors.amount)} aria-invalid={!!errors.amount} aria-describedby={errors.amount ? "e-amount" : undefined} />
          </Field>
          <button type="submit" className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 sm:w-auto">
            {profile ? "Update and view checklist" : "Build my checklist"}
          </button>
        </form>
      </Card>
    </div>
  );
}

const inputCls = (err?: string) =>
  `mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${err ? "border-destructive" : "border-input"}`;

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={`f-${id}`} className="text-sm font-medium">{label} <span className="text-destructive">*</span></label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {error && <p id={`e-${id}`} className="mt-1 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

function Select({ id, label, value, onChange, options, error }: {
  id: string; label: string; value: string; error?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: readonly { value: string; label: string }[];
}) {
  return (
    <Field id={id} label={label} error={error}>
      <select id={`f-${id}`} value={value} onChange={onChange} className={inputCls(error)} aria-invalid={!!error} aria-describedby={error ? `e-${id}` : undefined}>
        <option value="">Select…</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Field>
  );
}
