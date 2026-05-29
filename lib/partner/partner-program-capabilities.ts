import {
  PARTNER_RESPONSIBILITY_SLUGS,
  type PartnerResponsibilitySlug,
} from "@/lib/partner/responsibility-areas";

/** Leistungen mit Einmalprovision (nicht betriebliche Abschlussprovision). */
export const PARTNER_EINMAL_PROVISION_SLUGS = [
  "pflegehilfsmittel",
  "hauswirtschaft_betreuung",
  "pflegeberatung",
] as const satisfies readonly PartnerResponsibilitySlug[];

export type PartnerEinmalProvisionSlug = (typeof PARTNER_EINMAL_PROVISION_SLUGS)[number];

export const PARTNER_BETRIEBLICH_SLUG: PartnerResponsibilitySlug = "betriebliche_pflegeberatung";

const einmalSet = new Set<string>(PARTNER_EINMAL_PROVISION_SLUGS);

export function partnerHasEinmalProvisionProgram(
  responsibilityAreas: string[] | null | undefined,
): boolean {
  return (responsibilityAreas ?? []).some((s) => einmalSet.has(s));
}

export function partnerHasBetrieblicheProgram(
  responsibilityAreas: string[] | null | undefined,
): boolean {
  return (responsibilityAreas ?? []).includes(PARTNER_BETRIEBLICH_SLUG);
}

export function partnerHasWerbenetzwerkProgram(
  responsibilityAreas: string[] | null | undefined,
): boolean {
  return partnerHasBetrieblicheProgram(responsibilityAreas);
}

/** Tipp-Abgabe: mindestens eine freigeschaltete Leistung. */
export function partnerHasAnyTipProgram(responsibilityAreas: string[] | null | undefined): boolean {
  const set = new Set<string>(PARTNER_RESPONSIBILITY_SLUGS);
  return (responsibilityAreas ?? []).some((s) => set.has(s));
}
