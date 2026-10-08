/**
 * Client-seitige, geteilte Abfrage von `/api/partner/session`.
 *
 * Header-Leiste, Startseiten-Login-Block und Ratgeber-Helfer fragten den Endpoint bisher
 * unabhängig voneinander ab (pro Navigation, Fokus-Wechsel und Tab-Rückkehr). Hier werden
 * gleichzeitige Aufrufe zu einem Request zusammengelegt und das Ergebnis kurz zwischengespeichert.
 * Keine sensiblen Daten: der Endpoint liefert nur Booleans, Anzeigename, Rolle.
 */

export type PartnerSessionPayload = {
  configured: boolean;
  authenticated: boolean;
  hasProfile: boolean;
  displayName: string | null;
  firstName: string | null;
  email: string | null;
  role: "partner" | "admin" | null;
  systemAdminSession: boolean;
};

export const EMPTY_PARTNER_SESSION_PAYLOAD: PartnerSessionPayload = {
  configured: false,
  authenticated: false,
  hasProfile: false,
  displayName: null,
  firstName: null,
  email: null,
  role: null,
  systemAdminSession: false,
};

/** Wie lange ein Ergebnis ohne erneuten Request wiederverwendet wird. */
const CACHE_TTL_MS = 15_000;

let cached: { at: number; value: PartnerSessionPayload } | null = null;
let inflight: Promise<PartnerSessionPayload> | null = null;

function normalizeRole(v: unknown): PartnerSessionPayload["role"] {
  return v === "partner" || v === "admin" ? v : null;
}

function parsePayload(raw: string): PartnerSessionPayload {
  try {
    const json = JSON.parse(raw) as Partial<PartnerSessionPayload>;
    return {
      configured: Boolean(json.configured),
      authenticated: Boolean(json.authenticated),
      hasProfile: Boolean(json.hasProfile),
      displayName: typeof json.displayName === "string" ? json.displayName : null,
      firstName: typeof json.firstName === "string" ? json.firstName : null,
      email: typeof json.email === "string" ? json.email : null,
      role: normalizeRole(json.role),
      systemAdminSession: json.systemAdminSession === true,
    };
  } catch {
    return EMPTY_PARTNER_SESSION_PAYLOAD;
  }
}

async function requestPayload(): Promise<PartnerSessionPayload> {
  try {
    const res = await fetch("/api/partner/session", {
      credentials: "same-origin",
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    return parsePayload(await res.text());
  } catch {
    return EMPTY_PARTNER_SESSION_PAYLOAD;
  }
}

/**
 * Session-Status laden. `force` erzwingt einen frischen Request (z. B. nach Navigation),
 * laufende Requests werden trotzdem geteilt.
 */
export function fetchPartnerSessionShared(options?: { force?: boolean }): Promise<PartnerSessionPayload> {
  const now = Date.now();
  if (!options?.force && cached && now - cached.at < CACHE_TTL_MS) {
    return Promise.resolve(cached.value);
  }
  if (inflight) return inflight;
  inflight = requestPayload()
    .then((value) => {
      cached = { at: Date.now(), value };
      return value;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/** Nach Login/Logout aufrufen, damit die nächste Abfrage frisch vom Server kommt. */
export function invalidatePartnerSessionCache(): void {
  cached = null;
}
