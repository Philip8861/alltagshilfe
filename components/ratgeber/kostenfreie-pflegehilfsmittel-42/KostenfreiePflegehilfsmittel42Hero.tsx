import Image from "next/image";
import Link from "next/link";

import { RatgeberArticleImageBeratungCta } from "@/components/ratgeber/RatgeberArticleImageBeratungCta";
import { DecorativeIcon } from "@/components/ratgeber/pflegegrad-beantragen/pflegegrad-visual-primitives";
import { RatgeberArticleQualityLines } from "@/components/ratgeber/RatgeberArticleQualityLines";

const PROSE = "text-[1.125rem] leading-[1.7] text-neutral-800";

function IconCalendar() {
  return (
    <DecorativeIcon className="h-4 w-4 shrink-0 text-neutral-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5m8 2V5M5 11h14M5 19h14a2 2 0 002-2v-6H3v6a2 2 0 002 2z" />
    </DecorativeIcon>
  );
}

/** Hero für /ratgeber/kostenfreie-pflegehilfsmittel-42-euro — gleiche Bildsprache wie Pflegegrad-Ratgeber */
export function KostenfreiePflegehilfsmittel42Hero() {
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
          <li className="font-medium text-neutral-900">Kostenfreie Pflegehilfsmittel (42 €)</li>
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
              Ratgeber Pflege
            </p>
            <h1
              id="ratgeber-artikel-heading"
              className="mt-4 max-w-[40rem] text-balance text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl lg:max-w-none lg:text-[2.35rem] lg:leading-[1.2]"
            >
              Kostenfreie Pflegehilfsmittel im Wert von 42 € monatlich
            </h1>
            <p className={`${PROSE} mt-5 max-w-[40rem] text-center lg:mt-6 lg:text-left`}>
              Wer zu Hause gepflegt wird und mindestens Pflegegrad 1 hat, kann jeden Monat Pflegehilfsmittel zum Verbrauch
              im Wert von bis zu 42 € erhalten. Dazu gehören zum Beispiel Einmalhandschuhe, Desinfektionsmittel,
              Schutzschürzen, Mundschutz oder Bettschutzeinlagen zum Einmalgebrauch.
            </p>
            <p className={`${PROSE} mt-4 max-w-[40rem] text-center lg:text-left`}>
              Viele Familien wissen gar nicht, dass ihnen diese Unterstützung zusteht. Dabei können sich über das Jahr
              gerechnet bis zu 504 € ergeben – Geld, das sonst oft unnötig privat ausgegeben wird.
            </p>
            <p className={`${PROSE} mt-4 max-w-[40rem] text-center lg:text-left`}>
              Die 42 € Pflegehilfsmittelpauschale ist keine freiwillige Zusatzleistung, sondern ein gesetzlicher Anspruch
              für pflegebedürftige Menschen, die zu Hause versorgt werden und die Voraussetzungen erfüllen. Im Artikel
              erfahren Sie, wer Anspruch hat, wie der Antrag funktioniert und worauf Sie achten sollten.
            </p>
            <p className="mt-4 text-sm font-medium text-neutral-600 lg:text-left">
              Aktualisiert 2026 · verständlich erklärt · Alltagshilfe-Süd
            </p>
          </div>

          <div className="order-1 flex w-full max-w-[21.9375rem] shrink-0 flex-col items-center sm:max-w-[25.59375rem] lg:order-2 lg:ml-auto lg:w-[min(43.875%,512px)] lg:max-w-[512px] lg:shrink-0">
            <div className="w-full">
              <div className="overflow-hidden rounded-2xl border border-neutral-100 shadow-[0_12px_40px_-28px_rgba(15,79,104,0.35)] ring-1 ring-[#0F4F68]/10">
                <Image
                  src="/images/Ratgeber/ratgeber_pflegehilfsmittel.webp"
                  alt="Kostenfreie Pflegehilfsmittel: Einmalhandschuhe, Desinfektion und Verbrauchsmaterialien im Pflegealltag"
                  width={1200}
                  height={780}
                  className="h-auto w-full object-cover"
                  sizes="(max-width: 1024px) 90vw, 512px"
                  priority
                />
              </div>
            </div>
            <RatgeberArticleImageBeratungCta
              contextNote="Ratgeber: 42 € Pflegehilfsmittel (Artikelbild)"
              preselectedServices={["pflegebox", "pflegegrad_beantrag_widerspruch"]}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-neutral-200 pt-6">
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <p className="flex items-center gap-2 text-sm text-neutral-600">
            <IconCalendar />
            Stand: April 2026
          </p>
        </div>
        <RatgeberArticleQualityLines />
      </div>
      <div className="mt-6 border-t border-neutral-200" aria-hidden />
    </header>
  );
}
