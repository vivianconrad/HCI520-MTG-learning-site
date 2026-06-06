-- Migration for existing deployments: add session_secret to participants
-- Run once in Supabase SQL Editor if the table already exists without session_secret.
--
-- Deploy order:
--   1. Deploy the app release that generates session_secret client-side and sends
--      x-session-secret on participant PATCH requests.
--   2. Run this migration (backfill + NOT NULL).
-- In-flight browser sessions created before step 1 cannot PATCH after step 2; those
-- users must reset their session (Results → Reset session) or clear site data.
--
-- Optional cleanup before backfill (uncomment if stale incomplete rows should not
-- receive random secrets):
-- delete from public.participants
-- where session_secret is null
--   and pretest_answers is null
--   and posttest_answers is null;

alter table public.participants
  add column if not exists session_secret text;

update public.participants
  set session_secret = gen_random_uuid()::text
  where session_secret is null;

alter table public.participants
  alter column session_secret set not null;
