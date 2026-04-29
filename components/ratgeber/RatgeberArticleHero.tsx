import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

/** Natürliche Pixelmaße von `ratgeber_blog_backgrounds.webp` (VP8X-Canvas). */
export const RATGEBER_ARTICLE_HERO_BG_SRC = "/images/Ratgeber/ratgeber_blog_backgrounds.webp" as const;
export const RATGEBER_ARTICLE_HERO_BG_WIDTH = 1520 as const;
export const RATGEBER_ARTICLE_HERO_BG_HEIGHT = 434 as const;

const DEFAULT_UPDATED_ISO = "2026-05-01" as const;
const DEFAULT_UPDATED_DISPLAY = "01.05.2026" as const;
const DEFAULT_CTA_HREF = "/kontakt" as const;

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
  /** Anzeige-Datum wie „April 2026“. */
  updatedDisplay?: string;
  /** ISO für `<time dateTime="">`. */
  updatedISO?: string;
  /** Ziel des Termin-CTA (standard: Kontakt mit Beratungsanlass). */
  ctaHref?: string;
};

/**
 * Ratgeber-Artikelkopf: Hintergrundgrafik in Originalproportionen, maximal Originalbreite, mittig.
 * Nur Titel, drei Vertrauenszeilen und CTA liegen auf dem Bild; der Fließtext beginnt darunter.
 */
export function RatgeberArticleHero({
  title,
  updatedDisplay = DEFAULT_UPDATED_DISPLAY,
  updatedISO = DEFAULT_UPDATED_ISO,
  ctaHref = DEFAULT_CTA_HREF,
}: RatgeberArticleHeroProps) {
  return (
    <section className="w-full pt-0" aria-labelledby="ratgeber-artikel-heading">
      <div className="flex w-full justify-center px-0 sm:px-4 lg:px-6">
        <div className="relative isolate w-full max-w-[1520px] bg-white">
          <Image
            src={RATGEBER_ARTICLE_HERO_BG_SRC}
            width={RATGEBER_ARTICLE_HERO_BG_WIDTH}
            height={RATGEBER_ARTICLE_HERO_BG_HEIGHT}
            alt=""
            priority
            sizes="(max-width: 1520px) 100vw, 1520px"
            className="pointer-events-none block h-auto w-full max-w-[1520px] select-none bg-white"
          />

          {/* leichte Aufhellung für Kontrast ohne zusätzliche Inhaltsebenen */}
          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-white/88 via-[#fffbf7]/76 to-transparent" aria-hidden />
          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-white/65 via-transparent to-transparent" aria-hidden />

          <div className="absolute inset-0 z-[2] flex flex-col justify-center px-5 py-6 sm:px-10 sm:py-8 lg:px-14">
            <div className="mx-auto flex w-full min-w-0 max-w-xl flex-col items-center text-center sm:max-w-2xl">
              <h1
                id="ratgeber-artikel-heading"
                className="text-balance text-2xl font-extrabold leading-tight text-[#0F4F68] shadow-sm sm:text-[1.72rem] sm:leading-[1.22] lg:text-[2rem]"
              >
                {title}
              </h1>

              <ul
                className="mt-5 w-full space-y-2.5 text-pretty text-left sm:mt-6 sm:space-y-3"
                aria-label="Zu diesem Ratgeber-Beitrag"
              >
                <li className="flex gap-3 sm:gap-3.5">
                  <RatgeberHeroCheckIcon className="mt-0.5 shrink-0" />
                  <span className="min-w-0 pt-0 text-sm font-semibold leading-snug text-[#0F4F68] shadow-sm sm:text-[0.98rem] sm:leading-snug drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]">
                    Autor: Alltagshilfe-Süd Redaktion
                  </span>
                </li>
                <li className="flex gap-3 sm:gap-3.5">
                  <RatgeberHeroCheckIcon className="mt-0.5 shrink-0" />
                  <span className="min-w-0 pt-0 text-sm font-semibold leading-snug text-[#0F4F68] shadow-sm sm:text-[0.98rem] sm:leading-snug drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]">
                    Fachlich geprüfter Artikel von Luisa Gölder (zertifizierte Pflegeberaterin nach § 7a SGB XI)
                  </span>
                </li>
                <li className="flex gap-3 sm:gap-3.5">
                  <RatgeberHeroCheckIcon className="mt-0.5 shrink-0" />
                  <span className="min-w-0 pt-0 text-sm font-semibold leading-snug text-[#0F4F68] shadow-sm sm:text-[0.98rem] sm:leading-snug drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]">
                    Artikel auf neuestem Stand (aktualisiert <time dateTime={updatedISO}>{updatedDisplay}</time>)
                  </span>
                </li>
              </ul>

              <div className="mt-7 w-full sm:mt-8">
                <Link
                  href={ctaHref}
                  className={cn(
                    "inline-flex min-h-[2.875rem] w-full max-w-[28rem] items-center justify-center rounded-xl bg-[#F78F2E]",
                    "px-5 py-3 text-center text-[0.95rem] font-bold leading-snug text-white shadow-[0_10px_26px_-10px_rgba(247,143,46,0.55)]",
                    "transition hover:opacity-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2",
                    "sm:min-h-[3rem] sm:px-7 sm:text-base",
                  )}
                >
                  Noch Fragen? Wir beraten Sie gerne! Jetzt Termin vereinbaren
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
