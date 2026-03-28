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
    "border-[#0F4F68]/35 bg-[#E8F4F7] text-[#0a3d52] ring-1 ring-[#0F4F68]/15",
  pflegehilfsmittel:
    "border-[#F78F2E]/40 bg-[#FFF5ED] text-[#9a4a0a] ring-1 ring-[#F78F2E]/20",
  hauswirtschaft_betreuung:
    "border-emerald-300/60 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-200/80",
  pflegeberatung:
    "border-violet-300/70 bg-violet-50 text-violet-950 ring-1 ring-violet-200/80",
};

export function serviceBadgeClass(slug: string): string {
  const s = slug as PartnerResponsibilitySlug;
  return SERVICE_SLUG_BADGE_CLASS[s] ?? "border-neutral-200 bg-neutral-100 text-neutral-800";
}
