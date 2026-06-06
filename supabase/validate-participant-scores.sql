-- Optional: run in Supabase SQL Editor to enforce score bounds on participants.
-- Validates pretest_score and posttest_score are null or in [0, 20].

create or replace function public.validate_participant_scores()
returns trigger
language plpgsql
as $$
begin
  if new.pretest_score is not null
     and (new.pretest_score < 0 or new.pretest_score > 20) then
    raise exception 'pretest_score must be null or between 0 and 20';
  end if;

  if new.posttest_score is not null
     and (new.posttest_score < 0 or new.posttest_score > 20) then
    raise exception 'posttest_score must be null or between 0 and 20';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_participant_scores_trigger on public.participants;

create trigger validate_participant_scores_trigger
  before insert or update on public.participants
  for each row
  execute function public.validate_participant_scores();
