"use client";

/**
 * Meta Pixel – nur nach Einwilligung „Marketing“.
 * Pro Route genau ein `fbq('track', 'PageView')`; Meta-eigener pushState-Listener
 * ist deaktiviert (keine Auto-Duplikate). Kein Lead-Event; Conversion über die
 * URL der Dankeseite in Meta.
 *
 * PageView erst senden, wenn `window.location.pathname` dem Router-pathname
 * entspricht – fbevents.js liest `dl` aus document.location zum Track-Zeitpunkt.
 */

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { hasMarketingConsent } from "@/lib/consent";
import { trackMetaPageViewIfConsented } from "@/lib/analytics/meta-pixel-client";

const ROUTE_SYNC_MAX_FRAMES = 60;

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
    let attempts = 0;

    const attemptPageView = () => {
      if (cancelled || typeof window === "undefined") return;

      if (window.location.pathname !== pathname && attempts < ROUTE_SYNC_MAX_FRAMES) {
        attempts += 1;
        rafId = requestAnimationFrame(attemptPageView);
        return;
      }
      if (window.location.pathname !== pathname) return;

      const routeKey = `${window.location.pathname}${window.location.search}`;
      if (lastPageViewRouteKey.current === routeKey) return;
      lastPageViewRouteKey.current = routeKey;
      trackMetaPageViewIfConsented();
    };

    rafId = requestAnimationFrame(attemptPageView);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [marketingAllowed, pathname]);

  return null;
}
