import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const BG_SRC = "/images/Ratgeber/ratgeber_blog_backgrounds.webp" as const;
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
  /** Anzeige-Datum wie „01.05.2026“. */
  updatedDisplay?: string;
  /** ISO für `<time dateTime="">`. */
  updatedISO?: string;
  /** Ziel des Termin-CTA (standard: Kontakt mit Beratungsanlass). */
  ctaHref?: string;
  /** Optional: zweite Reihe unter dem Haupt-Button (z. B. „PDF herunterladen“, Anker-Link). */
  footer?: ReactNode;
};

/**
 * Gemeinsamer Ratgeber-Artikelkopf: BG-Bild, Kicker „Ratgeber“, H1,
 * drei Vertrauens-Zeilen mit Haken, primärer CTA.
 */
export function RatgeberArticleHero({
  title,
  updatedDisplay = DEFAULT_UPDATED_DISPLAY,
  updatedISO = DEFAULT_UPDATED_ISO,
  ctaHref = DEFAULT_CTA_HREF,
  footer,
}: RatgeberArticleHeroProps) {
  return (
    <section
      className="relative isolate w-full px-4 sm:px-6 md:px-8 lg:px-10"
      aria-labelledby="ratgeber-artikel-heading"
    >
      <div className="relative isolate w-full overflow-hidden rounded-[0.85rem] bg-[#FFFBF7] shadow-[0_8px_28px_-14px_rgba(15,79,104,0.18)] sm:rounded-2xl">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden>
          <Image
            src={BG_SRC}
            alt=""
            fill
            priority
            className="origin-center object-cover object-center scale-[0.49]"
            sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 768px) calc(100vw - 3rem), min(80rem, calc(100vw - 5rem))"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/93 via-[#fffbf8]/94 to-[#f5f9fb]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-7 lg:px-[var(--ahs-page-gutter)]">
          <div className="mx-auto w-full max-w-4xl py-11 sm:py-14 lg:py-16">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#0F4F68]">
              Ratgeber
            </p>
            <h1
              id="ratgeber-artikel-heading"
              className="mt-3 max-w-[min(100%,52rem)] text-balance text-3xl font-extrabold leading-tight text-[#0F4F68] sm:text-4xl sm:leading-[1.12] lg:text-[2.15rem]"
            >
              {title}
            </h1>

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
