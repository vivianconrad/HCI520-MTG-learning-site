-- Run this in Supabase SQL Editor if inserts work but updates leave columns null.
-- Symptom: PATCH returns Content-Range: */0 (zero rows updated) for anon role.
-- Applies the same secure RLS policies as participants.sql (session_secret header required for UPDATE).

-- Remove legacy/conflicting policies (safe to re-run)
drop policy if exists "Allow update own row" on public.participants;
drop policy if exists "Allow update for all" on public.participants;
drop policy if exists "Allow update with session secret" on public.participants;
drop policy if exists "Allow insert for all" on public.participants;
drop policy if exists "Deny select for all" on public.participants;
drop policy if exists "Allow select for instructor dashboard" on public.participants;

alter table public.participants enable row level security;

create policy "Allow insert for all"
  on public.participants for insert
  to anon, authenticated
  with check (
    session_secret is not null
    and length(trim(session_secret)) > 0
  );

create policy "Allow update with session secret"
  on public.participants for update
  to anon, authenticated
  using (
    (current_setting('request.headers', true)::json->>'x-session-secret') = session_secret
  )
  with check (
    (current_setting('request.headers', true)::json->>'x-session-secret') = session_secret
  );

create policy "Deny select for all"
  on public.participants for select
  to anon, authenticated
  using (false);

grant usage on schema public to anon, authenticated;
grant insert, update on table public.participants to anon, authenticated;
