import Image from "next/image";
import Link from "next/link";

import { RatgeberArticleQualityLines } from "@/components/ratgeber/RatgeberArticleQualityLines";
import { VerwandteRatgeberBeitraege } from "@/components/ratgeber/VerwandteRatgeberBeitraege";
import { DecorativeIcon } from "@/components/ratgeber/pflegegrad-beantragen/pflegegrad-visual-primitives";
import { getRatgeberBeitragReadMinutes } from "@/config/ratgeber-betraege";

const PROSE = "text-[1.125rem] leading-[1.7] text-neutral-800";

function IconClock() {
  return (
    <DecorativeIcon className="h-4 w-4 shrink-0 text-neutral-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2.5 1.5M12 3a9 9 0 100 18 9 9 0 000-18z" />
    </DecorativeIcon>
  );
}

function IconCalendar() {
  return (
    <DecorativeIcon className="h-4 w-4 shrink-0 text-neutral-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5m8 2V5M5 11h14M5 19h14a2 2 0 002-2v-6H3v6a2 2 0 002 2z" />
    </DecorativeIcon>
  );
}

type Props = {
  slug: string;
  title: string;
  breadcrumbLabel: string;
  body: string;
};

/** Minimaler Ratgeber-Artikel nur für Layout-/Grid-Tests (kein echter inhaltlicher Beitrag). */
export function RatgeberPlatzhalterArticleView({ slug, title, breadcrumbLabel, body }: Props) {
  const minutes = getRatgeberBeitragReadMinutes(slug);

  return (
    <div className="min-w-0">
      <header className="border-b border-neutral-200 pb-8 pt-5 sm:pb-10 sm:pt-6">
        <nav aria-label="Brotkrumen" className={`${PROSE} text-sm text-neutral-600`}>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link href="/" className="text-[#0F4F68] underline-offset-2 hover:underline">
                Startseite
              </Link>
            </li>
            <li aria-hidden className="text-neutral-400">
              /
            </li>
            <li>
              <Link href="/ratgeber" className="text-[#0F4F68] underline-offset-2 hover:underline">
                Ratgeber
              </Link>
            </li>
            <li aria-hidden className="text-neutral-400">
              /
            </li>
            <li className="font-medium text-neutral-900">{breadcrumbLabel}</li>
          </ol>
        </nav>

        <div
          className="mt-7 h-[3px] w-28 max-w-[40%] rounded-full bg-gradient-to-r from-[#0F4F68]/90 via-[#4a93a8] to-[#F78F2E]/80 sm:w-24"
          aria-hidden
        />

        <div className="mt-8 space-y-6 lg:mt-9 lg:space-y-8">
          <div className="flex flex-col items-center gap-5 text-center sm:gap-6 lg:flex-row lg:items-start lg:gap-10 lg:text-left">
            <div className="order-2 flex min-w-0 w-full flex-1 flex-col items-center lg:order-1 lg:items-start">
              <p className="inline-flex rounded-full border border-amber-200 bg-amber-50/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-amber-900">
                Platzhalter · nur Layout
              </p>
              <h1
                id="ratgeber-artikel-heading"
                className="mt-4 max-w-[40rem] text-balance text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl lg:max-w-none lg:text-[2.35rem] lg:leading-[1.2]"
              >
                {title}
              </h1>
            </div>

            <div className="order-1 w-full max-w-[18rem] shrink-0 overflow-hidden rounded-2xl border border-neutral-100 shadow-[0_12px_40px_-28px_rgba(15,79,104,0.35)] ring-1 ring-[#0F4F68]/10 sm:max-w-[21rem] lg:order-2 lg:max-w-[420px] lg:w-[min(36%,420px)]">
              <Image
                src="/images/Ratgeber/ratgeber.webp"
                alt=""
                width={840}
                height={560}
                className="h-auto w-full object-cover"
                sizes="(max-width:1024px) 90vw, 420px"
                priority
              />
            </div>
          </div>

          <p className={`${PROSE} mx-auto max-w-[40rem] text-center lg:mx-0 lg:text-left`}>
            Kurzer Platzhalter-Text für die Ratgeber-Karten und das Vier-Spalten-Raster – kein medizinischer Inhalt.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-neutral-200 pt-6">
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <p className="flex items-center gap-2 text-sm text-neutral-600">
              <IconCalendar />
              Stand: April 2026
            </p>
            <p className="flex items-center gap-2 text-sm text-neutral-600">
              <IconClock />
              Lesezeit: ca. {minutes} Minuten
            </p>
          </div>
          <RatgeberArticleQualityLines />
        </div>
        <div className="mt-6 border-t border-neutral-200" aria-hidden />
      </header>

      <div className={`${PROSE} mx-auto mt-10 max-w-[760px] space-y-6`}>
        <p className="rounded-xl border border-dashed border-amber-300/80 bg-amber-50/40 px-4 py-3 text-[1.05rem] text-amber-950">
          <strong>Hinweis:</strong> {body}
        </p>
        <p>
          <Link href="/ratgeber" className="font-medium text-[#0F4F68] underline-offset-2 hover:underline">
            Zurück zur Ratgeber-Übersicht
          </Link>
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-[760px]">
        <VerwandteRatgeberBeitraege currentSlug={slug} />
      </div>
    </div>
  );
}
