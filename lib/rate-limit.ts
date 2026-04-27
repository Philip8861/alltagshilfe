/**
 * Einfaches In-Memory-Rate-Limiting für Formulare/APIs.
 * Für Multi-Instance später durch Redis ersetzen.
 */
const store = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 1000; // 1 Minute
const MAX_REQUESTS = 5;

export function rateLimitWithConfig(
  identifier: string,
  maxRequests: number,
  windowMs: number,
): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry) {
    store.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: maxRequests - 1 };
  }

  if (now > entry.resetAt) {
    store.set(identifier, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: maxRequests - 1 };
  }

  entry.count += 1;
  if (entry.count > maxRequests) {
    return { success: false, remaining: 0 };
  }
  return { success: true, remaining: maxRequests - entry.count };
}

export function rateLimit(identifier: string): { success: boolean; remaining: number } {
  return rateLimitWithConfig(identifier, MAX_REQUESTS, WINDOW_MS);
}

/** Partner-Login: strengeres Limit (Missbrauchsschutz). */
export function rateLimitPartnerLogin(identifier: string): { success: boolean; remaining: number } {
  return rateLimitWithConfig(`partner-login:${identifier}`, 12, 15 * 60 * 1000);
}

/** Passwort ändern (Partnerportal). */
export function rateLimitPartnerPasswordChange(identifier: string): { success: boolean; remaining: number } {
  return rateLimitWithConfig(`partner-password:${identifier}`, 8, 60 * 60 * 1000);
}

/** Passwort per E-Mail zurücksetzen (Partner-Login). */
export function rateLimitPartnerPasswordReset(identifier: string): { success: boolean; remaining: number } {
  return rateLimitWithConfig(`partner-pwd-reset:${identifier}`, 5, 15 * 60 * 1000);
}

/** E-Mail-Adresse ändern (Partnerportal). */
export function rateLimitPartnerEmailChange(identifier: string): { success: boolean; remaining: number } {
  return rateLimitWithConfig(`partner-email:${identifier}`, 5, 60 * 60 * 1000);
}

/** Portal-Präferenzen speichern. */
export function rateLimitPartnerPortalPrefs(identifier: string): { success: boolean; remaining: number } {
  return rateLimitWithConfig(`partner-prefs:${identifier}`, 30, 60 * 60 * 1000);
}

/** Passwort-Hinweis unterdrücken / wieder aktivieren (Partnerportal). */
export function rateLimitPartnerPasswordPrompt(identifier: string): { success: boolean; remaining: number } {
  return rateLimitWithConfig(`partner-pwd-prompt:${identifier}`, 30, 60 * 60 * 1000);
}

/** Verwaltungs-Login (Partner-System-Admin, env-Zugang). */
export function rateLimitSystemAdminLogin(identifier: string): { success: boolean; remaining: number } {
  return rateLimitWithConfig(`partner-sys-admin-login:${identifier}`, 10, 15 * 60 * 1000);
}

/** Pflegebox-Abschluss per API (öffentlich, Service-Role-Insert). */
export function rateLimitPflegeboxOrder(identifier: string): { success: boolean; remaining: number } {
  return rateLimitWithConfig(`pflegebox-order:${identifier}`, 20, 60 * 60 * 1000);
}

/** Partner-Code-Prüfung aus dem Konfigurator (GET, IP-basiert). */
export function rateLimitPflegeboxPartnerLookup(identifier: string): { success: boolean; remaining: number } {
  return rateLimitWithConfig(`pflegebox-partner-lookup:${identifier}`, 45, 10 * 60 * 1000);
}
