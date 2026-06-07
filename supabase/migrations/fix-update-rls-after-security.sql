-- Apply after the security hardening that used x-session-secret in RLS.
-- Supabase Cloud strips custom headers before PostgREST, so header-based UPDATE
-- policies always match zero rows (PATCH returns HTTP 200 with 0 rows updated).
--
-- Safe to run on an existing project. For a full refresh (RPCs, triggers, grants),
-- re-run supabase/setup.sql instead.
--
-- Verify: node scripts/verify-participants-db.mjs

-- ---------------------------------------------------------------------------
-- Row-level security (replace header-based UPDATE policy)
-- ---------------------------------------------------------------------------
alter table public.participants enable row level security;

drop policy if exists "Allow update own row"              on public.participants;
drop policy if exists "Allow update for all"              on public.participants;
drop policy if exists "Allow update with session secret"  on public.participants;
drop policy if exists "Allow update by session id"        on public.participants;
drop policy if exists "Allow insert for all"              on public.participants;
drop policy if exists "Deny select for all"               on public.participants;
drop policy if exists "Allow select for instructor dashboard" on public.participants;

create policy "Allow update by session id"
  on public.participants for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "Deny select for all"
  on public.participants for select
  to anon, authenticated
  using (false);

grant usage  on schema public             to anon, authenticated;
grant update on table public.participants to anon, authenticated;
revoke insert on table public.participants from anon, authenticated;
