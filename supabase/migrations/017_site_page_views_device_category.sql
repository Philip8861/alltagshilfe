-- Gerätekategorie (mobil / tablet / desktop) je Zählerzeile; Client-Navigation + Middleware nutzen dieselbe Logik serverseitig.

alter table public.site_page_views_daily
  add column if not exists device_category text not null default 'unknown';

update public.site_page_views_daily
set device_category = 'unknown'
where device_category is null;

alter table public.site_page_views_daily
  drop constraint if exists site_page_views_daily_device_chk;

alter table public.site_page_views_daily
  add constraint site_page_views_daily_device_chk
  check (device_category in ('mobile', 'tablet', 'desktop', 'unknown'));

alter table public.site_page_views_daily
  drop constraint if exists site_page_views_daily_pkey;

alter table public.site_page_views_daily
  add primary key (day, path, device_category);

drop function if exists public.increment_site_page_view(date, text);

create or replace function public.increment_site_page_view(p_day date, p_path text, p_device text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_path text;
  v_dev text;
begin
  if p_path is null or length(trim(p_path)) = 0 then
    return;
  end if;
  v_path := left(trim(p_path), 2048);
  v_dev := lower(trim(coalesce(p_device, 'unknown')));
  if v_dev not in ('mobile', 'tablet', 'desktop', 'unknown') then
    v_dev := 'unknown';
  end if;
  insert into public.site_page_views_daily (day, path, device_category, views)
  values (p_day, v_path, v_dev, 1)
  on conflict (day, path, device_category) do update
  set views = public.site_page_views_daily.views + 1;
end;
$$;

revoke all on function public.increment_site_page_view(date, text, text) from public;
grant execute on function public.increment_site_page_view(date, text, text) to service_role;

comment on column public.site_page_views_daily.device_category is 'mobile | tablet | desktop | unknown (Historie vor Migration oder nicht zuordenbar).';
comment on function public.increment_site_page_view(date, text, text) is 'Service Role: +1 View für (Tag, Pfad, Gerät).';

create or replace function public.admin_site_traffic_device_breakdown(p_from date, p_to date)
returns table(device_category text, view_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select s.device_category, sum(s.views)::bigint as view_count
  from public.site_page_views_daily s
  where s.day >= p_from and s.day <= p_to
  group by s.device_category
  order by view_count desc;
$$;

revoke all on function public.admin_site_traffic_device_breakdown(date, date) from public;
grant execute on function public.admin_site_traffic_device_breakdown(date, date) to service_role;
