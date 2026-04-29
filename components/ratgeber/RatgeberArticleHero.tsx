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
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F78F2E]/20 text-[#F78F2E] sm:h-9 sm:w-9 ${className}`.trim()}
      aria-hidden
    >
      <svg
        className="h-[1.05rem] w-[1.05rem] sm:h-[1.15rem] sm:w-[1.15rem]"
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
  /** Optional: Brotkrumen oberhalb des Bildbereichs, ausgerichtet mit der Grafik-Spur */
  belowImageSlot?: ReactNode;
};

/**
 * Ratgeber-Artikelkopf: Grafik mittig (Originalmaße); Kicker bis CTA nur als Overlay auf dem Bild –
 * ohne separaten Unter-Balken. Der Fließtext-Artikel beginnt erst darunter auf der Seite.
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
  const mw = Number(RATGEBER_ARTICLE_HERO_BG_WIDTH);
  return (
    <section className="w-full pt-0" aria-labelledby="ratgeber-artikel-heading">
      {belowImageSlot ? (
        <div className="mx-auto mb-5 flex w-full max-w-[min(1520px,calc(100vw-2rem))] justify-center px-4 sm:px-0">
          <div className="w-full min-w-0">{belowImageSlot}</div>
        </div>
      ) : null}

      <div className="flex w-full justify-center overflow-x-auto bg-transparent px-4 pb-0 sm:px-6">
        <div
          className="relative isolate shrink-0 overflow-hidden rounded-xl shadow-[0_8px_28px_-14px_rgba(15,79,104,0.22)] sm:rounded-2xl"
          style={{ width: mw }}
        >
          <div className="relative isolate w-full bg-white">
            <Image
              src={RATGEBER_ARTICLE_HERO_BG_SRC}
              width={RATGEBER_ARTICLE_HERO_BG_WIDTH}
              height={RATGEBER_ARTICLE_HERO_BG_HEIGHT}
              alt=""
              priority
              sizes={`${mw}px`}
              className="pointer-events-none block h-auto w-full max-w-none select-none bg-white"
            />
            {/* Lesbarkeit: seitlicher Verlauf + leichte Abdunklung unten für Haken/Button */}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/93 via-[#fffbf7]/82 to-transparent"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/75 via-transparent to-transparent"
              aria-hidden
            />

            <div className="absolute inset-0 z-[2] flex flex-col px-6 py-6 sm:px-10 sm:py-10">
              <div className="min-w-0 max-w-xl">
                <p className="text-[0.8125rem] font-bold uppercase tracking-[0.16em] text-[#0F4F68] sm:text-sm">
                  Ratgeber
                </p>
                {topicCategoryBadge ? (
                  <p className="mt-2 sm:mt-3">
                    <span className="inline-flex max-w-full items-center rounded-full border border-[#0F4F68]/25 bg-[#0F4F68]/07 px-2.5 py-1 text-[0.6875rem] font-bold leading-snug text-[#0F4F68] backdrop-blur-sm sm:text-xs">
                      {topicCategoryBadge}
                    </span>
                  </p>
                ) : null}
                <h1
                  id="ratgeber-artikel-heading"
                  className="mt-3 text-balance text-2xl font-extrabold leading-tight text-[#0F4F68] shadow-sm sm:text-[1.72rem] sm:leading-[1.22] lg:text-[2rem]"
                >
                  {title}
                </h1>
                {lead ? (
                  <p className="mt-3 max-w-[min(100%,38rem)] text-pretty text-sm leading-snug text-neutral-900/[0.93] line-clamp-4 sm:text-[1.02rem] sm:leading-relaxed lg:mt-4">
                    {lead}
                  </p>
                ) : null}
              </div>

              {/* Haken + CTA untereinander auf dem Bild (unten andocken für klare Rasterung) */}
              <div className="mt-auto min-w-0 pt-8 sm:pt-10">
                <ul
                  className="space-y-2.5 text-pretty sm:space-y-3"
                  aria-label="Zu diesem Ratgeber-Beitrag"
                >
                  <li className="flex gap-3 sm:gap-3.5">
                    <RatgeberHeroCheckIcon className="mt-0.5 shrink-0" />
                    <span className="min-w-0 pt-0 text-sm font-semibold leading-snug text-[#0F4F68] shadow-sm sm:text-[0.98rem] sm:leading-snug drop-shadow-[0_0_14px_rgba(255,255,255,0.85)]">
                      Autor: Alltagshilfe-Süd Redaktion
                    </span>
                  </li>
                  <li className="flex gap-3 sm:gap-3.5">
                    <RatgeberHeroCheckIcon className="mt-0.5 shrink-0" />
                    <span className="min-w-0 pt-0 text-sm font-semibold leading-snug text-[#0F4F68] shadow-sm sm:text-[0.98rem] sm:leading-snug drop-shadow-[0_0_14px_rgba(255,255,255,0.85)]">
                      Fachlich geprüfter Artikel von Luisa Gölder (zertifizierte Pflegeberaterin nach § 7a SGB XI)
                    </span>
                  </li>
                  <li className="flex gap-3 sm:gap-3.5">
                    <RatgeberHeroCheckIcon className="mt-0.5 shrink-0" />
                    <span className="min-w-0 pt-0 text-sm font-semibold leading-snug text-[#0F4F68] shadow-sm sm:text-[0.98rem] sm:leading-snug drop-shadow-[0_0_14px_rgba(255,255,255,0.85)]">
                      Artikel auf neuestem Stand (aktualisiert{" "}
                      <time dateTime={updatedISO}>{updatedDisplay}</time>)
                    </span>
                  </li>
                </ul>

                <div className="mt-7 sm:mt-8">
                  <Link
                    href={ctaHref}
                    className={cn(
                      "inline-flex min-h-[2.875rem] max-w-[min(100%,28rem)] items-center justify-center rounded-xl bg-[#F78F2E]",
                      "px-5 py-3 text-center text-[0.95rem] font-bold leading-snug text-white shadow-[0_10px_26px_-10px_rgba(247,143,46,0.55)]",
                      "transition hover:opacity-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2",
                      "sm:min-h-[3rem] sm:px-7 sm:text-base",
                    )}
                  >
                    Noch Fragen? Wir beraten Sie gerne! Jetzt Termin vereinbaren
                  </Link>
                </div>
                {footer ? <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{footer}</div> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
