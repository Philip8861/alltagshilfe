/**
 * Meta Conversions API (CAPI) – serverseitiges Lead-Event für die FB-Landingpage.
 *
 * Nur technische Matching-Signale (event_id, fbp/fbc, IP, User-Agent) – niemals
 * Formular-, Pflege- oder Gesundheitsdaten. Access Token ausschließlich serverseitig
 * (META_CAPI_ACCESS_TOKEN, niemals NEXT_PUBLIC_*).
 *
 * Fehler werden vollständig abgefangen: Ein CAPI-Fehler darf die Verarbeitung
 * der Kundenanfrage niemals beeinflussen.
 */

import { META_PIXEL_ID } from "@/config/meta-pixel";
import { siteConfig } from "@/config/site";

const GRAPH_API_VERSION = "v23.0";
const CAPI_TIMEOUT_MS = 5000;

/**
 * Feste Source-URL (Server-Allowlist): Dieses Lead-Tracking existiert nur für die
 * FB-Landingpage – keine Client-URLs, keine Query-Strings, keine Nutzerdaten.
 */
const LEAD_EVENT_SOURCE_URL = `${siteConfig.baseUrl}/landing/haushaltshilfe-alltagsbegleitung`;

/** _fbp-Cookie-Format (fb.<domainIndex>.<timestamp>.<random>). */
const FBP_PATTERN = /^fb\.[0-2]\.\d{6,16}\.\d{1,32}$/;
/** _fbc-Cookie-Format (fb.<domainIndex>.<timestamp>.<fbclid>). */
const FBC_PATTERN = /^fb\.[0-2]\.\d{6,16}\.[\w.-]{1,255}$/;

/** Grobe IPv4/IPv6-Plausibilitätsprüfung – verhindert, dass z. B. "unknown" an Meta geht. */
const IP_PATTERN = /^(\d{1,3}(\.\d{1,3}){3}|[0-9a-fA-F:]{2,45})$/;

export type MetaLeadCapiInput = {
  /** Eindeutige Event-ID – identisch zum Browser-Pixel-Event (Deduplizierung). */
  eventId: string;
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  userAgent?: string;
};

/** Validiert Cookie-Werte gegen das erwartete Format (nichts Ungeprüftes an Meta senden). */
export function sanitizeFbCookie(value: string | undefined, kind: "fbp" | "fbc"): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  const pattern = kind === "fbp" ? FBP_PATTERN : FBC_PATTERN;
  return pattern.test(trimmed) ? trimmed : undefined;
}

/**
 * Sendet das Standard-Event „Lead" an die Meta Conversions API.
 * Wirft niemals – alle Fehler werden geloggt (ohne personenbezogene Daten).
 */
export async function sendMetaLeadCapiEvent(input: MetaLeadCapiInput): Promise<void> {
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN?.trim();
  if (!accessToken) {
    console.warn("[meta-capi] META_CAPI_ACCESS_TOKEN nicht gesetzt – Lead-Serverevent übersprungen.");
    return;
  }

  const userData: Record<string, string> = {};
  const fbp = sanitizeFbCookie(input.fbp, "fbp");
  const fbc = sanitizeFbCookie(input.fbc, "fbc");
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  const clientIp = input.clientIp?.trim();
  if (clientIp && IP_PATTERN.test(clientIp)) userData.client_ip_address = clientIp;
  const userAgent = input.userAgent?.trim().slice(0, 512);
  if (userAgent) userData.client_user_agent = userAgent;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: "website",
        event_source_url: LEAD_EVENT_SOURCE_URL,
        user_data: userData,
      },
    ],
  };

  const testEventCode = process.env.META_TEST_EVENT_CODE?.trim();
  if (testEventCode) payload.test_event_code = testEventCode;

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(accessToken)}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(CAPI_TIMEOUT_MS),
    });

    if (!res.ok) {
      let detail = "";
      try {
        const body = (await res.json()) as {
          error?: { message?: string; code?: number; fbtrace_id?: string };
        };
        detail = body?.error
          ? ` – code=${body.error.code ?? "?"} message="${body.error.message ?? "?"}" fbtrace_id=${body.error.fbtrace_id ?? "?"}`
          : "";
      } catch {
        /* Antwort nicht lesbar – Status reicht */
      }
      console.warn(`[meta-capi] Lead-Event abgelehnt (HTTP ${res.status})${detail} eventId=${input.eventId}`);
      return;
    }
  } catch (e) {
    const reason = e instanceof Error ? e.name : "unbekannt";
    console.warn(
      `[meta-capi] Lead-Event nicht zustellbar (${reason}) eventId=${input.eventId} – Anfrageverarbeitung nicht betroffen.`,
    );
  }
}
