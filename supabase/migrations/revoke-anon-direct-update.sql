-- Same as supabase/revoke-anon-direct-update.sql (migration copy).

alter table public.participants enable row level security;

drop policy if exists "Allow update own row"              on public.participants;
drop policy if exists "Allow update for all"              on public.participants;
drop policy if exists "Allow update with session secret"  on public.participants;
drop policy if exists "Allow update by session id"        on public.participants;
drop policy if exists "Deny update for anon"              on public.participants;

create policy "Deny update for anon"
  on public.participants for update
  to anon, authenticated
  using (false);

grant usage on schema public to anon, authenticated;
revoke insert, update on table public.participants from anon, authenticated;
