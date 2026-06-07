-- Revoke direct REST UPDATE on participants; writes use RPCs only.
--
-- Replaces the permissive "Allow update by session id" policy (using true / with check true)
-- with an explicit deny and revokes table-level UPDATE from anon/authenticated.
-- register_participant and update_participant (security definer) are unchanged.
--
-- Run in Supabase SQL Editor on existing deployments, then verify:
--   node scripts/verify-participants-db.mjs
--
-- Fresh deployments: use supabase/setup.sql (includes this policy model).

alter table public.participants enable row level security;

drop policy if exists "Allow update own row"              on public.participants;
drop policy if exists "Allow update for all"              on public.participants;
drop policy if exists "Allow update with session secret"  on public.participants;
drop policy if exists "Allow update by session id"        on public.participants;
drop policy if exists "Deny update for anon"              on public.participants;

create policy "Deny update for anon"
  on public.participants for update
  to anon, authenticated
  using (false);

grant usage on schema public to anon, authenticated;
revoke insert, update on table public.participants from anon, authenticated;
