-- Auszahlungsbetrag pro Tipp (EUR), wenn Status „bezahlt“; Monatsprovision bei betrieblicher Pflegeberatung.
-- Bestehende Einträge „neu“ → „in_bearbeitung“ (Status „Neu“ entfällt in der App).

alter table public.partner_tip_submissions
  add column if not exists paid_amount_eur numeric(12,2);

comment on column public.partner_tip_submissions.paid_amount_eur is
  'Auszahlungsbetrag EUR bei admin_status = bezahlt; bei betrieblicher Pflegeberatung = erfasste monatliche Provision.';

update public.partner_tip_submissions
set admin_status = 'in_bearbeitung'
where admin_status = 'neu';
