"use server";

import { headers } from "next/headers";
import {
  ensurePartnerProfileForCurrentSession,
  type EnsurePartnerProfileResult,
} from "@/lib/partner/ensure-partner-profile";
import { getAuthRedirectSiteBaseUrl } from "@/lib/partner/site-origin";
import { resolvePartnerLoginToEmail } from "@/lib/partner/resolve-partner-login-email";
import {
  rateLimitPartnerLogin,
  rateLimitPartnerPasswordChange,
  rateLimitPartnerPasswordReset,
} from "@/lib/rate-limit";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { partnerPasswordResetRequestSchema } from "@/lib/validations/partner";

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

async function publicSiteBaseForAuthRedirect(): Promise<string | null> {
  try {
    const h = await headers();
    const host =
      h.get("x-forwarded-host")?.split(",")[0]?.trim() ?? h.get("host")?.trim() ?? "";
    const proto = h.get("x-forwarded-proto") === "http" ? "http" : "https";
    const fromRequest = host ? `${proto}://${host}`.replace(/\/$/, "") : "";
    return getAuthRedirectSiteBaseUrl(fromRequest || undefined);
  } catch {
    return getAuthRedirectSiteBaseUrl();
  }
}

export type PartnerPasswordResetRequestState = { ok: true; message: string } | { ok: false; message: string };

const PASSWORD_RESET_SUCCESS_DE =
  "Wenn zu dieser Anmeldung ein Konto gehört, erhalten Sie in Kürze eine E-Mail mit einem Link. Darin können Sie ein neues Passwort festlegen.";

/**
 * Sendet die Supabase-Passwort-Reset-E-Mail (Link, kein Klartext-Passwort).
 * Versand nur über Supabase (`resetPasswordForEmail`) — die Links sind PKCE-kompatibel und zuverlässig.
 * Markenlayout: `supabase/email-templates/password-recovery-markenlayout.html` im Supabase-Dashboard einfügen.
 * Gleiche Erfolgsmeldung unabhängig davon, ob die Adresse existiert (Enumerationsschutz).
 */
export async function requestPartnerPasswordResetAction(
  _prev: PartnerPasswordResetRequestState | null,
  formData: FormData,
): Promise<PartnerPasswordResetRequestState> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Der Partnerbereich ist hier noch nicht eingerichtet." };
  }
  const ip = await clientIp();
  const limited = rateLimitPartnerPasswordReset(ip);
  if (!limited.success) {
    return { ok: false, message: "Zu viele Anfragen. Bitte später erneut versuchen." };
  }

  const parsed = partnerPasswordResetRequestSchema.safeParse({ login: formData.get("reset_login") });
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors.login?.[0] ?? "Bitte Eingaben prüfen.";
    return { ok: false, message: msg };
  }

  const resolved = resolvePartnerLoginToEmail(parsed.data.login);
  if (!resolved.ok) {
    return { ok: false, message: resolved.message };
  }

  const base = await publicSiteBaseForAuthRedirect();
  if (!base) {
    return {
      ok: false,
      message:
        "Passwort-Rücksetzen ist nicht konfiguriert (fehlende öffentliche Basis-URL). Bitte Administrator informieren.",
    };
  }

  const redirectTo = `${base}/auth/callback?next=${encodeURIComponent("/partner/passwort-zuruecksetzen")}`;

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(resolved.email, { redirectTo });
    if (error) {
      console.error("[requestPartnerPasswordResetAction] resetPasswordForEmail:", error.message);
    }
  } catch (e) {
    console.error("[requestPartnerPasswordResetAction]", e);
  }

  return { ok: true, message: PASSWORD_RESET_SUCCESS_DE };
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
