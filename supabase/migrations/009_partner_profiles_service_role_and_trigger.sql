-- Partner-Anlage per Service-Role (Admin): Schreibrechte und Trigger-Kompatibilität.
-- Ausführen, falls partner_profiles nach Auth-Anlage nicht beschrieben werden kann.

-- PostgREST mit service_role-Key: RLS wird umgangen, trotzdem braucht die Rolle Tabellenrechte.
grant usage on schema public to service_role;
grant select, insert, update, delete on table public.partner_profiles to service_role;

-- Trigger: nur Minimalzeile; vollständige Daten setzt die App per UPSERT (vermeidet PK-Konflikt mit INSERT).
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

comment on function public.handle_new_auth_user() is
  'Legt partner_profiles-Minimalzeile an; Admin-App ergänzt per UPSERT (Spalten aus 004/006/007).';
