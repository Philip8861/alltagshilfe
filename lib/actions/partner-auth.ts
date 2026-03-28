"use server";

import { headers } from "next/headers";
import { rateLimitPartnerLogin, rateLimitPartnerRegister } from "@/lib/rate-limit";
import { isSupabaseConfigured } from "@/lib/supabase/config";

async function clientIp(): Promise<string> {
  try {
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) {
      return forwarded.split(",")[0]?.trim() ?? "unknown";
    }
    return h.get("x-real-ip")?.trim() ?? "unknown";
  } catch {
    return "unknown";
  }
}

/** Wird vor dem Browser-Login aufgerufen (Rate-Limit nur serverseitig). */
export async function checkPartnerLoginRateLimitAction(): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Der Partnerbereich ist hier noch nicht eingerichtet." };
  }
  const ip = await clientIp();
  const limited = rateLimitPartnerLogin(ip);
  if (!limited.success) {
    return { ok: false, message: "Zu viele Versuche. Bitte später erneut versuchen." };
  }
  return { ok: true };
}

/** Vor Browser-Registrierung (Rate-Limit nur serverseitig). */
export async function checkPartnerRegisterRateLimitAction(): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Der Partnerbereich ist hier noch nicht eingerichtet." };
  }
  const ip = await clientIp();
  const limited = rateLimitPartnerRegister(ip);
  if (!limited.success) {
    return { ok: false, message: "Zu viele Registrierungsversuche. Bitte in einer Stunde erneut versuchen." };
  }
  return { ok: true };
}
