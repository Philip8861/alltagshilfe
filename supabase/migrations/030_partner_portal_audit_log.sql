-- Audit-Verlauf für Partnerportal (Tipps, Status, Provisionen — keine Seitenklicks)

CREATE TABLE IF NOT EXISTS public.partner_portal_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  event_kind text NOT NULL,
  subject_partner_id uuid REFERENCES public.partner_profiles(id) ON DELETE SET NULL,
  actor_kind text NOT NULL CHECK (actor_kind IN ('partner', 'admin', 'system')),
  actor_partner_id uuid REFERENCES public.partner_profiles(id) ON DELETE SET NULL,
  actor_label text,
  tip_id uuid REFERENCES public.partner_tip_submissions(id) ON DELETE SET NULL,
  summary text NOT NULL,
  detail_json jsonb
);

CREATE INDEX IF NOT EXISTS partner_portal_audit_log_created_at_idx
  ON public.partner_portal_audit_log (created_at DESC);

CREATE INDEX IF NOT EXISTS partner_portal_audit_log_subject_idx
  ON public.partner_portal_audit_log (subject_partner_id, created_at DESC);

COMMENT ON TABLE public.partner_portal_audit_log IS
  'Nachvollziehbarkeit: Tipp-Eingänge, Status, Archiv, Provisionen — ohne Navigations-Events.';
