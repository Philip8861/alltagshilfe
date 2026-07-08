"use client";

import { pushGtmDataLayer } from "@/lib/analytics/gtm-data-layer";

export type InkoRezeptCtaEventName =
  | "inko_cta_popup_30s_view"
  | "inko_cta_popup_30s_click"
  | "inko_cta_inline_view"
  | "inko_cta_inline_click"
  | "inko_cta_end_view"
  | "inko_cta_end_click"
  | "inko_cta_exit_view"
  | "inko_cta_exit_click"
  | "inko_cta_dismiss";

export function trackInkoRezeptCtaEvent(
  eventName: InkoRezeptCtaEventName,
  ctaId: string,
  extra?: Record<string, string>,
): void {
  if (typeof window === "undefined") return;
  pushGtmDataLayer({
    event: eventName,
    cta_id: ctaId,
    page_path: window.location.pathname,
    page_location: window.location.href,
    page_title: typeof document !== "undefined" ? document.title : "",
    ...extra,
  });
}
