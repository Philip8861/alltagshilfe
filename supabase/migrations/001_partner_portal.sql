-- Partnerportal (Alltagshilfe-Süd): einmal im Supabase SQL-Editor ausführen.
-- Projekt in der EU anlegen, z. B. Region „Frankfurt (eu-central-1)“ — DSGVO-freundlich.
-- Auth: E-Mail/Passwort unter Authentication → Providers aktivieren.
-- Öffentliche Selbstregistrierung: in Supabase Authentication → Providers → E-Mail abschalten („Sign ups“),
-- Partner nur über interne Verwaltung (Service Role) oder manuell in Auth anlegen.
--
-- Nach diesem Skript: Jede NEUE Registrierung (neuer Eintrag in auth.users) bekommt automatisch
-- eine Zeile in partner_profiles (Trigger unten). Bestehende Nutzer von vorher: einmalig
-- supabase/migrations/002_backfill_partner_profiles.sql ausführen oder einzeln per INSERT.

create table if not exists public.partner_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  organization_name text,
  role text not null default 'partner' check (role in ('partner', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pflegebox_orders (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references public.partner_profiles (id) on delete set null,
  external_reference text,
  status text not null default 'completed',
  summary_json jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists pflegebox_orders_partner_id_idx on public.pflegebox_orders (partner_id);
create index if not exists pflegebox_orders_created_at_idx on public.pflegebox_orders (created_at desc);

alter table public.partner_profiles enable row level security;
alter table public.pflegebox_orders enable row level security;

-- Admin-Check ohne Rekursion: EXISTS auf partner_profiles in der Policy würde RLS erneut auslösen.
create or replace function public.is_partner_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.partner_profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

revoke all on function public.is_partner_admin() from public;
grant execute on function public.is_partner_admin() to authenticated;

drop policy if exists "partner_profiles_select" on public.partner_profiles;
create policy "partner_profiles_select"
on public.partner_profiles for select
to authenticated
using (
  id = (select auth.uid())
  or public.is_partner_admin()
);

drop policy if exists "partner_profiles_update_own" on public.partner_profiles;
create policy "partner_profiles_update_own"
on public.partner_profiles for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

drop policy if exists "pflegebox_orders_select" on public.pflegebox_orders;
create policy "pflegebox_orders_select"
on public.pflegebox_orders for select
to authenticated
using (
  partner_id = (select auth.uid())
  or public.is_partner_admin()
);

-- Neues Auth-Konto -> Zeile in partner_profiles (Rolle Standard: partner)
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.partner_profiles (id, role)
  values (new.id, 'partner')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

grant select, update on table public.partner_profiles to authenticated;
grant select on table public.pflegebox_orders to authenticated;

-- Ersten Admin setzen (nach dem ersten Login): z. B.
-- update public.partner_profiles set role = 'admin' where id = 'UUID_DES_NUTZERS';

-- Pflegebox-Abschlüsse: Next.js Route POST /api/pflegebox-order schreibt mit Service-Role-Key in diese Tabelle.
-- Hosting: SUPABASE_SERVICE_ROLE_KEY in .env / Vercel setzen (niemals im Browser).

-- Nachträgliche Zuordnung zu einem Partner:
-- update public.pflegebox_orders set partner_id = 'PARTNER_PROFIL_UUID' where id = 'ORDER_UUID';
