-- Werbe-Netzwerk: Partner können beim Anlegen einen werbenden Partner (PartnerCode) erhalten.
-- Geld: A erhält 5 % Referral-Provision auf eigene freigegebene Abschlussprovision von direkt geworbenem B.
-- Regel-Härtung in DB: keine Self-Referral, kein direkter Zyklus, nur einmalig setzbar.
--
-- HINWEIS Migration:
-- 1. In Supabase SQL-Editor laufen lassen (nach 025).
-- 2. Rein additiv: 2 neue Spalten auf partner_profiles, 2 neue Spalten auf partner_payout_reports,
--    1 Trigger, 1 unique-Index, 1 Foreign Key. Keine Bestandsdaten werden geändert.

------------------------------------------------------------
-- 1) partner_profiles: referredBy + referredAt
------------------------------------------------------------

alter table public.partner_profiles
  add column if not exists referred_by_partner_id uuid,
  add column if not exists referred_at timestamptz;

comment on column public.partner_profiles.referred_by_partner_id is
  'Direkter Werber (max. einmalig setzbar; siehe Trigger). FK auf partner_profiles.id.';

comment on column public.partner_profiles.referred_at is
  'Zeitpunkt, an dem der Werber zugeordnet wurde. Provisionen vor diesem Zeitpunkt zählen NICHT.';

-- FK getrennt anlegen (idempotent), damit add column nicht fehlschlägt, wenn FK schon existiert.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'partner_profiles_referred_by_partner_id_fkey'
      and connamespace = 'public'::regnamespace
  ) then
    alter table public.partner_profiles
      add constraint partner_profiles_referred_by_partner_id_fkey
      foreign key (referred_by_partner_id)
      references public.partner_profiles (id)
      on delete set null;
  end if;
end$$;

-- Index für Abfragen "Wer wurde von X geworben?"
create index if not exists partner_profiles_referred_by_partner_id_idx
  on public.partner_profiles (referred_by_partner_id)
  where referred_by_partner_id is not null;

-- CHECK: kein Self-Referral
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'partner_profiles_no_self_referral_chk'
      and connamespace = 'public'::regnamespace
  ) then
    alter table public.partner_profiles
      add constraint partner_profiles_no_self_referral_chk
      check (referred_by_partner_id is null or referred_by_partner_id <> id);
  end if;
end$$;

------------------------------------------------------------
-- 2) Trigger: referred_by_partner_id ist nach Setzen unveränderlich.
--    - Vom NULL → NICHT-NULL: erlaubt (Erst-Zuweisung); referred_at wird automatisch gesetzt, falls fehlt.
--    - Vom NICHT-NULL → anderer Wert: blockiert (Wechsel).
--    - Vom NICHT-NULL → NULL: blockiert (Entfernen, außer durch FK on delete set null implizit).
--    - referred_at lässt sich nicht ändern, sobald gesetzt.
--    Direkter Zyklus (A->B, B->A) wird ebenfalls blockiert.
------------------------------------------------------------

create or replace function public.partner_profiles_referral_guard()
returns trigger
language plpgsql
as $$
declare
  v_inverse_exists boolean;
begin
  -- Self-Referral
  if new.referred_by_partner_id is not null and new.referred_by_partner_id = new.id then
    raise exception 'partner_referral_self_forbidden'
      using errcode = 'check_violation';
  end if;

  if tg_op = 'UPDATE' then
    -- Wechsel verhindern: war einmal gesetzt -> bleibt unveränderlich
    if old.referred_by_partner_id is not null
       and new.referred_by_partner_id is distinct from old.referred_by_partner_id then
      raise exception 'partner_referral_already_set'
        using errcode = 'check_violation';
    end if;

    -- referred_at: nicht überschreiben, sobald einmal gesetzt
    if old.referred_at is not null
       and new.referred_at is distinct from old.referred_at then
      raise exception 'partner_referred_at_immutable'
        using errcode = 'check_violation';
    end if;
  end if;

  -- referred_at automatisch setzen, wenn werber neu zugewiesen wird
  if new.referred_by_partner_id is not null and new.referred_at is null then
    new.referred_at := now();
  end if;

  -- Direkter Zyklus: A wirbt B – dann darf B nicht A werben
  if new.referred_by_partner_id is not null then
    select exists (
      select 1
      from public.partner_profiles p
      where p.id = new.referred_by_partner_id
        and p.referred_by_partner_id = new.id
    ) into v_inverse_exists;

    if v_inverse_exists then
      raise exception 'partner_referral_direct_cycle'
        using errcode = 'check_violation';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists partner_profiles_referral_guard_trg on public.partner_profiles;
create trigger partner_profiles_referral_guard_trg
  before insert or update on public.partner_profiles
  for each row execute function public.partner_profiles_referral_guard();

------------------------------------------------------------
-- 3) partner_payout_reports: Referral-Spalten (rein additiv).
--    Bestehendes total_eur bleibt unverändert (= einmal+monatlich; Eigenprovision).
--    Neu:
--      - referral_eur            = 5 % auf eigene freigegebene Closing-Commission der direkten Werblinge
--      - total_with_referral_eur = einmal + monatlich + referral_eur (= Auszahlungssumme inkl. Werbeprovision)
------------------------------------------------------------

alter table public.partner_payout_reports
  add column if not exists referral_eur numeric(12,2) not null default 0,
  add column if not exists total_with_referral_eur numeric(12,2) not null default 0;

comment on column public.partner_payout_reports.referral_eur is
  '5 % auf eigene freigegebene Abschlussprovisionen der direkt geworbenen Partner im periodKey (nur ab referred_at).';

comment on column public.partner_payout_reports.total_with_referral_eur is
  'einmal_eur + monatlich_eur + referral_eur (= Auszahlungssumme inkl. Werbeprovision; total_eur bleibt Eigenprovision).';

-- Backfill: total_with_referral_eur = total_eur (Bestand hat keine Referral-Daten)
update public.partner_payout_reports
set total_with_referral_eur = total_eur
where total_with_referral_eur = 0
  and total_eur > 0;

------------------------------------------------------------
-- 4) RLS: Spalten sind über bestehende Policies sichtbar (keine neuen Policies nötig).
------------------------------------------------------------
