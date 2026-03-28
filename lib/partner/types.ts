export type PartnerRole = "partner" | "admin";

export type PartnerSalutation = "herr" | "frau";

export type PartnerProfile = {
  id: string;
  display_name: string | null;
  organization_name: string | null;
  role: PartnerRole;
  created_at?: string;
  updated_at?: string;
  /** Anrede für Begrüßung „Willkommen, Herr/Frau …“ (Migration 006). */
  salutation?: PartnerSalutation | null;
  /** Individueller Partnercode, z. B. HM4827 (Migration 007). */
  partner_referral_code?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  recruited_by?: string | null;
  phone?: string | null;
  responsibility_areas?: string[] | null;
  /** Gesetzt, wenn der Partner das Passwort selbst geändert hat (kein Klartext). */
  password_changed_at?: string | null;
};

export type PartnerTipAdminStatus = "neu" | "in_bearbeitung" | "erledigt" | "abgelehnt";

export type PartnerTipSubmissionRow = {
  id: string;
  partner_id: string;
  service_slug: string;
  payload: Record<string, unknown>;
  created_at: string;
  admin_status: PartnerTipAdminStatus;
};

/** Partner-Dashboard: eigene Tippgeber-Einträge ohne partner_id im Client. */
export type PartnerDashboardTipSerial = Pick<
  PartnerTipSubmissionRow,
  "id" | "service_slug" | "payload" | "created_at" | "admin_status"
>;

export type PflegeboxOrderRow = {
  id: string;
  partner_id: string | null;
  external_reference: string | null;
  status: string;
  summary_json: Record<string, unknown> | null;
  created_at: string;
};
