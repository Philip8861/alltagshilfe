import type { PartnerTipAdminStatus } from "@/lib/partner/types";

const CANONICAL: readonly PartnerTipAdminStatus[] = [
  "in_bearbeitung",
  "vertragsabschluss_erfolgreich",
  "nicht_erfolgreich",
  "vertrag_gekuendigt",
];

const CANONICAL_SET = new Set<string>(CANONICAL);

/** Historische DB-/Client-Werte → kanonischer Status. */
function mapLegacyToCanonical(v: string): PartnerTipAdminStatus {
  switch (v) {
    case "erledigt":
    case "bezahlt":
      return "vertragsabschluss_erfolgreich";
    case "neu":
    case "termin_vereinbart":
    case "warten_auf_rueckmeldung":
      return "in_bearbeitung";
    case "abgelehnt":
      return "nicht_erfolgreich";
    default:
      return "in_bearbeitung";
  }
}

/** Admin-Dropdown / interne Bezeichnungen */
export const PARTNER_TIP_STATUS_LABELS: Record<PartnerTipAdminStatus, string> = {
  in_bearbeitung: "In Bearbeitung",
  vertragsabschluss_erfolgreich: "Vertragsabschluss erfolgreich",
  nicht_erfolgreich: "Nicht erfolgreich",
  vertrag_gekuendigt: "Vertrag gekündigt",
};

/** Partnerportal Statusliste: was der Partner sieht */
export const PARTNER_TIP_STATUS_PARTNER_LABELS: Record<PartnerTipAdminStatus, string> = {
  ...PARTNER_TIP_STATUS_LABELS,
};

export const PARTNER_TIP_ADMIN_STATUSES: PartnerTipAdminStatus[] = [...CANONICAL];

export const PARTNER_TIP_NEGATIVE_STATUSES: PartnerTipAdminStatus[] = [
  "nicht_erfolgreich",
  "vertrag_gekuendigt",
];

export function isPartnerTipNegativeStatus(status: PartnerTipAdminStatus): boolean {
  return status === "nicht_erfolgreich" || status === "vertrag_gekuendigt";
}

export function partnerTipStatusTriggersProvision(status: PartnerTipAdminStatus): boolean {
  return status === "vertragsabschluss_erfolgreich";
}

/** Legacy „neu“ und unbekannte Werte werden auf eine der vier Stufen gemappt. */
export function normalizePartnerTipAdminStatus(v: unknown): PartnerTipAdminStatus {
  if (typeof v === "string") {
    const t = v.trim();
    if (CANONICAL_SET.has(t)) return t as PartnerTipAdminStatus;
    return mapLegacyToCanonical(t);
  }
  return "in_bearbeitung";
}

/** Null/leer aus DB / API */
export function normalizeAdminVisibleNote(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
}

export function normalizeArchivedAt(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
}

/** Migration 012: Partner-Listen-Archiv (nur Sortierung, keine Auszahlungslogik). */
export function normalizePartnerArchivedAt(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
}

/** Migration 012: Admin „Ehemalige Unternehmen“. */
export function normalizeFormerActiveCompanyAt(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length > 0 ? s : null;
}
