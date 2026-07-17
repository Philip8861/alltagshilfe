"use client";

/**
 * Meta Pixel – nur nach Einwilligung „Marketing“.
 * Pro Seitenaufruf bzw. Client-Navigation genau ein `fbq('track', 'PageView')`.
 * Kein Lead-Event; Conversion über URL der Dankeseite in Meta.
 */

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { hasMarketingConsent } from "@/lib/consent";
import { trackMetaPageViewIfConsented } from "@/lib/analytics/meta-pixel-client";

export function MetaPixel() {
  const pathname = usePathname();
  const [marketingAllowed, setMarketingAllowed] = useState(false);
  const lastPageViewPath = useRef<string | null>(null);

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
      lastPageViewPath.current = null;
      return;
    }
    if (lastPageViewPath.current === pathname) return;
    lastPageViewPath.current = pathname;
    trackMetaPageViewIfConsented();
  }, [marketingAllowed, pathname]);

  return null;
}
