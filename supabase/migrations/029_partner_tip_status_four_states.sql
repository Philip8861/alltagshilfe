-- Vier Verwaltungs-Status für Partner-Tipps (Migration 029).
-- Ersetzt „abgelehnt“ durch „nicht_erfolgreich“ und ergänzt „vertrag_gekuendigt“.

UPDATE public.partner_tip_submissions
SET admin_status = 'nicht_erfolgreich'
WHERE admin_status = 'abgelehnt';

UPDATE public.partner_tip_submissions
SET partner_archived_at = COALESCE(partner_archived_at, archived_at, now())
WHERE admin_status IN ('nicht_erfolgreich', 'vertrag_gekuendigt')
  AND partner_archived_at IS NULL;

ALTER TABLE public.partner_tip_submissions
  DROP CONSTRAINT IF EXISTS partner_tip_submissions_admin_status_check;

ALTER TABLE public.partner_tip_submissions
  ADD CONSTRAINT partner_tip_submissions_admin_status_check
  CHECK (
    admin_status IN (
      'in_bearbeitung',
      'vertragsabschluss_erfolgreich',
      'nicht_erfolgreich',
      'vertrag_gekuendigt'
    )
  );

COMMENT ON COLUMN public.partner_tip_submissions.admin_status IS
  'in_bearbeitung (Standard), vertragsabschluss_erfolgreich (Provision), nicht_erfolgreich / vertrag_gekuendigt (keine Provision, Partner-Archiv).';
