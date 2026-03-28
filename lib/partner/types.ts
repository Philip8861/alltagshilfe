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
  first_name?: string | null;
  last_name?: string | null;
  recruited_by?: string | null;
  phone?: string | null;
  responsibility_areas?: string[] | null;
  /** Gesetzt, wenn der Partner das Passwort selbst geändert hat (kein Klartext). */
  password_changed_at?: string | null;
};

export type PflegeboxOrderRow = {
  id: string;
  partner_id: string | null;
  external_reference: string | null;
  status: string;
  summary_json: Record<string, unknown> | null;
  created_at: string;
};
