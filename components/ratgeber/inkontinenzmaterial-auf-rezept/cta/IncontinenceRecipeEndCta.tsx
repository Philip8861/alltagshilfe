"use client";

import { useRef } from "react";

import {
  INKO_ARTICLE_CTA_BODY_CLASS,
  INKO_ARTICLE_CTA_HEADING_CLASS,
  INKO_ARTICLE_CTA_SUBTEXT_CLASS,
  INKO_ARTICLE_CTA_SURFACE_CLASS,
  InkoArticleCtaBackground,
  InkoArticleCtaContentPane,
  InkoCtaGradientStripe,
  InkoPrimaryBeratungButton,
  InkoTrustCheckList,
  useInkoCtaViewTracking,
} from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/inko-rezept-cta-primitives";
import { INKO_REZEPT_TRUST_END } from "@/lib/ratgeber/inko-rezept-cta-config";
import { cn } from "@/lib/utils";

const CTA_ID = "inko-rezept-end";

/** Abschluss-CTA nach dem Fazit */
export function IncontinenceRecipeEndCta() {
  const ref = useRef<HTMLElement>(null);
  useInkoCtaViewTracking(ref, "inko_cta_end_view", CTA_ID);

  return (
    <section
      ref={ref}
      id="inko-abschluss-cta"
      data-cta={CTA_ID}
      className={cn(
        INKO_ARTICLE_CTA_SURFACE_CLASS,
        "relative mt-14 min-h-[18rem] scroll-mt-28 overflow-hidden rounded-2xl border border-[#0F4F68]/14 sm:min-h-[16rem]",
      )}
      aria-labelledby="inko-end-cta-heading"
    >
      <InkoArticleCtaBackground />
      <InkoCtaGradientStripe />
      <InkoArticleCtaContentPane className="relative z-[1] mx-auto max-w-[40rem] text-center sm:text-left">
        <h2 id="inko-end-cta-heading" className={`${INKO_ARTICLE_CTA_HEADING_CLASS} text-[1.35rem] sm:text-[1.75rem]`}>
          Wir helfen Ihnen zur passenden Inkontinenzversorgung auf Rezept
        </h2>
        <p className={`${INKO_ARTICLE_CTA_BODY_CLASS} mt-4 text-[1.125rem] sm:text-[1.2rem]`}>
          Sie müssen Rezept, Krankenkasse und Produktauswahl nicht allein klären. Alltagshilfe-Süd unterstützt Sie persönlich,
          diskret und verständlich. Auf Wunsch erhalten Sie ein kostenloses Testpaket mit passenden Produkten.
        </p>
        <InkoTrustCheckList items={INKO_REZEPT_TRUST_END} onBanner className="sm:grid sm:grid-cols-2 sm:gap-x-6" />
        <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:items-start">
          <InkoPrimaryBeratungButton
            dataCta={CTA_ID}
            clickEvent="inko_cta_end_click"
            className="min-h-[3.25rem] text-base sm:max-w-[21rem] sm:text-[1.0625rem]"
          >
            Jetzt kostenlos beraten lassen
          </InkoPrimaryBeratungButton>
        </div>
        <p className={`${INKO_ARTICLE_CTA_SUBTEXT_CLASS} mt-5 text-[0.9375rem] sm:text-base`}>
          Unverbindlich. Persönlich. Mit viel Herz im Alltag.
        </p>
      </InkoArticleCtaContentPane>
    </section>
  );
}
