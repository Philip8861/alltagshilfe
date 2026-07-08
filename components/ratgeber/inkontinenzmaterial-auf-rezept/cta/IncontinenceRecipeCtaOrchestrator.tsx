"use client";

import { IncontinenceTimedPopup } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/IncontinenceTimedPopup";
import { isInkoRezeptRatgeberPath } from "@/lib/ratgeber/inko-rezept-cta-config";
import { useInkoRezeptCtaGate } from "@/lib/ratgeber/inko-rezept-cta-storage";
import { usePathname } from "next/navigation";

/** 30s-Popup nur auf dem Inkontinenz-Rezept-Ratgeber */
export function IncontinenceRecipeCtaOrchestrator() {
  const pathname = usePathname();
  const { hydrated, ctaClicked, markClicked } = useInkoRezeptCtaGate();

  if (!hydrated || !isInkoRezeptRatgeberPath(pathname)) return null;

  return <IncontinenceTimedPopup enabled ctaClicked={ctaClicked} onCtaClick={markClicked} />;
}
