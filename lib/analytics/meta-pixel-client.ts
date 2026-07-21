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

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match?.[1];
}

/**
 * PageView mit explizitem `dl` = aktuelle Browser-URL.
 *
 * Offizielles fbq('track','PageView') kürzt bei diesem Pixel unter Meta
 * ProtectedDataMode / Core Setup die URL auf die Domain (Network: dlc=1,
 * dl=https://www.alltagshilfe-sued.de). URL-basierte Custom Conversions
 * brauchen den vollen Pfad – daher Image-Request mit window.location.href.
 */
function sendMetaPageViewWithBrowserUrl(pageUrl: string): void {
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
 * Init über fbq; PageView mit dl = window.location.href (volle aktuelle URL).
 */
export function trackMetaPageViewIfConsented(): void {
  if (!hasMarketingConsent()) return;
  if (typeof window === "undefined") return;

  const pageUrl = window.location.href.trim();
  if (!pageUrl.startsWith("http")) return;

  bootstrapMetaPixelScript();

  if (typeof window.fbq !== "function") return;

  if (!pixelInitialized) {
    window.fbq("init", META_PIXEL_ID, {}, { autoConfig: false });
    pixelInitialized = true;
  }

  sendMetaPageViewWithBrowserUrl(pageUrl);
}
