-- HCI520 Participant database setup
-- Run once in Supabase SQL Editor for a fresh deployment.
--
-- For an existing deployment whose participants table predates session_secret,
-- run migrations/add-session-secret.sql first, then re-run this file.
--
-- Instructor access: use Supabase Dashboard → Table Editor (service role).
-- Do NOT re-enable anon SELECT — all participant data would be publicly readable.

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
create table if not exists public.participants (
  id              uuid        default gen_random_uuid() primary key,
  participant_id  text        not null,
  session_id      text        not null unique,
  session_secret  text        not null,
  selected_questions jsonb    not null,
  pretest_answers  jsonb,
  pretest_score    integer,
  posttest_answers jsonb,
  posttest_score   integer,
  screens_time     jsonb,
  lessons_completed boolean   default false,
  scenarios_attempted integer default 0,
  completed_at     timestamptz,
  created_at       timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------
alter table public.participants enable row level security;

drop policy if exists "Allow update own row"              on public.participants;
drop policy if exists "Allow update for all"              on public.participants;
drop policy if exists "Allow update with session secret"  on public.participants;
drop policy if exists "Allow update by session id"        on public.participants;
drop policy if exists "Allow insert for all"              on public.participants;
drop policy if exists "Deny select for all"               on public.participants;
drop policy if exists "Allow select for instructor dashboard" on public.participants;

-- UPDATE: allow any anon client to update a row they can identify by session_id.
-- Row isolation comes from the PATCH filter (session_id=eq.<id>); session_ids are
-- 12-char random strings (~59 trillion combinations) so enumeration is impractical.
-- Note: Supabase Cloud's API gateway strips arbitrary custom headers before they
-- reach PostgREST, so current_setting('request.headers') cannot be used for
-- session_secret validation in RLS on hosted Supabase. Session secret is validated
-- server-side inside the register_participant and get_participant_progress RPCs.
create policy "Allow update by session id"
  on public.participants for update
  to anon, authenticated
  using (true)
  with check (true);

-- SELECT: denied for all anon/authenticated clients (use service role via dashboard).
create policy "Deny select for all"
  on public.participants for select
  to anon, authenticated
  using (false);

-- Grants: anon may UPDATE rows (gated by RLS above). INSERT is via RPC only.
grant usage  on schema public               to anon, authenticated;
grant update on table public.participants   to anon, authenticated;
revoke insert on table public.participants  from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Score helper — mirrors client-side calculateTestScore
-- ---------------------------------------------------------------------------
create or replace function public.compute_test_score(
  p_selected_questions jsonb,
  p_answers            jsonb
) returns integer
language plpgsql
immutable
as $$
declare
  elem    jsonb;
  qid     text;
  ans     int;
  correct int;
  total   int := 0;
begin
  if p_selected_questions is null or jsonb_typeof(p_selected_questions) <> 'array' then
    return 0;
  end if;
  if p_answers is null or jsonb_typeof(p_answers) <> 'object' then
    return 0;
  end if;

  for elem in select value from jsonb_array_elements(p_selected_questions)
  loop
    qid     := elem->>'id';
    correct := (elem->>'correctIndex')::int;
    if qid is null or elem->>'correctIndex' is null then continue; end if;
    if p_answers ? qid then
      begin
        ans := (p_answers->>qid)::int;
        if ans = correct then total := total + 1; end if;
      exception when others then null;
      end;
    end if;
  end loop;

  return total;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row validation trigger
-- ---------------------------------------------------------------------------
create or replace function public.validate_participant_row()
returns trigger
language plpgsql
as $$
declare
  expected_pre  int;
  expected_post int;
  qcount        int;
  elem          jsonb;
begin
  -- selected_questions shape
  if new.selected_questions is not null then
    if jsonb_typeof(new.selected_questions) <> 'array' then
      raise exception 'selected_questions must be a JSON array';
    end if;
    qcount := jsonb_array_length(new.selected_questions);
    if qcount <> 10 then
      raise exception 'selected_questions must contain exactly 10 questions';
    end if;
    for elem in select value from jsonb_array_elements(new.selected_questions)
    loop
      if elem->>'id' is null or elem->>'correctIndex' is null then
        raise exception 'each selected question must include id and correctIndex';
      end if;
    end loop;
  end if;

  -- INSERT-only guards
  if tg_op = 'INSERT' then
    if length(trim(new.session_id)) < 8 or length(trim(new.session_id)) > 64 then
      raise exception 'invalid session_id length';
    end if;
    if length(trim(new.session_secret)) < 32 then
      raise exception 'invalid session_secret length';
    end if;
    if new.participant_id is null or length(trim(new.participant_id)) < 6 then
      raise exception 'invalid participant_id';
    end if;
  end if;

  -- Score range guards
  if new.pretest_score  is not null and (new.pretest_score  < 0 or new.pretest_score  > 20) then
    raise exception 'pretest_score must be between 0 and 20';
  end if;
  if new.posttest_score is not null and (new.posttest_score < 0 or new.posttest_score > 20) then
    raise exception 'posttest_score must be between 0 and 20';
  end if;

  -- Server-side score recalculation (ignores client-supplied value)
  if new.pretest_answers is not null and new.selected_questions is not null then
    expected_pre := public.compute_test_score(new.selected_questions, new.pretest_answers);
    if new.pretest_score is not null and new.pretest_score <> expected_pre then
      raise exception 'pretest_score does not match pretest_answers';
    end if;
    new.pretest_score := expected_pre;
  end if;

  if new.posttest_answers is not null and new.selected_questions is not null then
    expected_post := public.compute_test_score(new.selected_questions, new.posttest_answers);
    if new.posttest_score is not null and new.posttest_score <> expected_post then
      raise exception 'posttest_score does not match posttest_answers';
    end if;
    new.posttest_score := expected_post;
  end if;

  -- scenarios_attempted integrity
  if new.scenarios_attempted is not null then
    if new.scenarios_attempted < 0 or new.scenarios_attempted > 11 then
      raise exception 'scenarios_attempted must be between 0 and 11';
    end if;
  end if;
  if tg_op = 'UPDATE'
     and old.scenarios_attempted is not null
     and new.scenarios_attempted is not null
     and new.scenarios_attempted < old.scenarios_attempted then
    raise exception 'scenarios_attempted cannot decrease';
  end if;

  -- Progress ordering
  if coalesce(new.lessons_completed, false) is true
     and coalesce(new.scenarios_attempted, 0) < 11 then
    raise exception 'lessons_completed requires at least 11 practice scenarios';
  end if;
  if new.posttest_answers is not null then
    if coalesce(new.lessons_completed, false) is not true then
      raise exception 'posttest_answers require lessons_completed';
    end if;
    if new.pretest_answers is null then
      raise exception 'posttest_answers require pretest_answers';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists validate_participant_scores_trigger on public.participants;
drop trigger if exists validate_participant_row_trigger    on public.participants;

create trigger validate_participant_row_trigger
  before insert or update on public.participants
  for each row execute function public.validate_participant_row();

-- ---------------------------------------------------------------------------
-- RPC: register_participant
-- Security definer so it can INSERT despite anon INSERT being revoked.
-- Rate-limited to 200 registrations per hour.
-- ---------------------------------------------------------------------------
create or replace function public.register_participant(
  p_participant_id    text,
  p_session_id        text,
  p_session_secret    text,
  p_selected_questions jsonb
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  recent_count int;
begin
  select count(*) into recent_count
  from public.participants
  where created_at > now() - interval '1 hour';

  if recent_count >= 200 then
    raise exception 'registration rate limit exceeded' using errcode = 'P0001';
  end if;

  insert into public.participants (
    participant_id, session_id, session_secret, selected_questions, screens_time
  ) values (
    p_participant_id, p_session_id, p_session_secret, p_selected_questions, '{}'::jsonb
  );

  return p_participant_id;
exception
  when unique_violation then
    raise exception 'session_id already registered' using errcode = '23505';
end;
$$;

revoke all    on function public.register_participant(text, text, text, jsonb) from public;
grant execute on function public.register_participant(text, text, text, jsonb) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- RPC: get_participant_progress
-- Verifies session_secret server-side; returns null if not found.
-- ---------------------------------------------------------------------------
create or replace function public.get_participant_progress(
  p_session_id     text,
  p_session_secret text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.participants%rowtype;
begin
  if p_session_id is null or p_session_secret is null then return null; end if;

  select * into r
  from public.participants
  where session_id = p_session_id and session_secret = p_session_secret;

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

revoke all    on function public.get_participant_progress(text, text) from public;
grant execute on function public.get_participant_progress(text, text) to anon, authenticated;
