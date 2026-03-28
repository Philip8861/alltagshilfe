"use server";

import { headers } from "next/headers";
import {
  ensurePartnerProfileForCurrentSession,
  type EnsurePartnerProfileResult,
} from "@/lib/partner/ensure-partner-profile";
import { rateLimitPartnerLogin, rateLimitPartnerPasswordChange } from "@/lib/rate-limit";
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

export async function checkPartnerPasswordChangeRateLimitAction(): Promise<
  { ok: true } | { ok: false; message: string }
> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Der Partnerbereich ist hier noch nicht eingerichtet." };
  }
  const ip = await clientIp();
  const limited = rateLimitPartnerPasswordChange(ip);
  if (!limited.success) {
    return { ok: false, message: "Zu viele Passwort-Versuche. Bitte später erneut versuchen." };
  }
  return { ok: true };
}

export type { EnsurePartnerProfileResult };

/** @deprecated Nutze GET /partner/sync-profile für zuverlässigere Cookies; diese Action ruft dieselbe Logik auf. */
export async function ensurePartnerProfileForSessionAction(): Promise<EnsurePartnerProfileResult> {
  return ensurePartnerProfileForCurrentSession();
}
