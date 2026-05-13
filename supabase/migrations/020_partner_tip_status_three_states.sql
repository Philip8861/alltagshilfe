-- Partner-Tipp-Status auf drei Werte vereinheitlichen.
-- Neu: in_bearbeitung | vertragsabschluss_erfolgreich | abgelehnt
-- Ziel: Provision/Einmal bei vertragsabschluss_erfolgreich wie früher bei erledigt/bezahlt; Ablehnungen ins Admin-Archiv.

UPDATE public.partner_tip_submissions
SET admin_status = 'vertragsabschluss_erfolgreich'
WHERE admin_status IN ('erledigt', 'bezahlt');

UPDATE public.partner_tip_submissions
SET admin_status = 'in_bearbeitung'
WHERE admin_status IN ('neu', 'termin_vereinbart', 'warten_auf_rueckmeldung');

-- Abgelehnte Einträge sollen in der Admin-Archiv-Ansicht landen (analog späterem Workflow bei neuem Ablehnen).
UPDATE public.partner_tip_submissions
SET archived_at = COALESCE(archived_at, now())
WHERE admin_status = 'abgelehnt'
  AND archived_at IS NULL;

ALTER TABLE public.partner_tip_submissions
  DROP CONSTRAINT IF EXISTS partner_tip_submissions_admin_status_check;

ALTER TABLE public.partner_tip_submissions
  ADD CONSTRAINT partner_tip_submissions_admin_status_check
  CHECK (
    admin_status IN ('in_bearbeitung', 'vertragsabschluss_erfolgreich', 'abgelehnt')
  );

COMMENT ON COLUMN public.partner_tip_submissions.admin_status IS
  'Bearbeitung: in_bearbeitung, vertragsabschluss_erfolgreich (Auszahlungslogik wie früher erledigt/bezahlt), abgelehnt (oft mit Admin-Archiv).';

COMMENT ON COLUMN public.partner_tip_submissions.paid_amount_eur IS
  'EUR: Einmalprovision (nicht betriebliche Leistungen) oder monatliche Provision bei Vertragsabschluss erfolgreich (betriebliche Pflegeberatung); siehe Provision-Logik.';
