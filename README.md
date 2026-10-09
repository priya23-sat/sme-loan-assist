# SME Loan Buddy

Build a clean, professional, responsive web application called SME Loan Application Copilot for an AI Product Manager portfolio project.
PURPOSE: Help fictional SME business owners understand their sample loan application status, required documents, and common loan-process questions.
DESIGN: Modern fintech dashboard, white background, navy blue accents, clear typography, simple cards, accessible contrast, responsive desktop and mobile layouts. Keep the interface professional and uncluttered.
PAGES/SECTIONS:
1. Dashboard: show fictional applicant 'ABC Traders', sample application ID SME-2026-1042, requested amount ₹25,00,000, and status 'Documents Pending'. Show a simple application progress tracker. Clearly mark all data as demo data.
2. Document Checklist: display sample documents such as PAN, business KYC, GST returns, bank statements, and financial statements. Show Submitted or Pending status. Allow the user to mark a pending item as submitted and update the progress indicator. Explain that requirements vary by bank and loan product.
3. AI Assistant: create a working chat interface for common questions about the document checklist, application stages, and general application process. Use a small fixed, clearly visible demo knowledge base and predefined grounded answers. Support common paraphrases. If the answer is not supported by the knowledge base, respond that the information is unavailable and direct the user to the bank's authorized representative. Never invent bank policies, guarantee approval, or make credit decisions. Label this as a simulated AI assistant; do not pretend a live AI API is connected.
4. Evaluation panel: show a small sample set of AI test cases with question, expected behavior, observed behavior, and pass/fail status. Include supported questions, missing-information questions, and an attempt to obtain a loan approval guarantee. Clearly label results as illustrative until tests are actually run.
FUNCTIONAL REQUIREMENTS: Navigation must work. Checklist controls must update state. Chat messages must appear in the conversation and return the appropriate predefined grounded response or safe fallback. The evaluation panel must be readable. Use fictional sample data only. No login, payments, real customer data, real credit bureau data, external API, or database integration in this first version.
PRODUCT SAFETY: Display a notice that this is an educational portfolio prototype, not a real banking service or loan eligibility tool. Do not collect sensitive personal information. Never represent document submission as loan approval.
Keep the code and application structure simple. Prioritize working interactions over decorative features. Build this first version without adding unnecessary features.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sme-loan-assist.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f103ff76-9608-4f77-a64e-2ba98f509131).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
