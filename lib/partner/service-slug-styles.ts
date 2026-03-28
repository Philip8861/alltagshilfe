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
