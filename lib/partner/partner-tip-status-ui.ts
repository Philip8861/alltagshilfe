import type { PartnerTipAdminStatus } from "@/lib/partner/types";

/** Farbcodierung Status (Partner-Dashboard). */
export const PARTNER_TIP_STATUS_BADGE_CLASS: Record<PartnerTipAdminStatus, string> = {
  neu: "border-sky-300/80 bg-sky-50 text-sky-950 ring-1 ring-sky-200/90",
  in_bearbeitung: "border-amber-400/80 bg-amber-50 text-amber-950 ring-1 ring-amber-200/90",
  erledigt: "border-emerald-400/80 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-200/90",
  abgelehnt: "border-rose-400/80 bg-rose-50 text-rose-950 ring-1 ring-rose-200/90",
};
