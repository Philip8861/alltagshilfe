"use client";

import type { ReactNode } from "react";

import { InkoBeratungChoiceProvider } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/InkoBeratungChoicePopup";
import { IncontinenceRecipeCtaOrchestrator } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/IncontinenceRecipeCtaOrchestrator";

/** Provider + Popups für Inkontinenz-Rezept-Ratgeber-CTAs */
export function IncontinenceRecipeCtaProvider({ children }: { children: ReactNode }) {
  return (
    <InkoBeratungChoiceProvider>
      {children}
      <IncontinenceRecipeCtaOrchestrator />
    </InkoBeratungChoiceProvider>
  );
}
