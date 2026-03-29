import type { PartnerTipAdminStatus } from "@/lib/partner/types";

const STATUS_SET = new Set<string>([
  "neu",
  "in_bearbeitung",
  "termin_vereinbart",
  "warten_auf_rueckmeldung",
  "bezahlt",
  "erledigt",
  "abgelehnt",
]);

/** Admin-Dropdown / interne Bezeichnungen */
export const PARTNER_TIP_STATUS_LABELS: Record<PartnerTipAdminStatus, string> = {
  neu: "Neu",
  in_bearbeitung: "In Bearbeitung",
  termin_vereinbart: "Termin vereinbart",
  warten_auf_rueckmeldung: "Warten auf Rückmeldung",
  bezahlt: "Bezahlt",
  erledigt: "Vertragsabschluss erfolgreich",
  abgelehnt: "Abgelehnt",
};

/** Partnerportal Statusliste: was der Partner sieht */
export const PARTNER_TIP_STATUS_PARTNER_LABELS: Record<PartnerTipAdminStatus, string> = {
  neu: "Neu",
  in_bearbeitung: "In Bearbeitung",
  termin_vereinbart: "Termin vereinbart",
  warten_auf_rueckmeldung: "Warten auf Rückmeldung",
  bezahlt: "Bezahlt",
  erledigt: "Vertragsabschluss erfolgreich",
  abgelehnt: "Abgelehnt",
};

export const PARTNER_TIP_ADMIN_STATUSES: PartnerTipAdminStatus[] = [
  "neu",
  "in_bearbeitung",
  "termin_vereinbart",
  "warten_auf_rueckmeldung",
  "bezahlt",
  "erledigt",
  "abgelehnt",
];

export function normalizePartnerTipAdminStatus(v: unknown): PartnerTipAdminStatus {
  if (typeof v === "string" && STATUS_SET.has(v)) return v as PartnerTipAdminStatus;
  return "neu";
}

/** Null/leer aus DB / API */
export function normalizeAdminVisibleNote(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
}

export function normalizeArchivedAt(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
}
