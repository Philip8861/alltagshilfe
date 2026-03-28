-- Status für Tippgeber-Eingänge (Admin-Bearbeitung). Nach 007 ausführen.

alter table public.partner_tip_submissions
  add column if not exists admin_status text;

update public.partner_tip_submissions
set admin_status = 'neu'
where admin_status is null or trim(admin_status) = '';

alter table public.partner_tip_submissions
  alter column admin_status set default 'neu';

alter table public.partner_tip_submissions
  alter column admin_status set not null;

alter table public.partner_tip_submissions
  drop constraint if exists partner_tip_submissions_admin_status_check;

alter table public.partner_tip_submissions
  add constraint partner_tip_submissions_admin_status_check
  check (admin_status in ('neu', 'in_bearbeitung', 'erledigt', 'abgelehnt'));

comment on column public.partner_tip_submissions.admin_status is
  'Bearbeitungsstatus für die Verwaltung (neu, in_bearbeitung, erledigt, abgelehnt).';

create index if not exists partner_tip_submissions_admin_status_idx
  on public.partner_tip_submissions (admin_status, created_at desc);
