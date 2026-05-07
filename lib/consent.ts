/**
 * Cookie-/Einwilligungs-Logik (Client).
 *
 * Consent-Banner nach DSGVO/TDDDG-Grundsätzen umgesetzt. Finale rechtliche Prüfung der
 * konkreten Dienste, Anbieter, Speicherdauern und Datenschutztexte muss durch den
 * Websitebetreiber bzw. Datenschutzbeauftragten erfolgen.
 */

export const CONSENT_STORAGE_KEY = "cookie-consent";
export const CONSENT_COOKIE_NAME = "cookie_consent";

/** Bei Kategorie-/Textänderungen erhöhen – Nutzer sehen den Banner erneut. */
export const CONSENT_VERSION = "2026-05-privacy-v1";

export type ConsentCategories = {
  necessary: true;
  statistics: boolean;
  translation: boolean;
  marketing: boolean;
};

/** Persistiertes Format (localStorage + Cookie). */
export type ConsentRecord = {
  version: string;
  createdAt: string;
  updatedAt: string;
  categories: ConsentCategories;
};

/** Abwärtskompatible Laufzeit-Form (bestehende Komponenten). */
export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
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

function stateFromRecord(record: ConsentRecord): ConsentState {
  return {
    necessary: true,
    analytics: record.categories.statistics,
    marketing: record.categories.marketing,
    translation: record.categories.translation,
    timestamp: Date.parse(record.updatedAt) || Date.now(),
  };
}

function recordFromState(state: ConsentState, prev: ConsentRecord | null): ConsentRecord {
  const now = new Date().toISOString();
  const createdAt = prev?.createdAt ?? (state.timestamp > 0 ? new Date(state.timestamp).toISOString() : now);
  return {
    version: CONSENT_VERSION,
    createdAt,
    updatedAt: now,
    categories: {
      necessary: true,
      statistics: state.analytics,
      marketing: state.marketing,
      translation: state.translation,
    },
  };
}

function parseLegacyShape(parsed: Record<string, unknown>): ConsentState | null {
  if (typeof parsed.analytics !== "boolean" || typeof parsed.marketing !== "boolean") {
    return null;
  }
  const analytics = parsed.analytics === true;
  const marketing = parsed.marketing === true;
  const translation =
    typeof parsed.translation === "boolean" ? parsed.translation === true : analytics && marketing;
  return {
    necessary: true,
    analytics,
    marketing,
    translation,
    timestamp: typeof parsed.timestamp === "number" ? parsed.timestamp : Date.now(),
  };
}

function migrateLegacyToStorage(parsed: Record<string, unknown>, state: ConsentState): void {
  const record = recordFromState(state, null);
  if (typeof parsed.timestamp === "number") {
    record.createdAt = new Date(parsed.timestamp).toISOString();
  }
  const payload = JSON.stringify(record);
  localStorage.setItem(CONSENT_STORAGE_KEY, payload);
  setConsentCookie(payload);
}

/**
 * Entfernt bekannte optionale Cookies/Storage soweit möglich (keine Sitzungs-/Sicherheits-Cookies).
 * Aufruf vor Speichern einer restriktiveren Einwilligung empfohlen.
 */
export function revokeOptionalConsent(): void {
  if (typeof document === "undefined" || typeof window === "undefined") return;

  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k === "googtrans" || k.startsWith("ga_") || k.startsWith("_gcl")) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }

  const host = window.location.hostname;
  const baseDomains = ["", host, `.${host}`];

  const erase = (name: string) => {
    for (const domain of baseDomains) {
      const dom = domain ? `; domain=${domain}` : "";
      document.cookie = `${name}=; path=/; max-age=0${dom}`;
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT${dom}`;
    }
  };

  try {
    document.cookie.split(";").forEach((c) => {
      const name = c.split("=")[0]?.trim();
      if (!name) return;
      if (name === "googtrans" || name.startsWith("_ga") || name.startsWith("_gid") || name.startsWith("_gat")) {
        erase(name);
      }
    });
  } catch {
    /* ignore */
  }

  erase("googtrans");
}

/** True, wenn noch keine gültige Einwilligung für die aktuelle Policy-Version vorliegt. */
export function consentNeedsBanner(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return true;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (parsed.version === CONSENT_VERSION && parsed.categories && typeof parsed.categories === "object") {
      return false;
    }
    if (!parsed.version && typeof parsed.analytics === "boolean") {
      return false;
    }
    if (typeof parsed.version === "string" && parsed.version !== CONSENT_VERSION) {
      return true;
    }
    return true;
  } catch {
    return true;
  }
}

/** Liest gespeicherten Consent (nur Client). Bei veralteter `version` → null. */
export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    if (parsed.version === CONSENT_VERSION && parsed.categories && typeof parsed.categories === "object") {
      const cat = parsed.categories as Record<string, unknown>;
      if (cat.necessary !== true) return null;
      const record: ConsentRecord = {
        version: CONSENT_VERSION,
        createdAt: typeof parsed.createdAt === "string" ? parsed.createdAt : new Date().toISOString(),
        updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
        categories: {
          necessary: true,
          statistics: cat.statistics === true,
          translation: cat.translation === true,
          marketing: cat.marketing === true,
        },
      };
      return stateFromRecord(record);
    }

    if (typeof parsed.version === "string" && parsed.version !== CONSENT_VERSION) {
      return null;
    }

    const legacy = parseLegacyShape(parsed);
    if (legacy) {
      migrateLegacyToStorage(parsed, legacy);
      return legacy;
    }
    return null;
  } catch {
    return null;
  }
}

export function setConsent(state: ConsentState): void {
  if (typeof window === "undefined") return;
  let prev: ConsentRecord | null = null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Record<string, unknown>;
      if (p.version === CONSENT_VERSION && p.categories && typeof p.categories === "object") {
        const cat = p.categories as Record<string, unknown>;
        prev = {
          version: CONSENT_VERSION,
          createdAt: typeof p.createdAt === "string" ? p.createdAt : new Date().toISOString(),
          updatedAt: typeof p.updatedAt === "string" ? p.updatedAt : new Date().toISOString(),
          categories: {
            necessary: true,
            statistics: cat.statistics === true,
            translation: cat.translation === true,
            marketing: cat.marketing === true,
          },
        };
      }
    }
  } catch {
    prev = null;
  }

  const record = recordFromState({ ...state, necessary: true }, prev);
  const payload = JSON.stringify(record);
  localStorage.setItem(CONSENT_STORAGE_KEY, payload);
  setConsentCookie(payload);
}

export function hasAnalyticsConsent(): boolean {
  return getConsent()?.analytics === true;
}

export function hasMarketingConsent(): boolean {
  return getConsent()?.marketing === true;
}

export function hasTranslationConsent(): boolean {
  return getConsent()?.translation === true;
}

/** Entfernt Speicher und Consent-Cookie (nur für Tests/Support; Footer nutzt Banner ohne Löschen). */
export function clearConsent(): void {
  if (typeof window === "undefined") return;
  revokeOptionalConsent();
  localStorage.removeItem(CONSENT_STORAGE_KEY);
  document.cookie = `${CONSENT_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}
