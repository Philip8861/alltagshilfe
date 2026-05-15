"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { pushGtmVirtualPageView } from "@/lib/analytics/gtm-data-layer";

/**
 * Client-Navigationen (App Router): dataLayer-Event für GTM/GA4-Konfiguration (z. B. History-Trigger).
 * Erster Mount wird übersprungen (Volllast wird vom Container mit „All Pages“ abgedeckt).
 */
export function GtmSpaRouteTracker() {
  const pathname = usePathname();
  const firstPaint = useRef(true);
  const lastReported = useRef<string | null>(null);

  useEffect(() => {
    if (firstPaint.current) {
      firstPaint.current = false;
      lastReported.current = pathname;
      return;
    }
    if (lastReported.current === pathname) return;
    lastReported.current = pathname;
    pushGtmVirtualPageView(pathname);
  }, [pathname]);

  useEffect(() => {
    const onConsent = () => {
      pushGtmVirtualPageView(pathname);
    };
    window.addEventListener("ahs-consent-updated", onConsent);
    return () => window.removeEventListener("ahs-consent-updated", onConsent);
  }, [pathname]);

  return null;
}
