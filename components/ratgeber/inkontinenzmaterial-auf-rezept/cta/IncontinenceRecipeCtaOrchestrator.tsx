"use client";

import { IncontinenceExitIntentPopup } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/IncontinenceExitIntentPopup";
import { IncontinenceTimedPopup } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/IncontinenceTimedPopup";
import { isInkoRezeptRatgeberPath } from "@/lib/ratgeber/inko-rezept-cta-config";
import { useInkoRezeptCtaGate } from "@/lib/ratgeber/inko-rezept-cta-storage";
import { usePathname } from "next/navigation";

/** Popups nur auf dem Inkontinenz-Rezept-Ratgeber – zentral eingebunden in der Page. */
export function IncontinenceRecipeCtaOrchestrator() {
  const pathname = usePathname();
  const { hydrated, ctaClicked, exitDismissed, markClicked, dismissExit } = useInkoRezeptCtaGate();

  if (!hydrated || !isInkoRezeptRatgeberPath(pathname)) return null;

  return (
    <>
      <IncontinenceTimedPopup enabled ctaClicked={ctaClicked} onCtaClick={markClicked} />
      <IncontinenceExitIntentPopup
        enabled
        ctaClicked={ctaClicked}
        dismissed={exitDismissed}
        onDismiss={dismissExit}
        onCtaClick={markClicked}
      />
    </>
  );
}
