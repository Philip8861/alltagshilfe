"use client";

import { useEffect, useRef } from "react";
import {
  readAndClearFbLandingHaushaltAlltagsSuccessContext,
  trackFinderSuccess,
} from "@/lib/analytics/gtm-data-layer";

/**
 * Nach erfolgreichem FB-Landing-Wizard (Redirect /vielen-dank-haushalt-alltag):
 * einmaliges contact_intent success für GTM / Facebook-Lead-Trigger.
 */
export function FbLandingHaushaltAlltagsDankeGtmEvent() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    const ctx = readAndClearFbLandingHaushaltAlltagsSuccessContext();
    if (!ctx) return;
    trackFinderSuccess({
      finder: "fb_landing_haushalt_alltags",
      source_component: "fb_landing_haushalt_alltags_danke",
      service: ctx.service,
      plz: ctx.plz,
    });
  }, []);

  return null;
}
