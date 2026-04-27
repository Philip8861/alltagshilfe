import type { PartnerTipAdminStatus } from "@/lib/partner/types";

/** Farbcodierung Status (Partner-Dashboard). */
export const PARTNER_TIP_STATUS_BADGE_CLASS: Record<PartnerTipAdminStatus, string> = {
  in_bearbeitung: "border-amber-400/80 bg-amber-50 text-amber-950 ring-1 ring-amber-200/90",
  termin_vereinbart: "border-indigo-300/80 bg-indigo-50 text-indigo-950 ring-1 ring-indigo-200/90",
  warten_auf_rueckmeldung: "border-violet-300/80 bg-violet-50 text-violet-950 ring-1 ring-violet-200/90",
  bezahlt: "border-green-600/80 bg-green-50 text-green-900 ring-1 ring-green-300/90",
  erledigt: "border-emerald-400/80 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-200/90",
  abgelehnt: "border-rose-400/80 bg-rose-50 text-rose-950 ring-1 ring-rose-200/90",
};

/** Rahmen/Fokus für Status-Dropdown im Admin (sichtbare Status-Farben) */
export const PARTNER_TIP_STATUS_SELECT_CLASS: Record<PartnerTipAdminStatus, string> = {
  in_bearbeitung: "border-amber-300 bg-amber-50/50 focus:border-amber-500 focus:ring-amber-500/25",
  termin_vereinbart: "border-indigo-300 bg-indigo-50/40 focus:border-indigo-500 focus:ring-indigo-500/25",
  warten_auf_rueckmeldung: "border-violet-300 bg-violet-50/40 focus:border-violet-500 focus:ring-violet-500/25",
  bezahlt: "border-green-500 bg-green-50/80 focus:border-green-600 focus:ring-green-500/25",
  erledigt: "border-emerald-300 bg-emerald-50/40 focus:border-emerald-600 focus:ring-emerald-500/25",
  abgelehnt: "border-rose-300 bg-rose-50/40 focus:border-rose-600 focus:ring-rose-500/25",
};
