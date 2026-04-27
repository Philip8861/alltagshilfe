"use server";

import { headers } from "next/headers";
import {
  ensurePartnerProfileForCurrentSession,
  type EnsurePartnerProfileResult,
} from "@/lib/partner/ensure-partner-profile";
import { getPublicSiteBaseUrl } from "@/lib/partner/site-origin";
import { resolvePartnerLoginToEmail } from "@/lib/partner/resolve-partner-login-email";
import {
  rateLimitPartnerLogin,
  rateLimitPartnerPasswordChange,
  rateLimitPartnerPasswordReset,
} from "@/lib/rate-limit";
import {
  buildBrandedPartnerPasswordResetEmailHtml,
  partnerPasswordResetOutboundSubject,
} from "@/lib/email/branded-html";
import { isTransactionalSmtpConfigured, sendTransactionalMail } from "@/lib/email/internal-smtp";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
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
    return getPublicSiteBaseUrl(fromRequest) || fromRequest || null;
  } catch {
    return getPublicSiteBaseUrl() || null;
  }
}

function extractSupabaseAdminRecoveryLink(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const props = (data as { properties?: unknown }).properties;
  if (!props || typeof props !== "object") return null;
  const p = props as Record<string, unknown>;
  for (const key of ["action_link", "href"] as const) {
    const v = p[key];
    if (typeof v === "string" && /^https:\/\//i.test(v.trim())) return v.trim();
  }
  return null;
}

export type PartnerPasswordResetRequestState = { ok: true; message: string } | { ok: false; message: string };

const PASSWORD_RESET_SUCCESS_DE =
  "Wenn zu dieser Anmeldung ein Konto gehört, erhalten Sie in Kürze eine E-Mail mit einem Link. Darin können Sie ein neues Passwort festlegen.";

/**
 * Sendet die Supabase-Passwort-Reset-E-Mail (Link, kein Klartext-Passwort).
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

  const svc = createSupabaseServiceRoleClient();
  if (svc && isTransactionalSmtpConfigured()) {
    try {
      const { data, error } = await svc.auth.admin.generateLink({
        type: "recovery",
        email: resolved.email,
        options: { redirectTo },
      });
      const link = extractSupabaseAdminRecoveryLink(data);
      if (!error && link) {
        const html = buildBrandedPartnerPasswordResetEmailHtml(link);
        const text = [
          "Passwort zurücksetzen",
          "",
          "Sie haben angefordert, Ihr Passwort für den Partnerbereich neu zu setzen.",
          "Öffnen Sie den folgenden Link im Browser, um ein neues Passwort festzulegen:",
          "",
          link,
          "",
          "Wenn Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail.",
        ].join("\n");
        const mailed = await sendTransactionalMail({
          to: resolved.email,
          subject: partnerPasswordResetOutboundSubject(),
          text,
          html,
        });
        if (mailed.ok) {
          return { ok: true, message: PASSWORD_RESET_SUCCESS_DE };
        }
        console.error("[requestPartnerPasswordResetAction] Transactional mail:", mailed.code);
      } else if (error) {
        console.warn("[requestPartnerPasswordResetAction] generateLink:", error.message);
      }
    } catch (e) {
      console.error("[requestPartnerPasswordResetAction] branded reset path:", e);
    }
  }

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
