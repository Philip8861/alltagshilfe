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
 * - Wichtig: NEXT_PUBLIC_*-Variablen werden zur Build-Zeit ins Bundle gebrannt.
 *   Nach dem Hinzufuegen muss in Vercel/Hosting NEU deployed werden, sonst ist
 *   der Wert im Browser leer und es wird nichts geladen.
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
import { Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { getConsent } from "@/lib/consent";

const GA_ID = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "").trim();

type GtagFn = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

/**
 * Initialer Consent-Mode (vor Skript-Laden setzen, im Inline-Snippet erledigt).
 * Definiert global `window.gtag` als Funktion, die `arguments` in den dataLayer pusht
 * (genau diese Form erwartet GTM/GA – ein normales Array reicht NICHT!).
 */
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
  const [scriptReady, setScriptReady] = useState(false);
  const configuredRef = useRef(false);
  const lastPagePath = useRef<string | null>(null);

  const syncConsent = useCallback(() => {
    const c = getConsent();
    setAnalyticsAllowed(c?.analytics === true);
    setMarketingAllowed(c?.marketing === true);
  }, []);

  /** Direkt nach Hydration Consent lesen, damit gtag bei wiederkehrenden Besuchern früher starten kann. */
  useLayoutEffect(() => {
    syncConsent();
  }, [syncConsent]);

  useEffect(() => {
    window.addEventListener("ahs-consent-updated", syncConsent);
    return () => window.removeEventListener("ahs-consent-updated", syncConsent);
  }, [syncConsent]);

  /** Statistik widerrufen: neu zulassen muss config + page_view erneut zuverlässig triggern. */
  useEffect(() => {
    if (analyticsAllowed) return;
    configuredRef.current = false;
    lastPagePath.current = null;
    setScriptReady(false);
  }, [analyticsAllowed]);

  /** Consent-Updates an gtag durchreichen (auch nachtraeglich, wenn Skript bereit ist). */
  useEffect(() => {
    if (!GA_ID) return;
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    window.gtag("consent", "update", {
      analytics_storage: analyticsAllowed ? "granted" : "denied",
      ad_storage: marketingAllowed ? "granted" : "denied",
      ad_user_data: marketingAllowed ? "granted" : "denied",
      ad_personalization: marketingAllowed ? "granted" : "denied",
    });
  }, [analyticsAllowed, marketingAllowed, scriptReady]);

  /** Konfiguriert GA einmal, sobald Skript geladen ist und Statistik erlaubt. */
  useEffect(() => {
    if (!GA_ID) return;
    if (!scriptReady) return;
    if (configuredRef.current) return;
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;
    window.gtag("config", GA_ID, {
      anonymize_ip: true,
      send_page_view: false,
    });
    configuredRef.current = true;
  }, [scriptReady]);

  const sendPageView = useCallback(() => {
    if (!GA_ID) return false;
    if (!analyticsAllowed) return false;
    if (typeof window === "undefined" || typeof window.gtag !== "function") return false;
    if (!configuredRef.current) return false;
    const qs = searchParams?.toString();
    const fullPath = qs ? `${pathname}?${qs}` : pathname;
    if (lastPagePath.current === fullPath) return true;
    lastPagePath.current = fullPath;
    window.gtag("event", "page_view", {
      page_path: fullPath,
      page_location: window.location.href,
      page_title: document.title,
    });
    return true;
  }, [analyticsAllowed, pathname, searchParams]);

  /** Page-View bei jedem Pfadwechsel; kurz verzögert, damit document.title aus Metadata meist gesetzt ist. */
  useEffect(() => {
    const id = window.setTimeout(() => {
      sendPageView();
    }, 0);
    return () => window.clearTimeout(id);
  }, [sendPageView, scriptReady]);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        id="ga-consent-default"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SNIPPET }}
      />
      {analyticsAllowed ? (
        <Script
          id="ga-loader"
          src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`}
          strategy="afterInteractive"
          onLoad={() => setScriptReady(true)}
          onReady={() => setScriptReady(true)}
        />
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
