import type { PartnerTipAdminStatus } from "@/lib/partner/types";

/** Haupfarbe Partnerportal / Admin */
export const CHART_TEAL = "#0F4F68";
export const CHART_EMERALD = "#059669";
export const CHART_AMBER = "#d97706";
export const CHART_ROSE = "#e11d48";
export const CHART_VIOLET = "#7c3aed";
export const CHART_SKY = "#0284c7";
export const CHART_SLATE = "#64748b";
/** Status „Bezahlt“ in Diagrammen (klares Grün, gut von Erledigt/Emerald unterscheidbar). */
export const CHART_GREEN = "#15803d";

export const ADMIN_STATUS_CHART_COLOR: Record<PartnerTipAdminStatus, string> = {
  in_bearbeitung: CHART_AMBER,
  termin_vereinbart: CHART_SKY,
  warten_auf_rueckmeldung: CHART_VIOLET,
  bezahlt: CHART_GREEN,
  erledigt: CHART_EMERALD,
  abgelehnt: CHART_ROSE,
};

export const CHART_AXIS_TICK = "#475569";
export const CHART_GRID = "#e2e8f0";
