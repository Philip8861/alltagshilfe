"use client";

import { META_PIXEL_ID } from "@/config/meta-pixel";
import { hasMarketingConsent } from "@/lib/consent";

type FbqFn = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  loaded?: boolean;
  push?: FbqFn;
  version?: string;
  disablePushState?: boolean;
};

declare global {
  interface Window {
    fbq?: FbqFn;
    _fbq?: FbqFn;
  }
}

let pixelInitialized = false;

/** Verhindert automatische PageViews von fbevents.js bei pushState/replaceState (Next.js SPA). */
function applyDisablePushState(fbq: FbqFn): void {
  fbq.disablePushState = true;
}

/** Vollständige Seiten-URL für Meta (Router-pathname + Origin; keine PII). */
export function buildMetaPageUrl(pathname: string): string {
  if (typeof window === "undefined") return "";
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${window.location.origin}${path}${window.location.search}`;
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match?.[1];
}

/**
 * PageView-Beacon mit explizitem `dl`.
 *
 * Wichtig: Die Site nutzt Referrer-Policy `strict-origin-when-cross-origin`.
 * Meta Events Manager zeigt die Event-URL oft aus dem HTTP-Referer – der wäre
 * dann nur die Domain (`https://www.alltagshilfe-sued.de/`). Deshalb setzt
 * dieses Image `referrerPolicy: no-referrer-when-downgrade`, damit der volle
 * Pfad als Referer und als `dl` bei Meta ankommt.
 *
 * fbq('track') wird bewusst nicht genutzt – fbevents.js erbt die Document-Policy
 * und würde wieder nur die Origin senden.
 */
function sendMetaPageViewBeacon(pageUrl: string): void {
  if (typeof document === "undefined") return;

  const params = new URLSearchParams();
  params.set("id", META_PIXEL_ID);
  params.set("ev", "PageView");
  params.set("dl", pageUrl);
  const documentReferrer = document.referrer?.trim();
  if (documentReferrer) params.set("rl", documentReferrer);
  params.set("if", "false");
  params.set("ts", String(Date.now()));

  const fbp = readCookie("_fbp");
  if (fbp) params.set("fbp", fbp);

  const img = new Image(1, 1);
  img.alt = "";
  img.referrerPolicy = "no-referrer-when-downgrade";
  img.src = `https://www.facebook.com/tr/?${params.toString()}`;
}

/** Stub + fbevents.js – nur bei Marketing-Einwilligung (Init/_fbp, kein Auto-PageView). */
export function bootstrapMetaPixelScript(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.fbq) {
    applyDisablePushState(window.fbq);
    return;
  }

  const fbq: FbqFn = (...args: unknown[]) => {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
    } else {
      fbq.queue?.push(args);
    }
  };
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.push = fbq;
  applyDisablePushState(fbq);
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;
  applyDisablePushState(window._fbq);

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  const firstScript = document.getElementsByTagName("script")[0];
  firstScript?.parentNode?.insertBefore(script, firstScript);
}

/**
 * Genau ein PageView – nur mit Marketing-Consent.
 * Init ohne Nutzerdaten; autoConfig aus. PageView per Beacon mit korrektem `dl`/Referer.
 */
export function trackMetaPageViewIfConsented(pageUrl: string): void {
  if (!hasMarketingConsent()) return;
  if (typeof window === "undefined") return;

  const dl = pageUrl.trim();
  if (!dl.startsWith("http")) return;

  bootstrapMetaPixelScript();

  if (typeof window.fbq !== "function") return;

  if (!pixelInitialized) {
    window.fbq("init", META_PIXEL_ID, {}, { autoConfig: false });
    pixelInitialized = true;
  }

  sendMetaPageViewBeacon(dl);
}
