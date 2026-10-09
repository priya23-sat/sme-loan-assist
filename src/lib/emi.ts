/** Illustrative EMI using standard reducing-balance formula. Not an offer. */
export function emi(principal: number, annualRatePct: number, months: number): number {
  const r = annualRatePct / 12 / 100;
  if (months <= 0) return 0;
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
