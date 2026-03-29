-- Bankdaten für Auszahlungen; Abrechnungsmonat je Tipp; monatliche Auszahlungsberichte (Admin).

alter table public.partner_profiles
  add column if not exists iban text,
  add column if not exists bic text,
  add column if not exists account_holder text;

comment on column public.partner_profiles.iban is 'IBAN für Partner-Auszahlung (nur Verwaltung/Service-Role).';
comment on column public.partner_profiles.bic is 'BIC optional (SEPA).';
comment on column public.partner_profiles.account_holder is 'Kontoinhaber für Auszahlung.';

alter table public.partner_tip_submissions
  add column if not exists payout_settled_period_key text;

comment on column public.partner_tip_submissions.payout_settled_period_key is
  'Kalendermonat der Abrechnung (YYYY-MM): gesetzt nach monatlichem Lauf; Einmal-Tipps zusätzlich archiviert.';

create index if not exists partner_tip_submissions_payout_period_idx
  on public.partner_tip_submissions (payout_settled_period_key)
  where payout_settled_period_key is not null;

create table if not exists public.partner_payout_reports (
  id uuid primary key default gen_random_uuid(),
  period_key text not null,
  partner_id uuid not null references public.partner_profiles (id) on delete cascade,
  einmal_eur numeric(12,2) not null default 0,
  monatlich_eur numeric(12,2) not null default 0,
  total_eur numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  constraint partner_payout_reports_period_partner_uidx unique (period_key, partner_id)
);

create index if not exists partner_payout_reports_period_idx
  on public.partner_payout_reports (period_key desc);

comment on table public.partner_payout_reports is
  'Abgeschlossene Monatsabrechnung: Summen Einmal + Monatlich je Partner für einen Kalendermonat (Europe/Berlin).';

alter table public.partner_payout_reports enable row level security;
