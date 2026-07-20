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

/** Stub + fbevents.js – nur bei Marketing-Einwilligung aufrufen. */
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
 * Init ohne Nutzerdaten; autoConfig aus (keine Auto-Events / kein Advanced Matching im Code).
 * `dl` wird von Meta aus document.location gelesen – Aufrufer muss die Browser-URL
 * bereits committet haben (siehe MetaPixel.tsx).
 */
export function trackMetaPageViewIfConsented(): void {
  if (!hasMarketingConsent()) return;
  if (typeof window === "undefined") return;

  bootstrapMetaPixelScript();

  if (typeof window.fbq !== "function") return;

  if (!pixelInitialized) {
    window.fbq("init", META_PIXEL_ID, {}, { autoConfig: false });
    pixelInitialized = true;
  }

  window.fbq("track", "PageView");
}
