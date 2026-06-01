-- Optional: allow instructor dashboard reads in the browser (class project only).
-- Default participants.sql denies SELECT for anon.

drop policy if exists "Deny select for all" on public.participants;

create policy "Allow select for instructor dashboard"
  on public.participants for select
  using (true);
