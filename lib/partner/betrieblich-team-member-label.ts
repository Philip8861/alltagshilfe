import type { PartnerProfile } from "@/lib/partner/types";
import { partnerPortalGreetingName } from "@/lib/partner/partner-portal-greeting";

/** Kurzname für Teamliste (ohne „Herr/Frau“). */
export function partnerTeamMemberLabel(
  profile: Pick<PartnerProfile, "first_name" | "last_name" | "display_name" | "organization_name">,
  fallbackEmail?: string,
): string {
  const fn = profile.first_name?.trim();
  const ln = profile.last_name?.trim();
  if (fn && ln) return `${fn} ${ln}`;
  if (ln) return ln;
  if (fn) return fn;
  const d = profile.display_name?.trim();
  if (d) return d;
  const o = profile.organization_name?.trim();
  if (o) return o;
  return partnerPortalGreetingName(profile as PartnerProfile, fallbackEmail);
}

/** Formulierung für Einladungs-E-Mail („Herr/Frau Nachname“ / Fallback). */
export function partnerTeamInviteFormalInviter(
  profile: Pick<PartnerProfile, "salutation" | "first_name" | "last_name" | "display_name" | "organization_name">,
): string {
  const ln = profile.last_name?.trim();
  if (profile.salutation === "herr") return ln ? `Herr ${ln}` : "Ein Kollege/Kollegin";
  if (profile.salutation === "frau") return ln ? `Frau ${ln}` : "Eine Kollegin/ein Kollege";
  return partnerTeamMemberLabel(profile);
}
