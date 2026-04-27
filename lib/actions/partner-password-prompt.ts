"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getPartnerSession } from "@/lib/partner/auth";
import { rateLimitPartnerPasswordPrompt } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("partner_profiles")
    .update({ password_change_prompt_suppress: suppress })
    .eq("id", session.profile.id);

  if (error) {
    const m = error.message.toLowerCase();
    if (
      m.includes("password_change_prompt_suppress") &&
      (m.includes("does not exist") || m.includes("schema cache") || m.includes("could not find"))
    ) {
      return {
        ok: false,
        message: "Datenbank-Update nicht möglich — Migration 014 (password_change_prompt_suppress) in Supabase ausführen.",
      };
    }
    return { ok: false, message: "Speichern fehlgeschlagen." };
  }

  revalidatePath("/partner");
  revalidatePath("/partner/einstellungen");
  revalidatePath("/partner/dashboard");
  return { ok: true };
}
