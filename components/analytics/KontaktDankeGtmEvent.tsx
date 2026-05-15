"use client";

import { useEffect, useRef } from "react";
import { readAndClearContactSubmissionContext, trackFormSuccess } from "@/lib/analytics/gtm-data-layer";

/**
 * Nach erfolgreichem Kontakt (Redirect /kontakt/danke): einmaliges contact_intent success für GTM.
 * Keine sichtbare UI-Änderung.
 */
export function KontaktDankeGtmEvent() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const ctx = readAndClearContactSubmissionContext();
    if (!ctx) return;
    trackFormSuccess({
      source_component: "kontakt_form_danke",
      contact_path: ctx.pathname,
      service: ctx.topic || undefined,
    });
  }, []);

  return null;
}
