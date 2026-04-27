"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Zählt Client-Navigationen (Next.js App Router), die keine vollständige Document-Request an die Middleware senden.
 * Erster Aufruf nach Mount wird übersprungen (Initial Load wird bereits von der Middleware gezählt).
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

    void fetch("/api/site-analytics/navigation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
