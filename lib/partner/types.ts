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
  /** Auszahlung (Migration 011). */
  iban?: string | null;
  bic?: string | null;
  account_holder?: string | null;
  /** Anzeige-Einstellungen Partnerportal (Migration 013). */
  portal_preferences?: Record<string, unknown> | null;
};

export type PartnerTipAdminStatus =
  | "in_bearbeitung"
  | "termin_vereinbart"
  | "warten_auf_rueckmeldung"
  | "bezahlt"
  | "erledigt"
  | "abgelehnt";

export type PartnerTipSubmissionRow = {
  id: string;
  partner_id: string;
  service_slug: string;
  payload: Record<string, unknown>;
  created_at: string;
  admin_status: PartnerTipAdminStatus;
  /** Vom Admin für den Partner sichtbare Notiz (nicht Payload). */
  admin_visible_note: string | null;
  archived_at: string | null;
  /** Partner-Archiv nur für Übersicht (Migration 012); ohne Einfluss auf Abrechnung. */
  partner_archived_at: string | null;
  /** Admin: Betriebskunde als ehemalig markiert (Migration 012). */
  former_active_company_at: string | null;
  /** Auszahlungsbetrag EUR bei Status bezahlt (Migration 010). */
  paid_amount_eur: number | null;
  /** Abgerechneter Kalendermonat YYYY-MM nach Monatslauf (Migration 011). */
  payout_settled_period_key: string | null;
};

/** Partner-Dashboard: eigene Tippgeber-Einträge ohne partner_id im Client. */
export type PartnerDashboardTipSerial = Pick<
  PartnerTipSubmissionRow,
  | "id"
  | "service_slug"
  | "payload"
  | "created_at"
  | "admin_status"
  | "admin_visible_note"
  | "archived_at"
  | "partner_archived_at"
  | "paid_amount_eur"
  | "payout_settled_period_key"
>;

/** Eine Zeile aus partner_payout_reports (Admin-Auszahlungsbericht). */
export type PartnerPayoutReportRow = {
  id: string;
  period_key: string;
  partner_id: string;
  einmal_eur: number;
  monatlich_eur: number;
  total_eur: number;
  created_at?: string;
};

/** Gruppierter Auszahlungsbericht für die Partner-Verwaltung. */
export type PartnerAdminPayoutPeriod = {
  periodKey: string;
  labelDe: string;
  rows: Array<
    PartnerPayoutReportRow & {
      email: string;
      profile: PartnerProfile | null;
    }
  >;
};

export type PflegeboxOrderRow = {
  id: string;
  partner_id: string | null;
  external_reference: string | null;
  status: string;
  summary_json: Record<string, unknown> | null;
  created_at: string;
};
