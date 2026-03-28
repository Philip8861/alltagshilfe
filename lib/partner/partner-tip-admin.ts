import type { PartnerTipAdminStatus } from "@/lib/partner/types";

/** Partnerportal: Lesbare Status-Bezeichnungen (z. B. „Abgeschlossen“ statt „Erledigt“). */
export const PARTNER_TIP_STATUS_PARTNER_LABELS: Record<PartnerTipAdminStatus, string> = {
  neu: "In Bearbeitung",
  in_bearbeitung: "In Bearbeitung",
  erledigt: "Erfolgreich Abgeschlossen",
  abgelehnt: "Abgelehnt",
};

export function normalizePartnerTipAdminStatus(v: unknown): PartnerTipAdminStatus {
  if (v === "in_bearbeitung" || v === "erledigt" || v === "abgelehnt" || v === "neu") return v;
  return "neu";
}

export const PARTNER_TIP_ADMIN_STATUSES: PartnerTipAdminStatus[] = [
  "neu",
  "in_bearbeitung",
  "erledigt",
  "abgelehnt",
];

export const PARTNER_TIP_STATUS_LABELS: Record<PartnerTipAdminStatus, string> = {
  neu: "Neu",
  in_bearbeitung: "In Bearbeitung",
  erledigt: "Erledigt",
  abgelehnt: "Abgelehnt",
};
