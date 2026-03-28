-- Erweiterung partner_profiles für Admin-Anlage und Übersicht (nach 001 ausführen).

alter table public.partner_profiles
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists recruited_by text,
  add column if not exists phone text,
  add column if not exists responsibility_areas text[] not null default '{}'::text[],
  add column if not exists password_changed_at timestamptz;

comment on column public.partner_profiles.password_changed_at is
  'Wird gesetzt, wenn der Partner sein Passwort selbst ändert (nicht das Hash, nur Zeitstempel).';
