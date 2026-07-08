"use client";

import { useRef } from "react";

import {
  InkoCtaGradientStripe,
  InkoPhoneLink,
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
        "relative mt-14 scroll-mt-28 overflow-hidden rounded-2xl border border-[#0F4F68]/18",
        "bg-[linear-gradient(165deg,#f9fcfc_0%,#ffffff_55%,#fafafa_100%)] px-5 py-8 sm:px-8 sm:py-10",
      )}
      aria-labelledby="inko-end-cta-heading"
    >
      <InkoCtaGradientStripe />
      <div className="mx-auto max-w-[40rem] text-center sm:text-left">
        <h2 id="inko-end-cta-heading" className="text-xl font-semibold tracking-tight text-[#0F4F68] sm:text-2xl">
          Wir helfen Ihnen zur passenden Inkontinenzversorgung auf Rezept
        </h2>
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-neutral-700">
          Sie müssen Rezept, Krankenkasse und Produktauswahl nicht allein klären. Alltagshilfe-Süd unterstützt Sie persönlich,
          diskret und verständlich. Auf Wunsch erhalten Sie ein kostenloses Testpaket mit passenden Produkten.
        </p>
        <InkoTrustCheckList items={INKO_REZEPT_TRUST_END} className="sm:grid sm:grid-cols-2 sm:gap-x-6" />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <InkoPrimaryBeratungButton
            dataCta={CTA_ID}
            clickEvent="inko_cta_end_click"
            contextNote="Ratgeber Inko-Rezept: Abschluss-CTA"
          >
            Kostenlose Beratung anfragen
          </InkoPrimaryBeratungButton>
          <InkoPhoneLink
            dataCta={`${CTA_ID}-phone`}
            clickEvent="inko_cta_end_click"
            sourceComponent="inko_rezept_end_cta_phone"
            className="min-h-[2.875rem] justify-center rounded-lg border border-[#0F4F68]/20 bg-white px-6 text-[0.95rem] no-underline hover:bg-[#F2F9FA] sm:min-w-[14rem]"
          >
            Jetzt anrufen: 08334 / 9893330
          </InkoPhoneLink>
        </div>
        <p className="mt-5 text-sm text-neutral-600">Unverbindlich. Persönlich. Mit viel Herz im Alltag.</p>
      </div>
    </section>
  );
}
