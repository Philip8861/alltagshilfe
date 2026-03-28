import type { SupabaseClient } from "@supabase/supabase-js";

function firstInitial(name: string): string {
  const t = name.trim();
  if (!t) return "X";
  const ch = [...t][0];
  if (!ch) return "X";
  const u = ch.toLocaleUpperCase("de-DE");
  return /^[A-ZÄÖÜ]$/.test(u) ? u : "X";
}

/** Ein Kandidat: 2 Buchstaben + 4 Ziffern (1000–9999). */
export function buildPartnerReferralCodeCandidate(firstName: string, lastName: string): string {
  return `${firstInitial(firstName)}${firstInitial(lastName)}${Math.floor(1000 + Math.random() * 9000)}`;
}

/**
 * Erzeugt einen in partner_profiles noch nicht vergebenen Code (Service Role).
 */
export async function assignUniquePartnerReferralCode(
  svc: SupabaseClient,
  firstName: string,
  lastName: string,
): Promise<string> {
  for (let i = 0; i < 30; i++) {
    const code = buildPartnerReferralCodeCandidate(firstName, lastName);
    const { data } = await svc.from("partner_profiles").select("id").eq("partner_referral_code", code).maybeSingle();
    if (!data?.id) return code;
  }
  throw new Error("partner_referral_code_unique_failed");
}
