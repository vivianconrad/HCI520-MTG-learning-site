-- Fix participant save failures after security hardening.
--
-- Symptom: app shows "We could not save your answers to the server" even though
-- register_participant RPC succeeds.
--
-- Causes addressed:
--   1. Header-based UPDATE RLS never matches on Supabase Cloud (custom headers stripped).
--   2. deny-SELECT RLS blocks REST PATCH even when UPDATE policy allows it.
--   3. Current app saves via update_participant RPC (security definer), which must exist.
--
-- README entry point. Same RLS section as:
--   supabase/migrations/fix-update-rls-after-security.sql
--
-- For score validation triggers and register_participant, re-run supabase/setup.sql.
-- Verify: node scripts/verify-participants-db.mjs

-- ---------------------------------------------------------------------------
-- Private session-secret hashing (idempotent; included in setup.sql)
-- ---------------------------------------------------------------------------
create extension if not exists pgcrypto with schema extensions;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to postgres, service_role;

create or replace function private.hash_session_secret(p_secret text)
returns text
language sql
immutable
set search_path = private, extensions
as $$
  select encode(extensions.digest(p_secret, 'sha256'), 'hex');
$$;

drop function if exists public.hash_session_secret(text);

-- ---------------------------------------------------------------------------
-- Row-level security (replace header-based UPDATE policy)
-- ---------------------------------------------------------------------------alter table public.participants enable row level security;

drop policy if exists "Allow update own row"              on public.participants;
drop policy if exists "Allow update for all"              on public.participants;
drop policy if exists "Allow update with session secret"  on public.participants;
drop policy if exists "Allow update by session id"        on public.participants;
drop policy if exists "Deny update for anon"              on public.participants;
drop policy if exists "Allow insert for all"              on public.participants;
drop policy if exists "Deny select for all"               on public.participants;
drop policy if exists "Allow select for instructor dashboard" on public.participants;

create policy "Deny update for anon"
  on public.participants for update
  to anon, authenticated
  using (false);

create policy "Deny select for all"
  on public.participants for select
  to anon, authenticated
  using (false);

grant usage on schema public to anon, authenticated;
revoke insert, update on table public.participants from anon, authenticated;

-- ---------------------------------------------------------------------------
-- RPC: update_participant
-- Security definer UPDATE bypassing deny-SELECT RLS; validates session_secret.
-- ---------------------------------------------------------------------------
create or replace function public.update_participant(
  p_session_id     text,
  p_session_secret text,
  p_patch          jsonb
) returns boolean
language plpgsql
security definer
set search_path = public, private, extensions
as $$
declare
  updated int;
  secret_hash text := private.hash_session_secret(p_session_secret);
begin
  if p_session_id is null or length(trim(p_session_id)) = 0
     or p_session_secret is null or length(trim(p_session_secret)) = 0
     or p_patch is null or p_patch = '{}'::jsonb then
    return false;
  end if;

  update public.participants
  set
    pretest_answers = case when p_patch ? 'pretest_answers'
      then p_patch->'pretest_answers' else pretest_answers end,
    pretest_score = case when p_patch ? 'pretest_score'
      then (p_patch->>'pretest_score')::integer else pretest_score end,
    posttest_answers = case when p_patch ? 'posttest_answers'
      then p_patch->'posttest_answers' else posttest_answers end,
    posttest_score = case when p_patch ? 'posttest_score'
      then (p_patch->>'posttest_score')::integer else posttest_score end,
    screens_time = case when p_patch ? 'screens_time'
      then p_patch->'screens_time' else screens_time end,
    lessons_completed = case when p_patch ? 'lessons_completed'
      then (p_patch->>'lessons_completed')::boolean else lessons_completed end,
    scenarios_attempted = case when p_patch ? 'scenarios_attempted'
      then (p_patch->>'scenarios_attempted')::integer else scenarios_attempted end,
    completed_at = case when p_patch ? 'completed_at'
      then (p_patch->>'completed_at')::timestamptz else completed_at end,
    curiosity_focus = case when p_patch ? 'curiosity_focus'
      then p_patch->>'curiosity_focus' else curiosity_focus end,
    posttest_readiness = case when p_patch ? 'posttest_readiness'
      then (p_patch->>'posttest_readiness')::integer else posttest_readiness end
  where session_id = p_session_id and session_secret = secret_hash;

  get diagnostics updated = row_count;
  return updated > 0;
end;
$$;

revoke all    on function public.update_participant(text, text, jsonb) from public;
grant execute on function public.update_participant(text, text, jsonb) to anon, authenticated;
