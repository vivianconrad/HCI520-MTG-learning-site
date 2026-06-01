-- Run in Supabase SQL Editor (project: scoupfjynfxholvwfglp)
-- Participant learning outcomes for HCI520 MTG lesson

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

-- Participants (anon key in static app): insert and upsert own row by session_id
drop policy if exists "learning_sessions_insert" on public.learning_sessions;
create policy "learning_sessions_insert"
  on public.learning_sessions
  for insert
  to anon
  with check (true);

drop policy if exists "learning_sessions_update" on public.learning_sessions;
create policy "learning_sessions_update"
  on public.learning_sessions
  for update
  to anon
  using (true)
  with check (true);

-- Instructor dashboard: anon SELECT (class project; no PII in rows)
-- Tighten later with Supabase Auth or an Edge Function + secret header.
drop policy if exists "learning_sessions_select" on public.learning_sessions;
create policy "learning_sessions_select"
  on public.learning_sessions
  for select
  to anon
  using (true);

create index if not exists learning_sessions_submitted_at_idx
  on public.learning_sessions (submitted_at desc);
