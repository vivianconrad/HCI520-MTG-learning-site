-- Retention policy: delete participant rows after study end + N days.
-- Update study_privacy_config before the study ends; schedule purge_expired_participants
-- via Supabase Dashboard → Database → Extensions → pg_cron (Pro) or run manually.

create table if not exists public.study_privacy_config (
  id int primary key default 1 check (id = 1),
  study_end_date date not null default '2026-06-30',
  retention_days_after_study_end int not null default 90 check (retention_days_after_study_end >= 0),
  updated_at timestamptz not null default now()
);

comment on table public.study_privacy_config is
  'Single-row retention settings. Purge runs only after study_end_date + retention_days.';

insert into public.study_privacy_config (study_end_date, retention_days_after_study_end)
values ('2026-06-30', 90)
on conflict (id) do nothing;

alter table public.study_privacy_config enable row level security;

drop policy if exists "Deny all on study_privacy_config" on public.study_privacy_config;
create policy "Deny all on study_privacy_config"
  on public.study_privacy_config for all
  to anon, authenticated
  using (false);

revoke all on table public.study_privacy_config from anon, authenticated;

create or replace function public.purge_expired_participants()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  cfg record;
  purge_after timestamptz;
  deleted_count int;
begin
  select study_end_date, retention_days_after_study_end
  into cfg
  from public.study_privacy_config
  where id = 1;

  if not found then
    return 0;
  end if;

  purge_after := (cfg.study_end_date + cfg.retention_days_after_study_end * interval '1 day')::timestamptz;

  if now() < purge_after then
    return 0;
  end if;

  delete from public.participants;
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

revoke all on function public.purge_expired_participants() from public;
-- Run manually or via pg_cron with service role / SQL editor only.

comment on function public.purge_expired_participants() is
  'Deletes all participant rows once current time is past study_end_date + retention_days. '
  'Include Supabase backups in your retention plan — enable PITR expiry or delete projects when done.';
