-- Optional: Nur ausführen, wenn partner_profiles zwar Daten hat, die App aber „kein Profil“ meldet
-- (Row Level Security / Policies weichen von der Vorlage ab).
-- Idempotent: Policies werden ersetzt wie in 001_partner_portal.sql.

drop policy if exists "partner_profiles_select" on public.partner_profiles;
create policy "partner_profiles_select"
on public.partner_profiles for select
to authenticated
using (
  id = (select auth.uid())
  or exists (
    select 1 from public.partner_profiles ap
    where ap.id = (select auth.uid()) and ap.role = 'admin'
  )
);

grant select, update on table public.partner_profiles to authenticated;
