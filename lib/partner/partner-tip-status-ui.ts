import type { PartnerTipAdminStatus } from "@/lib/partner/types";

/** Farbcodierung Status (Partner-Dashboard). */
export const PARTNER_TIP_STATUS_BADGE_CLASS: Record<PartnerTipAdminStatus, string> = {
  in_bearbeitung: "border-amber-400/80 bg-amber-50 text-amber-950 ring-1 ring-amber-200/90",
  vertragsabschluss_erfolgreich:
    "border-emerald-400/80 bg-emerald-600 text-white ring-1 ring-emerald-200/90",
  abgelehnt: "border-rose-400/80 bg-rose-50 text-rose-950 ring-1 ring-rose-200/90",
};

/** Rahmen/Fokus für Status-Dropdown im Admin (sichtbare Status-Farben) */
export const PARTNER_TIP_STATUS_SELECT_CLASS: Record<PartnerTipAdminStatus, string> = {
  in_bearbeitung: "border-amber-300 bg-amber-50/50 focus:border-amber-500 focus:ring-amber-500/25",
  vertragsabschluss_erfolgreich:
    "border-emerald-300 bg-emerald-50/40 focus:border-emerald-600 focus:ring-emerald-500/25",
  abgelehnt: "border-rose-300 bg-rose-50/40 focus:border-rose-600 focus:ring-rose-500/25",
};
