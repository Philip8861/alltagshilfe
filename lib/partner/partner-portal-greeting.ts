import type { PartnerProfile } from "@/lib/partner/types";

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
