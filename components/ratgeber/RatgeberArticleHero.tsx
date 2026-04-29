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
  /** Optional: Brotkrumen (ausgerichtet mit dem Hero, oberhalb der Grafik-Zeile) */
  belowImageSlot?: ReactNode;
};

/**
 * Gemeinsamer Ratgeber-Artikelkopf: Grafik zentriert in Original-Pixelmaßen,
 * Kopfbereich (Kicker bis Lead) liegt auf der Grafik wie zuvor; darunter angeklammerter Block mit Liste + CTA.
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
  const mh = Number(RATGEBER_ARTICLE_HERO_BG_HEIGHT);

  return (
    <section className="w-full pt-0" aria-labelledby="ratgeber-artikel-heading">
      {/* Brotkrumen: gleicher visueller Bund wie Hero-Karte (zentrierte 1520px-Spur) */}
      {belowImageSlot ? (
        <div className="mx-auto mb-5 flex w-full max-w-[min(1520px,calc(100vw-2rem))] justify-center px-4 sm:px-0">
          <div className="w-full min-w-0">{belowImageSlot}</div>
        </div>
      ) : null}

      {/* Zentrierter Hero: Grafik immer 1520 px breit bei schmalen Screens horizontal scrollbar */}
      <div className="flex w-full justify-center overflow-x-auto bg-transparent px-4 pb-10 sm:px-6 lg:pb-14">
        <div
          className="flex shrink-0 flex-col overflow-hidden rounded-xl bg-[#FFFBF7] shadow-[0_8px_28px_-14px_rgba(15,79,104,0.22)] ring-1 ring-black/5 sm:rounded-2xl"
          style={{
            width: mw,
          }}
        >
          {/* Grafikschicht */}
          <div className="relative isolate w-full shrink-0 overflow-hidden bg-white" style={{ height: mh }}>
            <Image
              src={RATGEBER_ARTICLE_HERO_BG_SRC}
              width={RATGEBER_ARTICLE_HERO_BG_WIDTH}
              height={RATGEBER_ARTICLE_HERO_BG_HEIGHT}
              alt=""
              priority
              sizes={`${mw}px`}
              className="pointer-events-none block h-auto w-full max-w-none bg-white"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/94 via-[#fffbf7]/92 to-transparent"
              aria-hidden
            />

            {/* Teaser-Text wie früher: links auf der Grafik */}
            <div className="absolute inset-y-2 left-0 z-[2] flex w-[min(100%,clamp(280px,48vw,760px))] flex-col justify-center px-6 py-6 sm:inset-y-0 sm:w-[54%] sm:justify-center sm:px-12 sm:py-14 lg:w-[52%]">
              <div className="max-w-xl">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#0F4F68]">Ratgeber</p>
                {topicCategoryBadge ? (
                  <p className="mt-3">
                    <span className="inline-flex max-w-full items-center rounded-full border border-[#0F4F68]/28 bg-[#0F4F68]/06 px-3 py-1.5 text-xs font-bold leading-snug text-[#0F4F68] shadow-sm backdrop-blur-[2px]">
                      {topicCategoryBadge}
                    </span>
                  </p>
                ) : null}
                <h1
                  id="ratgeber-artikel-heading"
                  className="mt-4 text-balance text-3xl font-extrabold leading-tight text-[#0F4F68] shadow-sm sm:text-[1.85rem] sm:leading-[1.2] lg:text-[2.05rem]"
                >
                  {title}
                </h1>
                {lead ? (
                  <p className="mt-4 max-w-[min(100%,36rem)] text-pretty text-base leading-relaxed text-neutral-900/92 sm:text-[1.0625rem]">
                    {lead}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {/* Liste + Button: Fortsetzung unter der Grafik, gleiche Rasterbreite ({mw}px) */}
          <div className="relative z-[1] border-t border-[#0F4F68]/10 bg-[#FFF9F6] px-6 py-10 sm:px-12 lg:py-14">
            <div className="mx-auto max-w-4xl">
              <ul
                className="mt-2 max-w-2xl space-y-3.5 text-pretty sm:space-y-4"
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
                  className={cn(
                    "inline-flex min-h-[3rem] max-w-[min(100%,28rem)] items-center justify-center rounded-xl bg-[#F78F2E]",
                    "px-6 py-3.5 text-center text-base font-bold leading-snug text-white shadow-[0_12px_32px_-12px_rgba(247,143,46,0.55)]",
                    "transition hover:opacity-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2",
                    "sm:min-h-[3.25rem] sm:px-8 sm:text-lg",
                  )}
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
      </div>
    </section>
  );
}
