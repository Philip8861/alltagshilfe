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

/** Große farbige Karten für Admin „Aktuelle Aufträge“ (pro Leistung). */
export const SERVICE_SLUG_AUFTRAEGE_ADMIN_CARD: Record<
  PartnerResponsibilitySlug,
  {
    wrap: string;
    header: string;
    stripe: string;
    kicker: string;
    title: string;
    counter: string;
    counterLabel: string;
    thead: string;
  }
> = {
  betriebliche_pflegeberatung: {
    wrap: "rounded-2xl border-2 border-sky-300/95 bg-gradient-to-br from-sky-50/95 via-white to-sky-50/40 shadow-[0_12px_40px_-18px_rgba(14,165,233,0.45)] ring-1 ring-sky-200/50",
    header: "border-b border-sky-200/80 bg-sky-100/50",
    stripe: "bg-sky-500 shadow-sm",
    kicker: "text-[#0F4F68]/70",
    title: "text-[#0F4F68]",
    counter:
      "min-w-[4.5rem] rounded-2xl border border-sky-200/90 bg-white/95 px-3 py-2 text-center shadow-inner ring-1 ring-sky-100/80",
    counterLabel: "text-[#0F4F68]/65",
    thead: "border-b border-sky-200/80 bg-sky-50/90 text-[#0F4F68]",
  },
  pflegehilfsmittel: {
    wrap: "rounded-2xl border-2 border-cyan-300/95 bg-gradient-to-br from-cyan-50/95 via-white to-cyan-50/40 shadow-[0_12px_40px_-18px_rgba(6,182,212,0.4)] ring-1 ring-cyan-200/50",
    header: "border-b border-cyan-200/80 bg-cyan-100/45",
    stripe: "bg-cyan-500 shadow-sm",
    kicker: "text-[#0F4F68]/70",
    title: "text-[#0F4F68]",
    counter:
      "min-w-[4.5rem] rounded-2xl border border-cyan-200/90 bg-white/95 px-3 py-2 text-center shadow-inner ring-1 ring-cyan-100/80",
    counterLabel: "text-[#0F4F68]/65",
    thead: "border-b border-cyan-200/80 bg-cyan-50/90 text-[#0F4F68]",
  },
  hauswirtschaft_betreuung: {
    wrap: "rounded-2xl border-2 border-indigo-300/95 bg-gradient-to-br from-indigo-50/95 via-white to-indigo-50/40 shadow-[0_12px_40px_-18px_rgba(99,102,241,0.35)] ring-1 ring-indigo-200/50",
    header: "border-b border-indigo-200/80 bg-indigo-100/40",
    stripe: "bg-indigo-500 shadow-sm",
    kicker: "text-[#0F4F68]/70",
    title: "text-[#0F4F68]",
    counter:
      "min-w-[4.5rem] rounded-2xl border border-indigo-200/90 bg-white/95 px-3 py-2 text-center shadow-inner ring-1 ring-indigo-100/80",
    counterLabel: "text-[#0F4F68]/65",
    thead: "border-b border-indigo-200/80 bg-indigo-50/90 text-[#0F4F68]",
  },
  pflegeberatung: {
    wrap: "rounded-2xl border-2 border-fuchsia-300/95 bg-gradient-to-br from-fuchsia-50/95 via-white to-fuchsia-50/40 shadow-[0_12px_40px_-18px_rgba(217,70,239,0.32)] ring-1 ring-fuchsia-200/50",
    header: "border-b border-fuchsia-200/80 bg-fuchsia-100/40",
    stripe: "bg-fuchsia-500 shadow-sm",
    kicker: "text-[#0F4F68]/70",
    title: "text-[#0F4F68]",
    counter:
      "min-w-[4.5rem] rounded-2xl border border-fuchsia-200/90 bg-white/95 px-3 py-2 text-center shadow-inner ring-1 ring-fuchsia-100/80",
    counterLabel: "text-[#0F4F68]/65",
    thead: "border-b border-fuchsia-200/80 bg-fuchsia-50/90 text-[#0F4F68]",
  },
};

export type ServiceAuftraegeAdminCardClasses =
  (typeof SERVICE_SLUG_AUFTRAEGE_ADMIN_CARD)[PartnerResponsibilitySlug];

export function serviceAuftraegeAdminCardClasses(slug: string): ServiceAuftraegeAdminCardClasses {
  const s = slug as PartnerResponsibilitySlug;
  return SERVICE_SLUG_AUFTRAEGE_ADMIN_CARD[s] ?? SERVICE_SLUG_AUFTRAEGE_ADMIN_CARD.betriebliche_pflegeberatung;
}
