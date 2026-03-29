-- Partner-Archiv (nur Übersicht Partner); Admin „ehemalige“ Betriebskunden.

alter table public.partner_tip_submissions
  add column if not exists partner_archived_at timestamptz,
  add column if not exists former_active_company_at timestamptz;

comment on column public.partner_tip_submissions.partner_archived_at is
  'Partner blendet Eintrag in eigenen Listen aus; ohne Einfluss auf Admin-Archiv, Provision und Abrechnung.';
comment on column public.partner_tip_submissions.former_active_company_at is
  'Admin: betriebliche Pflegeberatung mit Vertrag — Unterbereich „Ehemalige Unternehmen“.';

create index if not exists partner_tip_submissions_partner_archived_idx
  on public.partner_tip_submissions (partner_id, partner_archived_at);
