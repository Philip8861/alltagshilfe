"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { getConsent } from "@/lib/consent";

function currentAnalyticsPath(pathname: string): string {
  if (typeof window === "undefined") return pathname;
  const hash = window.location.hash.replace(/^#/, "").trim();
  return hash ? `${pathname}#${hash}` : pathname;
}

function postNavigationPath(path: string) {
  if (!getConsent()?.analytics) return;
  void fetch("/api/site-analytics/navigation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
    keepalive: true,
  }).catch(() => {});
}

/**
 * Zählt Client-Navigationen (Next.js App Router), die keine vollständige Document-Request an die Middleware senden.
 * Erster Aufruf nach Mount wird übersprungen (Initial Load wird bereits von der Middleware gezählt, sofern Einwilligung Statistik).
 * Hash-Wechsel (z. B. #betriebliche-pflegeberatung) werden mitgezählt und serverseitig auf den kanonischen Pfad gelegt.
 */
export function SiteAnalyticsSpaNavigation() {
  const pathname = usePathname();
  const firstPaint = useRef(true);
  const lastReported = useRef<string | null>(null);

  useEffect(() => {
    const report = (path: string) => {
      if (lastReported.current === path) return;
      lastReported.current = path;
      postNavigationPath(path);
    };

    if (firstPaint.current) {
      firstPaint.current = false;
      lastReported.current = currentAnalyticsPath(pathname);
    } else {
      report(currentAnalyticsPath(pathname));
    }

    const onHash = () => report(currentAnalyticsPath(pathname));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [pathname]);

  useEffect(() => {
    const onConsent = () => {
      postNavigationPath(currentAnalyticsPath(pathname));
    };
    window.addEventListener("ahs-consent-updated", onConsent);
    return () => window.removeEventListener("ahs-consent-updated", onConsent);
  }, [pathname]);

  return null;
}
