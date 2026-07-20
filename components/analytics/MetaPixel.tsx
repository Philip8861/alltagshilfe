"use client";

/**
 * Meta Pixel – nur nach Einwilligung „Marketing“.
 * Pro Route genau ein PageView mit explizitem `dl` (Landingpage, Dankeseite, …).
 * fbq('track','PageView') wird nicht verwendet – Meta liest sonst document.location (oft Startseite).
 */

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { hasMarketingConsent } from "@/lib/consent";
import { buildMetaPageUrl, trackMetaPageViewIfConsented } from "@/lib/analytics/meta-pixel-client";

function getRouteKey(pathname: string): string {
  if (typeof window === "undefined") return pathname;
  return `${pathname}${window.location.search}`;
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

    const routeKey = getRouteKey(pathname);
    if (lastPageViewRouteKey.current === routeKey) return;

    let cancelled = false;
    const timeoutId = window.setTimeout(() => {
      if (cancelled) return;
      if (lastPageViewRouteKey.current === routeKey) return;
      lastPageViewRouteKey.current = routeKey;
      trackMetaPageViewIfConsented(buildMetaPageUrl(pathname));
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [marketingAllowed, pathname]);

  return null;
}
