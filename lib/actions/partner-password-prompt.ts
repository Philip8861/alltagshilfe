"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getPartnerSession } from "@/lib/partner/auth";
import { rateLimitPartnerPasswordPrompt } from "@/lib/rate-limit";
import { mergePortalPrefsPasswordPromptSuppress } from "@/lib/partner/portal-preferences";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function isPasswordPromptColumnMissing(error: { message?: string; code?: string } | null): boolean {
  if (!error) return false;
  if (error.code === "42703") return true;
  const m = String(error.message ?? "").toLowerCase();
  return (
    m.includes("password_change_prompt_suppress") &&
    (m.includes("does not exist") || m.includes("schema cache") || m.includes("could not find"))
  );
}

/** portal_preferences-Spalte (Migration 013) vorhanden? */
function isPortalPreferencesMissing(error: { message?: string } | null): boolean {
  const m = String(error?.message ?? "").toLowerCase();
  return m.includes("portal_preferences") && (m.includes("does not exist") || m.includes("schema cache"));
}

export async function setPartnerPasswordPromptSuppressAction(
  suppress: boolean,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const session = await getPartnerSession();
  if (!session?.profile?.id) {
    return { ok: false, message: "Nicht angemeldet." };
  }

  try {
    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip")?.trim() ?? "unknown";
    const limited = rateLimitPartnerPasswordPrompt(`${ip}:${session.profile.id}`);
    if (!limited.success) {
      return { ok: false, message: "Zu viele Anfragen. Bitte später erneut versuchen." };
    }
  } catch {
    /* ignore */
  }

  const prefsMirror = mergePortalPrefsPasswordPromptSuppress(session.profile.portal_preferences ?? null, suppress);
  const supabase = await createSupabaseServerClient();

  /** 1) JSON immer aktualisieren (funktioniert ohne Migration 014 — Spalte optional). */
  const { error: prefsErr } = await supabase
    .from("partner_profiles")
    .update({ portal_preferences: prefsMirror })
    .eq("id", session.profile.id);

  if (prefsErr && isPortalPreferencesMissing(prefsErr)) {
    return {
      ok: false,
      message: "Datenbank-Update nicht möglich — Migration 013 (portal_preferences) in Supabase ausführen.",
    };
  }

  if (prefsErr && !isPortalPreferencesMissing(prefsErr)) {
    return { ok: false, message: "Speichern fehlgeschlagen." };
  }

  /** 2) Boolesche Spiegel-Spalte, falls Migration 014 ausgeführt (Fehler ignorieren). */
  const { error: columnErr } = await supabase
    .from("partner_profiles")
    .update({ password_change_prompt_suppress: suppress })
    .eq("id", session.profile.id);

  if (columnErr && !isPasswordPromptColumnMissing(columnErr)) {
    return { ok: false, message: "Speichern fehlgeschlagen." };
  }

  revalidatePath("/partner");
  revalidatePath("/partner/einstellungen");
  revalidatePath("/partner/dashboard");
  return { ok: true };
}
