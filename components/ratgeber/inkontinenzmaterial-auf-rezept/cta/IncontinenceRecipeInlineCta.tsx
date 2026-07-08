"use client";

import { useRef } from "react";

import {
  INKO_ARTICLE_CTA_BODY_CLASS,
  INKO_ARTICLE_CTA_HEADING_CLASS,
  INKO_ARTICLE_CTA_LABEL_CLASS,
  INKO_ARTICLE_CTA_SUBTEXT_CLASS,
  INKO_ARTICLE_CTA_SURFACE_CLASS,
  InkoArticleCtaBackground,
  InkoArticleCtaContentPane,
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
      className={`${INKO_ARTICLE_CTA_SURFACE_CLASS} relative mt-10 min-h-[17.5rem] scroll-mt-28 overflow-hidden rounded-2xl border border-[#0F4F68]/14 sm:min-h-[15.5rem]`}
      aria-labelledby="inko-inline-cta-heading"
    >
      <InkoArticleCtaBackground />
      <InkoCtaGradientStripe />
      <InkoArticleCtaContentPane className="relative z-[1]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="min-w-0 flex-1">
            <p className={INKO_ARTICLE_CTA_LABEL_CLASS}>Kostenlose Unterstützung</p>
            <h3
              id="inko-inline-cta-heading"
              className={`${INKO_ARTICLE_CTA_HEADING_CLASS} mt-2 text-xl sm:text-2xl`}
            >
              Unsicher, was Ihre Krankenkasse übernimmt?
            </h3>
            <p className={`${INKO_ARTICLE_CTA_BODY_CLASS} mt-3 text-[1.125rem] sm:text-[1.2rem]`}>
              Wir helfen Ihnen persönlich weiter. Lassen Sie sich kostenlos zur Inkontinenzversorgung auf Rezept beraten und
              erfahren Sie, welche Produkte zu Ihrer Situation passen.
            </p>
            <InkoTrustCheckList items={INKO_REZEPT_TRUST_INLINE} onBanner className="sm:grid sm:grid-cols-2 sm:gap-x-4" />
          </div>
          <div className="flex w-full shrink-0 flex-col items-stretch gap-3 lg:max-w-[18.5rem]">
            <InkoPrimaryBeratungButton dataCta={CTA_ID} clickEvent="inko_cta_inline_click" className="min-h-[3.25rem] text-base sm:text-[1.0625rem]">
              Jetzt kostenlos beraten lassen
            </InkoPrimaryBeratungButton>
            <p className={`${INKO_ARTICLE_CTA_SUBTEXT_CLASS} text-center text-[0.9375rem] sm:text-base`}>
              Anrufen, Kontaktformular oder WhatsApp – Sie wählen.
            </p>
          </div>
        </div>
      </InkoArticleCtaContentPane>
    </aside>
  );
}
