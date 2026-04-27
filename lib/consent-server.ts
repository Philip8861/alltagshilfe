import type { ConsentState } from "@/lib/consent";

function normalizeParsedConsent(parsed: Record<string, unknown>): ConsentState | null {
  if (typeof parsed.analytics !== "boolean" || typeof parsed.marketing !== "boolean") {
    return null;
  }
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

export function hasTranslationConsentFromCookieValue(raw: string | undefined): boolean {
  return parseConsentFromCookieValue(raw)?.translation === true;
}
