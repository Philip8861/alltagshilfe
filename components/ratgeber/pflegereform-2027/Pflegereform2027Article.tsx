import Link from "next/link";
import type { ReactNode } from "react";

import { GtmKontaktNavLink } from "@/components/analytics/GtmContactIntentLink";
import { PflegegradFaqAccordion } from "@/components/ratgeber/pflegegrad-beantragen/PflegegradFaqAccordion";
import { PflegegradQuickAnswerBox } from "@/components/ratgeber/pflegegrad-beantragen/PflegegradQuickAnswerAndFacts";
import {
  ArticleSectionHeading,
  ArticleSubtitle,
  PflegegradCallout,
} from "@/components/ratgeber/pflegegrad-beantragen/pflegegrad-visual-primitives";
import {
  BETRIEBLICHE_PFLEGEBERATUNG_PATH,
  Pflegereform2027BetrieblichBenefitSection,
  Pflegereform2027BetrieblichCompactCta,
} from "@/components/ratgeber/pflegereform-2027/Pflegereform2027BetrieblichPromo";
import { PFLEGEREFORM_2027_STAND_LABEL } from "@/components/ratgeber/pflegereform-2027/Pflegereform2027Hero";
import { PFLEGEREFORM2027_ARTICLE_FAQ } from "@/components/ratgeber/pflegereform-2027/pflegereform2027-faq-data";
import { PFLEGEREFORM2027_ARTICLE_TOC_ENTRIES } from "@/components/ratgeber/pflegereform-2027/pflegereform2027-toc-config";
import { cn } from "@/lib/utils";

const PROSE = "text-[1.125rem] leading-[1.7] text-neutral-800";
const LINK = "font-medium text-[#0F4F68] underline-offset-2 hover:underline";

/** Hervorgehobene Kernaussage (wie im Magazin-Layout der Quelle). */
function PullQuote({ children, tone = "navy" }: { children: ReactNode; tone?: "navy" | "orange" }) {
  return (
    <blockquote
      className={cn(
        "relative my-7 rounded-2xl border px-5 py-5 sm:px-7 sm:py-6",
        tone === "orange"
          ? "border-[#F78F2E]/30 bg-[linear-gradient(160deg,#fffdfb_0%,#fff7f0_60%,#ffffff_100%)]"
          : "border-[#0F4F68]/16 bg-[linear-gradient(160deg,#f8fcfd_0%,#f2f9fa_55%,#ffffff_100%)]",
      )}
    >
      <span
        className={cn(
          "absolute left-0 top-4 bottom-4 w-[4px] rounded-full",
          tone === "orange" ? "bg-[#F78F2E]" : "bg-[#0F4F68]",
        )}
        aria-hidden
      />
      <p className="text-balance text-[1.2rem] font-semibold leading-snug text-[#0F4F68] sm:text-[1.3rem]">{children}</p>
    </blockquote>
  );
}

/** Einer der sieben Prüfpunkte: große Nummer, H3, Inhalt. */
function CheckPoint({
  num,
  id,
  title,
  children,
}: {
  num: number;
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-neutral-200/90 pt-9 first:border-t-0 first:pt-0" aria-labelledby={`${id}-heading`}>
      <div className="flex items-start gap-4 sm:gap-5">
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#F78F2E] text-xl font-black tabular-nums text-white shadow-[0_10px_22px_-14px_rgba(247,143,46,0.9)] sm:h-14 sm:w-14 sm:text-2xl"
          aria-hidden
        >
          {num}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#5a959e]">Prüfpunkt {num} von 7</p>
          <h3 id={`${id}-heading`} className="mt-1 text-balance text-[1.35rem] font-bold leading-snug tracking-tight text-[#0F4F68] sm:text-[1.5rem]">
            {title}
          </h3>
        </div>
      </div>
      <div className="mt-5 min-w-0 sm:pl-[4.75rem]">{children}</div>
    </section>
  );
}

function Bullets({ items, tone = "navy" }: { items: readonly string[]; tone?: "navy" | "orange" }) {
  return (
    <ul className="mt-4 list-none space-y-2.5">
      {items.map((t) => (
        <li key={t} className="flex gap-3">
          <span
            className={cn("mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full", tone === "orange" ? "bg-[#F78F2E]/85" : "bg-[#0F4F68]/50")}
            aria-hidden
          />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function Pflegereform2027Article() {
  return (
    <div className={cn(PROSE, "min-w-0")}>
      <details className="group mb-11 overflow-hidden rounded-2xl border border-neutral-200/95 bg-white shadow-[0_12px_40px_-28px_rgba(15,79,104,0.22)] lg:hidden">
        <summary className="relative cursor-pointer list-none px-4 py-3.5 text-sm font-semibold text-[#0F4F68] [&::-webkit-details-marker]:hidden">
          <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#0F4F68]/45 to-[#F78F2E]/35" />
          <span className="flex items-center justify-between gap-2">
            INHALT
            <span aria-hidden className="text-neutral-400 transition group-open:rotate-180">
              ⌄
            </span>
          </span>
        </summary>
        <nav className="border-t border-neutral-100 px-4 py-4" aria-label="Inhalt (mobil)">
          <ol className="space-y-2.5">
            {[...PFLEGEREFORM2027_ARTICLE_TOC_ENTRIES].map((e, i) => (
              <li key={e.id} className="flex gap-2 text-sm leading-snug">
                <span className="w-7 shrink-0 font-semibold tabular-nums text-[#F78F2E]">{String(i + 1).padStart(2, "0")}</span>
                <a href={`#${e.id}`} className={`${LINK} text-[0.9375rem]`}>
                  {e.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </details>

      {/* Einstieg */}
      <div className="mb-10 space-y-4 border-b border-neutral-100 pb-10">
        <p>Pflege verändert sich meistens nicht von heute auf morgen.</p>
        <p>
          Erst hilft man ein bisschen beim Einkauf. Dann bei den Medikamenten. Irgendwann beim Duschen, beim Anziehen
          oder nachts beim Aufstehen.
        </p>
        <p>Und trotzdem hört man in Familien erstaunlich oft diesen Satz:</p>
        <PullQuote tone="orange">„Es geht schon noch.“</PullQuote>
        <p>Genau deshalb lohnt es sich gerade jetzt, genauer hinzuschauen.</p>
        <p>
          Denn mit der geplanten Pflegereform 2027 könnten sich einige Regeln deutlich verändern. Noch ist nicht alles
          endgültig beschlossen. Aber wer heute schon Unterstützung braucht, sollte bestehende Ansprüche nicht aus
          Unsicherheit liegen lassen.
        </p>
      </div>

      <ArticleSectionHeading sectionNum="01" id="kurz-zusammengefasst" isFirst heading="Kurz zusammengefasst">
        <PflegegradQuickAnswerBox>
          <p>
            Am 30. September 2026 hat das Bundeskabinett den Entwurf des Pflegeneuordnungsgesetzes beschlossen. Die
            Reform ist damit noch kein geltendes Recht – einzelne Regelungen können sich im parlamentarischen Verfahren
            noch ändern.
          </p>
          <p className="mt-4">
            Geplant sind unter anderem höhere Schwellenwerte für die Pflegegrade 1 bis 3 (mit Besitzstandsschutz für
            bereits anerkannte Pflegegrade), der Wegfall des Entlastungsbetrags von 131 Euro bei Pflegegrad 1 und ein
            neues Sozialraumbudget von 175 Euro monatlich in den Pflegegraden 2 bis 5.
          </p>
          <p className="mt-4">
            Wer bereits Pflege benötigt, sollte 2026 deshalb sieben Dinge prüfen: Pflegegrad, offene Leistungen,
            Entlastungsbetrag, Verhinderungs- und Kurzzeitpflege, Vorbereitung der Begutachtung, offene Unterlagen –
            und rechtzeitig Beratung holen.
          </p>
        </PflegegradQuickAnswerBox>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="02" id="was-passiert" heading="Was bei der Pflegereform gerade wirklich passiert">
        <p>
          Am <strong className="font-semibold text-[#0F4F68]">30. September 2026</strong> hat das Bundeskabinett den
          Entwurf des neuen Pflegeneuordnungsgesetzes beschlossen.
        </p>
        <p className="mt-4">
          Das ist wichtig. Es bedeutet aber noch nicht, dass die Reform bereits geltendes Recht ist. Der Gesetzentwurf
          muss durch das weitere parlamentarische Verfahren. Dabei können sich einzelne Regelungen noch ändern.
        </p>
        <p className="mt-4 font-semibold text-[#0F4F68]">Der Handlungsdruck ist enorm.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { value: "6 Mio.+", label: "Menschen in Deutschland sind inzwischen pflegebedürftig" },
            { value: "7,6 Mrd. €", label: "rechnerisches Defizit der sozialen Pflegeversicherung 2027 ohne Gegenmaßnahmen" },
            { value: "15 Mrd. €+", label: "werden für 2028 genannt" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-[#0F4F68]/12 bg-[#f8fcfd] px-4 py-4">
              <p className="text-2xl font-extrabold tabular-nums tracking-tight text-[#0F4F68]">{s.value}</p>
              <p className="mt-1.5 text-sm leading-snug text-neutral-700">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-6">
          Die Reform soll deshalb Geld sparen, Leistungen neu ordnen und gleichzeitig die Versorgung sichern. Und genau
          hier wird es für Pflegebedürftige interessant.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="03" id="was-aendert-sich-2027" heading="Was sich 2027 ändern könnte">
        <p>Besonders wichtig sind drei Punkte.</p>
        <ol className="mt-5 space-y-4">
          {[
            {
              k: "Erstens",
              t: "Pflegegrade 1 bis 3",
              d: "Die Voraussetzungen für die Pflegegrade 1 bis 3 sollen verschärft werden. Die erforderlichen Schwellenwerte bei der Begutachtung sollen steigen. Für bereits anerkannte Pflegegrade ist allerdings ein Besitzstandsschutz vorgesehen. Niemand soll seinen Pflegegrad allein deshalb verlieren, weil die neuen Grenzwerte eingeführt werden.",
            },
            {
              k: "Zweitens",
              t: "Entlastungsbetrag und Sozialraumbudget",
              d: "Bei Pflegegrad 1 soll der heutige Entlastungsbetrag von 131 Euro monatlich entfallen. Stattdessen soll Pflegegrad 1 stärker auf Prävention, Beratung und Begleitung ausgerichtet werden. In den Pflegegraden 2 bis 5 soll der Entlastungsbetrag nach dem derzeitigen Entwurf in einem neuen Sozialraumbudget aufgehen. Vorgesehen sind dort 175 Euro monatlich.",
            },
            {
              k: "Drittens",
              t: "Neue Budgets für die häusliche Pflege",
              d: "Verschiedene Leistungen der häuslichen Pflege sollen in neuen Budgets zusammengefasst werden. Das soll das System einfacher und flexibler machen. Ob es sich für jede einzelne Familie tatsächlich besser anfühlt, wird sich aber erst in der Praxis zeigen.",
            },
          ].map((item) => (
            <li key={item.k} className="rounded-2xl border border-neutral-200/90 bg-white px-5 py-5 shadow-[0_2px_14px_-10px_rgba(15,79,104,0.18)] sm:px-6">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#5a959e]">{item.k}</p>
              <p className="mt-1 text-[1.15rem] font-bold leading-snug text-[#0F4F68]">{item.t}</p>
              <p className="mt-2.5 text-[1.0625rem] leading-relaxed text-neutral-800">{item.d}</p>
            </li>
          ))}
        </ol>
        <PullQuote>Deshalb unser Rat: Keine Panik. Aber bitte auch nicht einfach bis 2027 abwarten.</PullQuote>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="04" id="die-7-punkte" heading="Die 7 Dinge, die Sie noch 2026 prüfen sollten">
        <p>
          Sieben Prüfpunkte, die sich in den letzten Monaten des Jahres besonders lohnen – ruhig nacheinander
          durchgehen, am besten gemeinsam mit der Person, die den Pflegealltag wirklich kennt.
        </p>

        <div className="mt-9 space-y-9">
          <CheckPoint num={1} id="punkt-1-pflegegrad" title="Prüfen Sie jetzt, ob Ihr Pflegegrad noch passt">
            <p>
              Das ist wahrscheinlich der wichtigste Punkt. Ein Pflegegrad, der vor zwei oder drei Jahren festgestellt
              wurde, muss nicht mehr zur heutigen Situation passen.
            </p>
            <p className="mt-4">
              Vielleicht wird inzwischen mehr Hilfe beim Waschen benötigt. Vielleicht klappt das Anziehen nicht mehr
              allein. Vielleicht müssen Medikamente vorbereitet werden. Vielleicht hat sich eine Demenz verschlechtert.
              Oder die Nächte sind inzwischen so unruhig, dass Angehörige regelmäßig helfen müssen.
            </p>
            <p className="mt-4">
              Wenn der tatsächliche Unterstützungsbedarf deutlich gestiegen ist, kann ein Antrag auf Höherstufung
              sinnvoll sein.
            </p>
            <p className="mt-4">
              Das ist mit Blick auf die Pflegereform besonders relevant. Der aktuelle Gesetzentwurf sieht vor, dass
              grundsätzlich das Recht gelten soll, das zum Zeitpunkt der Antragstellung maßgeblich ist. Gleichzeitig
              sollen die Schwellenwerte für die Pflegegrade 1 bis 3 ab 2027 steigen.
            </p>
            <p className="mt-4">
              Sozialverbände und Patientenorganisationen raten deshalb Menschen mit bereits bestehendem Pflegebedarf,
              eine notwendige Antragstellung noch 2026 zu prüfen.
            </p>
            <p className="mt-4">Aber bitte nicht missverstehen:</p>
            <PullQuote tone="orange">
              Niemand sollte aus Angst vor der Reform einfach irgendeinen Höherstufungsantrag stellen.
            </PullQuote>
            <p>Entscheidend ist, ob sich der Pflegebedarf wirklich verändert hat.</p>
            <PflegegradCallout variant="blue" title="Alltagshilfe-Süd Tipp">
              <p>
                Unsicher, ob eine Höherstufung sinnvoll ist? Entscheidend ist der tatsächliche Hilfebedarf im Alltag.{" "}
                <Link href="/ratgeber/pflegegrad-beantragen" className={LINK}>
                  So funktioniert der Pflegegrad-Antrag Schritt für Schritt
                </Link>
                .
              </p>
            </PflegegradCallout>
          </CheckPoint>

          <CheckPoint num={2} id="punkt-2-pflegekasse" title="Fragen Sie Ihre Pflegekasse, welche Leistungen noch offen sind">
            <p>
              Pflegegeld. Entlastungsbetrag. Verhinderungspflege. Kurzzeitpflege. Ganz ehrlich: Wer soll da ohne
              weiteres noch alles im Kopf behalten?
            </p>
            <p className="mt-4">Deshalb darf die einfachste Frage des Jahres lauten:</p>
            <PullQuote>„Welche Leistungen und Beträge stehen uns aktuell noch zur Verfügung?“</PullQuote>
            <p>
              Lassen Sie sich von Ihrer Pflegekasse erklären, was 2026 bereits genutzt wurde und welche Ansprüche noch
              bestehen. Erst wenn Sie wissen, was vorhanden ist, können Sie sinnvoll planen.
            </p>
          </CheckPoint>

          <CheckPoint num={3} id="punkt-3-entlastungsbetrag" title="Schauen Sie nach Ihrem Entlastungsbetrag">
            <p>
              Bei häuslicher Pflege besteht derzeit ab Pflegegrad 1 ein Anspruch auf bis zu{" "}
              <strong className="font-semibold text-[#0F4F68]">131 Euro Entlastungsbetrag im Monat</strong>. Bei einem
              Anspruch für das gesamte Jahr sind das bis zu 1.572 Euro.
            </p>
            <p className="mt-4">
              Der Betrag kann beispielsweise für bestimmte anerkannte Unterstützungsangebote im Alltag verwendet
              werden. Er wird nicht einfach als zusätzliches Pflegegeld ausgezahlt, sondern ist zweckgebunden.
            </p>
            <p className="mt-4">
              Und hier gibt es einen wichtigen Unterschied: Nicht verbrauchte Beträge aus 2026 verschwinden nach
              geltendem Recht nicht automatisch am 31. Dezember. Sie können grundsätzlich in das erste Halbjahr 2027
              übertragen werden.
            </p>
            <p className="mt-4">
              Trotzdem lohnt es sich, jetzt nachzuschauen. Denn was bringt ein Anspruch auf dem Papier, wenn die
              Familie seit Monaten dringend Unterstützung im Haushalt oder bei der Betreuung bräuchte?
            </p>
            <PullQuote tone="orange">
              Es geht nicht darum, Geld um jeden Preis auszugeben. Es geht darum, benötigte Hilfe auch wirklich zu
              nutzen.
            </PullQuote>
            <PflegegradCallout variant="orange" title="Entlastungsbetrag sinnvoll einsetzen">
              <p>
                Haushaltshilfe, Alltagsbegleitung oder Betreuung über den Entlastungsbetrag – Alltagshilfe-Süd rechnet
                je nach Leistung direkt mit der Pflegekasse ab. Mehr dazu:{" "}
                <Link href="/leistungen/haushaltshilfe" className={LINK}>
                  Haushaltshilfe
                </Link>{" "}
                und{" "}
                <Link href="/leistungen/alltagsbegleitung-betreuung" className={LINK}>
                  Alltagsbegleitung &amp; Betreuung
                </Link>
                .
              </p>
            </PflegegradCallout>
          </CheckPoint>

          <CheckPoint num={4} id="punkt-4-verhinderungspflege" title="Verhinderungspflege und Kurzzeitpflege prüfen">
            <p>
              Pflegende Angehörige sind keine Maschinen. Auch sie werden krank. Sie brauchen Urlaub. Sie haben Termine.
              Und manchmal brauchen sie schlicht ein paar Tage, in denen nicht alles an ihnen hängt.
            </p>
            <p className="mt-4">
              Für Verhinderungspflege und Kurzzeitpflege gibt es seit Juli 2025 einen gemeinsamen Jahresbetrag.
              Pflegebedürftigen ab Pflegegrad 2 stehen dafür 2026 unter den gesetzlichen Voraussetzungen insgesamt bis
              zu <strong className="font-semibold text-[#0F4F68]">3.539 Euro pro Kalenderjahr</strong> zur Verfügung.
            </p>
            <p className="mt-4">
              Wichtig: Das sind nicht zweimal 3.539 Euro. Es handelt sich um einen gemeinsamen Betrag für beide
              Leistungen.
            </p>
            <p className="mt-4">
              Wer 2026 eine Vertretung der privaten Pflegeperson oder eine Kurzzeitpflege benötigt, sollte jetzt
              prüfen, wie viel davon bereits verbraucht wurde.
            </p>
            <p className="mt-4">Und nein:</p>
            <PullQuote>Man muss nicht erst völlig erschöpft zusammenbrechen, bevor Entlastung erlaubt ist.</PullQuote>
          </CheckPoint>

          <CheckPoint num={5} id="punkt-5-begutachtung" title="Bereiten Sie eine Pflegebegutachtung richtig vor">
            <p>
              Viele Menschen machen bei der Begutachtung etwas sehr Menschliches. Sie wollen zeigen, was noch
              funktioniert.
            </p>
            <p className="mt-4 italic text-neutral-700">
              „Das schaffe ich schon.“ „Meine Tochter hilft nur ein bisschen.“ „Nachts ist es meistens okay.“
            </p>
            <p className="mt-4">
              Das Problem ist: So kann der tatsächliche Hilfebedarf kleiner wirken, als er wirklich ist.
            </p>
            <p className="mt-4">
              Schreiben Sie deshalb vor einer Begutachtung auf, wobei regelmäßig Unterstützung benötigt wird.
            </p>
            <ArticleSubtitle>Fragen, die Sie vorab notieren sollten</ArticleSubtitle>
            <Bullets
              items={[
                "Wie klappt das Waschen und Anziehen?",
                "Wie oft wird nachts geholfen?",
                "Wer kümmert sich um Medikamente?",
                "Wie selbstständig ist die Person unterwegs?",
                "Gibt es Probleme mit Orientierung, Ängsten oder Gedächtnis?",
              ]}
            />
            <p className="mt-6">
              Halten Sie vorhandene Arztberichte und den Medikamentenplan bereit. Und wenn möglich, sollte die Person
              dabei sein, die den Pflegealltag tatsächlich kennt.
            </p>
            <p className="mt-4">Die wichtigste Regel:</p>
            <PullQuote tone="orange">Nichts übertreiben. Aber bitte auch nichts schönreden.</PullQuote>
          </CheckPoint>

          <CheckPoint num={6} id="punkt-6-papiercheck" title="Machen Sie einen kleinen Pflege-Papiercheck">
            <p>
              Ja, Pflege produziert Papier. Und meistens liegt die Rechnung genau dann irgendwo auf dem Küchentisch,
              wenn schon das nächste Problem wartet.
            </p>
            <p className="mt-4">Deshalb lohnt sich vor Jahresende ein kleiner Check:</p>
            <Bullets
              tone="orange"
              items={[
                "Sind noch Rechnungen einzureichen?",
                "Fehlen Nachweise?",
                "Gibt es Schreiben der Pflegekasse, die beantwortet werden müssen?",
                "Wurde bereits Ersatzpflege bezahlt, aber noch nicht zur Erstattung eingereicht?",
                "Gibt es vielleicht Leistungen, von denen Sie gar nicht wussten, dass sie genutzt werden können?",
              ]}
            />
            <p className="mt-6">Nicht jede Pflegeleistung hat dieselben Fristen.</p>
            <p className="mt-4">Im Zweifel gilt deshalb:</p>
            <PullQuote>Lieber einmal zu viel bei der Pflegekasse nachfragen als einen berechtigten Anspruch verschenken.</PullQuote>
          </CheckPoint>

          <CheckPoint num={7} id="punkt-7-beratung" title="Holen Sie sich Beratung, bevor gar nichts mehr geht">
            <p>Pflegeberatung sollte nicht erst dann beginnen, wenn eine Familie völlig am Limit ist.</p>
            <p className="mt-4">
              Vielleicht gibt es Unterstützungsmöglichkeiten, die bisher niemand erklärt hat. Vielleicht kann eine
              Alltagshilfe entlasten. Vielleicht kommt Tagespflege infrage. Vielleicht wird ein Hilfsmittel benötigt.
              Vielleicht passt der Pflegegrad nicht mehr.
            </p>
            <p className="mt-4">
              Manchmal sind es nicht die großen Lösungen, die den Unterschied machen. Manchmal sind es zwei Stunden
              Hilfe pro Woche.
            </p>
            <p className="mt-4">
              Zwei Stunden, in denen eingekauft, geputzt oder betreut wird. Zwei Stunden, in denen ein Angehöriger
              einfach einmal nicht verantwortlich sein muss.
            </p>
            <PullQuote tone="orange">Und genau das kann im Pflegealltag unglaublich viel sein.</PullQuote>
          </CheckPoint>
        </div>
      </ArticleSectionHeading>

      <ArticleSectionHeading
        sectionNum="05"
        id="betriebliche-pflegeberatung"
        heading="Wie Ihr Unternehmen Sie jetzt unterstützen kann"
      >
        <p>
          Viele Angehörige organisieren Pflegekasse, Anträge und Begutachtungen neben ihrem Beruf. Mit den Änderungen
          2027 wächst der Orientierungsbedarf. Genau hier können Arbeitgeber konkret entlasten.
        </p>
        <Pflegereform2027BetrieblichBenefitSection />
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="06" id="kritisch-beobachten" heading="Warum die Pflegereform trotzdem kritisch beobachtet werden muss">
        <p>
          Die Reform soll die Pflegeversicherung stabilisieren. Das ist notwendig. Aber eine Pflegeversicherung ist
          nicht nur eine Bilanz. Hinter jeder Zahl steht ein Mensch.
        </p>
        <p className="mt-4">
          Besonders deutlich wird das bei Pflegegrad 1. 131 Euro Entlastungsbetrag im Monat wirken in einer
          milliardenschweren politischen Debatte klein.
        </p>
        <p className="mt-4">
          Für einen älteren Menschen können sie aber bedeuten, dass jemand regelmäßig im Haushalt hilft. Dass Betreuung
          organisiert werden kann. Oder dass ein Angehöriger ein paar Stunden entlastet wird.
        </p>
        <p className="mt-4">Deshalb muss bei der Pflegereform immer gefragt werden:</p>
        <PullQuote>Was bedeutet eine Änderung im echten Alltag?</PullQuote>
        <p>
          Auch bei Pflegeheimen bleibt der Druck enorm. Zum 1. Juli 2026 lag die durchschnittliche monatliche
          Eigenbeteiligung im ersten Aufenthaltsjahr bundesweit bei{" "}
          <strong className="font-semibold text-[#0F4F68]">3.364 Euro</strong>. Ein Jahr zuvor waren es 3.108 Euro.
        </p>
        <p className="mt-4">Das zeigt, wie groß die Baustelle Pflege inzwischen geworden ist.</p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="07" id="fazit" heading="Unser Fazit zur Pflegereform 2027">
        <p>
          Sie müssen jetzt nicht hektisch werden. Aber vielleicht ist genau jetzt der richtige Zeitpunkt, den eigenen
          Pflegefall einmal ehrlich anzuschauen.
        </p>
        <div className="mt-6 rounded-2xl border border-[#0F4F68]/12 bg-[#fafcfb] p-6 shadow-inner sm:p-8">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#5a959e]">Checkliste zum Abhaken</p>
          <ul className="mt-4 space-y-3">
            {[
              "Passt der Pflegegrad noch?",
              "Welche Leistungen sind noch verfügbar?",
              "Wird der Entlastungsbetrag tatsächlich genutzt?",
              "Braucht die pflegende Person eine Vertretung oder Pause?",
              "Sind noch Rechnungen oder Anträge offen?",
            ].map((t) => (
              <li key={t} className="flex gap-3 text-[1.0625rem] leading-relaxed text-neutral-800">
                <span
                  className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded border border-[#0F4F68]/35 bg-white text-xs font-bold text-[#0F4F68]"
                  aria-hidden
                >
                  ☐
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-6">
          Pflege ist anstrengend genug. Niemand sollte zusätzlich auf Unterstützung verzichten, nur weil das System
          kompliziert ist oder ein Antrag seit Monaten aufgeschoben wird.
        </p>
        <p className="mt-4">
          Die Pflegereform 2027 ist noch nicht endgültig beschlossen. Wir verfolgen deshalb weiter, was Bundestag und
          Bundesrat tatsächlich beschließen und was davon am Ende bei Pflegebedürftigen und Angehörigen ankommt.
        </p>
        <p className="mt-4">
          Speichern Sie sich diesen Beitrag gerne ab. Sobald sich bei Pflegegraden, Entlastungsleistungen oder den
          neuen Budgets etwas verbindlich ändert, sollte auch die eigene Pflegesituation erneut geprüft werden.
        </p>
        <p className="mt-4">Denn am Ende zählt nicht, wie gut eine Reform auf dem Papier klingt.</p>
        <PullQuote tone="orange">Es zählt, ob Pflege für die Menschen im echten Leben ein Stück leichter wird.</PullQuote>
        <Pflegereform2027BetrieblichCompactCta
          eyebrow="Pflege und Beruf"
          title="Unterstützung, bevor alles zu viel wird."
          primaryLabel="Betriebliche Pflegeberatung"
        >
          <p>
            Eine feste, vertrauliche Ansprechperson entlastet pflegende Beschäftigte und ihre Arbeitgeber.
          </p>
        </Pflegereform2027BetrieblichCompactCta>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="08" id="faq-pflegereform-2027" heading="Häufige Fragen zur Pflegereform 2027">
        <PflegegradFaqAccordion items={PFLEGEREFORM2027_ARTICLE_FAQ} />
      </ArticleSectionHeading>

      <section
        id="stand-hinweis"
        className="mt-16 scroll-mt-28 rounded-2xl border border-neutral-200/90 bg-[linear-gradient(165deg,#f9fafb_0%,#ffffff_52%,#f7fafb_100%)] px-5 py-7 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85)] sm:px-8 sm:py-8"
      >
        <div className="flex flex-wrap items-end gap-3 gap-y-2 border-b border-neutral-200/85 pb-4">
          <h2 className="text-lg font-semibold tracking-tight text-[#0F4F68]">Stand und Hinweis</h2>
          <span
            aria-hidden
            className="mb-0.5 h-px min-w-[2.5rem] flex-1 rounded-full bg-gradient-to-r from-[#0F4F68]/25 to-transparent max-sm:hidden"
          />
        </div>
        <p className="mt-3 text-sm text-neutral-600">
          <strong className="text-neutral-900">Stand:</strong> {PFLEGEREFORM_2027_STAND_LABEL}
        </p>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-neutral-700">
          Dieser Beitrag gibt den Stand vom {PFLEGEREFORM_2027_STAND_LABEL} wieder. Das Pflegeneuordnungsgesetz wurde vom
          Bundeskabinett beschlossen, befindet sich aber noch im Gesetzgebungsverfahren. Geplante Regelungen können
          sich deshalb noch ändern. Wir aktualisieren diesen Bereich, sobald Bundestag und Bundesrat verbindlich
          entschieden haben.
        </p>
        <p className="mt-4 text-[0.95rem] text-neutral-600">
          Hinweis: Dieser Artikel dient der allgemeinen Orientierung und ersetzt keine individuelle Pflegeberatung oder
          Rechtsberatung.
        </p>
      </section>

      <section
        id="interne-links"
        className="mt-14 scroll-mt-28 rounded-2xl border border-dashed border-neutral-200/95 bg-neutral-50/50 px-5 py-8 sm:px-7"
      >
        <h2 className="text-lg font-semibold tracking-tight text-[#0F4F68]">Weiterführend im Überblick</h2>
        <p className="mt-3 text-[1rem] leading-relaxed text-neutral-600">
          Passende Angebote und Ratgeber auf Alltagshilfe-Süd zu den sieben Prüfpunkten.
        </p>
        <ul className="mt-6 list-none space-y-2 text-[1rem] text-neutral-800">
          {[
            { href: BETRIEBLICHE_PFLEGEBERATUNG_PATH, label: "Betriebliche Pflegeberatung – der Benefit für Unternehmen" },
            { href: "/ratgeber/pflegegrad-beantragen", label: "Pflegegrad beantragen – Schritt für Schritt" },
            { href: "/ratgeber/pflegegrad-1", label: "Pflegegrad 1: Leistungen und Entlastungsbetrag" },
            { href: "/ratgeber/pflegegeldrechner", label: "Pflegegeldrechner 2026" },
            { href: "/leistungen/haushaltshilfe", label: "Haushaltshilfe über den Entlastungsbetrag" },
            { href: "/leistungen/alltagsbegleitung-betreuung", label: "Alltagsbegleitung und Betreuung" },
            { href: "/kontakt", label: "Kontakt" },
            { href: "/ratgeber", label: "Alle Ratgeber-Beiträge" },
          ].map((item) => (
            <li key={item.href}>
              {item.href === "/kontakt" ? (
                <GtmKontaktNavLink
                  href={item.href}
                  contactPath="ratgeber_pflegereform2027_weiterfuehrend_kontakt_nav"
                  sourceComponent="Pflegereform2027Article"
                  service="ratgeber"
                  className={`${LINK} inline-flex items-center gap-2 py-1`}
                >
                  <span className="h-6 w-1 shrink-0 rounded-full bg-gradient-to-b from-[#0F4F68] to-[#4a93a8]" aria-hidden />
                  {item.label}
                </GtmKontaktNavLink>
              ) : (
                <Link href={item.href} className={`${LINK} inline-flex items-center gap-2 py-1`}>
                  <span className="h-6 w-1 shrink-0 rounded-full bg-gradient-to-b from-[#0F4F68] to-[#4a93a8]" aria-hidden />
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
