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
    return getAuthRedirectSiteBaseUrl(fromRequest || undefined);
  } catch {
    return getAuthRedirectSiteBaseUrl();
  }
}

export type PartnerPasswordResetRequestState = { ok: true; message: string } | { ok: false; message: string };

const PASSWORD_RESET_SUCCESS_DE =
  "Wenn zu dieser Anmeldung ein Konto gehört, erhalten Sie in Kürze eine E-Mail mit einem Link. Darin können Sie ein neues Passwort festlegen. Prüfen Sie ggf. den Spam-Ordner.";

function isRedirectConfigurationError(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("redirect") ||
    (m.includes("url") && (m.includes("invalid") || m.includes("not allowed"))) ||
    (m.includes("verification") && m.includes("failed"))
  );
}

/** Supabase Custom-SMTP / Mailer — Fallback über Website-SMTP sinnvoll. */
function isLikelySupabaseSmtpOrMailerFailure(message: string): boolean {
  if (isRedirectConfigurationError(message)) return false;
  const m = message.toLowerCase();
  return (
    m.includes("smtp") ||
    m.includes("535") ||
    m.includes("534") ||
    m.includes("authentication failed") ||
    m.includes("login denied") ||
    m.includes("could not send") ||
    m.includes("failed to send") ||
    m.includes("error sending") ||
    m.includes("mailer") ||
    m.includes("dial tcp") ||
    m.includes("connection refused") ||
    (m.includes("email") && (m.includes("send") || m.includes("deliver") || m.includes("dispatch"))) ||
    (m.includes("tls") && m.includes("handshake"))
  );
}

function extractSupabaseAdminRecoveryLink(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const props = (data as { properties?: unknown }).properties;
  if (!props || typeof props !== "object") return null;
  const p = props as Record<string, unknown>;
  for (const key of ["action_link", "href"] as const) {
    const v = p[key];
    if (typeof v === "string" && /^https?:\/\//i.test(v.trim())) return v.trim();
  }
  for (const v of Object.values(p)) {
    if (typeof v === "string" && /^https?:\/\//i.test(v.trim())) return v.trim();
  }
  return null;
}

async function sendPasswordResetViaWebsiteSmtp(
  email: string,
  redirectTo: string,
): Promise<{ ok: true } | { ok: false; code: string }> {
  const svc = createSupabaseServiceRoleClient();
  if (!svc || !isTransactionalSmtpConfigured()) {
    return { ok: false, code: "no_smtp_or_service_role" };
  }
  try {
    const { data, error } = await svc.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo },
    });
    const link = extractSupabaseAdminRecoveryLink(data);
    if (error || !link) {
      console.warn("[password-reset website-smtp] generateLink:", error?.message);
      return { ok: false, code: "generate_link" };
    }
    const html = buildBrandedPartnerPasswordResetEmailHtml(link);
    const text = [
      "Passwort zurücksetzen",
      "",
      "Öffnen Sie den folgenden Link, um ein neues Passwort festzulegen:",
      "",
      link,
      "",
      "Wenn Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail.",
    ].join("\n");
    const mailed = await sendTransactionalMail({
      to: email,
      subject: partnerPasswordResetOutboundSubject(),
      text,
      html,
    });
    if (!mailed.ok) {
      console.error("[password-reset website-smtp] sendTransactionalMail:", mailed.code);
      return { ok: false, code: mailed.code };
    }
    return { ok: true };
  } catch (e) {
    console.error("[password-reset website-smtp]", e);
    return { ok: false, code: "exception" };
  }
}

function messageForPasswordResetSupabaseError(message: string): string {
  const m = message.toLowerCase();
  if (isRedirectConfigurationError(message)) {
    return "Supabase lehnt die Ziel-URL ab. Im Dashboard unter Authentication → URL configuration die Redirect-URLs prüfen (z. B. https://ihre-domain.de/auth/callback**).";
  }
  if (isLikelySupabaseSmtpOrMailerFailure(message)) {
    return "Supabase konnte die E-Mail nicht versenden (Custom SMTP). Bitte im Dashboard unter Project Settings → Auth → SMTP die Daten prüfen oder „Custom SMTP“ deaktivieren. Auf dem Server sind SMTP_HOST/SMTP_USER gesetzt: die Website versucht den Versand alternativ selbst — wenn beides fehlschlägt, Logs prüfen.";
  }
  if (m.includes("rate") || m.includes("too many")) {
    return "Zu viele Anfragen beim E-Mail-Dienst. Bitte in einigen Minuten erneut versuchen.";
  }
  return "Die E-Mail konnte technisch nicht ausgelöst werden. Bitte später erneut versuchen. Wenn das weiterhin passiert, Supabase Auth-Logs und SMTP prüfen.";
}

/**
 * Passwort-Reset per E-Mail (Link, kein Klartext-Passwort).
 *
 * **Primär:** `generateLink` (Service Role) + Versand über **Website-SMTP** (`SMTP_*`, `MAIL_FROM`) — Absender wie
 * Kontaktformular (Standard: „Alltagshilfe-Süd“). Voraussetzung: `SUPABASE_SERVICE_ROLE_KEY` + `SMTP_HOST`/`SMTP_USER`/…
 *
 * **Fallback:** `resetPasswordForEmail` (E-Mail durch Supabase), falls Website-Versand nicht möglich oder fehlgeschlagen.
 *
 * Redirect: Supabase → Authentication → URL configuration (`/auth/callback**`). Optional `AUTH_REDIRECT_BASE_URL`.
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

  const redirectTo = new URL("/auth/callback", `${base.replace(/\/$/, "")}/`);
  redirectTo.searchParams.set("next", "/partner/passwort-zuruecksetzen");
  const redirectToStr = redirectTo.toString();

  const websiteMailReady =
    Boolean(createSupabaseServiceRoleClient()) && isTransactionalSmtpConfigured();

  if (websiteMailReady) {
    const primary = await sendPasswordResetViaWebsiteSmtp(resolved.email, redirectToStr);
    if (primary.ok) {
      return { ok: true, message: PASSWORD_RESET_SUCCESS_DE };
    }
    console.warn("[requestPartnerPasswordResetAction] Website-SMTP-Reset fehlgeschlagen:", primary.code);
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(resolved.email, {
      redirectTo: redirectToStr,
    });
    if (error) {
      console.error("[requestPartnerPasswordResetAction] resetPasswordForEmail:", error.message, error);
      const parts: string[] = [messageForPasswordResetSupabaseError(error.message)];
      if (!websiteMailReady) {
        parts.push(
          "Hinweis: Für E-Mail von Alltagshilfe-Süd ohne Supabase-Versand bitte auf dem Server SUPABASE_SERVICE_ROLE_KEY und SMTP_HOST/SMTP_USER/SMTP_PASS setzen (siehe .env.example).",
        );
      }
      return { ok: false, message: parts.join(" ") };
    }
  } catch (e) {
    console.error("[requestPartnerPasswordResetAction]", e);
    return {
      ok: false,
      message:
        "Technischer Fehler beim Anstoßen des Passwort-Reset. Bitte später erneut versuchen oder Administrator informieren.",
    };
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
