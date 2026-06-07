-- Learner-choice covariates: curiosity focus at lesson intro, post-test readiness at lesson complete.
-- Run in Supabase SQL Editor, then re-apply update_participant from setup.sql if RPC is stale.

alter table public.participants
  add column if not exists curiosity_focus text,
  add column if not exists posttest_readiness integer;

-- Recreate validate_participant_row with new field guards (full function in setup.sql).
-- Minimal patch: extend existing trigger function if you cannot re-run full setup.sql.

create or replace function public.validate_participant_row()
returns trigger
language plpgsql
as $$
declare
  expected_pre  int;
  expected_post int;
  elem          jsonb;
begin
  if new.selected_questions is not null and jsonb_typeof(new.selected_questions) = 'array' then
    for elem in select value from jsonb_array_elements(new.selected_questions)
    loop
      if not (elem ? 'id' and elem ? 'correctIndex') then
        raise exception 'each selected question must include id and correctIndex';
      end if;
    end loop;
  end if;

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

  if new.pretest_score is not null and (new.pretest_score < 0 or new.pretest_score > 20) then
    raise exception 'pretest_score must be between 0 and 20';
  end if;
  if new.posttest_score is not null and (new.posttest_score < 0 or new.posttest_score > 20) then
    raise exception 'posttest_score must be between 0 and 20';
  end if;

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

  if new.curiosity_focus is not null
     and new.curiosity_focus not in ('reading_cards', 'card_types', 'turns', 'guide') then
    raise exception 'invalid curiosity_focus';
  end if;

  if new.posttest_readiness is not null
     and (new.posttest_readiness < 1 or new.posttest_readiness > 5) then
    raise exception 'posttest_readiness must be between 1 and 5';
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

create or replace function public.update_participant(
  p_session_id     text,
  p_session_secret text,
  p_patch          jsonb
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  updated int;
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
  where session_id = p_session_id and session_secret = p_session_secret;

  get diagnostics updated = row_count;
  return updated > 0;
end;
$$;

revoke all    on function public.update_participant(text, text, jsonb) from public;
grant execute on function public.update_participant(text, text, jsonb) to anon, authenticated;
