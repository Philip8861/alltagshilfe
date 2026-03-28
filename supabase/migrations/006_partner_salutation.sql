-- Anrede für Begrüßung im Partnerportal (Herr/Frau). Nach Anlegen in Supabase SQL-Editor ausführen.

alter table public.partner_profiles
  add column if not exists salutation text
  check (salutation is null or salutation in ('herr', 'frau'));

comment on column public.partner_profiles.salutation is
  'Anrede für „Willkommen, Herr/Frau …“; gesetzt bei Admin-Anlage (herr | frau).';
