-- Run in Supabase SQL Editor for HCI520 participant research data

create table if not exists public.participants (
  id uuid default gen_random_uuid() primary key,
  participant_id text not null,
  session_id text not null unique,
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

create policy "Allow insert for all"
  on public.participants for insert
  with check (true);

create policy "Allow update own row"
  on public.participants for update
  using (true)
  with check (true);

create policy "Deny select for all"
  on public.participants for select
  using (false);
