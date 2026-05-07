-- Aggregierte Auswertung der Frage „Wie sind Sie auf uns aufmerksam geworden?"
-- Speichert ausschließlich (Tag, Quelle, Formular-Typ, Anzahl) – keine personenbezogenen Daten.
-- Insert/Update nur per RPC mit Service Role (Server Actions). Lesen: Partner-Admins per RLS.

create table if not exists public.contact_sources_daily (
  day date not null,
  source text not null,
  kind text not null default 'contact',
  views bigint not null default 0,
  primary key (day, source, kind),
  constraint contact_sources_daily_source_len check (char_length(source) <= 64),
  constraint contact_sources_daily_kind_len check (char_length(kind) <= 32),
  constraint contact_sources_daily_views_nonneg check (views >= 0)
);

create index if not exists contact_sources_daily_day_idx
  on public.contact_sources_daily (day desc);

alter table public.contact_sources_daily enable row level security;

drop policy if exists "contact_sources_daily_select_admin" on public.contact_sources_daily;
create policy "contact_sources_daily_select_admin"
on public.contact_sources_daily for select
to authenticated
using (public.is_partner_admin());

revoke insert, update, delete on public.contact_sources_daily from anon, authenticated;

-- Inkrementiert den Zähler für (Tag, Quelle, Formular-Typ); +1 Anfrage.
create or replace function public.increment_contact_source(p_day date, p_source text, p_kind text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_source text;
  v_kind text;
begin
  if p_source is null or length(trim(p_source)) = 0 then
    return;
  end if;
  v_source := left(trim(p_source), 64);
  v_kind := left(coalesce(trim(p_kind), 'contact'), 32);
  if v_kind = '' then
    v_kind := 'contact';
  end if;
  insert into public.contact_sources_daily (day, source, kind, views)
  values (p_day, v_source, v_kind, 1)
  on conflict (day, source, kind) do update
  set views = public.contact_sources_daily.views + 1;
end;
$$;

revoke all on function public.increment_contact_source(date, text, text) from public;
grant execute on function public.increment_contact_source(date, text, text) to service_role;

comment on table public.contact_sources_daily is
  'Tägliche Aggregat-Zähler je (Quelle, Formular-Typ); keine IPs/Session-IDs/Personenbezug.';
comment on function public.increment_contact_source(date, text, text) is
  'Nur Service Role: +1 Anfrage für (Tag, Quelle, Formular-Typ).';

-- Aggregat im Datumsbereich (für Admin-Statistik).
create or replace function public.admin_contact_sources_by_range(p_from date, p_to date)
returns table(source text, kind text, view_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select s.source, s.kind, sum(s.views)::bigint as view_count
  from public.contact_sources_daily s
  where s.day >= p_from and s.day <= p_to
  group by s.source, s.kind
  order by view_count desc
  limit 400;
$$;

revoke all on function public.admin_contact_sources_by_range(date, date) from public;
grant execute on function public.admin_contact_sources_by_range(date, date) to service_role;

comment on function public.admin_contact_sources_by_range(date, date) is
  'Service Role / Partner-Admin: Aggregierte Quellen + Formular-Typ im Datumsbereich.';
