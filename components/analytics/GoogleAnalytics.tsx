"use client";

/**
 * Google Analytics 4 (GA4) – Consent-gestützte Einbindung mit SPA-Pageviews.
 *
 * Lädt das gtag-Skript erst, wenn der Nutzer im Cookie-Banner der Kategorie
 * „Statistik“ zugestimmt hat (`hasAnalyticsConsent()`), und meldet bei jedem
 * Pfadwechsel im App-Router einen `page_view` an GA.
 *
 * Aktivierung:
 * - `NEXT_PUBLIC_GA_MEASUREMENT_ID` in den Hosting-Env-Variablen setzen (z. B. `G-XXXXXXXXXX`).
 * - Ohne ID wird nichts geladen (kein Tracking).
 *
 * Datenschutz-Voreinstellungen:
 * - Vor Consent: Consent Mode v2 default = denied (analytics_storage, ad_*).
 * - Bei Zustimmung „Statistik“: analytics_storage = granted.
 * - Bei Zustimmung „Marketing“: ad_storage / ad_user_data / ad_personalization = granted.
 * - `anonymize_ip: true` als zusätzliche Schutzmaßnahme.
 */

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { getConsent } from "@/lib/consent";

const GA_ID = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "").trim();

type GtagFn = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

function pushDataLayer(...args: unknown[]) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

/** Initialer Consent-Mode (vor Skript-Laden setzen, im Inline-Snippet erledigt). */
const CONSENT_DEFAULT_SNIPPET = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'granted',
  security_storage: 'granted',
  wait_for_update: 500,
});
gtag('js', new Date());
`.trim();

function GoogleAnalyticsInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const [marketingAllowed, setMarketingAllowed] = useState(false);
  const lastPagePath = useRef<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const c = getConsent();
      setAnalyticsAllowed(c?.analytics === true);
      setMarketingAllowed(c?.marketing === true);
    };
    sync();
    window.addEventListener("ahs-consent-updated", sync);
    return () => window.removeEventListener("ahs-consent-updated", sync);
  }, []);

  useEffect(() => {
    if (!GA_ID) return;
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    window.gtag("consent", "update", {
      analytics_storage: analyticsAllowed ? "granted" : "denied",
      ad_storage: marketingAllowed ? "granted" : "denied",
      ad_user_data: marketingAllowed ? "granted" : "denied",
      ad_personalization: marketingAllowed ? "granted" : "denied",
    });
  }, [analyticsAllowed, marketingAllowed]);

  useEffect(() => {
    if (!GA_ID) return;
    if (!analyticsAllowed) return;
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    const qs = searchParams?.toString();
    const fullPath = qs ? `${pathname}?${qs}` : pathname;
    if (lastPagePath.current === fullPath) return;
    lastPagePath.current = fullPath;
    window.gtag("event", "page_view", {
      page_path: fullPath,
      page_location: typeof window !== "undefined" ? window.location.href : undefined,
      page_title: typeof document !== "undefined" ? document.title : undefined,
    });
  }, [pathname, searchParams, analyticsAllowed]);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        id="ga-consent-default"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SNIPPET }}
      />
      {analyticsAllowed ? (
        <>
          <Script
            id="ga-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`}
            strategy="afterInteractive"
            onLoad={() => {
              pushDataLayer("config", GA_ID, {
                anonymize_ip: true,
                send_page_view: false,
              });
            }}
          />
        </>
      ) : null}
    </>
  );
}

/**
 * Stabiler Wrapper – `useSearchParams` braucht einen Suspense-Boundary
 * für den App-Router, damit beim Pre-Rendering keine Bail-Outs entstehen.
 */
export function GoogleAnalytics() {
  if (!GA_ID) return null;
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner />
    </Suspense>
  );
}
