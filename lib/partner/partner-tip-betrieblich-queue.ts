import { normalizePaidAmountEur } from "@/lib/partner/partner-tip-payout";
import type { PartnerTipAdminStatus, PartnerTipSubmissionRow } from "@/lib/partner/types";

export const BETRIEBLICHE_PFLEGEBERATUNG_SLUG = "betriebliche_pflegeberatung";

/** Betriebliche Pflegeberatung mit erfasster Monatsprovision (Vertrag / früher „Bezahlt“). */
export function isBetrieblichMitMonatsprovisionRow(t: {
  service_slug: string;
  admin_status: PartnerTipAdminStatus;
  paid_amount_eur: number | null;
}): boolean {
  if (t.service_slug !== BETRIEBLICHE_PFLEGEBERATUNG_SLUG) return false;
  const paid = normalizePaidAmountEur(t.paid_amount_eur);
  if (paid == null || paid <= 0) return false;
  return t.admin_status === "erledigt" || t.admin_status === "bezahlt";
}

/** Admin „Aktuelle Aufträge“: nicht archiviert und kein abgeschlossener Betriebsfall mit Provision. */
export function inAdminAuftraegeQueue(t: PartnerTipSubmissionRow): boolean {
  if (t.archived_at) return false;
  return !isBetrieblichMitMonatsprovisionRow(t);
}

/** Admin „Aktive Unternehmen“. */
export function inAdminAktiveUnternehmen(t: PartnerTipSubmissionRow): boolean {
  if (t.archived_at) return false;
  return isBetrieblichMitMonatsprovisionRow(t);
}
