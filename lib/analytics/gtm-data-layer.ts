/**
 * Google Tag Manager (dataLayer) – nur clientseitig; respektiert Consent wie GTM-Ladelogik
 * (Statistik und/oder Marketing).
 *
 * Zentrales Mess-Event: `contact_intent` (ohne PII). Siehe docs/tracking/contact-tracking.md
 */

import { getConsent } from "@/lib/consent";

export const GTM_SESSION_CONTACT_PATH_KEY = "ahs_gtm_contact_origin_path";
export const GTM_SESSION_CONTACT_TOPIC_KEY = "ahs_gtm_contact_topic";
export const GTM_SESSION_FB_LANDING_HAUSHALT_ALLTAGS_KEY = "ahs_gtm_fb_landing_haushalt_alltags_success";

/** Erlaubte Werte für GTM-Variablen (stabile Keys für Tags & Trigger). */
export type ContactIntentType =
  | "phone"
  | "email"
  | "whatsapp"
  | "form"
  | "hilfefinder"
  | "standort_finder"
  | "nav";

export type ContactIntentStatus = "started" | "step_completed" | "success" | "click";

export type ContactIntentEventFields = {
  contact_path: string;
  contact_type: ContactIntentType;
  source_component: string;
  page_path: string;
  page_location: string;
  page_title: string;
  service?: string;
  plz?: string;
  status: ContactIntentStatus;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function isGtmDataLayerAllowed(): boolean {
  if (typeof window === "undefined") return false;
  const c = getConsent();
  return c?.analytics === true || c?.marketing === true;
}

function getClientPageContext(): Pick<ContactIntentEventFields, "page_path" | "page_location" | "page_title"> {
  if (typeof window === "undefined") {
    return { page_path: "", page_location: "", page_title: "" };
  }
  return {
    page_path: window.location.pathname,
    page_location: window.location.href,
    page_title: typeof document !== "undefined" ? document.title : "",
  };
}

/** Nur PLZ (5 Ziffern), kein Freitext — reduziert Risiko versehentlicher PII. */
export function sanitizeTrackingPlz(raw: string | undefined | null): string | undefined {
  if (raw == null) return undefined;
  const d = String(raw).replace(/\D/g, "").slice(0, 5);
  return d.length === 5 ? d : undefined;
}

export function pushGtmDataLayer(entry: Record<string, unknown>): void {
  if (typeof window === "undefined" || !isGtmDataLayerAllowed()) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(entry);
}

/**
 * Zentrales Event für GTM. Keine Namen, Mails, Telefonnummern o. Ä.
 * Echte Conversion: typischerweise `status === "success"` (z. B. Formular, Finder-Abschluss).
 */
export function trackContactIntent(fields: Omit<ContactIntentEventFields, "page_path" | "page_location" | "page_title">): void {
  const ctx = getClientPageContext();
  pushGtmDataLayer({
    event: "contact_intent",
    ...ctx,
    ...fields,
  });
}

export function trackPhoneClick(args: {
  source_component: string;
  contact_path?: string;
  plz?: string;
  service?: string;
}): void {
  trackContactIntent({
    contact_type: "phone",
    contact_path: args.contact_path ?? "tel",
    source_component: args.source_component,
    status: "click",
    plz: sanitizeTrackingPlz(args.plz),
    service: args.service,
  });
}

export function trackEmailClick(args: {
  source_component: string;
  contact_path?: string;
  plz?: string;
  service?: string;
}): void {
  trackContactIntent({
    contact_type: "email",
    contact_path: args.contact_path ?? "mailto",
    source_component: args.source_component,
    status: "click",
    plz: sanitizeTrackingPlz(args.plz),
    service: args.service,
  });
}

export function trackWhatsappClick(args: {
  source_component: string;
  contact_path?: string;
  plz?: string;
  service?: string;
}): void {
  trackContactIntent({
    contact_type: "whatsapp",
    contact_path: args.contact_path ?? "whatsapp",
    source_component: args.source_component,
    status: "click",
    plz: sanitizeTrackingPlz(args.plz),
    service: args.service,
  });
}

/** Navigation zur Kontaktseite (/kontakt). `contact_path` ist ein semantischer Key, keine vollständige Ziel-URL. */
export function trackContactNavClick(args: {
  source_component: string;
  contact_path: string;
  service?: string;
  plz?: string;
}): void {
  trackContactIntent({
    contact_type: "nav",
    contact_path: args.contact_path,
    source_component: args.source_component,
    status: "click",
    plz: sanitizeTrackingPlz(args.plz),
    service: args.service,
  });
}

export type FinderKind =
  | "hilfefinder_home"
  | "ratgeber_beratung"
  | "standort_finder"
  | "fb_landing_haushalt_alltags";

function finderContactType(kind: FinderKind): ContactIntentType {
  if (kind === "standort_finder") return "standort_finder";
  return "hilfefinder";
}

export function trackFinderStarted(args: {
  finder: FinderKind;
  source_component: string;
  service?: string;
  plz?: string;
}): void {
  trackContactIntent({
    contact_type: finderContactType(args.finder),
    contact_path: args.finder,
    source_component: args.source_component,
    status: "started",
    plz: sanitizeTrackingPlz(args.plz),
    service: args.service,
  });
}

export function trackFinderStepCompleted(args: {
  finder: FinderKind;
  source_component: string;
  step_completed: number;
  service?: string;
  plz?: string;
}): void {
  trackContactIntent({
    contact_type: finderContactType(args.finder),
    contact_path: `${args.finder}/step/${args.step_completed}`,
    source_component: args.source_component,
    status: "step_completed",
    plz: sanitizeTrackingPlz(args.plz),
    service: args.service,
  });
}

export function trackFinderSuccess(args: {
  finder: FinderKind;
  source_component: string;
  service?: string;
  plz?: string;
}): void {
  trackContactIntent({
    contact_type: finderContactType(args.finder),
    contact_path: `${args.finder}/complete`,
    source_component: args.source_component,
    status: "success",
    plz: sanitizeTrackingPlz(args.plz),
    service: args.service,
  });
}

export function trackFormStarted(args: {
  source_component: string;
  contact_path?: string;
  service?: string;
  plz?: string;
}): void {
  trackContactIntent({
    contact_type: "form",
    contact_path: args.contact_path ?? "website_contact",
    source_component: args.source_component,
    status: "started",
    plz: sanitizeTrackingPlz(args.plz),
    service: args.service,
  });
}

export function trackFormSuccess(args: {
  source_component: string;
  contact_path?: string;
  service?: string;
  plz?: string;
}): void {
  trackContactIntent({
    contact_type: "form",
    contact_path: args.contact_path ?? "website_contact",
    source_component: args.source_component,
    status: "success",
    plz: sanitizeTrackingPlz(args.plz),
    service: args.service,
  });
}

/** Für Konversionszuordnung: Seite, auf der das Kontaktformular abgeschickt wurde (ohne PII). */
export function stashContactFormSubmissionContext(pathname: string, topic: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(GTM_SESSION_CONTACT_PATH_KEY, pathname);
    sessionStorage.setItem(GTM_SESSION_CONTACT_TOPIC_KEY, topic);
  } catch {
    /* quota / private mode */
  }
}

export function readAndClearContactSubmissionContext(): { pathname: string; topic: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const pathname = sessionStorage.getItem(GTM_SESSION_CONTACT_PATH_KEY);
    const topic = sessionStorage.getItem(GTM_SESSION_CONTACT_TOPIC_KEY) ?? "";
    sessionStorage.removeItem(GTM_SESSION_CONTACT_PATH_KEY);
    sessionStorage.removeItem(GTM_SESSION_CONTACT_TOPIC_KEY);
    if (!pathname) return null;
    return { pathname, topic };
  } catch {
    return null;
  }
}

/** FB-Landing Wizard: Kontext für Konversions-Event auf /vielen-dank-haushalt-alltag (ohne PII). */
export function stashFbLandingHaushaltAlltagsSuccessContext(args: {
  service?: string;
  plz?: string;
}): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(
      GTM_SESSION_FB_LANDING_HAUSHALT_ALLTAGS_KEY,
      JSON.stringify({ service: args.service ?? "", plz: args.plz ?? "" }),
    );
  } catch {
    /* quota / private mode */
  }
}

export function readAndClearFbLandingHaushaltAlltagsSuccessContext(): {
  service?: string;
  plz?: string;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(GTM_SESSION_FB_LANDING_HAUSHALT_ALLTAGS_KEY);
    sessionStorage.removeItem(GTM_SESSION_FB_LANDING_HAUSHALT_ALLTAGS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { service?: string; plz?: string };
    return {
      service: parsed.service || undefined,
      plz: parsed.plz || undefined,
    };
  } catch {
    return null;
  }
}

/** Abbruch vor Redirect (Validierung, Honeypot, Netzwerkfehler): kein Konversions-Event auf /kontakt/danke. */
export function clearContactSubmissionContextStash(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(GTM_SESSION_CONTACT_PATH_KEY);
    sessionStorage.removeItem(GTM_SESSION_CONTACT_TOPIC_KEY);
  } catch {
    /* ignore */
  }
}

/** `redirect()` aus Server Actions löst auf dem Client einen Redirect-Fehler aus — Kontext für /kontakt/danke behalten. */
export function isNextjsRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    String((error as { digest: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

export function pushGtmVirtualPageView(pathname: string): void {
  if (pathname === "") return;
  pushGtmDataLayer({
    event: "ahs_virtual_page_view",
    page_path: pathname,
    page_location: typeof window !== "undefined" ? window.location.href : undefined,
    page_title: typeof document !== "undefined" ? document.title : undefined,
  });
}
