"use client";

import { useRef } from "react";

import {
  InkoCtaGradientStripe,
  InkoPhoneLink,
  InkoPrimaryBeratungButton,
  InkoTrustCheckList,
  InkoWhatsappLink,
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
      className="relative mt-10 scroll-mt-28 overflow-hidden rounded-2xl border border-neutral-200/95 bg-[linear-gradient(180deg,#fafcfc_0%,#ffffff_45%)] px-5 py-7 shadow-[0_2px_16px_-8px_rgba(15,79,104,0.12)] sm:px-8 sm:py-8"
      aria-labelledby="inko-inline-cta-heading"
    >
      <InkoCtaGradientStripe />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
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
        <div className="flex w-full shrink-0 flex-col items-stretch gap-3 sm:max-w-[17.5rem] lg:items-stretch">
          <InkoPrimaryBeratungButton
            dataCta={CTA_ID}
            clickEvent="inko_cta_inline_click"
            contextNote="Ratgeber Inko-Rezept: Inline-CTA nach Kosten"
          >
            Jetzt kostenlos beraten lassen
          </InkoPrimaryBeratungButton>
          <InkoPhoneLink
            dataCta={`${CTA_ID}-phone`}
            clickEvent="inko_cta_inline_click"
            sourceComponent="inko_rezept_inline_cta_phone"
            className="min-h-[2.75rem] w-full justify-center rounded-lg border border-[#0F4F68]/15 bg-white px-4 text-[0.95rem] no-underline hover:bg-[#F2F9FA]"
          >
            08334 / 9893330 anrufen
          </InkoPhoneLink>
          <InkoWhatsappLink
            dataCta={`${CTA_ID}-whatsapp`}
            clickEvent="inko_cta_inline_click"
            sourceComponent="inko_rezept_inline_cta_whatsapp"
            className="text-center"
          />
        </div>
      </div>
    </aside>
  );
}
