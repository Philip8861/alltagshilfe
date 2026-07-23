-- Tägliche Unique Visitors (nur mit Statistik-Consent, Cookie-Deduplizierung im App-Layer).
-- Speichert ausschließlich (Tag, Anzahl) – keine IPs, keine Visitor-IDs, keine Sessions.

create table if not exists public.site_unique_visitors_daily (
  day date not null primary key,
  visitors bigint not null default 0,
  constraint site_unique_visitors_daily_visitors_nonneg check (visitors >= 0)
);

create index if not exists site_unique_visitors_daily_day_idx
  on public.site_unique_visitors_daily (day desc);

alter table public.site_unique_visitors_daily enable row level security;

drop policy if exists "site_unique_visitors_daily_select_admin" on public.site_unique_visitors_daily;
create policy "site_unique_visitors_daily_select_admin"
on public.site_unique_visitors_daily for select
to authenticated
using (public.is_partner_admin());

revoke insert, update, delete on public.site_unique_visitors_daily from anon, authenticated;

create or replace function public.increment_site_unique_visitor(p_day date)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_day is null then
    return;
  end if;
  insert into public.site_unique_visitors_daily (day, visitors)
  values (p_day, 1)
  on conflict (day) do update
  set visitors = public.site_unique_visitors_daily.visitors + 1;
end;
$$;

revoke all on function public.increment_site_unique_visitor(date) from public;
grant execute on function public.increment_site_unique_visitor(date) to service_role;

comment on table public.site_unique_visitors_daily is
  'Tägliche Unique-Visitor-Zähler (Consent Statistik); keine personenbezogenen Daten.';
comment on function public.increment_site_unique_visitor(date) is
  'Nur Service Role: +1 Unique Visitor für den Kalendertag (Deduplizierung per First-Party-Cookie).';

create or replace function public.admin_site_unique_visitors_by_day(p_from date, p_to date)
returns table(bucket date, visitor_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select s.day as bucket, s.visitors::bigint as visitor_count
  from public.site_unique_visitors_daily s
  where s.day >= p_from and s.day <= p_to
  order by s.day;
$$;

create or replace function public.admin_site_unique_visitors_by_month_for_year(p_year int)
returns table(month int, visitor_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select extract(month from s.day)::int as month, sum(s.visitors)::bigint as visitor_count
  from public.site_unique_visitors_daily s
  where extract(year from s.day)::int = p_year
  group by extract(month from s.day)
  order by month;
$$;

create or replace function public.admin_site_unique_visitors_by_year(p_year_from int, p_year_to int)
returns table(year int, visitor_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select extract(year from s.day)::int as year, sum(s.visitors)::bigint as visitor_count
  from public.site_unique_visitors_daily s
  where extract(year from s.day)::int between p_year_from and p_year_to
  group by extract(year from s.day)
  order by year;
$$;

revoke all on function public.admin_site_unique_visitors_by_day(date, date) from public;
revoke all on function public.admin_site_unique_visitors_by_month_for_year(int) from public;
revoke all on function public.admin_site_unique_visitors_by_year(int, int) from public;
grant execute on function public.admin_site_unique_visitors_by_day(date, date) to service_role;
grant execute on function public.admin_site_unique_visitors_by_month_for_year(int) to service_role;
grant execute on function public.admin_site_unique_visitors_by_year(int, int) to service_role;
