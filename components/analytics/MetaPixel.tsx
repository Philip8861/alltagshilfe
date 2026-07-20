"use client";

/**
 * Meta Pixel – nur nach Einwilligung „Marketing“.
 * Pro Seitenaufruf bzw. Client-Navigation genau ein `fbq('track', 'PageView')`.
 * Kein Lead-Event; Conversion über URL der Dankeseite in Meta.
 *
 * Meta setzt `dl` ausschließlich aus `document.location` zum Fire-Zeitpunkt (nicht
 * über event_source_url). PageView deshalb erst senden, wenn Browser-URL und
 * App-Router-pathname übereinstimmen. Meta-eigener pushState-Listener ist aus.
 */

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { hasMarketingConsent } from "@/lib/consent";
import { trackMetaPageViewIfConsented } from "@/lib/analytics/meta-pixel-client";

const ROUTE_SYNC_MAX_FRAMES = 60;

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
    let rafId = 0;
    let timeoutId = 0;
    let attempts = 0;

    const fireWhenReady = () => {
      if (cancelled || typeof window === "undefined") return;
      if (window.location.pathname !== pathname) return;

      const routeKey = getBrowserRouteKey();
      if (lastPageViewRouteKey.current === routeKey) return;
      lastPageViewRouteKey.current = routeKey;
      trackMetaPageViewIfConsented();
    };

    const attemptPageView = () => {
      if (cancelled || typeof window === "undefined") return;

      const synced = window.location.pathname === pathname;

      if (!synced && attempts < ROUTE_SYNC_MAX_FRAMES) {
        attempts += 1;
        rafId = requestAnimationFrame(attemptPageView);
        return;
      }

      // Nach History-Commit: dl kommt aus document.location – ein Tick warten.
      timeoutId = window.setTimeout(fireWhenReady, 0);
    };

    rafId = requestAnimationFrame(attemptPageView);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [marketingAllowed, pathname]);

  return null;
}
