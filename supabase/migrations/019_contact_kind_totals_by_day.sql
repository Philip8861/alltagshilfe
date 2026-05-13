-- Tägliche Aggregat-Zähler nach Formular-Kanal (kind) für Admin-Statistik.
-- Quelle: contact_sources_daily – Summe über alle Marketing-Quellen (source) je Tag.

create or replace function public.admin_contact_kind_totals_by_day(p_from date, p_to date)
returns table(day date, kind text, view_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select s.day, s.kind, sum(s.views)::bigint as view_count
  from public.contact_sources_daily s
  where s.day >= p_from and s.day <= p_to
  group by s.day, s.kind
  order by s.day asc, s.kind asc;
$$;

revoke all on function public.admin_contact_kind_totals_by_day(date, date) from public;
grant execute on function public.admin_contact_kind_totals_by_day(date, date) to service_role;

comment on function public.admin_contact_kind_totals_by_day(date, date) is
  'Service Role: Anfragen je Kalendertag und Kanal (kind); anonyme Aggregate.';
