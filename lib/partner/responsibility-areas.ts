/** Werte in DB (partner_profiles.responsibility_areas) */
export const PARTNER_RESPONSIBILITY_SLUGS = [
  "betriebliche_pflegeberatung",
  "pflegehilfsmittel",
  "hauswirtschaft_betreuung",
  "pflegeberatung",
] as const;

export type PartnerResponsibilitySlug = (typeof PARTNER_RESPONSIBILITY_SLUGS)[number];

export const PARTNER_RESPONSIBILITY_LABELS: Record<PartnerResponsibilitySlug, string> = {
  betriebliche_pflegeberatung: "Betriebliche Pflegeberatung",
  pflegehilfsmittel: "Pflegehilfsmittel",
  hauswirtschaft_betreuung: "Hauswirtschaft & Betreuung",
  pflegeberatung: "Pflegeberatung",
};

export function parseResponsibilityAreasFromForm(values: string[]): PartnerResponsibilitySlug[] {
  const set = new Set(PARTNER_RESPONSIBILITY_SLUGS);
  const out: PartnerResponsibilitySlug[] = [];
  for (const v of values) {
    const t = v.trim();
    if (set.has(t as PartnerResponsibilitySlug)) out.push(t as PartnerResponsibilitySlug);
  }
  return out;
}

export function formatResponsibilityAreasList(areas: string[] | null | undefined): string {
  if (!areas?.length) return "—";
  return areas
    .map((a) => PARTNER_RESPONSIBILITY_LABELS[a as PartnerResponsibilitySlug] ?? a)
    .join(", ");
}
