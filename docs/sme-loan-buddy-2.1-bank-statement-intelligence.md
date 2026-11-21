# SME Loan Buddy 2.1 — Bank Statement Intelligence

## Release scope

The first release supports one agreed Indian bank statement layout, with both selectable-text PDFs and scanned/image-only PDFs. The bank format is configured behind a parser adapter so additional formats can be added without changing the domain contract.

### User outcome

A borrower or authorised reviewer can turn an uploaded statement into a structured transaction list and monthly cash-flow summary, then inspect and correct uncertain values against the original document.

### Explicit exclusions

- No loan eligibility, approval, rejection or automated credit score.
- No automated lending recommendation.
- No production use of real borrower statements during the portfolio prototype stage.
- No OCR/LLM provider selected until privacy, retention, data residency, accuracy and cost have been evaluated.

## Processing architecture

1. The signed-in user selects a PDF already held in the private `sme-loan-documents` vault.
2. An authenticated server-side function verifies ownership of the source document and creates an analysis job.
3. The processing adapter determines whether selectable text is available.
4. Text-based statements use a deterministic parser for the first supported layout. Scanned PDFs use a replaceable OCR adapter.
5. Both paths return the same validated extraction contract.
6. Normalisation and arithmetic reconciliation run before persistence.
7. Transactions and monthly summaries are stored under the document owner's RLS scope.
8. The user reviews uncertain rows and confirms corrections before the analysis can be marked verified.

## Data model

The migration `supabase/migrations/20261121010000_sme_loan_statement_intelligence.sql` adds:

- `statement_analyses`: one analysis record per source document, extraction method, processing status, statement period, INR opening/closing balances and safe error code.
- `statement_transactions`: extracted date, original description, reference hint, debit, credit, running balance, category, confidence, source page/row and review status.
- `statement_monthly_summaries`: monthly credits/debits, average/minimum/closing balances, transaction count and reconciliation result.

The existing `loan_documents` record remains the source of truth for the original private PDF. Composite foreign keys bind each analysis and child record to the same owner. RLS policies restrict every table to `auth.uid()`.

### Data handling

- Store INR amounts as PostgreSQL `numeric(18,2)`, not floating-point values.
- Store only masked/reference hints where possible; do not extract or persist full account numbers unless a later, justified requirement is approved.
- Never log statement text, account identifiers or transaction narration in application logs.
- Keep OCR/AI provider secrets on the server.
- Apply file-size, page-count, processing-time and rate limits.
- Provide deletion that removes derived analysis rows and respects the original document lifecycle.
- Preserve source page/row provenance so every extracted field can be checked against the PDF.

## Reconciliation and review rules

- Validate opening balance + credits - debits against closing balance when the statement's convention and coverage make this calculation valid.
- Flag, rather than silently repair, balance mismatches, ambiguous rows, low-confidence values, duplicate-looking transactions and unsupported formats.
- A model confidence score is a review signal, not a guarantee of correctness.
- Only a human reviewer can mark extracted transactions verified.

## Initial acceptance targets

These are targets to measure on synthetic fixtures, not claimed results:

- At least 95% transaction-row extraction accuracy on the first supported layout.
- 100% arithmetic reconciliation on complete, correctly extracted fixture statements.
- Every uncertain/unsupported row is visible for review.
- No cross-user access to source documents, analyses, transactions or summaries.
- No silent transaction drops or unexplained duplicate rows.

## Delivery sequence

1. Data model and extraction contract.
2. Synthetic text-PDF and scanned-PDF fixtures with expected JSON.
3. Deterministic parser for the first layout.
4. OCR adapter interface and provider evaluation.
5. Authenticated processing function and analysis status.
6. Transaction review UI, monthly dashboard and bilingual labels.
7. Security, reconciliation, deletion and regression testing.

## Current implementation status

- [x] Dedicated feature branch created from the SME Loan Buddy 2.0 document-vault feature branch.
- [x] Initial database migration committed to the 2.1 branch.
- [x] Initial GitHub development issues created.
- [ ] Migration reviewed and applied to a development Supabase environment.
- [ ] Extraction contract, synthetic fixtures and parser implemented.
- [ ] OCR provider evaluated and selected.
- [ ] End-to-end preview tested.

## Safety boundary

Use synthetic statements only during development. Do not upload real customer statements to this portfolio prototype. This system is a document-analysis aid, not a regulated credit-decision engine or a production banking service.
