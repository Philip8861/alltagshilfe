-- Partner: Anzeige-Präferenzen (Statuslisten, Spalten, Archiv auf Dashboard)

alter table public.partner_profiles
  add column if not exists portal_preferences jsonb not null default '{}'::jsonb;

comment on column public.partner_profiles.portal_preferences is
  'Partnerportal: JSON mit Anzeige-Optionen (Listen, Tabellenspalten, Archiv auf Übersicht).';
