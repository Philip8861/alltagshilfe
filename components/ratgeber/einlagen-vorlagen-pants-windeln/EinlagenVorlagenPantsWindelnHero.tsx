import Image from "next/image";
import Link from "next/link";

import { RatgeberArticleImageBeratungCta } from "@/components/ratgeber/RatgeberArticleImageBeratungCta";
import { DecorativeIcon } from "@/components/ratgeber/pflegegrad-beantragen/pflegegrad-visual-primitives";
import { RatgeberArticleQualityLines } from "@/components/ratgeber/RatgeberArticleQualityLines";
import {
  INKONTINENZMATERIAL_BYLINE_AUTHOR_TEXT,
  INKONTINENZMATERIAL_BYLINE_REVIEWER_TEXT,
} from "@/config/ratgeber-article-byline";
import { getRatgeberBeitragReadMinutes } from "@/config/ratgeber-betraege";

const SLUG = "einlagen-vorlagen-pants-windeln-inkontinenzmaterial" as const;
const ARTICLE_IMAGE = "/images/Ratgeber/Landing_page.webp" as const;
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

export function EinlagenVorlagenPantsWindelnHero() {
  return (
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
          <li className="font-medium text-neutral-900">Inkontinenzmaterial im Vergleich</li>
        </ol>
      </nav>

      <div
        className="mt-7 h-[3px] w-28 max-w-[40%] rounded-full bg-gradient-to-r from-[#0F4F68]/90 via-[#4a93a8] to-[#F78F2E]/80 sm:w-24"
        aria-hidden
      />

      <div className="mt-8 lg:mt-9">
        <div className="flex w-full flex-col items-center gap-5 text-center sm:gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10 lg:text-left">
          <div className="order-2 flex min-w-0 w-full max-w-none flex-1 flex-col items-center lg:order-1 lg:max-w-[min(100%,42rem)] lg:items-start lg:pr-2">
            <p className="inline-flex rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#0F4F68]">
              Inkontinenzversorgung
            </p>
            <h1
              id="ratgeber-artikel-heading"
              className="mt-4 max-w-[40rem] text-balance text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl lg:max-w-none lg:text-[2.35rem] lg:leading-[1.2]"
            >
              Einlagen, Vorlagen, Pants oder Windeln: Welches Inkontinenzmaterial passt zu mir?
            </h1>
            <p className={`${PROSE} mt-5 max-w-[40rem] text-center lg:mt-6 lg:text-left`}>
              Viele Menschen kaufen Inkontinenzprodukte zunächst auf gut Glück. Eine Packung Einlagen aus der Drogerie,
              später vielleicht Pants, dann doch stärkere Windeln. Oft beginnt genau so ein langer und teurer Kreislauf.
            </p>
            <p className={`${PROSE} mt-4 max-w-[40rem] text-center lg:text-left`}>
              Dabei ist Inkontinenzmaterial nicht einfach nur „Windel oder Einlage“. Die richtige Auswahl hängt davon ab,
              wie stark die Inkontinenz ist, ob die Person mobil ist, ob Demenz oder Pflegebedürftigkeit vorliegt und ob das
              Produkt tagsüber oder nachts gebraucht wird.
            </p>
            <p className={`${PROSE} mt-4 max-w-[40rem] text-center lg:text-left`}>
              Dieser Ratgeber erklärt verständlich, welches Inkontinenzmaterial zu welcher Situation passt, worauf Sie bei
              der Auswahl achten sollten und warum ein kostenloses Testpaket oft der beste erste Schritt ist.
            </p>
            <p className="mt-4 text-sm font-medium text-neutral-600 lg:text-left">
              Aktualisiert 2026 · verständlich erklärt · Alltagshilfe-Süd
            </p>
          </div>

          <div className="order-1 flex w-full max-w-[21.9375rem] shrink-0 flex-col items-center sm:max-w-[25.59375rem] lg:order-2 lg:ml-auto lg:w-[min(43.875%,512px)] lg:max-w-[512px] lg:shrink-0">
            <div className="w-full">
              <div className="overflow-hidden rounded-2xl border border-neutral-100 shadow-[0_12px_40px_-28px_rgba(15,79,104,0.35)] ring-1 ring-[#0F4F68]/10">
                <Image
                  src={ARTICLE_IMAGE}
                  alt="Einlagen, Vorlagen, Pants und Windeln: passende Inkontinenzversorgung für den Alltag"
                  width={1200}
                  height={780}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 1024px) 90vw, 512px"
                  priority
                />
              </div>
            </div>
            <RatgeberArticleImageBeratungCta
              inkoChoice={{
                dataCta: "inko-produkt-hero-image",
                clickEvent: "inko_cta_inline_click",
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-neutral-200 pt-6">
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <p className="flex items-center gap-2 text-sm text-neutral-600">
            <IconCalendar />
            Stand: Juli 2026
          </p>
          <p className="flex items-center gap-2 text-sm text-neutral-600">
            <IconClock />
            Lesezeit: ca. {getRatgeberBeitragReadMinutes(SLUG)} Minuten
          </p>
        </div>
        <RatgeberArticleQualityLines
          reviewerText={INKONTINENZMATERIAL_BYLINE_REVIEWER_TEXT}
          authorText={INKONTINENZMATERIAL_BYLINE_AUTHOR_TEXT}
        />
      </div>
      <div className="mt-6 border-t border-neutral-200" aria-hidden />
    </header>
  );
}
