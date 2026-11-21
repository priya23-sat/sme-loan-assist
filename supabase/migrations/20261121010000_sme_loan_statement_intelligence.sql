-- SME Loan Buddy 2.1: bank statement analysis data model.
-- Stores extracted data only; original statements remain in the private document vault.
-- All borrower-owned rows are protected by RLS and composite ownership foreign keys.

create unique index if not exists loan_documents_id_owner_uidx
  on public.loan_documents (id, owner_id);

create table if not exists public.statement_analyses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  source_document_id uuid not null,
  bank_format_key text not null,
  extraction_method text not null default 'pdf_text'
    check (extraction_method in ('pdf_text', 'ocr', 'mixed')),
  status text not null default 'queued'
    check (status in ('queued', 'processing', 'review_required', 'verified', 'failed')),
  statement_start_date date,
  statement_end_date date,
  currency_code text not null default 'INR'
    check (currency_code = 'INR'),
  opening_balance numeric(18,2),
  closing_balance numeric(18,2),
  error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  constraint statement_analyses_period_check
    check (statement_start_date is null or statement_end_date is null or statement_end_date >= statement_start_date),
  constraint statement_analyses_document_owner_fk
    foreign key (source_document_id, owner_id)
    references public.loan_documents (id, owner_id) on delete cascade,
  constraint statement_analyses_document_once unique (source_document_id),
  constraint statement_analyses_id_owner_unique unique (id, owner_id)
);

create table if not exists public.statement_transactions (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  transaction_date date not null,
  description text not null,
  reference_hint text,
  debit numeric(18,2) not null default 0 check (debit >= 0),
  credit numeric(18,2) not null default 0 check (credit >= 0),
  balance numeric(18,2),
  category text,
  confidence numeric(4,3) check (confidence between 0 and 1),
  source_page integer check (source_page is null or source_page > 0),
  source_row_index integer check (source_row_index is null or source_row_index > 0),
  review_status text not null default 'unreviewed'
    check (review_status in ('unreviewed', 'verified', 'corrected', 'needs_review')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint statement_transactions_one_side_check
    check (debit = 0 or credit = 0),
  constraint statement_transactions_analysis_owner_fk
    foreign key (analysis_id, owner_id)
    references public.statement_analyses (id, owner_id) on delete cascade
);

create table if not exists public.statement_monthly_summaries (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  month_start date not null,
  total_credits numeric(18,2) not null default 0 check (total_credits >= 0),
  total_debits numeric(18,2) not null default 0 check (total_debits >= 0),
  average_balance numeric(18,2),
  minimum_balance numeric(18,2),
  closing_balance numeric(18,2),
  transaction_count integer not null default 0 check (transaction_count >= 0),
  reconciliation_status text not null default 'pending'
    check (reconciliation_status in ('pending', 'matched', 'mismatch', 'not_available')),
  reconciliation_delta numeric(18,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint statement_monthly_summaries_month_unique unique (analysis_id, month_start),
  constraint statement_monthly_summaries_analysis_owner_fk
    foreign key (analysis_id, owner_id)
    references public.statement_analyses (id, owner_id) on delete cascade
);

create index if not exists statement_analyses_owner_created_idx
  on public.statement_analyses (owner_id, created_at desc);
create index if not exists statement_transactions_analysis_date_idx
  on public.statement_transactions (analysis_id, transaction_date);
create index if not exists statement_transactions_owner_date_idx
  on public.statement_transactions (owner_id, transaction_date desc);
create index if not exists statement_monthly_summaries_analysis_month_idx
  on public.statement_monthly_summaries (analysis_id, month_start);

alter table public.statement_analyses enable row level security;
alter table public.statement_transactions enable row level security;
alter table public.statement_monthly_summaries enable row level security;

revoke all on public.statement_analyses from anon;
revoke all on public.statement_transactions from anon;
revoke all on public.statement_monthly_summaries from anon;

grant select, insert, update, delete on public.statement_analyses to authenticated;
grant select, insert, update, delete on public.statement_transactions to authenticated;
grant select, insert, update, delete on public.statement_monthly_summaries to authenticated;

drop policy if exists "Borrowers access their own statement analyses" on public.statement_analyses;
create policy "Borrowers access their own statement analyses"
  on public.statement_analyses for all to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

drop policy if exists "Borrowers access their own statement transactions" on public.statement_transactions;
create policy "Borrowers access their own statement transactions"
  on public.statement_transactions for all to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

drop policy if exists "Borrowers access their own statement summaries" on public.statement_monthly_summaries;
create policy "Borrowers access their own statement summaries"
  on public.statement_monthly_summaries for all to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));
