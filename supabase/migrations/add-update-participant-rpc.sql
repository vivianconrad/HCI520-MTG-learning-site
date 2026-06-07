-- Participant saves must use RPC: deny-SELECT RLS blocks REST PATCH even when
-- UPDATE policies are permissive (PostgreSQL requires SELECT visibility to update).
-- Run this in Supabase SQL Editor, then re-run supabase/setup.sql if the validation
-- trigger is still missing (verify script check #5).
--
-- Verify: node scripts/verify-participants-db.mjs

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
      then (p_patch->>'completed_at')::timestamptz else completed_at end
  where session_id = p_session_id and session_secret = p_session_secret;

  get diagnostics updated = row_count;
  return updated > 0;
end;
$$;

revoke all    on function public.update_participant(text, text, jsonb) from public;
grant execute on function public.update_participant(text, text, jsonb) to anon, authenticated;
