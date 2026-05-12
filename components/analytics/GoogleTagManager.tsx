"use client";

/**
 * Google Tag Manager (Container) – konsistent mit bestehendem Cookie-Banner:
 * Consent Mode v2 per `gtag`-Stub (von `beforeInteractive`-Snippet im Root-Layout);
 * lädt den GTM-Bootstrap erst bei Einwilligung „Statistik“ und/oder „Marketing“,
 * ohne separates gtag.js/GA-Direct-ID im Seitenquelltext.
 */

import Script from "next/script";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { getConsent } from "@/lib/consent";

/** Offizieller Bootstrap (Container); GA4 nur im GTM, keine G--ID am Frontend. */
const GTM_BOOTSTRAP_SNIPPET = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NTZ7VJJC');`;

type GtagFn = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

function GoogleTagManagerInner() {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const [marketingAllowed, setMarketingAllowed] = useState(false);

  const syncConsent = useCallback(() => {
    const c = getConsent();
    setAnalyticsAllowed(c?.analytics === true);
    setMarketingAllowed(c?.marketing === true);
  }, []);

  useLayoutEffect(() => {
    syncConsent();
  }, [syncConsent]);

  useEffect(() => {
    window.addEventListener("ahs-consent-updated", syncConsent);
    return () => window.removeEventListener("ahs-consent-updated", syncConsent);
  }, [syncConsent]);

  /** Nachladen weiterer Tags im GTM wertet Consent aus; ohne Marketing bleiben ad_* verweigert. */
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    window.gtag("consent", "update", {
      analytics_storage: analyticsAllowed ? "granted" : "denied",
      ad_storage: marketingAllowed ? "granted" : "denied",
      ad_user_data: marketingAllowed ? "granted" : "denied",
      ad_personalization: marketingAllowed ? "granted" : "denied",
    });
  }, [analyticsAllowed, marketingAllowed]);

  const loadGtm = analyticsAllowed || marketingAllowed;

  if (!loadGtm) return null;

  return (
    <Script
      id="google-tag-manager-gtm-ntz7vjjc"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: GTM_BOOTSTRAP_SNIPPET }}
    />
  );
}

export function GoogleTagManager() {
  return <GoogleTagManagerInner />;
}
