import Image from "next/image";
import Link from "next/link";

import { DecorativeIcon } from "@/components/ratgeber/pflegegrad-beantragen/pflegegrad-visual-primitives";
import { Pflegereform2027BetrieblichImageCta } from "@/components/ratgeber/pflegereform-2027/Pflegereform2027BetrieblichPromo";
import { PFLEGEREFORM_2027_SLUG, getRatgeberBeitragReadMinutes } from "@/config/ratgeber-betraege";

const PROSE = "text-[1.125rem] leading-[1.7] text-neutral-800";

/** Redaktioneller Stand des Beitrags (aus der Quelle übernommen). */
export const PFLEGEREFORM_2027_STAND_LABEL = "7. Oktober 2026";

function IconCalendar() {
  return (
    <DecorativeIcon className="h-4 w-4 shrink-0 text-neutral-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5m8 2V5M5 11h14M5 19h14a2 2 0 002-2v-6H3v6a2 2 0 002 2z" />
    </DecorativeIcon>
  );
}

function IconClock() {
  return (
    <DecorativeIcon className="h-4 w-4 shrink-0 text-neutral-500">
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
    </DecorativeIcon>
  );
}

function Pflegereform2027MetaRow() {
  const minutes = getRatgeberBeitragReadMinutes(PFLEGEREFORM_2027_SLUG);
  return (
    <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-neutral-200 pt-6">
      <p className="flex items-center gap-2 text-sm text-neutral-600">
        <IconCalendar />
        Stand: {PFLEGEREFORM_2027_STAND_LABEL}
      </p>
      <p className="flex items-center gap-2 text-sm text-neutral-600">
        <IconClock />
        Lesezeit: ca. {minutes} Minuten
      </p>
    </div>
  );
}

/** Hero für den News-Beitrag „Pflegereform 2027“ — gleiche Struktur wie die anderen Ratgeber-Artikel */
export function Pflegereform2027Hero() {
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
          <li className="font-medium text-neutral-900">Pflegereform 2027</li>
        </ol>
      </nav>

      <div
        className="mt-7 h-[3px] w-28 max-w-[40%] rounded-full bg-gradient-to-r from-[#0F4F68]/90 via-[#4a93a8] to-[#F78F2E]/80 sm:w-24"
        aria-hidden
      />

      <div className="mt-8 lg:mt-9">
        <div className="flex w-full flex-col items-center gap-5 text-center sm:gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10 lg:text-left">
          <div className="order-2 flex min-w-0 w-full max-w-none flex-1 flex-col items-center lg:order-1 lg:max-w-[min(100%,42rem)] lg:items-start lg:pr-2">
            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <p className="inline-flex items-center gap-1.5 rounded-full border border-[#0F4F68]/25 bg-[#F2F9FA] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#0F4F68]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F78F2E]" aria-hidden />
                News zur Pflegereform
              </p>
              <p className="inline-flex rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-[#0F4F68]">
                Stand: {PFLEGEREFORM_2027_STAND_LABEL}
              </p>
            </div>
            <h1
              id="ratgeber-artikel-heading"
              className="mt-4 max-w-[40rem] text-balance text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl lg:max-w-none lg:text-[2.35rem] lg:leading-[1.2]"
            >
              Pflegereform 2027: Diese 7 Dinge sollten Pflegebedürftige und Angehörige noch 2026 prüfen
            </h1>
            <p className={`${PROSE} mt-5 max-w-[40rem] text-center lg:mt-6 lg:text-left`}>
              Die Pflegereform 2027 wird konkreter. Für Pflegebedürftige und Angehörige geht es dabei nicht nur um neue
              Gesetze aus Berlin. Es geht um Pflegegrade, Entlastungsleistungen, Unterstützung zu Hause und teilweise um
              viel Geld. Wer bereits Pflege benötigt, sollte deshalb die letzten Monate des Jahres 2026 sinnvoll nutzen.
            </p>
          </div>

          <div className="order-1 flex w-full max-w-[21.9375rem] shrink-0 flex-col items-center sm:max-w-[25.59375rem] lg:order-2 lg:ml-auto lg:w-[min(43.875%,512px)] lg:max-w-[512px] lg:shrink-0">
            <div className="w-full">
              <div className="overflow-hidden rounded-2xl border border-neutral-100 shadow-[0_12px_40px_-28px_rgba(15,79,104,0.35)] ring-1 ring-[#0F4F68]/10">
                <Image
                  src="/images/Ratgeber/pflegereform_2027_news.webp"
                  alt="Pflegereform 2027: Angehörige und Pflegebedürftige prüfen gemeinsam Unterlagen der Pflegekasse"
                  width={1080}
                  height={720}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 1024px) 90vw, 512px"
                  priority
                />
              </div>
            </div>
            <Pflegereform2027BetrieblichImageCta />
          </div>
        </div>
      </div>

      <Pflegereform2027MetaRow />
      <div className="mt-6 border-t border-neutral-200" aria-hidden />
    </header>
  );
}
