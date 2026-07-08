"use client";

import type { ReactNode } from "react";
import { useRef } from "react";

import { InkoArticleCtaBox } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/InkoArticleCtaBox";
import {
  INKO_ARTICLE_CTA_BODY_CLASS,
  INKO_ARTICLE_CTA_HEADING_CLASS,
  INKO_ARTICLE_CTA_SURFACE_CLASS,
  InkoArticleCtaBackground,
  InkoArticleCtaContentPane,
  InkoCtaGradientStripe,
  InkoPrimaryBeratungButton,
  useInkoCtaViewTracking,
} from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/inko-rezept-cta-primitives";
import type { InkoRezeptCtaEventName } from "@/lib/ratgeber/inko-rezept-cta-tracking";
import { cn } from "@/lib/utils";

type InkontinenzProductCtaBoxProps = {
  dataCta: string;
  clickEvent: InkoRezeptCtaEventName;
  heading: string;
  children: ReactNode;
  className?: string;
};

/** Werbebox im Artikel – Text auf Banner, einheitlicher Beratungs-Button */
export function InkontinenzProductCtaBox({ dataCta, clickEvent, heading, children, className }: InkontinenzProductCtaBoxProps) {
  return (
    <InkoArticleCtaBox dataCta={dataCta} clickEvent={clickEvent} heading={heading} className={className}>
      {children}
    </InkoArticleCtaBox>
  );
}

/** Abschluss-CTA mit einheitlichem Beratungs-Button */
export function InkontinenzProductEndCta() {
  const dataCta = "inko-produkt-end";
  const ref = useRef<HTMLElement>(null);
  useInkoCtaViewTracking(ref, "inko_cta_end_view", dataCta);

  return (
    <section
      ref={ref}
      id="inko-produkt-abschluss-cta"
      data-cta={dataCta}
      className={cn(
        INKO_ARTICLE_CTA_SURFACE_CLASS,
        "relative mt-14 min-h-[18rem] scroll-mt-28 overflow-hidden rounded-2xl border border-[#0F4F68]/14 sm:min-h-[16rem]",
      )}
      aria-labelledby="inko-produkt-end-heading"
    >
      <InkoArticleCtaBackground />
      <InkoCtaGradientStripe />
      <InkoArticleCtaContentPane className="mx-auto max-w-[40rem] text-center sm:text-left">
        <h2 id="inko-produkt-end-heading" className={`${INKO_ARTICLE_CTA_HEADING_CLASS} text-[1.35rem] sm:text-[1.75rem]`}>
          Jetzt passende Inkontinenzversorgung finden
        </h2>
        <p className={`${INKO_ARTICLE_CTA_BODY_CLASS} mt-4 text-[1.125rem] sm:text-[1.2rem]`}>
          Sie müssen nicht allein ausprobieren. Alltagshilfe-Süd berät Sie kostenlos, diskret und verständlich. Auf Wunsch
          erhalten Sie ein gratis Testpaket mit passenden Produkten.
        </p>
        <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:items-start">
          <InkoPrimaryBeratungButton
            dataCta={dataCta}
            clickEvent="inko_cta_end_click"
            className="sm:max-w-[26rem]"
          />
        </div>
        <p className={`${INKO_ARTICLE_CTA_BODY_CLASS} mt-5 text-[0.9375rem] sm:text-base`}>
          Rückruf innerhalb von 24 Stunden – oder direkt anrufen &amp; per WhatsApp.
        </p>
      </InkoArticleCtaContentPane>
    </section>
  );
}

/** Beratungs-CTA im Artikel */
export function InkontinenzProductBeratungCta() {
  return (
    <InkontinenzProductCtaBox
      dataCta="inko-produkt-beratung"
      clickEvent="inko_cta_inline_click"
      heading="Sie sind unsicher, ob Einlagen, Vorlagen, Pants oder Windeln richtig sind?"
    >
      <p>
        Lassen Sie sich kostenlos beraten. Wir helfen Ihnen dabei, die passende Inkontinenzversorgung zu finden und senden
        Ihnen auf Wunsch ein gratis Testpaket nach Hause.
      </p>
    </InkontinenzProductCtaBox>
  );
}
