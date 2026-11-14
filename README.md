# SME Loan Ready

**A bilingual (English and Marathi) preparation guide that helps small-business owners get ready for a conversation with a bank about business finance.**

**Preview app:** https://sme-loan-assist-nau92lisg-priya23-sat.vercel.app/

## The problem

Small-business owners may be unsure which documents to gather, how to explain their funding need, or what to ask when they visit a bank. SME Loan Ready makes the preparation journey easier to understand before that conversation.

## What the prototype does

- **Business profile:** asks for approximate, non-sensitive information about the business, operating history, funding purpose and requested amount.
- **Document checklist:** creates a practical, prioritised preparation checklist based on the profile, including age-appropriate document guidance.
- **Before the bank:** helps owners prepare questions and understand what to clarify with an authorised bank representative.
- **Business finance learning:** provides general educational information to help users understand common business-finance concepts.
- **Preparation progress and report:** lets users track documents marked ready and view a preparation summary.
- **English and Marathi:** supports a bilingual experience for users who are more comfortable preparing in Marathi.

## Intended users

Small-business owners and micro-enterprises who want to prepare for a bank conversation about business finance.

## Product boundaries and safety

SME Loan Ready is an **educational preparation guide**, not a bank, lender, loan application portal, eligibility checker or credit decision system.

- It does not approve, reject or recommend a loan.
- It does not guarantee funding or predict approval.
- Document requirements and loan terms vary by bank, lender, product and scheme; users should confirm the exact requirements with an authorised representative.
- Use demo information only. Do not enter PAN, Aadhaar, passwords, OTPs, bank-account details or other sensitive personal information.
- Readiness progress indicates preparation activity only; it does not indicate loan eligibility or approval.

## Early user discovery

The product direction was informed by conversations with small-business owners. Early feedback highlighted three practical barriers:

- Anxiety about what bank staff may ask and how to answer.
- A misconception that formal business loans are only for large businesses.
- Uncertainty about how recurring stock purchases and working-capital needs can be discussed with a bank.

These are qualitative discovery insights, not statistically representative findings.

## Technology

- React 19 and TypeScript
- Vite
- TanStack Router / TanStack Start
- Tailwind CSS
- Vitest and Testing Library

## Run locally

Requirements: Node.js and npm.

```bash
git clone https://github.com/priya23-sat/sme-loan-assist.git
cd sme-loan-assist
npm install
npm run dev
```

## Quality checks

```bash
npm run test
npm run build
```

The current resubmission branch was locally verified with **17 automated tests passing** and a successful production build. Run the commands above again after making changes.

## Repository workflow

The resubmission work is on the `mentor-resubmission` branch. Review the pull request into `main` before merging. The live Production deployment should only be updated after the preview has been reviewed and approved.
