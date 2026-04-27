"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { getConsent } from "@/lib/consent";

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
 */
export function SiteAnalyticsSpaNavigation() {
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

    postNavigationPath(pathname);
  }, [pathname]);

  useEffect(() => {
    const onConsent = () => {
      postNavigationPath(pathname);
    };
    window.addEventListener("ahs-consent-updated", onConsent);
    return () => window.removeEventListener("ahs-consent-updated", onConsent);
  }, [pathname]);

  return null;
}
