-- Allow lessons_completed without all 11 optional practice scenarios.
-- Run in Supabase SQL Editor if lesson/post-test saves return HTTP 400 with
-- "lessons_completed requires at least 11 practice scenarios".

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

  if new.pretest_score  is not null and (new.pretest_score  < 0 or new.pretest_score  > 20) then
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
