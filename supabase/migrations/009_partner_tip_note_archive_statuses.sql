-- Partner-Tipps: Partner-sichtbare Admin-Notiz, Archiv, erweiterte Status.

alter table public.partner_tip_submissions
  add column if not exists admin_visible_note text;

alter table public.partner_tip_submissions
  add column if not exists archived_at timestamptz;

comment on column public.partner_tip_submissions.admin_visible_note is
  'Vom Admin gesetzte Notiz; nur diese erscheint beim Partner unter „Notiz“ (nicht Payload-Notiz).';

comment on column public.partner_tip_submissions.archived_at is
  'Wenn gesetzt, erscheint der Eintrag nur in Archiv-Ansichten.';

alter table public.partner_tip_submissions
  drop constraint if exists partner_tip_submissions_admin_status_check;

alter table public.partner_tip_submissions
  add constraint partner_tip_submissions_admin_status_check
  check (
    admin_status in (
      'neu',
      'in_bearbeitung',
      'termin_vereinbart',
      'warten_auf_rueckmeldung',
      'bezahlt',
      'erledigt',
      'abgelehnt'
    )
  );

comment on column public.partner_tip_submissions.admin_status is
  'Bearbeitungsstatus: neu, in_bearbeitung, termin_vereinbart, warten_auf_rueckmeldung, bezahlt, erledigt (Vertragsabschluss), abgelehnt.';

create index if not exists partner_tip_submissions_archived_at_idx
  on public.partner_tip_submissions (archived_at, created_at desc);
