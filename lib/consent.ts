/**
 * Cookie-Consent: Typen und Client-Helfer für localStorage/Cookie.
 * Analytics/Marketing-Skripte erst laden, wenn entsprechende Zustimmung vorliegt.
 */

export const CONSENT_STORAGE_KEY = "cookie-consent";
export const CONSENT_COOKIE_NAME = "cookie_consent";

export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  /** Google Website Translator, englische URLs (/en) und serverseitige Übersetzungs-API. */
  translation: boolean;
  timestamp: number;
};

const COOKIE_MAX_AGE_DAYS = 365;

function setConsentCookie(value: string) {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_MAX_AGE_DAYS);
  const secure = typeof window !== "undefined" && window.location?.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(value)}; path=/; SameSite=Lax; expires=${expires.toUTCString()}${secure}`;
}

/** Liest gespeicherten Consent aus localStorage (nur Client). */
export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (parsed && typeof parsed.analytics === "boolean" && typeof parsed.marketing === "boolean") {
      const analytics = parsed.analytics === true;
      const marketing = parsed.marketing === true;
      const translation =
        typeof parsed.translation === "boolean"
          ? parsed.translation === true
          : analytics && marketing;
      return {
        necessary: true,
        analytics,
        marketing,
        translation,
        timestamp: typeof parsed.timestamp === "number" ? parsed.timestamp : 0,
      };
    }
    return null;
  } catch {
    return null;
  }
}

/** Speichert Consent in localStorage und setzt Cookie (nur Client). */
export function setConsent(state: ConsentState): void {
  if (typeof window === "undefined") return;
  const payload = { ...state, necessary: true };
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(payload));
  setConsentCookie(JSON.stringify(payload));
}

/** Prüft, ob Analytics (z. B. GA) geladen werden darf. */
export function hasAnalyticsConsent(): boolean {
  const c = getConsent();
  return c?.analytics === true;
}

/** Prüft, ob Marketing-Cookies erlaubt sind. */
export function hasMarketingConsent(): boolean {
  const c = getConsent();
  return c?.marketing === true;
}

/** Google-Übersetzung & englische Seitenversion. */
export function hasTranslationConsent(): boolean {
  const c = getConsent();
  return c?.translation === true;
}

/** Entfernt gespeicherten Consent (z. B. für „Cookie-Einstellungen“ im Footer). */
export function clearConsent(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CONSENT_STORAGE_KEY);
  document.cookie = `${CONSENT_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
