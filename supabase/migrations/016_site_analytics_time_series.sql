-- Zeitreihen für Admin „Statistik Homepage“ (aggregiert, keine personenbezogenen Daten).

create or replace function public.admin_site_traffic_totals_by_day(p_from date, p_to date)
returns table(bucket date, view_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select s.day as bucket, sum(s.views)::bigint as view_count
  from public.site_page_views_daily s
  where s.day >= p_from and s.day <= p_to
  group by s.day
  order by s.day;
$$;

create or replace function public.admin_site_traffic_totals_by_month_for_year(p_year int)
returns table(month int, view_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select extract(month from s.day)::int as month, sum(s.views)::bigint as view_count
  from public.site_page_views_daily s
  where extract(year from s.day)::int = p_year
  group by extract(month from s.day)
  order by month;
$$;

create or replace function public.admin_site_traffic_totals_by_year(p_year_from int, p_year_to int)
returns table(year int, view_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select extract(year from s.day)::int as year, sum(s.views)::bigint as view_count
  from public.site_page_views_daily s
  where extract(year from s.day)::int between p_year_from and p_year_to
  group by extract(year from s.day)
  order by year;
$$;

create or replace function public.admin_site_traffic_path_by_day(p_path text, p_from date, p_to date)
returns table(bucket date, view_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select s.day as bucket, sum(s.views)::bigint as view_count
  from public.site_page_views_daily s
  where s.path = p_path and s.day >= p_from and s.day <= p_to
  group by s.day
  order by s.day;
$$;

create or replace function public.admin_site_traffic_path_by_month_for_year(p_path text, p_year int)
returns table(month int, view_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select extract(month from s.day)::int as month, sum(s.views)::bigint as view_count
  from public.site_page_views_daily s
  where s.path = p_path and extract(year from s.day)::int = p_year
  group by extract(month from s.day)
  order by month;
$$;

create or replace function public.admin_site_traffic_path_by_year(p_path text, p_year_from int, p_year_to int)
returns table(year int, view_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select extract(year from s.day)::int as year, sum(s.views)::bigint as view_count
  from public.site_page_views_daily s
  where s.path = p_path
    and extract(year from s.day)::int between p_year_from and p_year_to
  group by extract(year from s.day)
  order by year;
$$;

revoke all on function public.admin_site_traffic_totals_by_day(date, date) from public;
revoke all on function public.admin_site_traffic_totals_by_month_for_year(int) from public;
revoke all on function public.admin_site_traffic_totals_by_year(int, int) from public;
revoke all on function public.admin_site_traffic_path_by_day(text, date, date) from public;
revoke all on function public.admin_site_traffic_path_by_month_for_year(text, int) from public;
revoke all on function public.admin_site_traffic_path_by_year(text, int, int) from public;

grant execute on function public.admin_site_traffic_totals_by_day(date, date) to service_role;
grant execute on function public.admin_site_traffic_totals_by_month_for_year(int) to service_role;
grant execute on function public.admin_site_traffic_totals_by_year(int, int) to service_role;
grant execute on function public.admin_site_traffic_path_by_day(text, date, date) to service_role;
grant execute on function public.admin_site_traffic_path_by_month_for_year(text, int) to service_role;
grant execute on function public.admin_site_traffic_path_by_year(text, int, int) to service_role;
