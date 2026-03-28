-- Einmal ausführen, falls es auth.users ohne partner_profiles gibt
-- (z. B. Konten vor Einrichtung des Triggers in 001_partner_portal.sql).
-- Neu registrierte Nutzer brauchen dieses Skript nicht — der Trigger in 001 legt die Zeile automatisch an.

insert into public.partner_profiles (id, role)
select u.id, 'partner'
from auth.users u
where not exists (
  select 1 from public.partner_profiles p where p.id = u.id
)
on conflict (id) do nothing;
