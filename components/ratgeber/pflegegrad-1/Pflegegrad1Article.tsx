import Link from "next/link";

import { PflegegradFaqAccordion } from "@/components/ratgeber/pflegegrad-beantragen/PflegegradFaqAccordion";
import { PflegegradQuickAnswerBox } from "@/components/ratgeber/pflegegrad-beantragen/PflegegradQuickAnswerAndFacts";
import { PFLEGEGRAD1_ARTICLE_FAQ } from "@/components/ratgeber/pflegegrad-1/pflegegrad1-faq-data";
import { PFLEGEGRAD1_ARTICLE_TOC_ENTRIES } from "@/components/ratgeber/pflegegrad-1/pflegegrad1-toc-config";
import { Pflegegrad1LeistungenTable } from "@/components/ratgeber/pflegegrad-1/Pflegegrad1LeistungenTable";
import {
  ArticleSectionHeading,
  ArticleStepHeading,
  ArticleSubtitle,
  PflegegradCallout,
} from "@/components/ratgeber/pflegegrad-beantragen/pflegegrad-visual-primitives";
import { cn } from "@/lib/utils";

const PROSE = "text-[1.125rem] leading-[1.7] text-neutral-800";
const LINK = "font-medium text-[#0F4F68] underline-offset-2 hover:underline";

export function Pflegegrad1Article() {
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
            {[...PFLEGEGRAD1_ARTICLE_TOC_ENTRIES].map((e, i) => (
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

      <div className="mb-10 space-y-4 border-b border-neutral-100 pb-10">
        <p>
          Pflegegrad 1 ist oft der erste Schritt in die Unterstützung durch die Pflegeversicherung. Er wird vergeben,
          wenn ein Mensch noch vieles selbstständig schafft, im Alltag aber bereits spürbare Einschränkungen bestehen.
          Genau deshalb wird Pflegegrad 1 häufig unterschätzt: Es geht noch nicht um umfangreiche Pflege, aber sehr wohl um
          Entlastung, Sicherheit und rechtzeitige Vorsorge.
        </p>
        <p>
          Wer Pflegegrad 1 hat, erhält zwar kein Pflegegeld und keine klassischen Pflegesachleistungen wie bei höheren
          Pflegegraden. Trotzdem gibt es wichtige Ansprüche, die den Alltag deutlich erleichtern können: den monatlichen
          Entlastungsbetrag, Pflegehilfsmittel, Zuschüsse für Wohnraumanpassungen, Beratung, Pflegekurse und unter
          bestimmten Voraussetzungen auch technische Hilfsmittel wie einen Hausnotruf.
        </p>
        <p>
          In diesem Ratgeber erfahren Sie, wann Pflegegrad 1 vergeben wird, welche Leistungen möglich sind, welche
          Missverständnisse häufig entstehen und wie Alltagshilfe-Süd Sie bei Antrag, Widerspruch, Entlastungsbetrag,
          Haushaltshilfe und weiteren Unterstützungsleistungen begleiten kann.
        </p>
      </div>

      <ArticleSectionHeading sectionNum="01" id="zusammenfassung" isFirst heading="Kurze Zusammenfassung">
        <PflegegradQuickAnswerBox>
          <p>
            Pflegegrad 1 bedeutet eine geringe Beeinträchtigung der Selbstständigkeit oder der Fähigkeiten. Er wird
            vergeben, wenn im Pflegegutachten mindestens 12,5 und weniger als 27 Gesamtpunkte erreicht werden.
          </p>
          <p className="mt-4">
            Die wichtigste monatliche Leistung ist der Entlastungsbetrag von bis zu 131 Euro. Dieser Betrag kann zum Beispiel
            für anerkannte Unterstützung im Alltag, Betreuung, Haushaltshilfe oder bestimmte Leistungen zugelassener Anbieter
            genutzt werden.
          </p>
          <p className="mt-4">
            Pflegegeld gibt es bei Pflegegrad 1 nicht. Auch klassische Pflegesachleistungen, Verhinderungspflege und der
            reguläre Leistungsbetrag für Kurzzeitpflege stehen grundsätzlich erst ab Pflegegrad 2 zur Verfügung.
          </p>
          <p className="mt-4">
            Trotzdem lohnt sich Pflegegrad 1 sehr: Er schafft Zugang zu Beratung, Pflegehilfsmitteln, möglichen
            Wohnraumanpassungen und frühen Entlastungsangeboten. Gerade bei beginnender Pflegebedürftigkeit kann dadurch viel
            Stabilität entstehen.
          </p>
        </PflegegradQuickAnswerBox>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="02" id="was-ist-pflegegrad-1" heading="Was bedeutet Pflegegrad 1?">
        <p>
          Pflegegrad 1 beschreibt eine Situation, in der ein Mensch noch weitgehend selbstständig lebt, aber im Alltag erste
          regelmäßige Unterstützung benötigt. Das kann zum Beispiel bei körperlichen Einschränkungen, Unsicherheit beim
          Gehen, beginnender Vergesslichkeit, chronischen Erkrankungen oder nachlassender Belastbarkeit der Fall sein.
        </p>
        <p className="mt-4">
          Wichtig ist: Pflegegrad 1 bedeutet nicht, dass bereits jeden Tag umfangreiche Pflege notwendig sein muss. Es reicht,
          wenn die Selbstständigkeit messbar eingeschränkt ist und die betroffene Person in bestimmten Lebensbereichen Hilfe,
          Anleitung, Beaufsichtigung oder Entlastung benötigt.
        </p>
        <ArticleSubtitle id="beispiele-pg1">Typische Beispiele</ArticleSubtitle>
        <ul className="mt-4 list-none space-y-2.5">
          {[
            "Eine ältere Person kann sich grundsätzlich selbst versorgen, braucht aber Unterstützung im Haushalt.",
            "Das Duschen oder Baden wird unsicher, weil Sturzgefahr besteht.",
            "Termine, Medikamente oder Alltagsorganisation werden zunehmend schwierig.",
            "Angehörige merken, dass regelmäßige Hilfe nötig wird, obwohl die betroffene Person vieles noch alleine schafft.",
            "Die Wohnung muss angepasst werden, damit die Person sicher zu Hause bleiben kann.",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F4F68]/50" aria-hidden />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          Pflegegrad 1 ist deshalb oft ein Frühwarnsignal. Er zeigt: Es besteht noch kein hoher Pflegebedarf, aber der
          Alltag sollte jetzt gut organisiert werden, damit die Selbstständigkeit möglichst lange erhalten bleibt.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="03" id="voraussetzungen" heading="Voraussetzungen und Begutachtung">
        <p>
          Ob Pflegegrad 1 bewilligt wird, entscheidet die Pflegekasse auf Grundlage einer Begutachtung. Bei gesetzlich
          Versicherten wird in der Regel der Medizinische Dienst beauftragt. Bei privat Versicherten erfolgt die
          Begutachtung durch Medicproof.
        </p>
        <p className="mt-4">
          Die Gutachterin oder der Gutachter schaut nicht nur darauf, welche Diagnosen vorliegen. Entscheidend ist vor allem,
          wie selbstständig die Person im Alltag noch ist. Bewertet werden sechs Lebensbereiche:
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#0F4F68]">
          <li>Mobilität</li>
          <li>Kognitive und kommunikative Fähigkeiten</li>
          <li>Verhaltensweisen und psychische Problemlagen</li>
          <li>Selbstversorgung</li>
          <li>Umgang mit krankheits- oder therapiebedingten Anforderungen</li>
          <li>Gestaltung des Alltagslebens und sozialer Kontakte</li>
        </ol>
        <p className="mt-4">
          Aus diesen Bereichen entsteht ein Gesamtpunktwert. Für Pflegegrad 1 müssen mindestens 12,5 und weniger als 27 Punkte
          erreicht werden.
        </p>
        <p className="mt-4">
          Wichtig für Angehörige: Bereiten Sie die Begutachtung gut vor. Viele Menschen stellen ihre Einschränkungen im
          Termin unbewusst besser dar, als sie im Alltag wirklich sind. Deshalb sollte vorher notiert werden, wobei
          regelmäßig Hilfe nötig ist. Auch kleine Dinge zählen, wenn sie wiederkehrend auftreten.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="04" id="leistungen-tabelle" heading="Leistungen bei Pflegegrad 1">
        <p>
          Bei Pflegegrad 1 gibt es weniger Geldleistungen als bei höheren Pflegegraden. Trotzdem bestehen mehrere wichtige
          Ansprüche. Die folgende Übersicht hilft bei der Einordnung und ist auf dem Smartphone als Kartenansicht lesbar.
        </p>
        <Pflegegrad1LeistungenTable />
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="05" id="entlastungsbetrag" heading="Der Entlastungsbetrag bei Pflegegrad 1">
        <p>
          Der Entlastungsbetrag ist die zentrale Leistung bei Pflegegrad 1. Er beträgt bis zu 131 Euro pro Monat. Das ergibt
          bis zu 1.572 Euro pro Jahr.
        </p>
        <p className="mt-4">
          Der Betrag wird nicht einfach an die pflegebedürftige Person ausgezahlt. Er ist zweckgebunden. Das bedeutet: Es
          müssen anerkannte Leistungen genutzt und anschließend mit der Pflegekasse abgerechnet werden. Je nach Anbieter kann
          die Abrechnung auch direkt über die Pflegekasse erfolgen.
        </p>
        <ArticleSubtitle>Typische Verwendungszwecke</ArticleSubtitle>
        <ul className="mt-4 list-none space-y-2.5">
          {[
            "Unterstützung im Haushalt",
            "Alltagsbegleitung",
            "Betreuung",
            "Hilfe bei Einkäufen oder Alltagsorganisation",
            "anerkannte Angebote zur Unterstützung im Alltag",
            "bestimmte Leistungen zugelassener Pflege- oder Betreuungsdienste",
            "Tages- oder Nachtpflege",
            "Kurzzeitpflege",
            "bei Pflegegrad 1 auch für körperbezogene Unterstützung durch zugelassene Pflegedienste, zum Beispiel Hilfe beim Duschen oder Baden",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F78F2E]/80" aria-hidden />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          Gerade der letzte Punkt ist wichtig: Bei den Pflegegraden 2 bis 5 ist der Entlastungsbetrag nicht für
          körperbezogene Selbstversorgung gedacht. Bei Pflegegrad 1 gibt es hier aber eine besondere Ausnahme, wenn
          zugelassene Pflegedienste eingesetzt werden.
        </p>
        <p className="mt-4">
          Nicht verbrauchte Beträge können in die Folgemonate übertragen werden. Beträge, die am Ende eines Kalenderjahres
          noch nicht genutzt wurden, können in der Regel noch bis zum 30. Juni des Folgejahres verwendet werden.
        </p>
        <PflegegradCallout variant="blue" title="Alltagshilfe-Süd Tipp">
          <p>
            Viele Familien lassen den Entlastungsbetrag ungenutzt, weil sie nicht wissen, welche Leistungen anerkannt sind
            oder wie die Abrechnung funktioniert. Alltagshilfe-Süd kann helfen, passende Unterstützung im Alltag zu
            organisieren und zu prüfen, wie der Entlastungsbetrag sinnvoll eingesetzt werden kann.
          </p>
        </PflegegradCallout>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="06" id="haushalt-alltag" heading="Haushaltshilfe und Alltagsbegleitung bei Pflegegrad 1">
        <p>
          Für viele Menschen mit Pflegegrad 1 ist nicht die medizinische Pflege das größte Problem, sondern der Alltag. Die
          Wohnung sauber halten, Wäsche erledigen, einkaufen, Termine organisieren oder regelmäßig jemanden an der Seite
          haben – all das kann mit der Zeit schwerer werden.
        </p>
        <p className="mt-4">
          Hier kann der Entlastungsbetrag besonders sinnvoll sein. Wenn die Leistung anerkannt ist und die Voraussetzungen
          erfüllt sind, kann er für Unterstützung im Haushalt oder für Alltagsbegleitung genutzt werden.
        </p>
        <p className="mt-4 font-medium text-[#0F4F68]">Alltagshilfe-Süd unterstützt je nach Situation unter anderem bei:</p>
        <ul className="mt-3 list-none space-y-2">
          {[
            "Haushaltsreinigung",
            "Alltagsbegleitung und Betreuung",
            "Einkäufen und alltäglicher Organisation",
            "Entlastung von Angehörigen",
            "Orientierung, welche Leistungen über die Pflegekasse abgerechnet werden können",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F4F68]/45" aria-hidden />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          Wichtig ist, dass die Leistung zur jeweiligen Pflegesituation passt und korrekt mit der Pflegekasse abgestimmt wird.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="07" id="pflegehilfsmittel" heading="Pflegehilfsmittel bei Pflegegrad 1">
        <p>
          Menschen mit Pflegegrad 1 können Anspruch auf Pflegehilfsmittel haben. Besonders wichtig sind Pflegehilfsmittel
          zum Verbrauch. Dafür können bis zu 42 Euro monatlich übernommen werden.
        </p>
        <p className="mt-4">Dazu gehören je nach Bedarf zum Beispiel:</p>
        <ul className="mt-3 list-none space-y-2">
          {["Einmalhandschuhe", "Bettschutzeinlagen", "Schutzschürzen", "Händedesinfektion", "Flächendesinfektion"].map(
            (t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F4F68]/45" aria-hidden />
                <span>{t}</span>
              </li>
            ),
          )}
        </ul>
        <p className="mt-6">
          Diese Hilfsmittel können Angehörige entlasten und die häusliche Versorgung hygienischer und sicherer machen.
          Passende Produkte finden Sie auch im{" "}
          <Link href="/pflegeshop" className={LINK}>
            Pflegeshop
          </Link>{" "}
          von Alltagshilfe-Süd. Hintergrund zur Pauschale:{" "}
          <Link href="/pflegehilfsmittel/kostenfreie-pflegehilfsmittel" className={LINK}>
            Kostenfreie Pflegehilfsmittel (42 Euro monatlich)
          </Link>
          .
        </p>
        <p className="mt-4">
          Falls Inkontinenz eine Rolle spielt, sollte zusätzlich geprüft werden, ob eine Inkontinenzversorgung über Rezept
          möglich ist. Informationen dazu bietet unsere Seite zur{" "}
          <Link href="/inkontinenzversorgung" className={LINK}>
            Inkontinenzversorgung
          </Link>
          ; in einem persönlichen Gespräch können wir prüfen, ob kostenlose Musterprodukte infrage kommen.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading
        sectionNum="08"
        id="wohnraum-technik"
        heading="Wohnraumanpassung, Hausnotruf, Treppenlift und begehbare Dusche"
      >
        <p>
          Pflegegrad 1 ist oft der richtige Zeitpunkt, um die Wohnung sicherer zu machen. Denn viele Probleme entstehen nicht
          erst durch schwere Pflegebedürftigkeit, sondern durch Stürze, Barrieren und Unsicherheit im Alltag.
        </p>
        <p className="mt-4">Mögliche Maßnahmen können sein:</p>
        <ul className="mt-3 list-none space-y-2">
          {[
            "Haltegriffe im Bad",
            "Entfernung von Stolperfallen",
            "rutschhemmende Lösungen",
            "bessere Beleuchtung",
            "Anpassungen im Badezimmer",
            "begehbare Dusche",
            "Treppenlift",
            "Hausnotruf",
            "Pflegebett oder andere technische Pflegehilfsmittel, wenn notwendig",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F4F68]/45" aria-hidden />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          Für wohnumfeldverbessernde Maßnahmen kann die Pflegekasse unter bestimmten Voraussetzungen bis zu 4.180 Euro je
          Maßnahme als Zuschuss zahlen. Wichtig ist, solche Maßnahmen möglichst vor Beginn bei der Pflegekasse zu beantragen.
        </p>
        <p className="mt-4">
          Alltagshilfe-Süd kann in diesem Zusammenhang auf{" "}
          <Link href="/kooperation" className={LINK}>
            Kooperationspartner
          </Link>{" "}
          für Hausnotruf, Treppenlift und begehbare Dusche hinweisen. Die konkrete Bewilligung hängt immer von der
          Pflegekasse und der individuellen Situation ab.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="09" id="was-nicht" heading="Was gibt es bei Pflegegrad 1 nicht?">
        <p>
          Bei Pflegegrad 1 entstehen häufig Missverständnisse. Viele Menschen erwarten eine monatliche Geldzahlung. Diese
          gibt es aber nicht.
        </p>
        <p className="mt-4">Bei Pflegegrad 1 gibt es in der Regel kein:</p>
        <ul className="mt-3 list-none space-y-2">
          {[
            "Pflegegeld",
            "reguläres Budget für Pflegesachleistungen",
            "reguläres Budget für Verhinderungspflege",
            "reguläres Budget für Kurzzeitpflege wie ab Pflegegrad 2",
            "reguläres Budget für Tages- und Nachtpflege wie ab Pflegegrad 2",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" aria-hidden />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          Das bedeutet aber nicht, dass Pflegegrad 1 wertlos ist. Im Gegenteil: Er öffnet den Zugang zu wichtigen frühen
          Hilfen. Besonders der Entlastungsbetrag, Pflegehilfsmittel, Beratung und Wohnraumanpassung können sehr wertvoll
          sein.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="10" id="antrag" heading="Pflegegrad 1 beantragen: So gehen Sie vor">
        <p>
          Pflegegrad 1 muss bei der Pflegekasse beantragt werden. Die Pflegekasse ist bei der Krankenkasse angesiedelt. Der
          Antrag kann meist telefonisch, schriftlich, online oder formlos gestellt werden.
        </p>
        <ArticleSubtitle>Ablauf in der Übersicht</ArticleSubtitle>
        <ol className="mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-[#0F4F68]">
          <li>Antrag bei der Pflegekasse stellen</li>
          <li>Termin zur Begutachtung erhalten</li>
          <li>Alltagssituation vorbereiten und Hilfebedarf notieren</li>
          <li>Begutachtung zu Hause oder in bestimmten Fällen anderweitig durchführen lassen</li>
          <li>Bescheid der Pflegekasse abwarten</li>
          <li>Gutachten prüfen</li>
          <li>Bei Ablehnung oder zu niedrigem Pflegegrad einen Widerspruch prüfen</li>
        </ol>
        <p className="mt-6">
          Für die Vorbereitung ist ein Pflegetagebuch hilfreich. Darin sollte festgehalten werden, wobei im Alltag Hilfe
          nötig ist, wie häufig Unterstützung erforderlich wird und welche Risiken bestehen. Dazu zählen auch Dinge wie
          Unsicherheit beim Treppensteigen, Vergesslichkeit, Sturzangst, Probleme mit Medikamenten oder Überforderung bei
          Behörden- und Alltagsthemen.
        </p>
        <ArticleStepHeading>Alltagshilfe-Süd kann beim Antrag unterstützen</ArticleStepHeading>
        <p className="mt-3">
          Viele Familien stellen den Antrag zu spät oder bereiten die Begutachtung nicht ausreichend vor. Alltagshilfe-Süd
          kann dabei helfen, den Pflegegrad zu beantragen, Unterlagen zu sortieren und die Alltagssituation realistisch
          darzustellen.
        </p>
        <div className="mt-8 rounded-2xl border border-neutral-200/95 bg-[#fafcfc] px-5 py-6 sm:px-7">
          <p className="text-[1.0625rem] font-medium leading-relaxed text-neutral-800">
            Sie möchten Pflegegrad 1 beantragen oder sind unsicher, ob ein Antrag sinnvoll ist? Alltagshilfe-Süd unterstützt
            Sie verständlich und persönlich.
          </p>
          <Link
            href="/ratgeber/pflegegrad-beantragen"
            className="mt-5 inline-flex min-h-[2.875rem] items-center justify-center rounded-lg bg-[#0F4F68] px-6 text-[0.95rem] font-semibold text-white transition hover:bg-[#0c3d52] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
          >
            Hilfe beim Pflegegrad beantragen
          </Link>
        </div>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="11" id="widerspruch" heading="Was tun, wenn Pflegegrad 1 abgelehnt wird?">
        <p>
          Wenn die Pflegekasse keinen Pflegegrad bewilligt oder aus Sicht der Familie ein zu niedriger Pflegegrad festgestellt
          wurde, sollte der Bescheid genau geprüft werden. Manchmal wurden Einschränkungen nicht vollständig erfasst. Manchmal
          war die betroffene Person im Begutachtungstermin besonders bemüht und hat den Alltag besser dargestellt, als er
          tatsächlich ist.
        </p>
        <p className="mt-4">
          In solchen Fällen kann ein Widerspruch sinnvoll sein. Wichtig ist, die Frist im Bescheid zu beachten. Häufig beträgt
          die Widerspruchsfrist einen Monat nach Bekanntgabe des Bescheids.
        </p>
        <ArticleSubtitle>Für einen Widerspruch sammeln</ArticleSubtitle>
        <ul className="mt-3 list-none space-y-2">
          {[
            "Welche Einschränkungen wurden im Gutachten nicht berücksichtigt?",
            "Welche Hilfe ist regelmäßig nötig?",
            "Gibt es ärztliche Unterlagen, Diagnosen oder Therapieberichte?",
            "Wurde die Wohnsituation richtig bewertet?",
            "Gibt es Stürze, Vergesslichkeit, Überforderung oder Risiken im Alltag?",
            "Wurden Angehörige ausreichend einbezogen?",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F78F2E]/75" aria-hidden />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          Alltagshilfe-Süd kann auch beim Widerspruch unterstützen, wenn der Pflegegrad abgelehnt wurde oder aus Sicht der
          Familie zu niedrig ist.
        </p>
        <PflegegradCallout variant="blue" title="Hinweis">
          <p>
            Ein Widerspruch ist kein Streit mit der Pflegekasse, sondern eine sachliche Überprüfung. Entscheidend ist, den
            tatsächlichen Hilfebedarf nachvollziehbar darzustellen.
          </p>
        </PflegegradCallout>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="12" id="wann-lohnt-sich" heading="Wann lohnt sich Pflegegrad 1 besonders?">
        <p>
          Pflegegrad 1 lohnt sich vor allem dann, wenn noch keine schwere Pflegebedürftigkeit besteht, aber erste
          Unterstützung regelmäßig notwendig wird.
        </p>
        <p className="mt-4 font-medium text-[#0F4F68]">Besonders sinnvoll ist ein Antrag, wenn:</p>
        <ul className="mt-3 list-none space-y-2">
          {[
            "Angehörige bereits regelmäßig helfen",
            "der Haushalt nicht mehr zuverlässig allein geschafft wird",
            "Körperpflege unsicher wird",
            "Stürze oder Beinahe-Stürze vorkommen",
            "Termine und Medikamente schwerer organisiert werden können",
            "eine beginnende Demenz oder Vergesslichkeit auffällt",
            "die Wohnung angepasst werden sollte",
            "Entlastung für Angehörige gebraucht wird",
            "Hilfsmittel oder ein Hausnotruf sinnvoll wären",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F4F68]/45" aria-hidden />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          Je früher passende Hilfe organisiert wird, desto länger kann Selbstständigkeit erhalten bleiben. Genau darin liegt
          der Wert von Pflegegrad 1.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="13" id="tipps-angehoerige" heading="Praktische Tipps für Angehörige">
        <p>
          Angehörige warten oft zu lange, bevor sie Unterstützung beantragen. Viele denken: „Es geht ja noch irgendwie.“ Doch
          genau diese Phase ist entscheidend. Wenn Hilfe frühzeitig organisiert werden kann, lassen sich Überforderung,
          Stürze und Konflikte häufig vermeiden.
        </p>
        <p className="mt-4 font-medium text-[#0F4F68]">Hilfreich ist es, folgende Dinge früh zu klären:</p>
        <ul className="mt-3 list-none space-y-2">
          {[
            "Wer unterstützt im Alltag regelmäßig?",
            "Welche Aufgaben fallen Angehörigen bereits zu?",
            "Welche Tätigkeiten werden für die pflegebedürftige Person anstrengend?",
            "Gibt es Risiken in der Wohnung?",
            "Werden Hilfsmittel benötigt?",
            "Wird der Entlastungsbetrag bereits genutzt?",
            "Ist eine Beratung sinnvoll?",
            "Sollte ein höherer Pflegegrad geprüft werden, wenn sich der Zustand verschlechtert?",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F4F68]/45" aria-hidden />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          Pflegegrad 1 sollte nicht als „kleiner Pflegegrad“ abgetan werden. Er ist eine Chance, Unterstützung aufzubauen,
          bevor die Belastung zu groß wird.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="14" id="service-ahs" heading="Wie Alltagshilfe-Süd bei Pflegegrad 1 helfen kann">
        <p>
          Alltagshilfe-Süd unterstützt Menschen mit Pflegegrad und ihre Angehörigen dabei, die passenden Hilfen zu verstehen
          und im Alltag zu nutzen. Gerade bei Pflegegrad 1 geht es häufig darum, die ersten Schritte richtig zu gehen.
        </p>
        <div className="mt-8 rounded-2xl border border-[#0F4F68]/14 bg-[linear-gradient(165deg,#fafcfc_0%,#ffffff_55%,#f9fafb_100%)] px-5 py-7 sm:px-8">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#5a959e]">Unterstützungsangebote</p>
          <ul className="mt-5 grid gap-x-10 gap-y-2.5 sm:grid-cols-2">
            {[
              "Hilfe beim Antrag auf Pflegegrad",
              "Unterstützung beim Widerspruch, wenn der Pflegegrad abgelehnt oder zu niedrig eingestuft wurde",
              "Beratung zu Leistungen der Pflegekasse",
              "Haushaltsreinigung",
              "Alltagsbegleitung und Betreuung",
              "Nutzung des Entlastungsbetrags",
              "Pflegehilfsmitteln im Wert von bis zu 42 Euro monatlich",
              "Pflegeshop und passenden Produkten für zu Hause",
              "Inkontinenzversorgung über Rezept",
              "möglichen kostenlosen Musterprodukten bei Inkontinenz",
              "Hausnotruf über Kooperationspartner",
              "Treppenlift über Kooperationspartner",
              "begehbare Dusche über Kooperationspartner",
            ].map((t) => (
              <li key={t} className="flex gap-2.5 text-[1.02rem] leading-snug text-neutral-800">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#F78F2E]/85" aria-hidden />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[1.02rem] leading-relaxed text-neutral-700">
            Außerdem kann die Abrechnung je nach Leistung und Voraussetzung über die Pflegekasse erfolgen. Alltagshilfe-Süd
            arbeitet mit allen Kranken- und Pflegekassen zusammen beziehungsweise rechnet im Rahmen der jeweils möglichen
            Leistungen ab.{" "}
            <Link href="/pflegeberatung/private-pflegeberatung" className={LINK}>
              Private Pflegeberatung
            </Link>{" "}
            erfolgt getrennt von betrieblichen Pflegeangeboten des Arbeitgebers.
          </p>
          <p className="mt-6 text-[1.0625rem] font-medium text-neutral-800">
            Sie möchten wissen, welche Leistungen bei Pflegegrad 1 für Sie möglich sind? Wir beraten Sie gerne.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/kontakt"
              className="inline-flex min-h-[2.875rem] items-center justify-center rounded-lg bg-[#F78F2E] px-6 text-[0.95rem] font-semibold text-white transition hover:bg-[#e8862a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
            >
              Jetzt Unterstützung anfragen
            </Link>
            <Link
              href="/ratgeber/pflegegrad-beantragen"
              className="inline-flex min-h-[2.875rem] items-center justify-center rounded-lg border border-[#0F4F68]/35 bg-white px-6 text-[0.95rem] font-semibold text-[#0F4F68] transition hover:bg-[#f6fafc] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
            >
              Mehr zur Hilfe beim Pflegegrad
            </Link>
          </div>
        </div>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="15" id="faq-pflegegrad-1" heading="Häufige Fragen zu Pflegegrad 1">
        <PflegegradFaqAccordion items={PFLEGEGRAD1_ARTICLE_FAQ} />
      </ArticleSectionHeading>

      <section
        id="quellen-pflegegrad-1"
        className="mt-16 scroll-mt-28 rounded-2xl border border-neutral-200/90 bg-[linear-gradient(165deg,#f9fafb_0%,#ffffff_52%,#f7fafb_100%)] px-5 py-7 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.85)] sm:px-8 sm:py-8"
      >
        <div className="flex flex-wrap items-end gap-3 gap-y-2 border-b border-neutral-200/85 pb-4">
          <h2 className="text-lg font-semibold tracking-tight text-[#0F4F68]">Quellen</h2>
          <span
            aria-hidden
            className="mb-0.5 h-px min-w-[2.5rem] flex-1 rounded-full bg-gradient-to-r from-[#0F4F68]/25 to-transparent max-sm:hidden"
          />
        </div>
        <p className="mt-3 text-sm text-neutral-600">
          <strong className="text-neutral-900">Stand:</strong> April 2026
        </p>
        <ul className="mt-5 list-none space-y-3 text-[0.95rem] text-neutral-700">
          <li>
            Bundesgesundheitsministerium: Pflege —{" "}
            <a href="https://www.bundesgesundheitsministerium.de/pflege" className={LINK} target="_blank" rel="noopener noreferrer">
              bundesgesundheitsministerium.de/pflege
            </a>
          </li>
          <li>
            Bundesgesundheitsministerium: Pflege zu Hause —{" "}
            <a
              href="https://www.bundesgesundheitsministerium.de/pflege-zu-hause"
              className={LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              bundesgesundheitsministerium.de/pflege-zu-hause
            </a>
          </li>
          <li>
            Medizinischer Dienst: Pflegebegutachtung —{" "}
            <a
              href="https://www.medizinischerdienst.de/versicherte/pflegebegutachtung"
              className={LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              medizinischerdienst.de
            </a>
          </li>
          <li>
            Sozialgesetzbuch XI, Pflegegrade (§ 15) —{" "}
            <a href="https://www.gesetze-im-internet.de/sgb_11/__15.html" className={LINK} target="_blank" rel="noopener noreferrer">
              gesetze-im-internet.de
            </a>
          </li>
        </ul>
        <p className="mt-8 text-[0.95rem] text-neutral-600">
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
          Passende Angebote und Ratgeber auf Alltagshilfe-Süd — ohne Verweis auf betriebliche Pflegeberatung.
        </p>
        <ul className="mt-6 list-none space-y-2 text-[1rem] text-neutral-800">
          {[
            { href: "/ratgeber/pflegegrad-beantragen", label: "Pflegegrad beantragen – Schritt für Schritt" },
            { href: "/pflegeberatung/private-pflegeberatung", label: "Private Pflegeberatung" },
            { href: "/leistungen/haushaltshilfe", label: "Haushaltshilfe" },
            { href: "/leistungen/alltagsbegleitung-betreuung", label: "Alltagsbegleitung und Betreuung" },
            { href: "/pflegehilfsmittel/kostenfreie-pflegehilfsmittel", label: "Pflegehilfsmittel (42 € monatlich)" },
            { href: "/pflegeshop", label: "Pflegeshop" },
            { href: "/inkontinenzversorgung", label: "Inkontinenzversorgung" },
            { href: "/kooperation", label: "Kooperationspartner (z. B. Hausnotruf, Treppenlift, begehbare Dusche)" },
            { href: "/kontakt", label: "Kontakt" },
            { href: "/ratgeber", label: "Alle Ratgeber-Beiträge" },
          ].map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={`${LINK} inline-flex items-center gap-2 py-1`}>
                <span className="h-6 w-1 shrink-0 rounded-full bg-gradient-to-b from-[#0F4F68] to-[#4a93a8]" aria-hidden />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
