-- Hash session_secret at rest (SHA-256 hex). Clients still send the plaintext secret;
-- RPCs hash the provided value before compare/insert.
--
-- For fresh projects, supabase/setup.sql already includes this. Run this migration
-- once on existing deployments that still store plaintext session_secret.
create extension if not exists pgcrypto with schema extensions;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to postgres, service_role;

create table if not exists public.schema_migrations_applied (
  name text primary key,
  applied_at timestamptz not null default now()
);

create or replace function private.hash_session_secret(p_secret text)
returns text
language sql
immutable
set search_path = private, extensions
as $$
  select encode(extensions.digest(p_secret, 'sha256'), 'hex');
$$;

drop function if exists public.hash_session_secret(text);

do $$
begin
  if exists (select 1 from public.schema_migrations_applied where name = 'hash-session-secret') then
    raise notice 'hash-session-secret already applied; skipping backfill';
  else
    update public.participants
    set session_secret = private.hash_session_secret(session_secret);

    insert into public.schema_migrations_applied (name) values ('hash-session-secret');
  end if;
end;
$$;

create or replace function public.register_participant(
  p_participant_id    text,
  p_session_id        text,
  p_session_secret    text,
  p_selected_questions jsonb
) returns text
language plpgsql
security definer
set search_path = public, private, extensions
as $$
declare
  recent_count int;
begin
  if p_participant_id is distinct from p_session_id then
    raise exception 'participant_id must match session_id' using errcode = 'P0001';
  end if;

  select count(*) into recent_count
  from public.participants
  where created_at > now() - interval '1 hour';

  if recent_count >= 200 then
    raise exception 'registration rate limit exceeded' using errcode = 'P0001';
  end if;

  insert into public.participants (
    participant_id, session_id, session_secret, selected_questions, screens_time
  ) values (
    p_session_id,
    p_session_id,
    private.hash_session_secret(p_session_secret),
    p_selected_questions,
    '{}'::jsonb
  );

  return p_session_id;
exception
  when unique_violation then
    raise exception 'session_id already registered' using errcode = '23505';
end;
$$;

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

create or replace function public.get_participant_progress(
  p_session_id     text,
  p_session_secret text
) returns jsonb
language plpgsql
security definer
set search_path = public, private, extensions
as $$
declare
  r public.participants%rowtype;
  secret_hash text := private.hash_session_secret(p_session_secret);
begin
  if p_session_id is null or p_session_secret is null then return null; end if;

  select * into r
  from public.participants
  where session_id = p_session_id and session_secret = secret_hash;

  if not found then return null; end if;

  return jsonb_build_object(
    'pretest_completed',  r.pretest_answers  is not null,
    'posttest_completed', r.posttest_answers is not null,
    'lessons_completed',  coalesce(r.lessons_completed,  false),
    'scenarios_attempted',coalesce(r.scenarios_attempted, 0),
    'pretest_score',      r.pretest_score,
    'posttest_score',     r.posttest_score
  );
end;
$$;

revoke all    on function public.register_participant(text, text, text, jsonb) from public;
grant execute on function public.register_participant(text, text, text, jsonb) to anon, authenticated;

revoke all    on function public.update_participant(text, text, jsonb) from public;
grant execute on function public.update_participant(text, text, jsonb) to anon, authenticated;

revoke all    on function public.get_participant_progress(text, text) from public;
grant execute on function public.get_participant_progress(text, text) to anon, authenticated;
