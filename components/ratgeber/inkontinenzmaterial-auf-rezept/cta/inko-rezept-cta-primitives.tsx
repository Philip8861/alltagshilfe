"use client";

import type { ReactNode, RefObject } from "react";
import { useEffect, useRef } from "react";

import { GtmKontaktNavLink, GtmPhoneLink, GtmWhatsappLink } from "@/components/analytics/GtmContactIntentLink";
import { useInkoBeratungChoice } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/InkoBeratungChoicePopup";
import {
  INKO_REZEPT_CTA_PHONE_DISPLAY,
  INKO_REZEPT_CTA_PHONE_HREF,
  INKO_REZEPT_CTA_WHATSAPP_HREF,
  INKO_REZEPT_KONTAKT_HREF,
} from "@/lib/ratgeber/inko-rezept-cta-config";
import { markInkoCtaClickedThisSession } from "@/lib/ratgeber/inko-rezept-cta-storage";
import type { InkoRezeptCtaEventName } from "@/lib/ratgeber/inko-rezept-cta-tracking";
import { trackInkoRezeptCtaEvent } from "@/lib/ratgeber/inko-rezept-cta-tracking";
import { cn } from "@/lib/utils";

export function InkoTrustCheckList({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cn("mt-4 space-y-2", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-[0.98rem] leading-snug text-neutral-700">
          <span
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F2F9FA] text-[#0F4F68]"
            aria-hidden
          >
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function InkoCtaGradientStripe() {
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0F4F68]/55 via-[#3d9aaa]/70 to-[#F78F2E]/70"
    />
  );
}

/** Basis-Stil für feste CTAs im Artikel: leichter Schatten + sanftes Aufleuchten */
export const INKO_ARTICLE_CTA_SURFACE_CLASS = "inko-article-cta-glow";

type InkoPrimaryBeratungButtonProps = {
  children: ReactNode;
  dataCta: string;
  clickEvent: InkoRezeptCtaEventName;
  className?: string;
  onAfterClick?: () => void;
  onAfterChoice?: () => void;
};

export function InkoPrimaryBeratungButton({
  children,
  dataCta,
  clickEvent,
  className,
  onAfterClick,
  onAfterChoice,
}: InkoPrimaryBeratungButtonProps) {
  const choice = useInkoBeratungChoice();

  return (
    <button
      type="button"
      data-cta={dataCta}
      className={cn(
        "inko-primary-cta-pulse inline-flex min-h-[3rem] items-center justify-center rounded-lg bg-[#F78F2E] px-6 text-base font-bold tracking-tight text-white shadow-[0_3px_12px_-4px_rgba(180,90,10,0.35)] [text-shadow:0_1px_1px_rgba(0,0,0,0.14)] transition-[background-color] hover:bg-[#e8862a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2",
        className,
      )}
      onClick={() => {
        choice?.open({
          dataCta,
          clickEvent,
          onAfterOpen: onAfterClick,
          onAfterChoice,
        });
      }}
    >
      {children}
    </button>
  );
}

type InkoKontaktLinkButtonProps = {
  children: ReactNode;
  dataCta: string;
  clickEvent: InkoRezeptCtaEventName;
  sourceComponent: string;
  className?: string;
  href?: string;
  onAfterClick?: () => void;
};

export function InkoKontaktLinkButton({
  children,
  dataCta,
  clickEvent,
  sourceComponent,
  className,
  href = INKO_REZEPT_KONTAKT_HREF,
  onAfterClick,
}: InkoKontaktLinkButtonProps) {
  return (
    <GtmKontaktNavLink
      href={href}
      data-cta={dataCta}
      sourceComponent={sourceComponent}
      contactPath="inko_rezept_ratgeber_kontakt"
      service="inkontinenzversorgung"
      className={cn(
        "inline-flex min-h-[2.875rem] w-full items-center justify-center rounded-lg bg-[#F78F2E] px-6 text-[0.95rem] font-semibold text-white transition hover:bg-[#e8862a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2 sm:w-auto",
        className,
      )}
      onClick={() => {
        markInkoCtaClickedThisSession();
        trackInkoRezeptCtaEvent(clickEvent, dataCta);
        onAfterClick?.();
      }}
    >
      {children}
    </GtmKontaktNavLink>
  );
}

export function InkoPhoneLink({
  dataCta,
  clickEvent,
  sourceComponent,
  className,
  children,
  onAfterClick,
}: {
  dataCta: string;
  clickEvent: InkoRezeptCtaEventName;
  sourceComponent: string;
  className?: string;
  children?: ReactNode;
  onAfterClick?: () => void;
}) {
  return (
    <GtmPhoneLink
      href={INKO_REZEPT_CTA_PHONE_HREF}
      data-cta={dataCta}
      sourceComponent={sourceComponent}
      service="inkontinenzversorgung"
      className={cn(
        "inline-flex min-h-[2.75rem] items-center justify-center gap-2 font-semibold text-[#0F4F68] underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2",
        className,
      )}
      onClick={() => {
        markInkoCtaClickedThisSession();
        trackInkoRezeptCtaEvent(clickEvent, dataCta);
        onAfterClick?.();
      }}
    >
      {children ?? INKO_REZEPT_CTA_PHONE_DISPLAY}
    </GtmPhoneLink>
  );
}

export function InkoWhatsappLink({
  dataCta,
  clickEvent,
  sourceComponent,
  className,
}: {
  dataCta: string;
  clickEvent: InkoRezeptCtaEventName;
  sourceComponent: string;
  className?: string;
}) {
  return (
    <GtmWhatsappLink
      href={INKO_REZEPT_CTA_WHATSAPP_HREF}
      data-cta={dataCta}
      sourceComponent={sourceComponent}
      service="inkontinenzversorgung"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "text-sm font-medium text-[#0F4F68] underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2",
        className,
      )}
      onClick={() => {
        markInkoCtaClickedThisSession();
        trackInkoRezeptCtaEvent(clickEvent, dataCta);
      }}
    >
      Per WhatsApp schreiben
    </GtmWhatsappLink>
  );
}

export function InkoDismissLink({
  children,
  dataCta,
  onDismiss,
  className,
}: {
  children: ReactNode;
  dataCta: string;
  onDismiss: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      data-cta={dataCta}
      className={cn(
        "text-sm font-medium text-neutral-600 underline-offset-2 hover:text-[#0F4F68] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2",
        className,
      )}
      onClick={() => {
        trackInkoRezeptCtaEvent("inko_cta_dismiss", dataCta);
        onDismiss();
      }}
    >
      {children}
    </button>
  );
}

/** Sichtbarkeits-Tracking einmalig per IntersectionObserver */
export function useInkoCtaViewTracking(
  ref: RefObject<HTMLElement | null>,
  viewEvent: InkoRezeptCtaEventName,
  ctaId: string,
) {
  const logged = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || logged.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting && e.intersectionRatio >= 0.35);
        if (hit && !logged.current) {
          logged.current = true;
          trackInkoRezeptCtaEvent(viewEvent, ctaId);
          observer.disconnect();
        }
      },
      { threshold: [0.35] },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, viewEvent, ctaId]);
}
