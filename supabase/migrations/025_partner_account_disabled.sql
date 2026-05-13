-- Partnerkonto deaktivieren (Admin): Login ins Portal mit Hinweis, kein Datenlöschen.

alter table public.partner_profiles
  add column if not exists account_disabled_at timestamptz;

comment on column public.partner_profiles.account_disabled_at is
  'Wenn gesetzt: Zugang zum Partnerportal gesperrt (Support). Auth-User bleibt bestehen.';
