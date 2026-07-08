import Link from "next/link";

import { RatgeberBeratungCtaButton } from "@/components/ratgeber/RatgeberBeratungDialog";
import { PflegegeldrechnerCalculator } from "@/components/ratgeber/pflegegeldrechner/PflegegeldrechnerCalculator";
import { PFLEGEGELDRECHNER_FAQ_ITEMS } from "@/components/ratgeber/pflegegeldrechner/pflegegeldrechner-faq-data";
import { PFLEGEGELDRECHNER_TOC_ENTRIES } from "@/components/ratgeber/pflegegeldrechner/pflegegeldrechner-toc-config";
import { PflegegradFaqAccordion } from "@/components/ratgeber/pflegegrad-beantragen/PflegegradFaqAccordion";
import { ArticleSectionHeading } from "@/components/ratgeber/pflegegrad-beantragen/pflegegrad-visual-primitives";
import { cn } from "@/lib/utils";

const PROSE = "text-[1.125rem] leading-[1.7] text-neutral-800";
const LINK = "font-medium text-[#0F4F68] underline-offset-2 hover:underline";

export function PflegegeldrechnerArticle() {
  return (
    <div className={cn(PROSE, "min-w-0")}>
      <details className="group mb-11 overflow-hidden rounded-2xl border border-neutral-200/95 bg-white shadow-[0_12px_40px_-28px_rgba(15,79,104,0.22)] lg:hidden">
        <summary className="relative cursor-pointer list-none px-4 py-3.5 text-sm font-semibold text-[#0F4F68] [&::-webkit-details-marker]:hidden">
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#0F4F68]/45 to-[#F78F2E]/35"
          />
          <span className="flex items-center justify-between gap-2">
            INHALT
            <span aria-hidden className="text-neutral-400 transition group-open:rotate-180">
              ⌄
            </span>
          </span>
        </summary>
        <nav className="border-t border-neutral-100 px-4 py-4" aria-label="Inhalt (mobil)">
          <ol className="space-y-2.5">
            {[...PFLEGEGELDRECHNER_TOC_ENTRIES].map((e, i) => (
              <li key={e.id} className="flex gap-2 text-sm leading-snug">
                <span className="w-7 shrink-0 font-semibold tabular-nums text-[#F78F2E]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <a href={`#${e.id}`} className={`${LINK} text-[0.9375rem]`}>
                  {e.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </details>

      <PflegegeldrechnerCalculator className="mb-12" />

      <ArticleSectionHeading sectionNum="01" id="was-ist-pflegegeld" isFirst heading="Was ist Pflegegeld?">
        <p>
          Pflegegeld ist eine monatliche Geldleistung der Pflegekasse. Es wird gezahlt, wenn pflegebedürftige Menschen zu
          Hause versorgt werden und die Pflege ganz oder teilweise durch Angehörige, Freunde oder andere private
          Pflegepersonen organisiert wird. Die Höhe richtet sich nach dem anerkannten Pflegegrad. Wer den{" "}
          <Link href="/ratgeber/pflegegrad-beantragen" className={LINK}>
            Pflegegrad beantragen
          </Link>{" "}
          möchte, findet im verlinkten Ratgeber eine kompakte Schritt-für-Schritt-Orientierung.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="02" id="tabelle-pflegegeld" heading="Pflegegeld 2026 nach Pflegegrad">
        <div className="mt-2 overflow-x-auto rounded-xl border border-neutral-200/95 bg-white">
          <table className="w-full min-w-[280px] border-collapse text-left text-[0.9375rem]">
            <caption className="sr-only">Pflegegeld 2026 nach Pflegegrad, monatlich und jährlich</caption>
            <thead>
              <tr className="border-b border-neutral-200 bg-[#f6fafb]">
                <th scope="col" className="px-4 py-3 font-semibold text-[#0F4F68]">
                  Pflegegrad
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-[#0F4F68]">
                  Pflegegeld pro Monat
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-[#0F4F68]">
                  Pflegegeld pro Jahr
                </th>
              </tr>
            </thead>
            <tbody className="tabular-nums text-neutral-800">
              <tr className="border-b border-neutral-100">
                <th scope="row" className="px-4 py-3 font-medium text-[#0F4F68]">
                  Pflegegrad 1
                </th>
                <td className="px-4 py-3">0 €</td>
                <td className="px-4 py-3">0 €</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <th scope="row" className="px-4 py-3 font-medium text-[#0F4F68]">
                  Pflegegrad 2
                </th>
                <td className="px-4 py-3">347 €</td>
                <td className="px-4 py-3">4.164 €</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <th scope="row" className="px-4 py-3 font-medium text-[#0F4F68]">
                  Pflegegrad 3
                </th>
                <td className="px-4 py-3">599 €</td>
                <td className="px-4 py-3">7.188 €</td>
              </tr>
              <tr className="border-b border-neutral-100">
                <th scope="row" className="px-4 py-3 font-medium text-[#0F4F68]">
                  Pflegegrad 4
                </th>
                <td className="px-4 py-3">800 €</td>
                <td className="px-4 py-3">9.600 €</td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-[#0F4F68]">
                  Pflegegrad 5
                </th>
                <td className="px-4 py-3">990 €</td>
                <td className="px-4 py-3">11.880 €</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-neutral-600">
          Stand: 2026. Die Jahresspalte entspricht zwölf vollen Monaten; bei Bewilligung mitten im Monat ist der erste Monat
          anteilig – das berücksichtigt der Rechner oben über das Bewilligungsdatum. Maßgeblich sind die Angaben Ihrer
          Pflegekasse.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="03" id="hilfe-ahs" heading="Unsicher beim Pflegegrad? Alltagshilfe-Süd unterstützt Sie">
        <p>
          Viele Familien wissen nicht, welcher Pflegegrad realistisch ist oder wie sie reagieren sollen, wenn der Antrag
          abgelehnt wurde. Alltagshilfe-Süd unterstützt Sie bei der Beantragung eines Pflegegrades und hilft auch beim{" "}
          <Link href="/ratgeber/pflegegrad-beantragen#widerspruch" className={LINK}>
            Widerspruch
          </Link>
          , wenn der Pflegegrad zu niedrig ausfällt oder komplett abgelehnt wurde.
        </p>
        <ul className="mt-5 list-disc space-y-2 pl-5 marker:text-[#F78F2E]">
          <li>Hilfe beim Pflegegrad-Antrag</li>
          <li>Unterstützung beim Widerspruch</li>
          <li>Erklärung der möglichen Pflegeleistungen</li>
          <li>
            Unterstützung bei{" "}
            <Link href="/ratgeber/pflegegrad-1" className={LINK}>
              Entlastungsbetrag
            </Link>
            ,{" "}
            <Link href="/leistungen/alltagsbegleitung-betreuung" className={LINK}>
              Betreuung und Alltagshilfe
            </Link>
          </li>
          <li>
            Hilfe bei{" "}
            <Link href="/pflegehilfsmittel/kostenfreie-pflegehilfsmittel" className={LINK}>
              Pflegehilfsmitteln
            </Link>{" "}
            im Wert von bis zu 42 € monatlich
          </li>
          <li>
            Unterstützung bei{" "}
            <Link href="/pflegeshop#qualitaetsversprechen-pflegeshop" className={LINK}>
              Inkontinenzversorgung über Rezept
            </Link>
            , falls relevant
          </li>
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <RatgeberBeratungCtaButton
            className="w-full justify-center sm:w-auto sm:min-w-[14rem]"
            contextNote="Ratgeber: Pflegegeldrechner – Unterstützung anfragen"
            preselectedServices={["pflegegrad_beantrag_widerspruch"]}
          >
            Jetzt Unterstützung anfragen
          </RatgeberBeratungCtaButton>
          <Link
            href="/pflegeberatung/private-pflegeberatung"
            className={`${LINK} inline-flex min-h-[44px] items-center justify-center text-center text-[0.95rem] sm:px-2`}
          >
            Mehr zur privaten Pflegeberatung
          </Link>
        </div>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="04" id="entlastungsbetrag" heading="Pflegegeld und Entlastungsbetrag">
        <p>
          Pflegegeld ist nicht dasselbe wie der Entlastungsbetrag. Der Entlastungsbetrag kann zusätzlich für anerkannte
          Entlastungs- und Betreuungsangebote genutzt werden – siehe auch unseren Ratgeber{" "}
          <Link href="/ratgeber/pflegegrad-1" className={LINK}>
            Pflegegrad 1
          </Link>{" "}
          mit Schwerpunkt Entlastungsbetrag. Alltagshilfe-Süd kann Ihnen erklären, welche Leistungen für Ihre Situation
          sinnvoll sind und wie die Abrechnung über die Pflegekasse funktioniert. Bei organisatorischen Hilfen im Haushalt
          lohnt sich zusätzlich der Blick auf{" "}
          <Link href="/leistungen/haushaltshilfe" className={LINK}>
            Haushaltshilfe
          </Link>
          .
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="05" id="faq-pflegegeld" heading="Häufige Fragen">
        <PflegegradFaqAccordion items={PFLEGEGELDRECHNER_FAQ_ITEMS} />
      </ArticleSectionHeading>

      <section id="quellen" className="scroll-mt-28 border-t border-neutral-200/90 pt-10">
        <h2 className="text-base font-semibold text-[#0F4F68]">Quellen</h2>
        <ul className="mt-3 space-y-2 text-sm text-neutral-600">
          <li>
            <a
              href="https://www.bundesgesundheitsministerium.de/pflegegeld"
              className={LINK}
              rel="noopener noreferrer"
              target="_blank"
            >
              Bundesgesundheitsministerium: Pflegegeld für häusliche Pflege
            </a>
          </li>
          <li>
            <a
              href="https://www.aok.de/pk/leistungen/pflegegeld-bei-pflege-zu-hause/"
              className={LINK}
              rel="noopener noreferrer"
              target="_blank"
            >
              AOK: Pflegegeld / Pflegeleistungen
            </a>
          </li>
        </ul>
      </section>

    </div>
  );
}
