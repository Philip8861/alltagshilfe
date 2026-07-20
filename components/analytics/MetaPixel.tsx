"use client";

/**
 * Meta Pixel – nur nach Einwilligung „Marketing“.
 * Pro Seitenaufruf bzw. Client-Navigation genau ein `fbq('track', 'PageView')`.
 * Kein Lead-Event; Conversion über URL der Dankeseite in Meta.
 *
 * PageView erst auslösen, wenn `window.location.pathname` dem App-Router-pathname
 * entspricht – verhindert falsche `dl`-Werte (z. B. Startseite statt Landingpage).
 */

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { hasMarketingConsent } from "@/lib/consent";
import { trackMetaPageViewIfConsented } from "@/lib/analytics/meta-pixel-client";

const ROUTE_SYNC_MAX_FRAMES = 40;

function getBrowserRouteKey(): string {
  if (typeof window === "undefined") return "";
  return `${window.location.pathname}${window.location.search}`;
}

export function MetaPixel() {
  const pathname = usePathname();
  const [marketingAllowed, setMarketingAllowed] = useState(false);
  const lastPageViewRouteKey = useRef<string | null>(null);

  const syncConsent = useCallback(() => {
    setMarketingAllowed(hasMarketingConsent());
  }, []);

  useLayoutEffect(() => {
    syncConsent();
  }, [syncConsent]);

  useEffect(() => {
    const onConsentUpdated = () => syncConsent();
    window.addEventListener("ahs-consent-updated", onConsentUpdated);
    return () => window.removeEventListener("ahs-consent-updated", onConsentUpdated);
  }, [syncConsent]);

  useEffect(() => {
    if (!marketingAllowed) {
      lastPageViewRouteKey.current = null;
      return;
    }

    let cancelled = false;
    let frameId = 0;
    let attempts = 0;

    const attemptPageView = () => {
      if (cancelled || typeof window === "undefined") return;

      const browserPath = window.location.pathname;
      const synced = browserPath === pathname;

      if (!synced && attempts < ROUTE_SYNC_MAX_FRAMES) {
        attempts += 1;
        frameId = requestAnimationFrame(attemptPageView);
        return;
      }

      const routeKey = getBrowserRouteKey();
      if (lastPageViewRouteKey.current === routeKey) return;
      lastPageViewRouteKey.current = routeKey;
      trackMetaPageViewIfConsented();
    };

    frameId = requestAnimationFrame(attemptPageView);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
    };
  }, [marketingAllowed, pathname]);

  return null;
}
