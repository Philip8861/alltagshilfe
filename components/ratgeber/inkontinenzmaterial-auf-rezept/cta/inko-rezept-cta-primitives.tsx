"use client";

import type { ReactNode, RefObject } from "react";
import { useEffect, useRef } from "react";
import Image from "next/image";

import { GtmKontaktNavLink, GtmPhoneLink, GtmWhatsappLink } from "@/components/analytics/GtmContactIntentLink";
import { useInkoBeratungChoice } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/InkoBeratungChoicePopup";
import {
  INKO_REZEPT_ARTICLE_CTA_BG,
  INKO_REZEPT_CTA_PHONE_DISPLAY,
  INKO_REZEPT_CTA_PHONE_HREF,
  INKO_REZEPT_CTA_WHATSAPP_HREF,
  INKO_REZEPT_KONTAKT_HREF,
} from "@/lib/ratgeber/inko-rezept-cta-config";
import { markInkoCtaClickedThisSession } from "@/lib/ratgeber/inko-rezept-cta-storage";
import type { InkoRezeptCtaEventName } from "@/lib/ratgeber/inko-rezept-cta-tracking";
import { trackInkoRezeptCtaEvent } from "@/lib/ratgeber/inko-rezept-cta-tracking";
import { cn } from "@/lib/utils";

export function InkoTrustCheckList({
  items,
  className,
  onBanner = false,
}: {
  items: readonly string[];
  className?: string;
  /** Auf Banner-Hintergrund: höherer Kontrast */
  onBanner?: boolean;
}) {
  return (
    <ul className={cn("mt-4 space-y-2", className)}>
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            "flex items-start gap-2.5 leading-snug",
            onBanner
              ? "text-[1.05rem] font-bold text-[#062a38] [text-shadow:0_1px_2px_rgba(255,255,255,0.92)] sm:text-[1.1rem]"
              : "text-[0.98rem] text-neutral-700",
          )}
        >
          <span
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[#0F4F68]",
              onBanner ? "border border-[#0F4F68]/18 bg-white shadow-sm" : "bg-[#F2F9FA]",
            )}
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
      className="absolute inset-x-0 top-0 z-[2] h-1 bg-gradient-to-r from-[#0F4F68]/55 via-[#3d9aaa]/70 to-[#F78F2E]/70"
    />
  );
}

/** Banner-Bild als Hintergrund – Text liegt direkt auf dem Motiv */
export function InkoArticleCtaBackground() {
  return (
    <>
      <Image
        src={INKO_REZEPT_ARTICLE_CTA_BG}
        alt=""
        fill
        aria-hidden
        className="pointer-events-none object-cover object-center"
        sizes="(max-width: 640px) 100vw, 760px"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/78 via-white/42 to-transparent sm:from-white/72 sm:via-white/28"
      />
    </>
  );
}

/** Text-Layout direkt auf dem Banner – ohne weiße Box */
export function InkoArticleCtaContentPane({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("relative z-[1] px-5 py-7 sm:px-8 sm:py-9", className)}>{children}</div>;
}

/** Typografie für Texte auf dem Banner */
export const INKO_ARTICLE_CTA_LABEL_CLASS =
  "text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-[#0a4a5c] [text-shadow:0_1px_2px_rgba(255,255,255,0.95)] sm:text-[0.82rem]";
export const INKO_ARTICLE_CTA_HEADING_CLASS =
  "font-extrabold tracking-tight text-[#062a38] [text-shadow:0_1px_3px_rgba(255,255,255,0.95)]";
export const INKO_ARTICLE_CTA_BODY_CLASS =
  "font-semibold leading-relaxed text-[#0f3340] [text-shadow:0_1px_2px_rgba(255,255,255,0.92)]";
export const INKO_ARTICLE_CTA_SUBTEXT_CLASS =
  "font-semibold leading-relaxed text-[#1a4552] [text-shadow:0_1px_2px_rgba(255,255,255,0.9)]";

/** Basis-Stil für feste CTAs im Artikel: leichter Schatten + sanftes Aufleuchten */
export const INKO_ARTICLE_CTA_SURFACE_CLASS = "inko-article-cta-glow";

/** Einheitlicher Button-Text für alle Inkontinenz-Ratgeber-CTAs */
export const INKO_BERATUNG_BUTTON_LABEL = (
  <span className="flex w-full items-center justify-center">
    <span className="inline-flex items-center justify-center gap-3 sm:gap-3.5">
      <GiftIcon className="h-9 w-9 shrink-0 opacity-95 sm:h-10 sm:w-10" />
      <span className="text-center text-[0.9375rem] font-extrabold leading-snug sm:text-base sm:leading-snug md:text-[1.0625rem]">
        Kostenlos beraten lassen und
        <br />
        gratis Testpaket erhalten
      </span>
    </span>
  </span>
);

function GiftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" />
    </svg>
  );
}

/** Orangener Beratungs-Button – mobil volle Breite, gut lesbar */
export const INKO_PRIMARY_BUTTON_CLASS =
  "ratgeber-cta-pulse inko-primary-cta-pulse flex w-full min-h-[3.5rem] items-center justify-center gap-2 rounded-xl bg-[#F78F2E] px-5 py-3.5 text-center font-extrabold leading-snug tracking-tight text-white shadow-[0_3px_12px_-4px_rgba(180,90,10,0.32)] [text-shadow:0_1px_2px_rgba(0,0,0,0.18)] transition-[background-color] hover:bg-[#e8862a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2 sm:min-h-[3.75rem] sm:px-6 sm:py-4";

type InkoPrimaryBeratungButtonProps = {
  children?: ReactNode;
  dataCta: string;
  clickEvent: InkoRezeptCtaEventName;
  className?: string;
  onAfterClick?: () => void;
  onAfterChoice?: () => void;
};

export function InkoPrimaryBeratungButton({
  children = INKO_BERATUNG_BUTTON_LABEL,
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
      className={cn(INKO_PRIMARY_BUTTON_CLASS, className)}
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
  options?: { enabled?: boolean },
) {
  const logged = useRef(false);
  const enabled = options?.enabled ?? true;

  useEffect(() => {
    if (!enabled) return;
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
  }, [ref, viewEvent, ctaId, enabled]);
}
