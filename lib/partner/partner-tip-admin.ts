import type { PartnerTipAdminStatus } from "@/lib/partner/types";

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
