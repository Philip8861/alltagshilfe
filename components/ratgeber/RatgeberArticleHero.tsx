import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
/** Natürliche Pixelmaße von `ratgeber_blog_backgrounds.webp` (VP8X-Canvas), Anzeige 1:1. */
export const RATGEBER_ARTICLE_HERO_BG_SRC = "/images/Ratgeber/ratgeber_blog_backgrounds.webp" as const;
export const RATGEBER_ARTICLE_HERO_BG_WIDTH = 1520 as const;
export const RATGEBER_ARTICLE_HERO_BG_HEIGHT = 434 as const;
const DEFAULT_UPDATED_ISO = "2026-05-01" as const;
const DEFAULT_UPDATED_DISPLAY = "01.05.2026" as const;
const DEFAULT_CTA_HREF = "/kontakt" as const;

/** Gleiche orangene Haken wie auf Start-/Kooperations-/Pflegeberatungs-Hero(s). */
function RatgeberHeroCheckIcon({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F78F2E]/15 text-[#F78F2E] sm:h-10 sm:w-10 ${className}`.trim()}
      aria-hidden
    >
      <svg
        className="h-[1.2rem] w-[1.2rem] sm:h-[1.35rem] sm:w-[1.35rem]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </span>
  );
}

export type RatgeberArticleHeroProps = {
  /** Hauptüberschrift des Artikels (eindeutig pro Seite, SEO-H1). */
  title: string;
  /** Themen-Badge (z. B. aus der Ratgeber-Kategorie), unter dem Ratgeber-Kicker. */
  topicCategoryBadge?: string;
  /** Kurzer Einleitungstext direkt unter der H1. */
  lead?: string;
  /** Anzeige-Datum wie „01.05.2026“. */
  updatedDisplay?: string;
  /** ISO für `<time dateTime="">`. */
  updatedISO?: string;
  /** Ziel des Termin-CTA (standard: Kontakt mit Beratungsanlass). */
  ctaHref?: string;
  /** Optional: zweite Reihe unter dem Haupt-Button (z. B. „PDF herunterladen“, Anker-Link). */
  footer?: ReactNode;
  /** Optional: z. B. Brotkrumen direkt unter der Kopfgrafik, vor Textkarte/H1-Inhalt */
  belowImageSlot?: ReactNode;
};

/**
 * Gemeinsamer Ratgeber-Artikelkopf: Illustration in Originalgröße oben, danach Kicker „Ratgeber“, H1,
 * drei Vertrauens-Zeilen mit Haken, primärer CTA.
 */
export function RatgeberArticleHero({
  title,
  topicCategoryBadge,
  lead,
  updatedDisplay = DEFAULT_UPDATED_DISPLAY,
  updatedISO = DEFAULT_UPDATED_ISO,
  ctaHref = DEFAULT_CTA_HREF,
  footer,
  belowImageSlot,
}: RatgeberArticleHeroProps) {
  return (
    <section className="w-full pt-0" aria-labelledby="ratgeber-artikel-heading">
      {/* Grafik exakt mit Original Pixelmaßen (horizontal scrollbar wenn Viewport schmaler) */}
      <div className="w-full overflow-x-auto bg-white">
        <Image
          src={RATGEBER_ARTICLE_HERO_BG_SRC}
          width={RATGEBER_ARTICLE_HERO_BG_WIDTH}
          height={RATGEBER_ARTICLE_HERO_BG_HEIGHT}
          sizes={`${RATGEBER_ARTICLE_HERO_BG_WIDTH}px`}
          priority
          alt=""
          className="block h-auto max-w-none shrink-0"
          style={{ width: RATGEBER_ARTICLE_HERO_BG_WIDTH }}
        />
      </div>

      {belowImageSlot ? (
        <div className="mx-auto mt-5 w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-[var(--ahs-page-gutter)]">{belowImageSlot}</div>
      ) : null}
      <div
        className={cn(
          "relative isolate mx-4 mb-0 w-auto overflow-hidden rounded-[0.85rem] bg-[#FFFBF7] shadow-[0_8px_28px_-14px_rgba(15,79,104,0.18)] sm:mx-6 sm:rounded-2xl md:mx-8 lg:mx-auto lg:max-w-[min(80rem,calc(100%-5rem))] lg:rounded-2xl",
          belowImageSlot ? "mt-6 sm:mt-8" : "mt-8 sm:mt-10",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/93 via-[#fffbf8]/94 to-[#f5f9fb]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-7 lg:px-[var(--ahs-page-gutter)]">
          <div className="mx-auto w-full max-w-4xl py-11 sm:py-14 lg:py-16">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#0F4F68]">
              Ratgeber
            </p>
            {topicCategoryBadge ? (
              <p className="mt-3">
                <span className="inline-flex max-w-full items-center rounded-full border border-[#0F4F68]/28 bg-[#0F4F68]/06 px-3 py-1.5 text-xs font-bold leading-snug text-[#0F4F68] shadow-sm">
                  {topicCategoryBadge}
                </span>
              </p>
            ) : null}
            <h1
              id="ratgeber-artikel-heading"
              className="mt-4 max-w-[min(100%,52rem)] text-balance text-3xl font-extrabold leading-tight text-[#0F4F68] sm:text-4xl sm:leading-[1.12] lg:text-[2.15rem]"
            >
              {title}
            </h1>
            {lead ? (
              <p className="mt-4 max-w-[min(100%,52rem)] text-pretty text-lg leading-relaxed text-neutral-700 sm:text-[1.08rem] sm:leading-relaxed">
                {lead}
              </p>
            ) : null}

            <ul
              className="mt-6 max-w-2xl space-y-3.5 text-pretty sm:mt-8 sm:space-y-4"
              aria-label="Zu diesem Ratgeber-Beitrag"
            >
              <li className="flex gap-3 sm:items-start">
                <RatgeberHeroCheckIcon className="mt-0.5 shrink-0 sm:mt-0" />
                <span className="min-w-0 pt-0.5 text-base font-semibold leading-snug text-[#0F4F68] sm:text-[1.05rem] sm:leading-snug">
                  Autor: Alltagshilfe-Süd Redaktion
                </span>
              </li>
              <li className="flex gap-3 sm:items-start">
                <RatgeberHeroCheckIcon className="mt-0.5 shrink-0 sm:mt-0" />
                <span className="min-w-0 pt-0.5 text-base font-semibold leading-snug text-[#0F4F68] sm:text-[1.05rem] sm:leading-snug">
                  Fachlich geprüfter Artikel von Luisa Gölder (zertifizierte Pflegeberaterin nach § 7a SGB XI)
                </span>
              </li>
              <li className="flex gap-3 sm:items-start">
                <RatgeberHeroCheckIcon className="mt-0.5 shrink-0 sm:mt-0" />
                <span className="min-w-0 pt-0.5 text-base font-semibold leading-snug text-[#0F4F68] sm:text-[1.05rem] sm:leading-snug">
                  Artikel auf neuestem Stand (aktualisiert{" "}
                  <time dateTime={updatedISO}>{updatedDisplay}</time>)
                </span>
              </li>
            </ul>

            <div className="mt-8 sm:mt-10">
              <Link
                href={ctaHref}
                className="inline-flex min-h-[3rem] max-w-[min(100%,28rem)] items-center justify-center rounded-xl bg-[#F78F2E] px-6 py-3.5 text-center text-base font-bold leading-snug text-white shadow-[0_12px_32px_-12px_rgba(247,143,46,0.55)] transition hover:opacity-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2 sm:min-h-[3.25rem] sm:px-8 sm:text-lg"
              >
                Noch Fragen? Wir beraten Sie gerne! Jetzt Termin vereinbaren
              </Link>
            </div>
            {footer ? (
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">{footer}</div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
