-- SME Loan Buddy 2.0: private borrower document storage.
-- Run this migration in the Supabase SQL Editor before enabling cloud uploads.

create table if not exists public.loan_documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  checklist_id text not null,
  file_name text not null,
  mime_type text not null check (mime_type in ('application/pdf', 'image/jpeg', 'image/png')),
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 10485760),
  storage_path text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists loan_documents_owner_created_idx
  on public.loan_documents (owner_id, created_at desc);

alter table public.loan_documents enable row level security;

drop policy if exists "Borrowers read their own document records" on public.loan_documents;
create policy "Borrowers read their own document records"
  on public.loan_documents for select to authenticated
  using (owner_id = (select auth.uid()));

drop policy if exists "Borrowers add their own document records" on public.loan_documents;
create policy "Borrowers add their own document records"
  on public.loan_documents for insert to authenticated
  with check (owner_id = (select auth.uid()));

drop policy if exists "Borrowers delete their own document records" on public.loan_documents;
create policy "Borrowers delete their own document records"
  on public.loan_documents for delete to authenticated
  using (owner_id = (select auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('sme-loan-documents', 'sme-loan-documents', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png'])
on conflict (id) do update
set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Borrowers read their own stored documents" on storage.objects;
create policy "Borrowers read their own stored documents"
  on storage.objects for select to authenticated
  using (bucket_id = 'sme-loan-documents' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "Borrowers upload their own stored documents" on storage.objects;
create policy "Borrowers upload their own stored documents"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'sme-loan-documents' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "Borrowers delete their own stored documents" on storage.objects;
create policy "Borrowers delete their own stored documents"
  on storage.objects for delete to authenticated
  using (bucket_id = 'sme-loan-documents' and (storage.foldername(name))[1] = (select auth.uid())::text);
