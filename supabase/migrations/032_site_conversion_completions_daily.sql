-- Eigene Anfragen-Zähler NUR für Admin „Besucher & Conversion“ (frisch ab Tracking-Start).
-- Unabhängig von contact_sources_daily – Altbestand dort bleibt für die anderen Statistik-Kacheln.

create table if not exists public.site_conversion_completions_daily (
  day date not null,
  kind text not null,
  completions bigint not null default 0,
  primary key (day, kind),
  constraint site_conversion_completions_daily_kind_len check (char_length(kind) <= 32),
  constraint site_conversion_completions_daily_nonneg check (completions >= 0)
);

create index if not exists site_conversion_completions_daily_day_idx
  on public.site_conversion_completions_daily (day desc);

alter table public.site_conversion_completions_daily enable row level security;

drop policy if exists "site_conversion_completions_daily_select_admin"
  on public.site_conversion_completions_daily;
create policy "site_conversion_completions_daily_select_admin"
on public.site_conversion_completions_daily for select
to authenticated
using (public.is_partner_admin());

revoke insert, update, delete on public.site_conversion_completions_daily from anon, authenticated;

create or replace function public.increment_site_conversion_completion(p_day date, p_kind text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_kind text;
begin
  if p_day is null then
    return;
  end if;
  v_kind := left(coalesce(trim(p_kind), 'contact'), 32);
  if v_kind = '' then
    v_kind := 'contact';
  end if;
  insert into public.site_conversion_completions_daily (day, kind, completions)
  values (p_day, v_kind, 1)
  on conflict (day, kind) do update
  set completions = public.site_conversion_completions_daily.completions + 1;
end;
$$;

revoke all on function public.increment_site_conversion_completion(date, text) from public;
grant execute on function public.increment_site_conversion_completion(date, text) to service_role;

comment on table public.site_conversion_completions_daily is
  'Anfragen-Aggregate nur für Besucher-&-Conversion (frisch); kein Personenbezug.';
comment on function public.increment_site_conversion_completion(date, text) is
  'Nur Service Role: +1 Anfrage (kind) für Conversion-Statistik.';

create or replace function public.admin_site_conversion_completions_by_day(p_from date, p_to date)
returns table(day date, kind text, view_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select s.day, s.kind, sum(s.completions)::bigint as view_count
  from public.site_conversion_completions_daily s
  where s.day >= p_from and s.day <= p_to
  group by s.day, s.kind
  order by s.day asc, s.kind asc;
$$;

revoke all on function public.admin_site_conversion_completions_by_day(date, date) from public;
grant execute on function public.admin_site_conversion_completions_by_day(date, date) to service_role;

comment on function public.admin_site_conversion_completions_by_day(date, date) is
  'Service Role: Conversion-Anfragen je Tag und Kanal (eigene Tabelle, ohne Altbestand).';
