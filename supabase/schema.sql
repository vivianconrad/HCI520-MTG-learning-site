-- Run in Supabase SQL Editor (project: scoupfjynfxholvwfglp)
-- DEPRECATED: superseded by public.participants (see participants.sql).
-- Kept for reference; do not grant anon read/update on this table from the browser.

create table if not exists public.learning_sessions (
  session_id text primary key,
  question_ids text[] not null default '{}',
  pretest_answers jsonb not null default '{}',
  posttest_answers jsonb not null default '{}',
  pretest_correct smallint not null,
  posttest_correct smallint not null,
  gain smallint not null,
  lo_scores jsonb not null,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.learning_sessions enable row level security;

drop policy if exists "learning_sessions_insert" on public.learning_sessions;
create policy "learning_sessions_insert"
  on public.learning_sessions
  for insert
  to anon
  with check (true);

drop policy if exists "learning_sessions_update" on public.learning_sessions;
drop policy if exists "learning_sessions_deny_update" on public.learning_sessions;
create policy "learning_sessions_deny_update"
  on public.learning_sessions
  for update
  to anon
  using (false);

drop policy if exists "learning_sessions_select" on public.learning_sessions;
drop policy if exists "learning_sessions_deny_select" on public.learning_sessions;
create policy "learning_sessions_deny_select"
  on public.learning_sessions
  for select
  to anon
  using (false);

create index if not exists learning_sessions_submitted_at_idx
  on public.learning_sessions (submitted_at desc);
