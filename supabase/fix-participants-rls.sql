-- Run in Supabase SQL Editor when PATCH returns Content-Range: */0 (zero rows updated).
-- Symptom: participant row exists but anon UPDATE is blocked (missing/wrong x-session-secret header).
--
-- Does NOT re-open anon INSERT or SELECT. After validate-participant-data.sql, inserts use
-- register_participant() RPC only.

drop policy if exists "Allow update own row" on public.participants;
drop policy if exists "Allow update for all" on public.participants;
drop policy if exists "Allow update with session secret" on public.participants;
drop policy if exists "Allow insert for all" on public.participants;
drop policy if exists "Deny select for all" on public.participants;
drop policy if exists "Allow select for instructor dashboard" on public.participants;

alter table public.participants enable row level security;

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
grant update on table public.participants to anon, authenticated;
revoke insert on table public.participants from anon, authenticated;
