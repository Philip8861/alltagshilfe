-- Erinnerungs-Mail an interne Zuständigkeit (Partner-Tipp weiterhin "In Bearbeitung")
alter table public.partner_tip_submissions
  add column if not exists last_in_bearbeitung_staff_reminder_at timestamptz;

comment on column public.partner_tip_submissions.last_in_bearbeitung_staff_reminder_at is
  'Zeitpunkt der letzten 3-Tage-Erinnerung an Zuständige (nur bei Status in_bearbeitung). NULL = noch keine Erinnerung.';
