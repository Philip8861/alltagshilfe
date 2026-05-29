-- Individuelle Provisions-Sätze pro Partner und Leistungsbereich (Einmal / Monatlich).
-- Fallback: globale Standard-Sätze in lib/partner/partner-tip-payout.ts (Einmal).
-- Snapshot bei Status „vertragsabschluss_erfolgreich“ bleibt in partner_tip_submissions.paid_amount_eur.

create table if not exists public.partner_commission_rates (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.partner_profiles (id) on delete cascade,
  service_slug text not null,
  bucket text not null check (bucket in ('einmal', 'monatlich')),
  amount_eur numeric(12, 2) not null check (amount_eur > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (partner_id, service_slug)
);

create index if not exists partner_commission_rates_partner_id_idx
  on public.partner_commission_rates (partner_id);

comment on table public.partner_commission_rates is
  'Individuelle Provisions-Sätze pro Partner und Leistungsbereich. Bei Abschluss wird der Betrag in paid_amount_eur gespeichert.';

comment on column public.partner_commission_rates.bucket is
  'einmal = Einmalprovision; monatlich = wiederkehrende Provision (betriebliche Pflegeberatung).';

-- Kein direkter Partner-Zugriff — nur Service Role / Admin-Server-Actions.
alter table public.partner_commission_rates enable row level security;
