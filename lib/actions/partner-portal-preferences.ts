"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { normalizePortalPreferences, parsePortalPreferences, type PartnerPortalPreferences } from "@/lib/partner/portal-preferences";
import { getPartnerSession, isPartnerAccountDisabled, PARTNER_ACCOUNT_DISABLED_MESSAGE } from "@/lib/partner/auth";
import { rateLimitPartnerPortalPrefs } from "@/lib/rate-limit";
import { partnerPortalPreferencesSchema } from "@/lib/validations/partner-portal-preferences";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type PortalPrefsState = { ok: true; message: string } | { ok: false; message: string };

export async function savePartnerPortalPreferencesAction(
  _prev: PortalPrefsState | null,
  formData: FormData,
): Promise<PortalPrefsState> {
  const session = await getPartnerSession();
  if (!session?.profile?.id) {
    return { ok: false, message: "Nicht angemeldet." };
  }

  if (isPartnerAccountDisabled(session.profile)) {
    return { ok: false, message: PARTNER_ACCOUNT_DISABLED_MESSAGE };
  }

  try {
    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip")?.trim() ?? "unknown";
    const limited = rateLimitPartnerPortalPrefs(`${ip}:${session.profile.id}`);
    if (!limited.success) {
      return { ok: false, message: "Zu viele Speichervorgänge. Bitte später erneut versuchen." };
    }
  } catch {
    /* ignore */
  }

  const raw = formData.get("preferences_json");
  if (typeof raw !== "string") {
    return { ok: false, message: "Ungültige Daten." };
  }
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    return { ok: false, message: "JSON ungültig." };
  }

  const parsed = partnerPortalPreferencesSchema.safeParse(parsedJson);
  if (!parsed.success) {
    return { ok: false, message: "Eingaben ungültig." };
  }

  const normalized = normalizePortalPreferences(parsed.data as PartnerPortalPreferences);

  const supabase = await createSupabaseServerClient();
  const { data: prefRow, error: loadErr } = await supabase
    .from("partner_profiles")
    .select("portal_preferences")
    .eq("id", session.profile.id)
    .maybeSingle();

  if (loadErr) {
    return { ok: false, message: "Profil konnte nicht geladen werden." };
  }

  const existing = normalizePortalPreferences(parsePortalPreferences(prefRow?.portal_preferences));
  const merged = normalizePortalPreferences({
    ...normalized,
    password_prompt_suppressed: existing.password_prompt_suppressed,
  });

  const { error } = await supabase
    .from("partner_profiles")
    .update({ portal_preferences: merged })
    .eq("id", session.profile.id);

  if (error) {
    const m = error.message.toLowerCase();
    if (m.includes("portal_preferences") && (m.includes("does not exist") || m.includes("schema cache"))) {
      return {
        ok: false,
        message: "Datenbank-Spalte portal_preferences fehlt — Migration 013 in Supabase ausführen.",
      };
    }
    return { ok: false, message: "Speichern fehlgeschlagen." };
  }

  revalidatePath("/partner/dashboard");
  revalidatePath("/partner/einstellungen");
  revalidatePath("/partner/einstellungen/statuslisten");
  return { ok: true, message: "Anzeige-Einstellungen gespeichert." };
}
