"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { getPartnerSession } from "@/lib/partner/auth";
import { rateLimitPartnerEmailChange } from "@/lib/rate-limit";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type PartnerEmailChangeState = { ok: true; message: string } | { ok: false; message: string };

const emailSchema = z.string().trim().email("Gültige E-Mail-Adresse eingeben.").max(320);

async function clientIp(): Promise<string> {
  try {
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
    return h.get("x-real-ip")?.trim() ?? "unknown";
  } catch {
    return "unknown";
  }
}

/**
 * Startet E-Mail-Änderung: Supabase sendet Bestätigung an die neue Adresse (sofern in Projekt aktiviert).
 */
export async function partnerRequestEmailChangeAction(
  _prev: PartnerEmailChangeState | null,
  formData: FormData,
): Promise<PartnerEmailChangeState> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Der Partnerbereich ist hier noch nicht eingerichtet." };
  }

  const session = await getPartnerSession();
  if (!session?.userId || !session.email) {
    return { ok: false, message: "Nicht angemeldet." };
  }

  const ip = await clientIp();
  const limited = rateLimitPartnerEmailChange(`${ip}:${session.userId}`);
  if (!limited.success) {
    return { ok: false, message: "Zu viele Versuche. Bitte später erneut versuchen." };
  }

  const parsed = emailSchema.safeParse(formData.get("new_email"));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.flatten().formErrors[0] ?? "E-Mail ungültig." };
  }

  const newEmail = parsed.data.toLowerCase();
  const current = session.email.trim().toLowerCase();
  if (newEmail === current) {
    return { ok: false, message: "Die neue Adresse ist bereits Ihre aktuelle E-Mail." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ email: newEmail });

  if (error) {
    return { ok: false, message: error.message || "E-Mail konnte nicht geändert werden." };
  }

  return {
    ok: true,
    message:
      "Bestätigungs-Link wurde an die neue Adresse gesendet (falls E-Mail-Änderungen in Supabase aktiviert sind). Prüfen Sie auch den Spam-Ordner.",
  };
}
