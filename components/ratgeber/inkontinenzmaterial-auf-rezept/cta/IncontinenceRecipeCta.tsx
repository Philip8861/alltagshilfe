"use client";

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
import { cn } from "@/lib/utils";

const END_CTA_ID = "inko-rezept-end";

/** Nach dem Kosten-Abschnitt – Fokus Zuzahlung statt Selbstkauf */
export function IncontinenceRecipeCostCta() {
  return (
    <InkoArticleCtaBox
      dataCta="inko-rezept-kosten"
      clickEvent="inko_cta_inline_click"
      viewEvent="inko_cta_inline_view"
      heading="Nur 10 € Zuzahlung pro Monat – statt teurem Selbstkauf?"
    >
      <p>
        Wir erklären Ihnen, was die Krankenkasse übernimmt, wie die Zuzahlung funktioniert und welche Produkte ohne
        unnötige Aufzahlung möglich sind. Auf Wunsch mit gratis Testpaket zum Ausprobieren.
      </p>
    </InkoArticleCtaBox>
  );
}

/** Nach Aufzahlung – Mehrkosten vermeiden */
export function IncontinenceRecipeAufzahlungCta() {
  return (
    <InkoArticleCtaBox
      dataCta="inko-rezept-aufzahlung"
      clickEvent="inko_cta_inline_click"
      heading="Aufzahlung verlangt? Das müssen Sie nicht hinnehmen."
    >
      <p>
        Wenn ein Produkt medizinisch notwendig ist, haben Sie Anspruch auf mehrkostenfreie Versorgung. Wir prüfen mit
        Ihnen, ob Pants oder andere Produkte ohne Mehrkosten über die Krankenkasse möglich sind.
      </p>
    </InkoArticleCtaBox>
  );
}

/** Nach Ablauf – Begleitung durch den Prozess */
export function IncontinenceRecipeAblaufCta() {
  return (
    <InkoArticleCtaBox
      dataCta="inko-rezept-ablauf"
      clickEvent="inko_cta_inline_click"
      heading="Rezept, Krankenkasse, Lieferung – wir begleiten Sie Schritt für Schritt."
    >
      <p>
        Von der ärztlichen Verordnung über die Krankenkasse bis zur diskreten Lieferung nach Hause: Lassen Sie sich
        kostenlos beraten und starten Sie Ihre Versorgung auf Rezept ohne Umwege.
      </p>
    </InkoArticleCtaBox>
  );
}

/** Nach Rezept-Abschnitt – Pants-Begründung */
export function IncontinenceRecipeRezeptCta() {
  return (
    <InkoArticleCtaBox
      dataCta="inko-rezept-rezept-pants"
      clickEvent="inko_cta_inline_click"
      heading="Pants auf Rezept? Die ärztliche Begründung ist entscheidend."
    >
      <p>
        Wir helfen Ihnen, Rezept und Produktauswahl so zu formulieren, dass medizinisch notwendige Pants ohne
        unnötige Aufzahlung übernommen werden können.
      </p>
    </InkoArticleCtaBox>
  );
}

/** Vor dem FAQ – allgemeine Beratung */
export function IncontinenceRecipeBeratungCta() {
  return (
    <InkoArticleCtaBox
      dataCta="inko-rezept-beratung"
      clickEvent="inko_cta_inline_click"
      heading="Unsicher bei Anspruch, Kosten oder Rezept?"
    >
      <p>
        Lassen Sie sich kostenlos beraten. Wir klären Anspruch, Krankenkasse und passende Produkte – und senden Ihnen
        auf Wunsch ein gratis Testpaket nach Hause.
      </p>
    </InkoArticleCtaBox>
  );
}

/** Abschluss-CTA nach dem Fazit */
export function IncontinenceRecipeEndCta() {
  const ref = useRef<HTMLElement>(null);
  useInkoCtaViewTracking(ref, "inko_cta_end_view", END_CTA_ID);

  return (
    <section
      ref={ref}
      id="inko-abschluss-cta"
      data-cta={END_CTA_ID}
      className={cn(
        INKO_ARTICLE_CTA_SURFACE_CLASS,
        "relative mt-14 min-h-[18rem] scroll-mt-28 overflow-hidden rounded-2xl border border-[#0F4F68]/14 sm:min-h-[16rem]",
      )}
      aria-labelledby="inko-end-cta-heading"
    >
      <InkoArticleCtaBackground />
      <InkoCtaGradientStripe />
      <InkoArticleCtaContentPane className="mx-auto max-w-[40rem] text-center sm:text-left">
        <h2 id="inko-end-cta-heading" className={`${INKO_ARTICLE_CTA_HEADING_CLASS} text-[1.35rem] sm:text-[1.75rem]`}>
          Jetzt Inkontinenzversorgung auf Rezept starten
        </h2>
        <p className={`${INKO_ARTICLE_CTA_BODY_CLASS} mt-4 text-[1.125rem] sm:text-[1.2rem]`}>
          Sie müssen Rezept, Krankenkasse und Produktauswahl nicht allein klären. Alltagshilfe-Süd berät Sie kostenlos,
          diskret und verständlich – mit Rezeptabrechnung und gratis Testpaket auf Wunsch.
        </p>
        <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:items-start">
          <InkoPrimaryBeratungButton dataCta={END_CTA_ID} clickEvent="inko_cta_end_click" className="sm:max-w-[26rem]" />
        </div>
        <p className={`${INKO_ARTICLE_CTA_BODY_CLASS} mt-5 text-[0.9375rem] sm:text-base`}>
          Rückruf innerhalb von 24 Stunden – oder direkt anrufen &amp; per WhatsApp.
        </p>
      </InkoArticleCtaContentPane>
    </section>
  );
}
