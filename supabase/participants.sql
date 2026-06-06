-- Run in Supabase SQL Editor for HCI520 participant research data

create table if not exists public.participants (
  id uuid default gen_random_uuid() primary key,
  participant_id text not null,
  session_id text not null unique,
  session_secret text not null,
  selected_questions jsonb not null,
  pretest_answers jsonb,
  pretest_score integer,
  posttest_answers jsonb,
  posttest_score integer,
  screens_time jsonb,
  lessons_completed boolean default false,
  scenarios_attempted integer default 0,
  completed_at timestamptz,
  created_at timestamptz default now()
);

alter table public.participants enable row level security;

drop policy if exists "Allow update own row" on public.participants;
drop policy if exists "Allow update for all" on public.participants;
drop policy if exists "Allow update with session secret" on public.participants;
drop policy if exists "Allow insert for all" on public.participants;
drop policy if exists "Deny select for all" on public.participants;
drop policy if exists "Allow select for instructor dashboard" on public.participants;

create policy "Allow insert for all"
  on public.participants for insert
  to anon, authenticated
  with check (
    session_secret is not null
    and length(trim(session_secret)) > 0
  );

create policy "Allow update with session secret"
  on public.participants for update
  to anon, authenticated
  using (
    (current_setting('request.headers', true)::json->>'x-session-secret') = session_secret
  )
  with check (
    (current_setting('request.headers', true)::json->>'x-session-secret') = session_secret
  );

create policy "Deny select for all"
  on public.participants for select
  to anon, authenticated
  using (false);

grant usage on schema public to anon, authenticated;
grant insert, update on table public.participants to anon, authenticated;
