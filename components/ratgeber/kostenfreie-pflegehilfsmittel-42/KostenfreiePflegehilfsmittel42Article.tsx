import type { ReactNode } from "react";
import Link from "next/link";

import { RatgeberBeratungCtaButton, RatgeberSidebarBeratungTeaser } from "@/components/ratgeber/RatgeberBeratungDialog";
import { PflegegradFaqAccordion } from "@/components/ratgeber/pflegegrad-beantragen/PflegegradFaqAccordion";
import {
  ArticleSectionHeading,
  ArticleStepHeading,
  ArticleSubtitle,
  PflegegradCallout,
} from "@/components/ratgeber/pflegegrad-beantragen/pflegegrad-visual-primitives";
import { KOSTENFREIE_PFLEGEHILFSMITTEL_42_FAQ } from "@/components/ratgeber/kostenfreie-pflegehilfsmittel-42/kostenfreie-pflegehilfsmittel-42-faq";
import { KOSTENFREIE_PFLEGEHILFSMITTEL_42_TOC } from "@/components/ratgeber/kostenfreie-pflegehilfsmittel-42/kostenfreie-pflegehilfsmittel-42-toc";
import { cn } from "@/lib/utils";

const PROSE = "text-[1.125rem] leading-[1.7] text-neutral-800";
const LINK = "font-medium text-[#0F4F68] underline-offset-2 hover:underline";

function FactsOverview42Table() {
  const rows = [
    { q: "Wie hoch ist der Anspruch?", a: "Bis zu 42 € pro Monat" },
    { q: "Wer bekommt Pflegehilfsmittel?", a: "Pflegebedürftige ab Pflegegrad 1 in häuslicher Pflege" },
    { q: "Braucht man ein Rezept?", a: "Nein, ein Antrag bei der Pflegekasse genügt" },
    { q: "Wird das Geld ausgezahlt?", a: "Meist nicht direkt, sondern per Erstattung oder Direktabrechnung" },
    { q: "Wie viel ist das pro Jahr?", a: "Bis zu 504 € jährlich" },
    { q: "Hilft Alltagshilfe-Süd?", a: "Ja, bei Antrag, Pflegegrad, Widerspruch und passender Versorgung" },
  ];
  return (
    <figure className="mt-6">
      <figcaption className="sr-only">Kurzüberblick zu kostenfreien Pflegehilfsmitteln und der 42-Euro-Pauschale</figcaption>
      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-[0_2px_8px_-4px_rgba(15,79,104,0.12)]">
        <table className="w-full min-w-[min(100%,20rem)] border-collapse text-left text-[1.025rem] sm:text-[1.0425rem]">
          <thead>
            <tr className="border-b border-neutral-200 bg-gradient-to-br from-neutral-50 to-[#f6fafc]">
              <th
                scope="col"
                className="px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#5a959e] sm:px-5"
              >
                Frage
              </th>
              <th
                scope="col"
                className="border-l border-neutral-100 px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#5a959e] sm:px-5"
              >
                Antwort
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.q} className={i % 2 === 1 ? "bg-[#fafcfc]/95" : "bg-white"}>
                <th
                  scope="row"
                  className="w-[42%] min-w-[10.5rem] border-b border-neutral-100 px-4 py-[0.8rem] align-top font-semibold leading-snug text-[#0F4F68] sm:px-5"
                >
                  {r.q}
                </th>
                <td className="border-b border-neutral-100 px-4 py-[0.8rem] align-top leading-relaxed text-neutral-800 sm:px-5">
                  {r.a}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

function DezenteCtaBox({
  title,
  titleId,
  body,
  buttonText,
  preselectedServices,
  contextNote,
}: {
  title: string;
  titleId: string;
  body: ReactNode;
  buttonText: string;
  preselectedServices: ("pflegebox" | "pflegegrad_beantrag_widerspruch" | "hilfsmittel" | "haushalt")[];
  contextNote: string;
}) {
  return (
    <aside
      className="relative mt-8 overflow-hidden rounded-2xl border border-neutral-200/95 bg-[linear-gradient(180deg,#fafcfc_0%,#ffffff_45%)] px-5 py-7 shadow-[0_2px_16px_-8px_rgba(15,79,104,0.12)] sm:px-8 sm:py-8"
      aria-labelledby={titleId}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0F4F68]/55 via-[#3d9aaa]/70 to-[#F78F2E]/70"
      />
      <h3 id={titleId} className="text-lg font-semibold tracking-tight text-[#0F4F68] sm:text-xl">
        {title}
      </h3>
      <div className="mt-3 text-[1.0625rem] leading-relaxed text-neutral-700">{body}</div>
      <RatgeberBeratungCtaButton
        className="mt-7 inline-flex min-h-[2.875rem] w-full items-center justify-center px-6 sm:w-auto"
        preselectedServices={preselectedServices}
        contextNote={contextNote}
      >
        {buttonText}
      </RatgeberBeratungCtaButton>
    </aside>
  );
}

export function KostenfreiePflegehilfsmittel42Article() {
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
            {[...KOSTENFREIE_PFLEGEHILFSMITTEL_42_TOC].map((e, i) => (
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

      <ArticleSectionHeading sectionNum="01" id="blick" isFirst heading="Das Wichtigste auf einen Blick">
        <FactsOverview42Table />
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="02" id="verbrauch" heading="Was sind Pflegehilfsmittel zum Verbrauch?">
        <p>
          Pflegehilfsmittel zum Verbrauch sind Produkte, die im Pflegealltag regelmäßig benötigt und meist nur einmal
          verwendet werden. Sie helfen dabei, die Pflege hygienischer, sicherer und einfacher zu machen.
        </p>
        <p className="mt-4">
          Sie schützen nicht nur die pflegebedürftige Person, sondern auch Angehörige, Betreuungskräfte und andere Helfer
          im Alltag.
        </p>
        <ArticleSubtitle eyebrow="Beispiele">Typische Pflegehilfsmittel zum Verbrauch</ArticleSubtitle>
        <ul className="mt-4 list-disc space-y-2 pl-[1.15rem] marker:text-[#0F4F68]">
          <li>Einmalhandschuhe</li>
          <li>Fingerlinge</li>
          <li>Händedesinfektion</li>
          <li>Flächendesinfektion</li>
          <li>Schutzschürzen</li>
          <li>Mundschutz</li>
          <li>FFP2-Masken</li>
          <li>Bettschutzeinlagen zum Einmalgebrauch</li>
          <li>Einmallätzchen</li>
        </ul>
        <p className="mt-4">
          Diese Produkte werden häufig täglich gebraucht. Gerade bei Inkontinenz, eingeschränkter Mobilität, Wundversorgung,
          Körperpflege oder häufigem Kontakt mit Körperflüssigkeiten können sie den Pflegealltag deutlich erleichtern.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="03" id="anspruch" heading="Wer hat Anspruch auf die 42 € Pflegehilfsmittel?">
        <p>Anspruch auf Pflegehilfsmittel zum Verbrauch besteht, wenn bestimmte Voraussetzungen erfüllt sind.</p>
        <p className="mt-4">Die pflegebedürftige Person muss:</p>
        <ul className="mt-3 list-disc space-y-2 pl-[1.15rem] marker:text-[#0F4F68]">
          <li>mindestens Pflegegrad 1 haben,</li>
          <li>zu Hause, in einer Wohngemeinschaft oder im betreuten Wohnen gepflegt werden,</li>
          <li>Pflegehilfsmittel für die häusliche Pflege benötigen,</li>
          <li>einen Antrag bei der Pflegekasse stellen oder stellen lassen.</li>
        </ul>
        <p className="mt-4">
          Wichtig ist: Der Anspruch besteht nicht nur bei hohen Pflegegraden. Bereits mit Pflegegrad 1 kann die monatliche
          Pflegehilfsmittelpauschale genutzt werden – siehe auch unseren Ratgeber{" "}
          <Link href="/ratgeber/pflegegrad-1" className={LINK}>
            Pflegegrad 1
          </Link>
          .
        </p>
        <p className="mt-4">
          Nicht gedacht ist diese Leistung in der Regel für Personen, die dauerhaft vollstationär in einem Pflegeheim
          versorgt werden. Dort ist die Einrichtung für viele Verbrauchsmaterialien zuständig.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="04" id="auszahlung" heading="Werden die 42 € direkt ausgezahlt?">
        <p>
          Die 42 € sind keine klassische Geldleistung wie das{" "}
          <Link href="/ratgeber/pflegegeldrechner" className={LINK}>
            Pflegegeld
          </Link>
          . Das bedeutet: Das Geld wird in der Regel nicht einfach monatlich auf das Konto überwiesen.
        </p>
        <p className="mt-4">Stattdessen gibt es meistens zwei Möglichkeiten.</p>
        <ArticleStepHeading>Möglichkeit 1: Selbst kaufen und erstatten lassen</ArticleStepHeading>
        <p className="mt-3">
          Sie kaufen die benötigten Pflegehilfsmittel selbst, zum Beispiel in einer Apotheke, Drogerie oder online.
          Anschließend reichen Sie die Belege bei der Pflegekasse ein. Die Pflegekasse kann dann Kosten bis maximal 42 € pro
          Monat erstatten.
        </p>
        <p className="mt-4">
          Diese Variante ist flexibel, bedeutet aber auch mehr Aufwand, weil Quittungen gesammelt und eingereicht werden
          müssen.
        </p>
        <ArticleStepHeading>Möglichkeit 2: Lieferung über einen Anbieter mit Direktabrechnung</ArticleStepHeading>
        <p className="mt-3">
          Viele Familien nutzen einen Anbieter, der die Pflegehilfsmittel regelmäßig liefert und direkt mit der Pflegekasse
          abrechnet. Dadurch muss die pflegebedürftige Person nicht jeden Monat selbst Belege einreichen.
        </p>
        <p className="mt-4">
          Diese Variante ist besonders praktisch, wenn regelmäßig ähnliche Produkte benötigt werden. Informationen zur
          praktischen Versorgung finden Sie auch auf unserer Seite{" "}
          <Link href="/pflegehilfsmittel/kostenfreie-pflegehilfsmittel" className={LINK}>
            Kostenfreie Pflegehilfsmittel
          </Link>{" "}
          und beim{" "}
          <Link href="/pflegehilfsmittel/pflegebox-konfigurator" className={LINK}>
            Pflegebox-Konfigurator
          </Link>
          .
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="05" id="beantragen" heading="So beantragen Sie kostenfreie Pflegehilfsmittel">
        <p>
          Der Antrag ist meist unkompliziert. Für Pflegehilfsmittel zum Verbrauch ist in der Regel kein ärztliches Rezept
          notwendig. Es reicht ein Antrag bei der Pflegekasse.
        </p>
        <ArticleStepHeading>Schritt 1: Pflegegrad prüfen</ArticleStepHeading>
        <p className="mt-3">
          Der Anspruch besteht erst ab Pflegegrad 1. Wer noch keinen Pflegegrad hat, sollte zunächst prüfen lassen, ob ein
          Pflegegrad beantragt werden kann.
        </p>
        <p className="mt-4">
          In unserem Ratgeber{" "}
          <Link href="/ratgeber/pflegegrad-beantragen" className={LINK}>
            Pflegegrad beantragen
          </Link>{" "}
          beschreiben wir den Ablauf Schritt für Schritt. Alltagshilfe-Süd unterstützt Familien dabei, den Antrag
          vorzubereiten und die nächsten Schritte zu verstehen.
        </p>
        <ArticleStepHeading>Schritt 2: Bedarf festlegen</ArticleStepHeading>
        <p className="mt-3">
          Überlegen Sie, welche Produkte im Alltag wirklich gebraucht werden. Nicht jede Pflegebox passt zu jeder
          Pflegesituation.
        </p>
        <p className="mt-4">Mögliche Fragen sind:</p>
        <ul className="mt-3 list-disc space-y-2 pl-[1.15rem] marker:text-[#0F4F68]">
          <li>Werden regelmäßig Einmalhandschuhe benötigt?</li>
          <li>Wird Desinfektionsmittel für Hände oder Flächen gebraucht?</li>
          <li>Sind Bettschutzeinlagen sinnvoll?</li>
          <li>Werden Schutzschürzen oder Masken benötigt?</li>
          <li>Gibt es besondere hygienische Anforderungen?</li>
        </ul>
        <ArticleStepHeading>Schritt 3: Antrag bei der Pflegekasse stellen</ArticleStepHeading>
        <p className="mt-3">
          Der Antrag wird bei der Pflegekasse der pflegebedürftigen Person gestellt. Das kann die pflegebedürftige Person
          selbst tun oder eine bevollmächtigte Person.
        </p>
        <p className="mt-4">Viele Anbieter übernehmen diesen Antrag ebenfalls im Rahmen der Direktversorgung.</p>
        <ArticleStepHeading>Schritt 4: Versorgung starten</ArticleStepHeading>
        <p className="mt-3">
          Nach der Genehmigung können die Pflegehilfsmittel regelmäßig bezogen werden – entweder durch eigene Einkäufe mit
          anschließender Erstattung oder über einen Anbieter mit Direktabrechnung.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading
        sectionNum="06"
        id="alltagshilfe"
        heading="Alltagshilfe-Süd hilft beim Antrag und bei der richtigen Einordnung"
      >
        <p>
          Gerade am Anfang ist oft unklar, welche Leistungen überhaupt zustehen. Viele Familien nutzen nur einen Teil der
          Möglichkeiten, obwohl deutlich mehr Unterstützung möglich wäre.
        </p>
        <p className="mt-4">Alltagshilfe-Süd hilft Ihnen dabei, Pflegeleistungen besser zu verstehen und sinnvoll zu nutzen.</p>
        <p className="mt-4">Wir unterstützen unter anderem bei:</p>
        <ul className="mt-3 list-disc space-y-2 pl-[1.15rem] marker:text-[#0F4F68]">
          <li>
            dem{" "}
            <Link href="/ratgeber/pflegegrad-beantragen" className={LINK}>
              Antrag auf einen Pflegegrad
            </Link>
            ,
          </li>
          <li>der Vorbereitung auf die Pflegebegutachtung,</li>
          <li>
            dem{" "}
            <Link href="/ratgeber/pflegegrad-beantragen#widerspruch" className={LINK}>
              Widerspruch
            </Link>
            , wenn der Pflegegrad abgelehnt oder zu niedrig eingestuft wurde,
          </li>
          <li>der Beantragung von Pflegehilfsmitteln,</li>
          <li>der passenden Versorgung mit Pflegehilfsmitteln,</li>
          <li>
            der{" "}
            <Link href="/pflegeshop#qualitaetsversprechen-pflegeshop" className={LINK}>
              Inkontinenzversorgung über Rezept
            </Link>
            ,
          </li>
          <li>
            der Nutzung des{" "}
            <Link href="/leistungen/haushaltshilfe" className={LINK}>
              Entlastungsbetrags
            </Link>
            ,
          </li>
          <li>
            der Organisation von{" "}
            <Link href="/leistungen/alltagsbegleitung-betreuung" className={LINK}>
              Alltagsbegleitung
            </Link>{" "}
            und{" "}
            <Link href="/leistungen/haushaltshilfe" className={LINK}>
              Haushaltshilfe
            </Link>
            ,
          </li>
          <li>
            der regelmäßigen{" "}
            <Link href="/pflegeberatung/private-pflegeberatung" className={LINK}>
              Pflegeberatung nach § 37.3 SGB XI
            </Link>{" "}
            im Rahmen der privaten Pflegeberatung.
          </li>
        </ul>

        <DezenteCtaBox
          title="Sie sind unsicher, welche Leistungen Ihnen zustehen?"
          titleId="cta-unsicher-leistungen"
          body={
            <>
              Alltagshilfe-Süd hilft Ihnen beim Pflegegrad-Antrag, beim Widerspruch und bei der passenden Versorgung mit
              Pflegehilfsmitteln.
            </>
          }
          buttonText="Jetzt unverbindlich beraten lassen"
          preselectedServices={["pflegebox", "pflegegrad_beantrag_widerspruch"]}
          contextNote="Ratgeber: 42 € Pflegehilfsmittel – Unsicherheit Leistungen"
        />
      </ArticleSectionHeading>

      <ArticleSectionHeading
        sectionNum="07"
        id="inkontinenz-unterschied"
        heading="Pflegehilfsmittel oder Inkontinenzversorgung: Was ist der Unterschied?"
      >
        <p>
          Pflegehilfsmittel zum Verbrauch und Inkontinenzprodukte werden häufig verwechselt. Dabei handelt es sich um
          unterschiedliche Leistungsbereiche.
        </p>
        <p className="mt-4">
          Die 42 € Pflegehilfsmittelpauschale gilt vor allem für Verbrauchsmaterialien wie Handschuhe, Desinfektionsmittel,
          Schutzschürzen oder Bettschutzeinlagen zum Einmalgebrauch.
        </p>
        <p className="mt-4">
          Körpernahe Inkontinenzprodukte wie Windeln, Pants oder Vorlagen laufen dagegen häufig über die Krankenkasse. Dafür
          wird in der Regel eine ärztliche Verordnung benötigt. Mehr dazu:{" "}
          <Link href="/pflegeshop#qualitaetsversprechen-pflegeshop" className={LINK}>
            Inkontinenzversorgung über Rezept
          </Link>
          .
        </p>
        <p className="mt-4">
          Alltagshilfe-Süd kann auch bei der Inkontinenzversorgung über Rezept unterstützen. Je nach Bedarf sind auch
          kostenlose Musterprodukte möglich, damit Betroffene nicht blind die falschen Produkte bestellen.
        </p>
        <PflegegradCallout variant="blue" title="Hinweis">
          <p>
            Bettschutzeinlagen können zu den Pflegehilfsmitteln gehören. Windeln, Pants und Vorlagen zählen dagegen meist zur
            Inkontinenzversorgung über die Krankenkasse.
          </p>
        </PflegegradCallout>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="08" id="lohnt-sich" heading="Warum sich der Antrag lohnt">
        <p>
          42 € im Monat wirken auf den ersten Blick vielleicht nicht riesig. Im Pflegealltag machen diese Produkte aber
          einen echten Unterschied.
        </p>
        <p className="mt-4">
          Wer regelmäßig Einmalhandschuhe, Desinfektion oder Bettschutzeinlagen kauft, merkt schnell, wie sich die Kosten
          summieren. Über ein Jahr gerechnet sind bis zu 504 € möglich.
        </p>
        <p className="mt-4">Außerdem sorgen die richtigen Pflegehilfsmittel für:</p>
        <ul className="mt-3 list-disc space-y-2 pl-[1.15rem] marker:text-[#0F4F68]">
          <li>mehr Hygiene,</li>
          <li>weniger Infektionsrisiko,</li>
          <li>mehr Sicherheit bei der Pflege,</li>
          <li>Entlastung für Angehörige,</li>
          <li>bessere Organisation im Alltag,</li>
          <li>weniger private Zusatzkosten.</li>
        </ul>
        <p className="mt-4">Der Anspruch sollte deshalb nicht ungenutzt bleiben.</p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="09" id="fehler" heading="Häufige Fehler bei Pflegehilfsmitteln">
        <ArticleStepHeading>Fehler 1: Der Anspruch wird gar nicht genutzt</ArticleStepHeading>
        <p className="mt-3">
          Viele Angehörige kaufen Pflegehilfsmittel privat, obwohl ein monatlicher Anspruch besteht. Dadurch entstehen
          unnötige Kosten.
        </p>
        <ArticleStepHeading>Fehler 2: Es werden unpassende Produkte bestellt</ArticleStepHeading>
        <p className="mt-3">
          Nicht jede fertige Pflegebox passt zur tatsächlichen Situation. Wer zum Beispiel keine Bettschutzeinlagen braucht,
          sollte den verfügbaren Betrag besser für andere Produkte nutzen.
        </p>
        <ArticleStepHeading>Fehler 3: Pflegehilfsmittel werden mit Inkontinenzprodukten verwechselt</ArticleStepHeading>
        <p className="mt-3">
          Pflegehilfsmittel und Inkontinenzversorgung sind nicht dasselbe. Deshalb sollte geprüft werden, welche Produkte
          über welchen Leistungsbereich laufen.
        </p>
        <ArticleStepHeading>Fehler 4: Nach einer Ablehnung wird nicht weiter nachgefragt</ArticleStepHeading>
        <p className="mt-3">
          Wenn ein Pflegegrad abgelehnt oder zu niedrig eingestuft wurde, kann ein Widerspruch sinnvoll sein. Alltagshilfe-Süd
          unterstützt Familien dabei, die Situation einzuschätzen und die nächsten Schritte vorzubereiten.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="10" id="kein-pflegegrad" heading="Was ist, wenn noch kein Pflegegrad vorhanden ist?">
        <p>
          Ohne Pflegegrad besteht kein Anspruch auf die 42 € Pflegehilfsmittelpauschale. Das bedeutet aber nicht, dass keine
          Unterstützung möglich ist.
        </p>
        <p className="mt-4">
          Wenn im Alltag bereits Hilfe benötigt wird, sollte geprüft werden, ob ein Pflegegrad beantragt werden kann. Das
          gilt besonders, wenn Unterstützung bei Körperpflege, Mobilität, Haushalt, Medikamenten, Orientierung oder
          Alltagsstruktur notwendig ist.
        </p>
        <p className="mt-4">
          Alltagshilfe-Süd hilft beim Beantragen eines Pflegegrads und unterstützt auch dann, wenn der Antrag abgelehnt
          wurde oder der bewilligte Pflegegrad zu niedrig erscheint.
        </p>
        <p className="mt-6 text-center text-[1.0625rem] leading-relaxed text-neutral-800 sm:text-left">
          <span className="font-semibold text-[#0F4F68]">Noch kein Pflegegrad vorhanden?</span>
          <br />
          Wir helfen Ihnen beim Antrag und prüfen gemeinsam, welche Unterstützung möglich ist.
        </p>
        <div className="mt-5 flex justify-center sm:justify-start">
          <RatgeberBeratungCtaButton
            className="inline-flex min-h-[2.875rem] min-w-[min(100%,18rem)] items-center justify-center px-6"
            preselectedServices={["pflegegrad_beantrag_widerspruch"]}
            contextNote="Ratgeber: 42 € Pflegehilfsmittel – kein Pflegegrad"
          >
            Beratung anfragen
          </RatgeberBeratungCtaButton>
        </div>
      </ArticleSectionHeading>

      <ArticleSectionHeading
        sectionNum="11"
        id="fazit-klein"
        heading="Kostenfreie Pflegehilfsmittel: kleine Hilfe, große Wirkung"
      >
        <p>
          Kostenfreie Pflegehilfsmittel im Wert von 42 € monatlich sind eine einfache, aber sehr hilfreiche Unterstützung im
          Pflegealltag. Sie sorgen für mehr Hygiene, mehr Sicherheit und weniger finanzielle Belastung.
        </p>
        <p className="mt-4">
          Wer bereits einen Pflegegrad hat und zu Hause gepflegt wird, sollte diesen Anspruch unbedingt prüfen. Wer noch
          keinen Pflegegrad hat, kann sich beraten lassen, ob ein Antrag sinnvoll ist.
        </p>
        <p className="mt-4">
          Alltagshilfe-Süd unterstützt Sie dabei, Pflegeleistungen richtig zu nutzen – vom Pflegegrad-Antrag über den
          Widerspruch bis zur passenden Versorgung mit Pflegehilfsmitteln, Inkontinenzprodukten, Entlastungsleistungen und
          Alltagshilfe. Ergänzend finden Sie passendes Sortiment im{" "}
          <Link href="/pflegeshop" className={LINK}>
            Pflegeshop
          </Link>
          .
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="12" id="faq-pflegehilfsmittel" heading="FAQ: Kostenfreie Pflegehilfsmittel">
        <PflegegradFaqAccordion items={KOSTENFREIE_PFLEGEHILFSMITTEL_42_FAQ} />
      </ArticleSectionHeading>

      <section
        id="abschluss-cta"
        className="mt-14 scroll-mt-28 rounded-2xl border border-[#0F4F68]/18 bg-[linear-gradient(165deg,#f9fcfc_0%,#ffffff_55%,#fafafa_100%)] px-5 py-8 sm:px-8"
        aria-labelledby="abschluss-cta-heading"
      >
        <h2 id="abschluss-cta-heading" className="text-xl font-semibold tracking-tight text-[#0F4F68] sm:text-2xl">
          Pflegehilfsmittel beantragen oder Pflegegrad prüfen lassen?
        </h2>
        <p className="mt-4 max-w-[40rem] text-[1.0625rem] leading-relaxed text-neutral-700">
          Alltagshilfe-Süd unterstützt Sie beim Antrag, beim Widerspruch und bei der passenden Versorgung im Alltag. Wir
          helfen Ihnen, Ihre Ansprüche zu verstehen und sinnvoll zu nutzen.
        </p>
        <RatgeberBeratungCtaButton
          className="mt-8 inline-flex min-h-[2.875rem] w-full items-center justify-center px-6 sm:w-auto"
          preselectedServices={["pflegebox", "pflegegrad_beantrag_widerspruch", "hilfsmittel"]}
          contextNote="Ratgeber: 42 € Pflegehilfsmittel – Abschluss-CTA"
        >
          Jetzt unverbindlich Kontakt aufnehmen
        </RatgeberBeratungCtaButton>
      </section>

      <section id="quellen" className="mt-14 scroll-mt-28 border-t border-neutral-200 pt-10">
        <h2 className="text-base font-semibold tracking-tight text-neutral-700">Quellen und fachliche Grundlagen</h2>
        <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-neutral-600">
          <li>
            <span className="text-neutral-700">§ 40 SGB XI</span> – Pflegehilfsmittel und wohnumfeldverbessernde Maßnahmen:{" "}
            <a
              href="https://www.sozialgesetzbuch-sgb.de/sgbxi/40.html"
              className={LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              sozialgesetzbuch-sgb.de
            </a>
          </li>
          <li>
            Bundesgesundheitsministerium – Pflegehilfsmittel:{" "}
            <a
              href="https://www.bundesgesundheitsministerium.de/themen/pflege/pflegepolitik/pflegehilfsmittel-und-wohnumfeldverbessernde-massnahmen.html"
              className={LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              bundesgesundheitsministerium.de
            </a>
          </li>
          <li>
            gesund.bund.de – Pflegehilfsmittel:{" "}
            <a
              href="https://www.gesund.bund.de/pflegehilfsmittel-und-wohnumfeldverbessernde-massnahmen"
              className={LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              gesund.bund.de
            </a>
          </li>
          <li>
            Verbraucherzentrale – Pflegehilfsmittel zum Verbrauch:{" "}
            <a
              href="https://www.verbraucherzentrale.de/wissen/gesundheit-pflege/pflegeantrag-und-leistungen/pflegehilfsmittel-zum-verbrauch-was-ist-drin-und-wer-bezahlt-11480"
              className={LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              verbraucherzentrale.de
            </a>
          </li>
          <li>
            GKV-Spitzenverband – Pflegehilfsmittelverzeichnis:{" "}
            <a
              href="https://www.gkv-spitzenverband.de/krankenversicherung/pflegeversicherung/pflegehilfsmittelverzeichnis/pflegehilfsmittelverzeichnis.jsp"
              className={LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              gkv-spitzenverband.de
            </a>
          </li>
        </ul>
        <p className="mt-8 text-[0.95rem] text-neutral-600">
          Hinweis: Dieser Ratgeber ersetzt keine Rechtsberatung und keine Entscheidung Ihrer Pflegekasse. Prüfen Sie
          Bescheide und Fristen im Einzelfall.
        </p>
      </section>

      <section className="mt-12 rounded-2xl border border-dashed border-neutral-200/95 bg-neutral-50/40 px-5 py-7 sm:px-7">
        <h2 className="text-lg font-semibold tracking-tight text-[#0F4F68]">Passende Themen</h2>
        <ul className="mt-5 list-none space-y-2.5 text-[1rem] text-neutral-800">
          <li>
            <Link href="/ratgeber/pflegegrad-beantragen" className={LINK}>
              Pflegegrad beantragen
            </Link>
          </li>
          <li>
            <Link href="/pflegehilfsmittel/kostenfreie-pflegehilfsmittel" className={LINK}>
              Kostenfreie Pflegehilfsmittel (Leistungsseite)
            </Link>
          </li>
          <li>
            <Link href="/ratgeber/pflegegeldrechner" className={LINK}>
              Pflegegeldrechner 2026
            </Link>
          </li>
          <li>
            <Link href="/pflegeberatung/private-pflegeberatung" className={LINK}>
              Private Pflegeberatung
            </Link>
          </li>
        </ul>
      </section>

      <div className="mt-14 lg:hidden">
        <RatgeberSidebarBeratungTeaser
          supportLine="Fragen zu Pflegehilfsmitteln, Pflegegrad oder Antrag?"
          preselectedServices={["pflegebox", "pflegegrad_beantrag_widerspruch"]}
          contextNote="Ratgeber: 42 € Pflegehilfsmittel (mobil)"
        />
      </div>
    </div>
  );
}
