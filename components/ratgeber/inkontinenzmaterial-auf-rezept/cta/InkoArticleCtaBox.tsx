"use client";

import type { ReactNode } from "react";
import { useRef } from "react";

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

type InkoArticleCtaBoxProps = {
  dataCta: string;
  clickEvent: InkoRezeptCtaEventName;
  heading: string;
  children: ReactNode;
  className?: string;
  /** Optional: Impression-Tracking beim Sichtbarwerden */
  viewEvent?: InkoRezeptCtaEventName;
  minHeightClass?: string;
};

/** Einheitliche Werbebox im Ratgeber – Text auf Banner, zentraler Beratungs-Button */
export function InkoArticleCtaBox({
  dataCta,
  clickEvent,
  heading,
  children,
  className,
  viewEvent,
  minHeightClass = "min-h-[14rem] sm:min-h-[13rem]",
}: InkoArticleCtaBoxProps) {
  const ref = useRef<HTMLElement>(null);
  useInkoCtaViewTracking(ref, viewEvent ?? "inko_cta_inline_view", dataCta, { enabled: Boolean(viewEvent) });

  return (
    <aside
      ref={ref}
      data-cta={dataCta}
      className={cn(
        INKO_ARTICLE_CTA_SURFACE_CLASS,
        "relative my-10 scroll-mt-28 overflow-hidden rounded-2xl border border-[#0F4F68]/14",
        minHeightClass,
        className,
      )}
      aria-label={heading}
    >
      <InkoArticleCtaBackground />
      <InkoCtaGradientStripe />
      <InkoArticleCtaContentPane>
        <h3 className={`${INKO_ARTICLE_CTA_HEADING_CLASS} text-lg sm:text-xl`}>{heading}</h3>
        <div className={`${INKO_ARTICLE_CTA_BODY_CLASS} mt-3 text-[1.0625rem] sm:text-[1.125rem]`}>{children}</div>
        <div className="mt-6">
          <InkoPrimaryBeratungButton dataCta={dataCta} clickEvent={clickEvent} className="sm:max-w-[26rem]" />
        </div>
      </InkoArticleCtaContentPane>
    </aside>
  );
}
