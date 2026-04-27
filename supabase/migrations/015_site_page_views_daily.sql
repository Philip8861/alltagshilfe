-- Aggregierte Seitenaufrufe für interne Auswertung (keine personenbezogenen Daten).
-- Erhöhung nur über RPC mit Service Role (Middleware). Lesen: Partner-Admins per RLS.

create table if not exists public.site_page_views_daily (
  day date not null,
  path text not null,
  views bigint not null default 0,
  primary key (day, path),
  constraint site_page_views_daily_path_len check (char_length(path) <= 2048),
  constraint site_page_views_daily_views_nonneg check (views >= 0)
);

create index if not exists site_page_views_daily_day_idx on public.site_page_views_daily (day desc);

alter table public.site_page_views_daily enable row level security;

drop policy if exists "site_page_views_daily_select_admin" on public.site_page_views_daily;
create policy "site_page_views_daily_select_admin"
on public.site_page_views_daily for select
to authenticated
using (public.is_partner_admin());

revoke insert, update, delete on public.site_page_views_daily from anon, authenticated;

create or replace function public.increment_site_page_view(p_day date, p_path text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_path text;
begin
  if p_path is null or length(trim(p_path)) = 0 then
    return;
  end if;
  v_path := left(trim(p_path), 2048);
  insert into public.site_page_views_daily (day, path, views)
  values (p_day, v_path, 1)
  on conflict (day, path) do update
  set views = public.site_page_views_daily.views + 1;
end;
$$;

revoke all on function public.increment_site_page_view(date, text) from public;
grant execute on function public.increment_site_page_view(date, text) to service_role;

comment on table public.site_page_views_daily is 'Tägliche Aggregat-Zähler je URL-Pfad; keine IPs/Session-IDs.';
comment on function public.increment_site_page_view(date, text) is 'Nur Service Role (Middleware); erhöht views für (day, path).';

-- Auswertung im Betriebs-Admin (Service Role); liefert gebündelte Aufrufe je Pfad im Zeitraum.
create or replace function public.admin_site_traffic_by_path_range(p_from date, p_to date)
returns table(path text, view_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select s.path, sum(s.views)::bigint as view_count
  from public.site_page_views_daily s
  where s.day >= p_from and s.day <= p_to
  group by s.path
  order by view_count desc
  limit 400;
$$;

revoke all on function public.admin_site_traffic_by_path_range(date, date) from public;
grant execute on function public.admin_site_traffic_by_path_range(date, date) to service_role;

comment on function public.admin_site_traffic_by_path_range(date, date) is 'Nur Service Role: Top-Pfade nach aggregierten Aufrufen im Datumsbereich.';
