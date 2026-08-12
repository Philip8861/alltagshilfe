import type { ConsentState } from "@/lib/consent";
import { CONSENT_VERSION } from "@/lib/consent";

function stateFromCategories(cat: Record<string, unknown>): ConsentState | null {
  if (cat.necessary !== true) return null;
  return {
    necessary: true,
    analytics: cat.statistics === true,
    marketing: cat.marketing === true,
    translation: cat.translation === true,
    timestamp: Date.now(),
  };
}

function normalizeParsedConsent(parsed: Record<string, unknown>): ConsentState | null {
  if (parsed.version === CONSENT_VERSION && parsed.categories && typeof parsed.categories === "object") {
    return stateFromCategories(parsed.categories as Record<string, unknown>);
  }

  if (typeof parsed.version === "string" && parsed.version !== CONSENT_VERSION) {
    return null;
  }

  if (typeof parsed.analytics === "boolean" && typeof parsed.marketing === "boolean") {
    const analytics = parsed.analytics === true;
    const marketing = parsed.marketing === true;
    const translation =
      typeof parsed.translation === "boolean" ? parsed.translation === true : analytics && marketing;
    return {
      necessary: true,
      analytics,
      marketing,
      translation,
      timestamp: typeof parsed.timestamp === "number" ? parsed.timestamp : 0,
    };
  }
  return null;
}

/** Parst den Wert des Cookies `cookie_consent` (wie von setConsent gesetzt). */
export function parseConsentFromCookieValue(raw: string | undefined): ConsentState | null {
  if (!raw) return null;
  let json = raw;
  try {
    json = decodeURIComponent(raw);
  } catch {
    json = raw;
  }
  try {
    const parsed = JSON.parse(json) as Record<string, unknown>;
    return normalizeParsedConsent(parsed);
  } catch {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      return normalizeParsedConsent(parsed);
    } catch {
      return null;
    }
  }
}

export function hasAnalyticsConsentFromCookieValue(raw: string | undefined): boolean {
  return parseConsentFromCookieValue(raw)?.analytics === true;
}

/** Marketing-Consent aus dem Consent-Cookie – serverseitige Autorität (z. B. Meta CAPI). */
export function hasMarketingConsentFromCookieValue(raw: string | undefined): boolean {
  return parseConsentFromCookieValue(raw)?.marketing === true;
}

export function hasTranslationConsentFromCookieValue(raw: string | undefined): boolean {
  return parseConsentFromCookieValue(raw)?.translation === true;
}
