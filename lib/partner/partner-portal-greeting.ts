import type { PartnerProfile } from "@/lib/partner/types";

/** Formale Ansprache für Begrüßung (Nachname bevorzugt, sonst Vorname). */
function ansprechpartnerKurzname(profile: PartnerProfile, email: string | undefined): string {
  const ln = profile.last_name?.trim();
  const fn = profile.first_name?.trim();
  if (ln) return ln;
  if (fn) return fn;
  return partnerPortalGreetingName(profile, email);
}

/**
 * Begrüßungszeile im Partnerportal-Kopf.
 * Mit Anrede (Migration 006): „Willkommen, Herr/Frau …“.
 */
export function partnerPortalWelcomeLine(profile: PartnerProfile, email: string | undefined): string {
  const name = ansprechpartnerKurzname(profile, email);
  if (profile.salutation === "herr") return `Willkommen, Herr ${name}`;
  if (profile.salutation === "frau") return `Willkommen, Frau ${name}`;
  return `Willkommen, ${partnerPortalGreetingName(profile, email)}`;
}

/** Große Überschrift auf der Partner-Übersicht („du“-Ansprache). */
export function partnerDashboardWelcomeHeadline(profile: PartnerProfile, email: string | undefined): string {
  const name = ansprechpartnerKurzname(profile, email);
  if (profile.salutation === "herr") return `Willkommen, Herr ${name} in deinem Partnerportal.`;
  if (profile.salutation === "frau") return `Willkommen, Frau ${name} in deinem Partnerportal.`;
  return `Willkommen, ${partnerPortalGreetingName(profile, email)} in deinem Partnerportal.`;
}

/** Reine Logik, server- und clientnutzbar (nicht in „use client“-Dateien exportieren). */
export function partnerPortalGreetingName(
  profile: PartnerProfile,
  email: string | undefined,
): string {
  const fn = profile.first_name?.trim();
  const ln = profile.last_name?.trim();
  if (fn && ln) return `${fn} ${ln}`;
  if (fn) return fn;
  const d = profile.display_name?.trim();
  if (d) return d;
  const o = profile.organization_name?.trim();
  if (o) return o;
  const e = email?.trim();
  if (e) {
    const at = e.indexOf("@");
    if (at > 0) return e.slice(0, at);
    return e;
  }
  return "Partner";
}
