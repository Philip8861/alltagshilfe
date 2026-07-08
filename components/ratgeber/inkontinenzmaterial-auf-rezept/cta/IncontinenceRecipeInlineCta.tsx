"use client";

import { useRef } from "react";

import {
  INKO_ARTICLE_CTA_SURFACE_CLASS,
  InkoArticleCtaBackground,
  InkoCtaGradientStripe,
  InkoPrimaryBeratungButton,
  InkoTrustCheckList,
  useInkoCtaViewTracking,
} from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/inko-rezept-cta-primitives";
import { INKO_REZEPT_TRUST_INLINE } from "@/lib/ratgeber/inko-rezept-cta-config";

const CTA_ID = "inko-rezept-inline-cost";

/** Feste CTA-Box nach dem Kosten-Abschnitt */
export function IncontinenceRecipeInlineCta() {
  const ref = useRef<HTMLElement>(null);
  useInkoCtaViewTracking(ref, "inko_cta_inline_view", CTA_ID);

  return (
    <aside
      ref={ref}
      data-cta={CTA_ID}
      className={`${INKO_ARTICLE_CTA_SURFACE_CLASS} relative mt-10 scroll-mt-28 overflow-hidden rounded-2xl border border-[#0F4F68]/12 px-5 py-7 sm:px-8 sm:py-8`}
      aria-labelledby="inko-inline-cta-heading"
    >
      <InkoArticleCtaBackground />
      <InkoCtaGradientStripe />
      <div className="relative z-[1] flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="min-w-0 flex-1">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#5a959e]">Kostenlose Unterstützung</p>
          <h3 id="inko-inline-cta-heading" className="mt-2 text-lg font-semibold tracking-tight text-[#0F4F68] sm:text-xl">
            Unsicher, was Ihre Krankenkasse übernimmt?
          </h3>
          <p className="mt-3 text-[1.0625rem] leading-relaxed text-neutral-700">
            Wir helfen Ihnen persönlich weiter. Lassen Sie sich kostenlos zur Inkontinenzversorgung auf Rezept beraten und
            erfahren Sie, welche Produkte zu Ihrer Situation passen.
          </p>
          <InkoTrustCheckList items={INKO_REZEPT_TRUST_INLINE} className="sm:grid sm:grid-cols-2 sm:gap-x-4" />
        </div>
        <div className="flex w-full shrink-0 flex-col items-stretch gap-3 lg:max-w-[17.5rem]">
          <InkoPrimaryBeratungButton dataCta={CTA_ID} clickEvent="inko_cta_inline_click">
            Jetzt kostenlos beraten lassen
          </InkoPrimaryBeratungButton>
          <p className="text-center text-xs leading-relaxed text-neutral-500 sm:text-[0.8125rem]">
            Anrufen, Kontaktformular oder WhatsApp – Sie wählen.
          </p>
        </div>
      </div>
    </aside>
  );
}
