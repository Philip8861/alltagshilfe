-- Behebt: „infinite recursion detected in policy for relation partner_profiles“
--
-- Ursache: In partner_profiles_select (und analog in pflegebox_orders_select) stand
--   EXISTS (SELECT 1 FROM partner_profiles ap WHERE …)
-- Beim Auswerten der Policy auf partner_profiles wird dieselbe SELECT-Policy erneut
-- angewendet → Endlosschleife.
--
-- Lösung: Admin-Prüfung in eine STABLE SECURITY DEFINER-Funktion auslagern.
-- Sie läuft mit Rechten des Funktionsowners (postgres) und umgeht RLS auf der Leseseite.
--
-- Im Supabase SQL-Editor einmal ausführen (nach 001 / 003 / 004).

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

drop policy if exists "pflegebox_orders_select" on public.pflegebox_orders;
create policy "pflegebox_orders_select"
on public.pflegebox_orders for select
to authenticated
using (
  partner_id = (select auth.uid())
  or public.is_partner_admin()
);
