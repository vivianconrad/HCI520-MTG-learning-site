-- Migration for existing deployments: add session_secret to participants
-- Run once in Supabase SQL Editor if the table already exists without session_secret.

alter table public.participants
  add column if not exists session_secret text;

update public.participants
  set session_secret = gen_random_uuid()::text
  where session_secret is null;

alter table public.participants
  alter column session_secret set not null;
