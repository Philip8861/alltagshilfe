import type { PartnerResponsibilitySlug } from "@/lib/partner/responsibility-areas";

/**
 * Feste Reihenfolge + Farben für die vier Leistungen (Admin & Partner-UI).
 * Reihenfolge: Petrol → Orange → Smaragd → Violett
 */
export const SERVICE_SLUG_ORDER: PartnerResponsibilitySlug[] = [
  "betriebliche_pflegeberatung",
  "pflegehilfsmittel",
  "hauswirtschaft_betreuung",
  "pflegeberatung",
];

export const SERVICE_SLUG_BADGE_CLASS: Record<PartnerResponsibilitySlug, string> = {
  betriebliche_pflegeberatung:
    "border-sky-300/80 bg-sky-50 text-sky-900 ring-1 ring-sky-200/80",
  pflegehilfsmittel:
    "border-cyan-300/80 bg-cyan-50 text-cyan-900 ring-1 ring-cyan-200/80",
  hauswirtschaft_betreuung:
    "border-indigo-300/80 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-200/80",
  pflegeberatung:
    "border-fuchsia-300/80 bg-fuchsia-50 text-fuchsia-900 ring-1 ring-fuchsia-200/80",
};

export function serviceBadgeClass(slug: string): string {
  const s = slug as PartnerResponsibilitySlug;
  return SERVICE_SLUG_BADGE_CLASS[s] ?? "border-neutral-200 bg-neutral-100 text-neutral-800";
}

/** Vertikaler Farbstreifen / Punkt in Listen (Modal „Tipp geben“) — getrennt von Statusfarben */
export const SERVICE_SLUG_ACCENT: Record<PartnerResponsibilitySlug, string> = {
  betriebliche_pflegeberatung: "bg-sky-500",
  pflegehilfsmittel: "bg-cyan-500",
  hauswirtschaft_betreuung: "bg-indigo-500",
  pflegeberatung: "bg-fuchsia-500",
};

export function serviceAccentClass(slug: string): string {
  const s = slug as PartnerResponsibilitySlug;
  return SERVICE_SLUG_ACCENT[s] ?? "bg-neutral-400";
}

/** Linker Akzent an Tabellenzeilen (Admin Aufträge), passend zu den Leistungs-Badges */
export const SERVICE_SLUG_ROW_ACCENT: Record<PartnerResponsibilitySlug, string> = {
  betriebliche_pflegeberatung: "border-l-4 border-l-sky-500",
  pflegehilfsmittel: "border-l-4 border-l-cyan-500",
  hauswirtschaft_betreuung: "border-l-4 border-l-indigo-500",
  pflegeberatung: "border-l-4 border-l-fuchsia-500",
};

export function serviceRowAccentBorderClass(slug: string): string {
  const s = slug as PartnerResponsibilitySlug;
  return SERVICE_SLUG_ROW_ACCENT[s] ?? "border-l-4 border-l-neutral-300";
}

/** Hintergrund + linker Streifen für Spalte „Typ“ in Partner-Statuslisten */
export const SERVICE_SLUG_TIP_TABLE_CELL: Record<PartnerResponsibilitySlug, string> = {
  betriebliche_pflegeberatung: "border-l-[3px] border-l-sky-500 bg-sky-50/90",
  pflegehilfsmittel: "border-l-[3px] border-l-cyan-500 bg-cyan-50/90",
  hauswirtschaft_betreuung: "border-l-[3px] border-l-indigo-500 bg-indigo-50/90",
  pflegeberatung: "border-l-[3px] border-l-fuchsia-500 bg-fuchsia-50/90",
};

export function serviceTipTableTypCellClass(slug: string): string {
  const s = slug as PartnerResponsibilitySlug;
  return SERVICE_SLUG_TIP_TABLE_CELL[s] ?? "border-l-[3px] border-l-neutral-400 bg-neutral-50/90";
}
