-- Run this in Supabase SQL Editor if inserts work but updates leave columns null.
-- Symptom: PATCH returns Content-Range: */0 (zero rows updated) for anon role.

-- Remove legacy/conflicting policies (safe to re-run)
drop policy if exists "Allow update own row" on public.participants;
drop policy if exists "Allow update for all" on public.participants;
drop policy if exists "Allow insert for all" on public.participants;
drop policy if exists "Deny select for all" on public.participants;
drop policy if exists "Allow select for instructor dashboard" on public.participants;

alter table public.participants enable row level security;

create policy "Allow insert for all"
  on public.participants for insert
  to anon, authenticated
  with check (true);

create policy "Allow update for all"
  on public.participants for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "Deny select for all"
  on public.participants for select
  to anon, authenticated
  using (false);

grant usage on schema public to anon, authenticated;
grant insert, update on table public.participants to anon, authenticated;
