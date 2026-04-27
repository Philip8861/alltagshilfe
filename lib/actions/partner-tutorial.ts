"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getPartnerSession } from "@/lib/partner/auth";
import { normalizePortalPreferences, parsePortalPreferences } from "@/lib/partner/portal-preferences";
import { rateLimitPartnerPortalPrefs } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function setPartnerTutorialHiddenAction(
  hidden: boolean,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const session = await getPartnerSession();
  if (!session?.profile?.id) {
    return { ok: false, message: "Nicht angemeldet." };
  }

  try {
    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip")?.trim() ?? "unknown";
    const limited = rateLimitPartnerPortalPrefs(`tutorial:${ip}:${session.profile.id}`);
    if (!limited.success) {
      return { ok: false, message: "Zu viele Anfragen. Bitte später erneut versuchen." };
    }
  } catch {
    /* ignore */
  }

  const current = normalizePortalPreferences(parsePortalPreferences(session.profile.portal_preferences));
  const next = normalizePortalPreferences({ ...current, tutorial_hidden: hidden });

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("partner_profiles").update({ portal_preferences: next }).eq("id", session.profile.id);

  if (error) {
    const m = error.message.toLowerCase();
    if (m.includes("portal_preferences") && (m.includes("does not exist") || m.includes("schema cache"))) {
      return { ok: false, message: "portal_preferences fehlt — Migration 013 ausführen." };
    }
    return { ok: false, message: "Speichern fehlgeschlagen." };
  }

  revalidatePath("/partner");
  revalidatePath("/partner/dashboard");
  revalidatePath("/partner/einstellungen");
  revalidatePath("/partner/statistik");
  return { ok: true };
}
