-- Aggregierte Anfragen nach ISO-Wochentag (1=Montag … 7=Sonntag) für Admin-Statistik.
-- Karriere-Kanäle getrennt von Kontaktformular/Hilfe-Finder/Ratgeber.

create or replace function public.admin_contact_weekday_group_totals(p_from date, p_to date)
returns table (
  iso_weekday int,
  karriere_views bigint,
  kern_views bigint,
  other_views bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    extract(isodow from s.day)::int as iso_weekday,
    coalesce(
      sum(
        case when s.kind in ('karriere', 'karriere-form', 'karriere-wizard')
          then s.views else 0 end
      ),
      0
    )::bigint as karriere_views,
    coalesce(
      sum(
        case when s.kind in ('contact', 'hilfefinder', 'ratgeber')
          then s.views else 0 end
      ),
      0
    )::bigint as kern_views,
    coalesce(
      sum(
        case
          when s.kind in (
            'karriere', 'karriere-form', 'karriere-wizard',
            'contact', 'hilfefinder', 'ratgeber'
          ) then 0
          else s.views
        end
      ),
      0
    )::bigint as other_views
  from public.contact_sources_daily s
  where s.day >= p_from and s.day <= p_to
  group by extract(isodow from s.day)
  order by iso_weekday;
$$;

revoke all on function public.admin_contact_weekday_group_totals(date, date) from public;
grant execute on function public.admin_contact_weekday_group_totals(date, date) to service_role;

comment on function public.admin_contact_weekday_group_totals(date, date) is
  'Admin: Summe views je ISO-Wochentag für Karriere vs. Kern-Kanäle vs. Sonstiges (contact_sources_daily).';
