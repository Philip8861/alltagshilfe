create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

create table public.orientierungskurs_cron_tokens (
  token uuid primary key default gen_random_uuid(),
  expires_at timestamptz not null default (now() + interval '10 minutes')
);

alter table public.orientierungskurs_cron_tokens enable row level security;
revoke all on public.orientierungskurs_cron_tokens from public, anon, authenticated, service_role;

create function public.orientierungskurs_consume_cron_token(presented uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.orientierungskurs_cron_tokens where token = presented and expires_at > clock_timestamp();
  return found;
end;
$$;

revoke all on function public.orientierungskurs_consume_cron_token(uuid) from public, anon, authenticated;
grant execute on function public.orientierungskurs_consume_cron_token(uuid) to service_role;

create function public.orientierungskurs_queue_reminders()
returns bigint
language plpgsql
set search_path = ''
as $$
declare
  next_token uuid;
begin
  delete from public.orientierungskurs_cron_tokens where expires_at <= clock_timestamp();
  insert into public.orientierungskurs_cron_tokens default values returning token into next_token;
  return net.http_get(
    url := 'https://www.alltagshilfe-sued.de/api/cron/orientierungskurs-erinnerungen',
    headers := jsonb_build_object('Authorization', 'Bearer ' || next_token::text),
    timeout_milliseconds := 120000
  );
end;
$$;

revoke all on function public.orientierungskurs_queue_reminders() from public, anon, authenticated, service_role;

select cron.schedule('orientierungskurs-erinnerungen', '0 7 * * *', 'select public.orientierungskurs_queue_reminders()');
