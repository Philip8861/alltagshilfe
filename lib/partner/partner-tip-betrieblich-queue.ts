import type { PartnerTipAdminStatus, PartnerTipSubmissionRow } from "@/lib/partner/types";

export const BETRIEBLICHE_PFLEGEBERATUNG_SLUG = "betriebliche_pflegeberatung";

export function isBetrieblichServiceSlug(slug: string): boolean {
  return slug === BETRIEBLICHE_PFLEGEBERATUNG_SLUG;
}

/** Admin „Aufträge“: nur Tipps mit Status „In Bearbeitung“ (alle Leistungen). */
export function inAdminAuftraegeQueue(t: PartnerTipSubmissionRow): boolean {
  return t.admin_status === "in_bearbeitung";
}

/** Betriebliche Pflegeberatung mit erfolgreichem Vertragsabschluss (laufend). */
export function inAdminAktiveUnternehmen(t: PartnerTipSubmissionRow): boolean {
  if (!isBetrieblichServiceSlug(t.service_slug)) return false;
  if (t.admin_status !== "vertragsabschluss_erfolgreich") return false;
  /** Legacy: manuell als ehemalig markiert, bis Status auf „Vertrag gekündigt“ gesetzt wird. */
  if (t.former_active_company_at) return false;
  return true;
}

/** Betriebliche Pflegeberatung: Vertrag gekündigt oder legacy ehemalig markiert. */
export function inAdminEhemaligeUnternehmen(t: PartnerTipSubmissionRow): boolean {
  if (!isBetrieblichServiceSlug(t.service_slug)) return false;
  if (t.admin_status === "vertrag_gekuendigt") return true;
  return (
    t.admin_status === "vertragsabschluss_erfolgreich" && Boolean(t.former_active_company_at)
  );
}

/**
 * Admin „Archiv“: alle Tipps ohne Status „In Bearbeitung“, die nicht unter Aktive/Ehemalige (betrieblich) liegen.
 * Sortierung nach Leistung — unabhängig von Provision oder archived_at (Abrechnungs-Markierung).
 */
export function inAdminArchivQueue(t: PartnerTipSubmissionRow): boolean {
  if (t.admin_status === "in_bearbeitung") return false;
  if (inAdminAktiveUnternehmen(t) || inAdminEhemaligeUnternehmen(t)) return false;
  return true;
}

/** @deprecated Nur noch für Abwärtskompatibilität in Auszahlungs-Hinweisen. */
export function isBetrieblichMitMonatsprovisionRow(t: {
  service_slug: string;
  admin_status: PartnerTipAdminStatus;
  paid_amount_eur: number | null;
}): boolean {
  return inAdminAktiveUnternehmen(t as PartnerTipSubmissionRow);
}

export function adminSectionForTip(t: PartnerTipSubmissionRow): "auftraege" | "aktive_unternehmen" | "archiv" {
  if (inAdminAktiveUnternehmen(t) || inAdminEhemaligeUnternehmen(t)) return "aktive_unternehmen";
  if (inAdminArchivQueue(t)) return "archiv";
  return "auftraege";
}
