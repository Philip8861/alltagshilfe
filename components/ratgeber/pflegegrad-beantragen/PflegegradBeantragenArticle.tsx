import Link from "next/link";

import { RatgeberSidebarBeratungTeaser } from "@/components/ratgeber/RatgeberBeratungDialog";
import { PflegegradChecklistSection } from "@/components/ratgeber/pflegegrad-beantragen/PflegegradChecklistSection";
import { PflegegradFaqAccordion } from "@/components/ratgeber/pflegegrad-beantragen/PflegegradFaqAccordion";
import { PflegegradLeistungenMatrix } from "@/components/ratgeber/pflegegrad-beantragen/PflegegradLeistungenMatrix";
import {
  PflegegradFactsOverviewTable,
  PflegegradQuickAnswerBox,
} from "@/components/ratgeber/pflegegrad-beantragen/PflegegradQuickAnswerAndFacts";
import { PflegegradServiceSupportSection } from "@/components/ratgeber/pflegegrad-beantragen/PflegegradServiceSupportSection";
import { PflegegradStepsTimeline } from "@/components/ratgeber/pflegegrad-beantragen/PflegegradStepsTimeline";
import { PFLEGEGRAD_ARTICLE_FAQ } from "@/components/ratgeber/pflegegrad-beantragen/pflegegrad-beantragen-faq-data";
import { PFLEGEGRAD_ARTICLE_TOC_ENTRIES } from "@/components/ratgeber/pflegegrad-beantragen/pflegegrad-toc-config";
import {
  ArticleSectionHeading,
  ArticleStepHeading,
  ArticleSubtitle,
  PflegegradCallout,
} from "@/components/ratgeber/pflegegrad-beantragen/pflegegrad-visual-primitives";
import { cn } from "@/lib/utils";

const PROSE = "text-[1.125rem] leading-[1.7] text-neutral-800";
const LINK = "font-medium text-[#0F4F68] underline-offset-2 hover:underline";

export function PflegegradBeantragenArticle() {
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
            {[...PFLEGEGRAD_ARTICLE_TOC_ENTRIES].map((e, i) => (
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

      <div className="mb-11 lg:hidden">
        <RatgeberSidebarBeratungTeaser
          supportLine="Sie möchten Unterstützung beim Pflegegrad-Antrag?"
          preselectedServices={["pflegegrad_beantrag_widerspruch"]}
          contextNote="Ratgeber: Pflegegrad beantragen (mobil)"
        />
      </div>

      <ArticleSectionHeading sectionNum="01" id="kurzantwort" isFirst heading="Kurzantwort">
        <PflegegradQuickAnswerBox>
          <p>
            Einen Pflegegrad beantragen Sie bei der Pflegekasse der betroffenen Person. Die Pflegekasse ist bei der
            jeweiligen Krankenkasse angesiedelt. Nach dem Antrag beauftragt die Pflegekasse in der Regel den Medizinischen
            Dienst oder andere unabhängige Gutachter mit der Begutachtung. Entscheidend ist, wie selbstständig die
            betroffene Person ihren Alltag noch bewältigen kann.
          </p>
        </PflegegradQuickAnswerBox>
      </ArticleSectionHeading>

      <ArticleSectionHeading
        sectionNum="02"
        id="wann-beantragen"
        heading="Wann sollte man einen Pflegegrad beantragen?"
      >
        <p>
          Ein Pflegegrad sollte beantragt werden, sobald regelmäßig Unterstützung im Alltag notwendig wird. Viele
          Angehörige warten zu lange, weil sie zunächst „einfach mithelfen“ und die zunehmende Belastung als
          selbstverständlich ansehen. Dadurch werden mögliche Leistungen oft später genutzt, als es eigentlich möglich wäre.
        </p>
        <p className="mt-4">
          Typische Anzeichen für einen möglichen Pflegegrad sind, wenn die betroffene Person Hilfe beim Waschen, Duschen,
          Anziehen, Essen oder Trinken benötigt. Auch Schwierigkeiten beim Aufstehen, Gehen, Treppensteigen oder bei der
          Orientierung können wichtig sein. Ebenso relevant sind vergessene Medikamente, Probleme bei Arztterminen,
          Unsicherheit im Haushalt, Inkontinenz, nächtliche Unruhe, Sturzgefahr oder ein zunehmender Betreuungsbedarf.
        </p>
        <p className="mt-4">
          Ein Pflegegrad kommt nicht nur bei körperlichen Einschränkungen infrage. Auch Demenz, psychische Erkrankungen,
          kognitive Einschränkungen, Orientierungslosigkeit oder starke Probleme bei der Alltagsorganisation können eine
          Rolle spielen.
        </p>
        <p className="mt-4">
          Aus der Praxis: Viele Familien beantragen den Pflegegrad erst, wenn die Belastung bereits sehr hoch ist. Besser
          ist es, frühzeitig prüfen zu lassen, ob ein Anspruch bestehen könnte. Alltagshilfe-Süd kann Sie bei der ersten
          Einschätzung, beim Antrag und bei der Vorbereitung auf die Begutachtung unterstützen.
        </p>

        <ArticleSubtitle eyebrow="Überblick">Das Wichtigste auf einen Blick</ArticleSubtitle>
        <PflegegradFactsOverviewTable />
      </ArticleSectionHeading>

      <ArticleSectionHeading
        sectionNum="03"
        id="schritt-fuer-schritt"
        heading="Schritt für Schritt zum Pflegegrad"
      >
        <PflegegradStepsTimeline />

        <ArticleStepHeading>Schritt 1: Pflegekasse kontaktieren</ArticleStepHeading>
        <p className="mt-3">
          Der erste Schritt ist die Kontaktaufnahme mit der Pflegekasse. Sie können dort anrufen und sagen:
        </p>
        <blockquote className="relative my-6 overflow-hidden rounded-xl border border-[#0F4F68]/14 bg-[linear-gradient(135deg,#f9fcfc_0%,#ffffff_52%,#fafafa_100%)] px-[1.15rem] py-4 shadow-[inset_0_1px_0_0_rgba(15,79,104,0.06)] not-italic before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-full before:bg-gradient-to-b before:from-[#0F4F68] before:to-[#3d8ea0]/80 before:content-[''] md:px-6 md:py-[1.1rem]">
          „Ich möchte für Frau/Herrn [Name] Leistungen der Pflegeversicherung beantragen und bitte um Prüfung eines
          Pflegegrades.“
        </blockquote>
        <p>
          Dieser Satz reicht in der Regel aus, damit das Verfahren angestoßen wird. Bitten Sie um eine schriftliche
          Bestätigung des Antragseingangs. Notieren Sie sich außerdem Datum, Uhrzeit und den Namen der Person, mit der Sie
          gesprochen haben.
        </p>
        <p className="mt-4">
          Das Antragsdatum ist wichtig, weil Leistungen der Pflegeversicherung grundsätzlich nur auf Antrag gewährt werden.
        </p>

        <ArticleStepHeading>Schritt 2: Antragsformular ausfüllen</ArticleStepHeading>
        <p className="mt-3">
          Nach der ersten Kontaktaufnahme sendet die Pflegekasse meist ein Formular zu. Darin werden persönliche Daten,
          Versicherungsnummer, Wohnsituation, behandelnde Ärzte, Angaben zur Pflegeperson und gewünschte Leistungen
          abgefragt.
        </p>
        <p className="mt-4">
          Füllen Sie das Formular sorgfältig aus und senden Sie es zeitnah zurück. Wenn Angehörige den Antrag stellen oder
          für die betroffene Person handeln, sollte eine Vollmacht vorliegen. Falls eine gesetzliche Betreuung besteht,
          sollte der Betreuerausweis bereitliegen.
        </p>
        <p className="mt-4">
          Tipp: Wenn Sie unsicher sind, welche Angaben wichtig sind, lassen Sie sich unterstützen – etwa in der{" "}
          <Link href="/pflegeberatung/private-pflegeberatung" className={LINK}>
            privaten Pflegeberatung
          </Link>
          .
        </p>

        <ArticleStepHeading>Schritt 3: Unterlagen sammeln</ArticleStepHeading>
        <p className="mt-3">
          Je besser die Situation dokumentiert ist, desto nachvollziehbarer wird der tatsächliche Hilfebedarf. Sammeln Sie
          deshalb vor der Begutachtung wichtige Unterlagen.
        </p>
        <p className="mt-4">
          Hilfreich sind Arztberichte, Krankenhausberichte, Reha-Berichte, Diagnosen, Medikamentenpläne, Entlassbriefe,
          Therapieberichte, vorhandene Pflegedokumentationen, Schwerbehindertenausweis, Vollmacht oder Betreuerausweis und
          eigene Notizen zum Alltag.
        </p>
        <p className="mt-4">
          Besonders hilfreich ist ein <strong>Pflegetagebuch</strong>. Darin wird über mehrere Tage notiert, wobei
          Unterstützung notwendig ist. Schreiben Sie nicht nur allgemein „Hilfe beim Waschen“, sondern möglichst konkret:
          „Morgens Hilfe beim Aufstehen, Waschen des Rückens, Anziehen der Kompressionsstrümpfe und Erinnerung an
          Medikamente.“
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading
        sectionNum="04"
        id="begutachtung-vorbereiten"
        heading="Begutachtung vorbereiten"
      >
        <ArticleStepHeading>Schritt 4: Begutachtungstermin vorbereiten</ArticleStepHeading>
        <p className="mt-3">
          Nach Antragstellung meldet sich der Medizinische Dienst beziehungsweise die zuständige Gutachterstelle zur
          Begutachtung. Die Begutachtung findet in der Regel bei der betroffenen Person zu Hause statt. Dadurch soll die
          Alltagssituation besser eingeschätzt werden können.
        </p>
        <p className="mt-4">
          Bei der Begutachtung sollte möglichst eine vertraute Person dabei sein. Viele Betroffene stellen ihre
          Einschränkungen unbewusst zu positiv dar. Manche möchten nicht zur Last fallen, andere schämen sich oder vergessen
          wichtige Details. Angehörige können dann ergänzen, wie der Alltag wirklich aussieht.
        </p>
        <p className="mt-4">
          Wichtig ist, den normalen Alltag zu beschreiben – nicht den besten Tag. Wenn es gute und schlechte Tage gibt,
          sollten beide Seiten erklärt werden.
        </p>

        <PflegegradCallout variant="blue" title="Praxis-Tipp zur Vorbereitung">
          <p>
            Notieren Sie typische Hilfen mit Uhrzeit und Häufigkeit (z. B. „3× wöchentlich Einkaufen“). So wird sichtbar,
            was im Alltag wirklich anfällt – für Gutachter und oft auch für die Familie leichter zu benennen.
          </p>
        </PflegegradCallout>

        <ArticleSubtitle id="was-wird-begutachtet" eyebrow="Begutachtung">
          Was wird bei der Pflegebegutachtung geprüft?
        </ArticleSubtitle>
        <p className="mt-4">
          Bei der Pflegebegutachtung geht es nicht allein um Krankheiten oder Diagnosen. Entscheidend ist, wie selbstständig
          die betroffene Person im Alltag ist. Der Medizinische Dienst bewertet verschiedene Lebensbereiche.
        </p>
        <p className="mt-4">
          Geprüft werden unter anderem Mobilität, kognitive und kommunikative Fähigkeiten, Verhaltensweisen und psychische
          Problemlagen, Selbstversorgung, der Umgang mit krankheits- oder therapiebedingten Anforderungen sowie die
          Gestaltung des Alltagslebens und sozialer Kontakte.
        </p>
        <p className="mt-4">
          Zur Mobilität gehört zum Beispiel, ob die Person aufstehen, sich umsetzen, gehen oder Treppen steigen kann. Bei den
          kognitiven und kommunikativen Fähigkeiten geht es darum, ob Personen, Orte, Zeiten und Situationen erkannt werden
          und ob Bedürfnisse mitgeteilt werden können. Im Bereich Selbstversorgung wird geprüft, ob Körperpflege, Duschen,
          Anziehen, Essen, Trinken und Toilettengänge selbstständig möglich sind.
        </p>
        <p className="mt-4">
          Auch der Umgang mit Medikamenten, Verbänden, Arztterminen, Therapien oder Messungen kann wichtig sein. Ebenso spielt
          eine Rolle, ob die Person ihren Tagesablauf selbst planen und gestalten kann.
        </p>
        <p className="mt-4">
          Aus diesen Bewertungen entsteht ein Gesamtpunktwert. Ab 12,5 Punkten liegt Pflegebedürftigkeit im Sinne der
          Pflegeversicherung vor.
        </p>

        <ArticleStepHeading>Schritt 5: Bescheid prüfen</ArticleStepHeading>
        <p className="mt-3">
          Nach der Begutachtung erhält die Pflegekasse das Gutachten und entscheidet über den Pflegegrad. Anschließend
          bekommen Sie einen Bescheid. In diesem steht, ob ein Pflegegrad bewilligt wurde und welcher Pflegegrad anerkannt
          wird.
        </p>
        <p className="mt-4">
          Prüfen Sie den Bescheid und das Gutachten sorgfältig. Achten Sie darauf, ob alle Einschränkungen korrekt
          berücksichtigt wurden. Wenn der Pflegegrad aus Ihrer Sicht zu niedrig ist oder der Antrag abgelehnt wurde, können
          Sie Widerspruch einlegen.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="05" id="pflegegrade-leistungen" heading="Pflegegrade & Leistungen 2026">
        <p>
          Die Pflegegrade reichen von Pflegegrad 1 bis Pflegegrad 5. Sie richten sich nach dem Grad der Beeinträchtigung der
          Selbstständigkeit oder Fähigkeiten.
        </p>
        <ul className="mt-6 divide-y divide-neutral-200/90 rounded-xl border border-neutral-200/95 bg-[linear-gradient(180deg,#fafcfc_0%,#ffffff_40%)] px-0 py-0 shadow-[0_1px_0_0_rgba(15,79,104,0.04)] sm:px-1">
          <li className="px-4 py-3.5 first:rounded-t-xl sm:px-5">
            <strong className="text-[#0F4F68]">Pflegegrad 1:</strong> 12,5 bis unter 27 Punkte – geringe Beeinträchtigung der
            Selbstständigkeit oder Fähigkeiten.
          </li>
          <li className="px-4 py-3.5 sm:px-5">
            <strong className="text-[#0F4F68]">Pflegegrad 2:</strong> 27 bis unter 47,5 Punkte – erhebliche Beeinträchtigung.
          </li>
          <li className="px-4 py-3.5 sm:px-5">
            <strong className="text-[#0F4F68]">Pflegegrad 3:</strong> 47,5 bis unter 70 Punkte – schwere Beeinträchtigung.
          </li>
          <li className="px-4 py-3.5 sm:px-5">
            <strong className="text-[#0F4F68]">Pflegegrad 4:</strong> 70 bis unter 90 Punkte – schwerste Beeinträchtigung.
          </li>
          <li className="px-4 py-3.5 last:rounded-b-xl sm:px-5">
            <strong className="text-[#0F4F68]">Pflegegrad 5:</strong> 90 bis 100 Punkte – schwerste Beeinträchtigung mit
            besonderen Anforderungen an die pflegerische Versorgung.
          </li>
        </ul>
        <p className="mt-4">Die Einstufung entscheidet darüber, welche Leistungen der Pflegeversicherung genutzt werden können.</p>

        <ArticleSubtitle eyebrow="Leistungen">Welche Leistungen können nach einem Pflegegrad wichtig werden?</ArticleSubtitle>
        <p className="mt-4">
          Welche Leistungen genutzt werden können, hängt vom Pflegegrad und von der Versorgungssituation ab. Für die häusliche
          Pflege sind besonders Pflegegeld, Pflegesachleistungen, der Entlastungsbetrag, Pflegehilfsmittel, Verhinderungspflege,
          Wohnraumanpassung und Beratungsleistungen wichtig.
        </p>
        <p className="mt-4">2026 gelten nach aktueller Übersicht unter anderem folgende monatliche Beträge:</p>
        <PflegegradLeistungenMatrix />
        <ul className="mt-8 list-none space-y-3">
          <li>
            <strong className="text-[#0F4F68]">Entlastungsbetrag:</strong> Pflegegrad 1 bis 5 – bis zu 131 Euro monatlich.
          </li>
          <li>
            <strong className="text-[#0F4F68]">Pflegehilfsmittel zum Verbrauch:</strong> Pflegegrad 1 bis 5 – bis zu 42 Euro
            monatlich, wenn die Voraussetzungen erfüllt sind.
          </li>
          <li>
            <strong className="text-[#0F4F68]">Wohnumfeldverbessernde Maßnahmen:</strong> Pflegegrad 1 bis 5 – bis zu 4.180 Euro
            je Maßnahme, wenn die Voraussetzungen erfüllt sind.
          </li>
        </ul>
        <p className="mt-4">
          Der Entlastungsbetrag kann für anerkannte Unterstützungsangebote im Alltag genutzt werden. Je nach Situation kann er
          zum Beispiel für Entlastungsleistungen, Alltagsbegleitung oder Hilfe im Haushalt relevant sein. Alltagshilfe-Süd kann
          Sie dazu beraten und unterstützt bei passenden Leistungen.
        </p>
        <p className="mt-4">
          Gut zu wissen: Nach einem anerkannten Pflegegrad können auch Pflegehilfsmittel, Inkontinenzversorgung über Rezept,
          private Pflegeberatung, Unterstützung im Haushalt, Alltagsbegleitung, Ersatzpflege beziehungsweise Verhinderungspflege
          oder Essen auf Rädern wichtig werden. Alltagshilfe-Süd hilft Ihnen dabei, passende Leistungen zu verstehen und sinnvoll
          zu nutzen.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="06" id="haeufige-fehler" heading="Häufige Fehler beim Pflegegrad-Antrag">
        <p>
          Ein häufiger Fehler ist, den Hilfebedarf zu verharmlosen. Viele Menschen sagen beim Termin: „Das geht schon noch.“
          Für die Einstufung ist aber entscheidend, was regelmäßig tatsächlich nicht mehr selbstständig gelingt.
        </p>
        <p className="mt-4">
          Ein weiterer Fehler ist, nur körperliche Einschränkungen zu erwähnen. Auch Vergesslichkeit, Orientierungslosigkeit,
          nächtliche Unruhe, Angst, Antriebslosigkeit, Überforderung, Demenz oder fehlende Tagesstruktur können für die
          Begutachtung wichtig sein.
        </p>
        <p className="mt-4">
          Auch fehlende Beispiele sind problematisch. Allgemeine Aussagen wie „braucht Hilfe“ sind zu ungenau. Besser ist: „Die
          Medikamente müssen täglich vorbereitet und kontrolliert werden, weil die Einnahme sonst vergessen oder doppelt
          erfolgen kann.“
        </p>
        <p className="mt-4">
          Viele Familien bereiten außerdem keine Unterlagen vor. Dadurch fehlen wichtige Nachweise. Sammeln Sie deshalb
          Arztberichte, Medikamentenpläne und eigene Notizen rechtzeitig.
        </p>
        <p className="mt-4">
          Ein weiterer Fehler ist, den Bescheid ungeprüft zu akzeptieren. Wenn der Pflegegrad abgelehnt oder zu niedrig
          erscheint, sollte das Gutachten genau gelesen werden.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="07" id="widerspruch" heading="Wenn der Pflegegrad abgelehnt wird">
        <p>
          Wenn die Pflegekasse keinen Pflegegrad bewilligt oder der Pflegegrad zu niedrig erscheint, können Sie Widerspruch
          einlegen. Die Frist beträgt grundsätzlich einen Monat ab Zugang des Bescheids. In der Regel steht die Frist auch in
          der Rechtsbehelfsbelehrung des Bescheids.
        </p>

        <PflegegradCallout variant="orange" title="Widerspruchsfrist nicht verpassen">
          <p>
            Sichern Sie die Frist gegen ein zu knappes Datum: Auf dem Bescheid finden Sie Hinweise zur Widerspruchsfrist –
            häufig ein Monat ab Zugang. Ein kurzes Fristwahrschreiben kann genügen („Widerspruch wird begründet nachgereicht“).
          </p>
        </PflegegradCallout>

        <p className="mt-4">
          Wichtig ist zuerst, die Frist zu sichern. Dafür kann zunächst ein kurzer Widerspruch reichen. Die ausführliche
          Begründung kann nachgereicht werden.
        </p>
        <p className="mt-4">Eine mögliche Formulierung lautet:</p>
        <blockquote className="relative my-6 overflow-hidden rounded-xl border border-[#0F4F68]/14 bg-neutral-50/80 px-[1.15rem] py-4 pl-6 italic text-neutral-800 shadow-[inset_0_1px_0_0_rgba(15,79,104,0.05)] before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-[#F78F2E]/80 before:content-[''] md:px-6 md:py-[1rem] md:pl-7">
          „Hiermit lege ich fristgerecht Widerspruch gegen den Bescheid vom [Datum] ein. Eine ausführliche Begründung reiche ich
          nach. Bitte senden Sie mir das vollständige Gutachten zu.“
        </blockquote>
        <p>
          Danach sollte das Gutachten sorgfältig geprüft werden. Welche Einschränkungen wurden nicht oder nicht ausreichend
          berücksichtigt? Stimmen die Angaben zur Selbstständigkeit? Wurden kognitive, psychische oder nächtliche
          Belastungen richtig erfasst? Gibt es neue Arztberichte oder zusätzliche Nachweise?
        </p>
        <p className="mt-4">
          Alltagshilfe-Süd unterstützt Sie auch beim Widerspruch, wenn der Pflegegrad abgelehnt wurde oder aus Ihrer Sicht zu
          niedrig eingestuft ist. Wir helfen dabei, den Bescheid besser zu verstehen, den tatsächlichen Hilfebedarf zu
          erfassen und die nächsten Schritte zu planen.
        </p>
      </ArticleSectionHeading>

      <section
        aria-labelledby="praxis-heading"
        className="mt-16 scroll-mt-28 rounded-2xl border border-neutral-200/90 bg-[linear-gradient(165deg,#fafcfc_0%,#ffffff_55%,#f8fafb_100%)] p-6 shadow-[0_1px_0_0_rgba(15,79,104,0.05)] sm:p-8"
      >
        <div className="flex flex-wrap items-center gap-3 gap-y-2 border-b border-neutral-200/80 pb-4">
          <span className="rounded-md border border-[#F78F2E]/35 bg-[#fff9f4] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[#b85a1a]">
            Fall
          </span>
          <h2 id="praxis-heading" className="text-[1.15rem] font-semibold leading-snug text-[#0F4F68] sm:text-[1.25rem]">
            Praxisbeispiel: Warum Vorbereitung so wichtig ist
          </h2>
        </div>
        <p className="mt-4">
          Frau Müller ist 82 Jahre alt und lebt allein. Ihre Tochter hilft täglich beim Einkaufen, bei Medikamenten, beim
          Duschen, bei der Wäsche und bei Arztterminen. Beim Begutachtungstermin sagt Frau Müller mehrmals: „Ich komme
          eigentlich gut zurecht.“
        </p>
        <p className="mt-4">
          Ohne Vorbereitung könnte dadurch der Eindruck entstehen, dass nur wenig Hilfe nötig ist. Hat die Tochter jedoch
          vorher notiert, wobei regelmäßig Unterstützung gebraucht wird, entsteht ein deutlich realistischeres Bild.
        </p>
        <p className="mt-4">
          Dann wird sichtbar, dass Frau Müller beim Duschen nicht sicher stehen kann, Medikamente nicht zuverlässig einnimmt,
          Einkäufe nicht mehr selbst erledigt, Termine vergisst, nachts unsicher ist und die Wohnung nicht mehr allein sauber
          halten kann.
        </p>
        <p className="mt-4">
          Genau darum geht es bei der Begutachtung: nicht um einen einzelnen guten Moment, sondern um den tatsächlichen Alltag.
        </p>
      </section>

      <ArticleSectionHeading
        sectionNum="08"
        id="unterstuetzung-ahs"
        heading="Unterstützung durch Alltagshilfe-Süd"
        className="mt-16 sm:mt-20"
      >
        <PflegegradCallout variant="orange" title="Service-Hinweis">
          <p>
            Alltagshilfe-Süd kann bei Antragstellung, Dokumentation, Gesprächsvorbereitung und bei der späteren Organisation
            der Versorgung begleiten. Pflege­beratung erfolgt privat organisiert unter{" "}
            <Link href="/pflegeberatung/private-pflegeberatung" className={LINK}>
              privater Pflegeberatung
            </Link>{" "}
            – nicht im Rahmen betrieblicher Pflegeangebote des Arbeitgebers.
          </p>
        </PflegegradCallout>

        <p className="mt-6">
          Ein Pflegegrad-Antrag ist für viele Familien der Beginn einer neuen Lebensphase. Neben dem Antrag selbst geht es oft
          darum, den Alltag neu zu organisieren: Wer hilft im Haushalt? Welche Leistungen können genutzt werden? Welche
          Hilfsmittel sind sinnvoll? Wie können Angehörige entlastet werden?
        </p>
        <p className="mt-4">
          Alltagshilfe-Süd unterstützt Pflegebedürftige und Angehörige je nach Situation bei der Beantragung eines Pflegegrades,
          bei der Vorbereitung auf die Begutachtung und beim Widerspruch, wenn der Pflegegrad abgelehnt oder zu niedrig
          eingestuft wurde.
        </p>
        <p className="mt-4">
          Außerdem helfen wir bei der{" "}
          <Link href="/pflegeberatung/private-pflegeberatung" className={LINK}>
            privaten Pflegeberatung
          </Link>
          , bei der Nutzung des Entlastungsbetrags, bei Haushaltsreinigung, Alltagsbegleitung und Betreuung, bei Ersatzpflege
          beziehungsweise Verhinderungspflege, bei Pflegehilfsmitteln im Wert von bis zu 42 Euro monatlich und bei der
          Inkontinenzversorgung über Rezept.
        </p>
        <p className="mt-4">
          Über unseren{" "}
          <Link href="/pflegeshop" className={LINK}>
            Pflegeshop
          </Link>{" "}
          erhalten Sie außerdem passende Produkte für die Versorgung zu Hause. Zusätzlich können wir bei Bedarf zu weiteren
          Lösungen wie Hausnotruf, Treppenlift oder begehbarer Dusche über unsere Kooperationspartner informieren.
        </p>
        <p className="mt-4">Die Abrechnung ist bei passenden Leistungen über alle Kranken- und Pflegekassen möglich.</p>

        <div className="mt-10">
          <PflegegradServiceSupportSection />
        </div>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="09" id="checkliste" heading="Checkliste">
        <p className="-mt-1 text-neutral-700">So behalten Sie den Überblick – Schritt für Schritt abhaken:</p>
        <PflegegradChecklistSection />
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="10" id="faq-pflegegrad" heading="Häufige Fragen">
        <PflegegradFaqAccordion items={PFLEGEGRAD_ARTICLE_FAQ} />
      </ArticleSectionHeading>

      <PflegegradQuellenSection />
      <PflegegradRelatedSection />
    </div>
  );
}

function PflegegradQuellenSection() {
  return (
    <section
      id="quellen-pflegegrad"
      className="mt-16 rounded-2xl border border-neutral-200/90 bg-[linear-gradient(165deg,#f9fafb_0%,#ffffff_52%,#f7fafb_100%)] px-5 py-7 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85)] sm:px-8 sm:py-8"
    >
      <div className="flex flex-wrap items-end gap-3 gap-y-2 border-b border-neutral-200/85 pb-4">
        <h2 id="quellen-stand-heading" className="scroll-mt-28 text-lg font-semibold tracking-tight text-[#0F4F68]">
          Quellen &amp; Stand
        </h2>
        <span
          aria-hidden
          className="mb-0.5 h-px min-w-[2.5rem] flex-1 rounded-full bg-gradient-to-r from-[#0F4F68]/25 to-transparent max-sm:hidden"
        />
      </div>
      <p className="mt-3 text-sm text-neutral-600">
        <strong className="text-neutral-900">Stand:</strong> April 2026
      </p>
      <p className="mt-2 text-sm text-neutral-600">
        <strong className="text-neutral-900">Fachliche Grundlage:</strong> Bundesgesundheitsministerium, Medizinischer Dienst
        Bund, Verbraucherzentrale, SGB XI.
      </p>
      <ul className="mt-5 list-none space-y-3 text-[0.95rem] text-neutral-700">
        <li>
          Bundesgesundheitsministerium: Pflegebedürftig – was nun?{" "}
          <a
            href="https://www.bundesgesundheitsministerium.de/themen/pflege/online-ratgeber-pflege/pflegebeduerftig-was-nun"
            className={LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            bundesgesundheitsministerium.de
          </a>
        </li>
        <li>
          Bundesgesundheitsministerium: Leistungsansprüche der Versicherten im Jahr 2026 (PDF){" "}
          <a
            href="https://www.bundesgesundheitsministerium.de/fileadmin/Dateien/3_Downloads/P/Pflegeversicherung_Leistungsbeitraege/Uebersicht_Leistungsbetraege_2026.pdf"
            className={LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            Übersicht (PDF)
          </a>
        </li>
        <li>
          Medizinischer Dienst Bund: Fragen und Antworten zur Pflegebegutachtung{" "}
          <a
            href="https://md-bund.de/themen/pflegebeduerftigkeit-und-pflegebegutachtung/fragen-und-antworten.html"
            className={LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            md-bund.de
          </a>
        </li>
        <li>
          Verbraucherzentrale: Pflegegrad abgelehnt – Widerspruch und Klage{" "}
          <a
            href="https://www.verbraucherzentrale.de/wissen/gesundheit-pflege/pflegeantrag-und-leistungen/pflegegrad-abgelehnt-so-wehren-sie-sich-mit-widerspruch-und-klage-11547"
            className={LINK}
            target="_blank"
            rel="noopener noreferrer"
          >
            verbraucherzentrale.de
          </a>
        </li>
        <li>
          SGB XI §33 Leistungsvoraussetzungen{" "}
          <a href="https://www.sozialgesetzbuch-sgb.de/sgbxi/33.html" className={LINK} target="_blank" rel="noopener noreferrer">
            sozialgesetzbuch-sgb.de
          </a>
        </li>
      </ul>
      <p className="mt-8 text-[0.95rem] text-neutral-600">
        Hinweis: Dieser Artikel dient der allgemeinen Orientierung und ersetzt keine individuelle Pflegeberatung oder
        Rechtsberatung.
      </p>
    </section>
  );
}

function PflegegradRelatedSection() {
  const items = [
    "Entlastungsbetrag 2026",
    "Pflegegeld 2026",
    "Pflegehilfsmittel zum Verbrauch",
    "Pflegegrad abgelehnt: Widerspruch",
    "Pflegeberatung nach §37.3 SGB XI",
  ];
  return (
    <section className="mt-14 rounded-2xl border border-dashed border-neutral-200/95 bg-neutral-50/40 px-5 py-8 sm:px-7">
      <h2 className="text-lg font-semibold tracking-tight text-[#0F4F68]">Verwandte Themen</h2>
      <p className="mt-3 text-[1rem] leading-relaxed text-neutral-600">
        Weitere vertiefende Artikel folgen sukzessive. Aktuell finden Sie in der{" "}
        <Link href="/ratgeber" className={LINK}>
          Ratgeber-Übersicht
        </Link>{" "}
        unsere weiteren Beiträge.
      </p>
      <ul className="mt-6 list-none space-y-2 text-[1rem] text-neutral-800">
        {items.map((t) => (
          <li
            key={t}
            className="flex gap-3 rounded-lg border border-transparent py-1.5 pl-1 hover:border-neutral-200/90 hover:bg-white"
          >
            <span className="mt-2 h-6 w-1 shrink-0 rounded-full bg-gradient-to-b from-[#0F4F68] to-[#4a93a8]" aria-hidden />
            <span className="leading-relaxed">{t}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
