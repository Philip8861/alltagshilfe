import type { ReactNode } from "react";
import Link from "next/link";

import { INKONTINENZMATERIAL_AUF_REZEPT_FAQ } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/inkontinenzmaterial-auf-rezept-faq";
import { INKONTINENZMATERIAL_AUF_REZEPT_TOC } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/inkontinenzmaterial-auf-rezept-toc";
import { IncontinenceRecipeEndCta } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/IncontinenceRecipeEndCta";
import { IncontinenceRecipeInlineCta } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/IncontinenceRecipeInlineCta";
import { RatgeberSidebarBeratungTeaser } from "@/components/ratgeber/RatgeberBeratungDialog";
import { PflegegradFaqAccordion } from "@/components/ratgeber/pflegegrad-beantragen/PflegegradFaqAccordion";
import {
  ArticleSectionHeading,
  ArticleStepHeading,
  PflegegradCallout,
} from "@/components/ratgeber/pflegegrad-beantragen/pflegegrad-visual-primitives";
import { cn } from "@/lib/utils";

const PROSE = "text-[1.125rem] leading-[1.7] text-neutral-800";
const LINK = "font-medium text-[#0F4F68] underline-offset-2 hover:underline";

function FactsOverviewInkontinenzTable() {
  const rows = [
    {
      q: "Wer hat Anspruch?",
      a: "Gesetzlich Versicherte mit mindestens mittelgradiger Harn- und/oder Stuhlinkontinenz (Richtwert: > 100 ml Urinverlust in 4 Stunden)",
    },
    { q: "Braucht man einen Pflegegrad?", a: "Nein – zuständig ist die Krankenkasse, nicht die Pflegekasse" },
    { q: "Gesetzliche Zuzahlung 2026", a: "10 % der Kosten, maximal 10 € pro Monatsbedarf (Kinder unter 18: befreit)" },
    { q: "Wirtschaftliche Aufzahlung", a: "Nur bei Produkten über die medizinisch notwendige Regelversorgung hinaus" },
    { q: "Typische Produkte", a: "Vorlagen, Einlagen, Windeln, Pants, ableitende Hilfsmittel" },
    { q: "Hilft Alltagshilfe-Süd?", a: "Ja, bei Beratung, Rezept, Versorgung und passenden Produkten" },
  ];
  return (
    <figure className="mt-6">
      <figcaption className="sr-only">Kurzüberblick zu Inkontinenzmaterial auf Rezept</figcaption>
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

function PflegegradVsKrankenkasseTable() {
  const rows = [
    { thema: "Inkontinenzmaterial auf Rezept", zustaendig: "Krankenkasse", voraussetzung: "Medizinische Notwendigkeit, ärztliche Verordnung" },
    {
      thema: "Pflegehilfsmittel zum Verbrauch",
      zustaendig: "Pflegekasse",
      voraussetzung: "Pflegegrad (1–5) und häusliche Pflege",
    },
    { thema: "Hautpflege, Reinigung, Cremes", zustaendig: "Meist privat", voraussetzung: "Nur in medizinischen Sonderfällen erstattungsfähig" },
  ];
  return (
    <figure className="mt-6">
      <figcaption className="sr-only">Unterschied zwischen Krankenkasse und Pflegekasse bei Inkontinenzversorgung</figcaption>
      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-[0_2px_8px_-4px_rgba(15,79,104,0.12)]">
        <table className="w-full min-w-[min(100%,28rem)] border-collapse text-left text-[1.025rem] sm:text-[1.0425rem]">
          <thead>
            <tr className="border-b border-neutral-200 bg-gradient-to-br from-neutral-50 to-[#f6fafc]">
              <th scope="col" className="px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#5a959e] sm:px-5">
                Thema
              </th>
              <th scope="col" className="border-l border-neutral-100 px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#5a959e] sm:px-5">
                Zuständig
              </th>
              <th scope="col" className="border-l border-neutral-100 px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#5a959e] sm:px-5">
                Voraussetzung
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.thema} className={i % 2 === 1 ? "bg-[#fafcfc]/95" : "bg-white"}>
                <th scope="row" className="border-b border-neutral-100 px-4 py-[0.8rem] align-top font-semibold leading-snug text-[#0F4F68] sm:px-5">
                  {r.thema}
                </th>
                <td className="border-b border-neutral-100 px-4 py-[0.8rem] align-top leading-relaxed text-neutral-800 sm:px-5">
                  {r.zustaendig}
                </td>
                <td className="border-b border-neutral-100 px-4 py-[0.8rem] align-top leading-relaxed text-neutral-800 sm:px-5">
                  {r.voraussetzung}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

function ChecklistItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[#0F4F68]/25 bg-white text-xs text-neutral-400" aria-hidden>
        ☐
      </span>
      <span>{children}</span>
    </li>
  );
}

export function InkontinenzmaterialAufRezeptArticle() {
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
            {[...INKONTINENZMATERIAL_AUF_REZEPT_TOC].map((e, i) => (
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

      <ArticleSectionHeading sectionNum="01" id="blick" isFirst heading="Das Wichtigste in Kürze">
        <p>
          Inkontinenzmaterial auf Rezept bekommen gesetzlich Versicherte, wenn eine ärztlich festgestellte mindestens
          mittelgradige Harn- und/oder Stuhlinkontinenz vorliegt und die Hilfsmittel medizinisch notwendig sind. Als
          Richtwert nennt die Verbraucherzentrale mehr als 100 ml Urinverlust in vier Stunden.
        </p>
        <p className="mt-4">
          Ein{" "}
          <Link href="/ratgeber/pflegegrad-beantragen" className={LINK}>
            Pflegegrad
          </Link>{" "}
          ist dafür nicht zwingend erforderlich. Zuständig ist in der Regel die Krankenkasse, nicht die Pflegekasse.
          Pflegehilfsmittel sind ein anderes Thema und werden nur unter bestimmten Voraussetzungen über die
          Pflegeversicherung übernommen.
        </p>
        <p className="mt-4">
          Die gesetzliche Zuzahlung beträgt bei volljährigen Versicherten 10 Prozent der Kosten, maximal aber 10 Euro für
          den gesamten Monatsbedarf an zum Verbrauch bestimmten Hilfsmitteln. Kinder und Jugendliche unter 18 Jahren zahlen
          keine gesetzliche Zuzahlung.
        </p>
        <p className="mt-4">
          Zusätzliche Aufzahlungen sind nur dann relevant, wenn Sie ein Produkt wünschen, das über die medizinisch
          notwendige Regelversorgung hinausgeht. Medizinisch notwendige Produkte in ausreichender Qualität und Menge müssen
          grundsätzlich ohne solche Mehrkosten verfügbar sein.
        </p>
        <FactsOverviewInkontinenzTable />
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="02" id="bedeutung" heading="Was bedeutet „Inkontinenzmaterial auf Rezept“?">
        <p>
          Mit Inkontinenzmaterial sind Hilfsmittel gemeint, die bei Harn- oder Stuhlinkontinenz eingesetzt werden. Dazu
          zählen vor allem aufsaugende Produkte wie Vorlagen, Einlagen, Windeln, Inkontinenzhosen oder Pants. Die gesetzliche
          Krankenversicherung spricht häufig von Inkontinenzhilfen oder aufsaugenden Inkontinenzprodukten.
        </p>
        <p className="mt-4">
          Diese Produkte helfen nicht nur dabei, Urin oder Stuhl aufzufangen. Sie schützen auch die Haut, reduzieren Gerüche,
          erleichtern die Pflege und geben Betroffenen Sicherheit im Alltag. Für viele Menschen ist eine passende Versorgung
          entscheidend, um wieder einkaufen zu gehen, Termine wahrzunehmen, Besuch zu empfangen oder am gesellschaftlichen
          Leben teilzunehmen.
        </p>
        <p className="mt-4">
          Die Verbraucherzentrale nennt als typische aufsaugende Inkontinenzhilfen unter anderem Vorlagen mit Fixierhose,
          wiederverschließbare Schutzhosen und Inkontinenzunterhosen (Pants). Bei der Auswahl spielen Größe, Körperbau,
          Trinkmenge, Saugstärke, Geschlecht und Hautprobleme eine wichtige Rolle.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="03" id="anspruch" heading="Wer hat Anspruch auf Inkontinenzmaterial auf Rezept?">
        <p>
          Anspruch besteht, wenn die Inkontinenz medizinisch relevant ist und das Hilfsmittel im Einzelfall erforderlich ist.
          In der Praxis bedeutet das: Die Ärztin oder der Arzt muss feststellen, dass eine Harn- und/oder Stuhlinkontinenz
          vorliegt und dass Inkontinenzmaterial notwendig ist.
        </p>
        <p className="mt-4">
          Die Verbraucherzentrale nennt als Voraussetzung für die Kostenübernahme durch die Krankenkasse eine mindestens
          mittelgradige Harn- und/oder Stuhlinkontinenz. Als Richtwert werden mehr als 100 ml Urinverlust in vier Stunden
          genannt. Außerdem sollten Diagnose, Produktart, Menge, Versorgungszeitraum und medizinischer Grund auf der
          Verordnung stehen.
        </p>
        <p className="mt-4">
          Die AOK beschreibt die Voraussetzungen ähnlich: Die Kostenübernahme kommt infrage, wenn mindestens eine mittlere
          Urin- und/oder Stuhlinkontinenz ärztlich attestiert ist, die Versorgung medizinisch notwendig und im Einzelfall
          erforderlich ist und die Versicherten dadurch Grundbedürfnisse des täglichen Lebens befriedigen können.
        </p>
        <p className="mt-4">Typische Situationen, in denen ein Anspruch bestehen kann:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Harninkontinenz, etwa Belastungs-, Drang- oder Mischinkontinenz</li>
          <li>Stuhlinkontinenz</li>
          <li>Inkontinenz nach Operationen</li>
          <li>Neurologischen Erkrankungen</li>
          <li>Demenz oder kognitiven Einschränkungen</li>
          <li>Pflegebedürftigkeit mit regelmäßigem Inkontinenzbedarf</li>
          <li>Körperlichen Einschränkungen, die den Toilettengang erschweren</li>
          <li>Dauerhafter Versorgung im häuslichen Umfeld</li>
        </ul>
        <p className="mt-4">
          Wichtig ist: Nicht die Scham oder der Wunsch nach Komfort entscheidet, sondern die medizinische Notwendigkeit.
          Genau deshalb ist ein gutes ärztliches Rezept so wichtig.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="04" id="pflegegrad" heading="Braucht man einen Pflegegrad für Inkontinenzmaterial?">
        <p>
          Nein, für Inkontinenzmaterial auf Rezept ist kein Pflegegrad erforderlich. Die Versorgung mit medizinisch
          notwendigen Inkontinenzhilfen läuft über die Krankenkasse, weil es sich um Hilfsmittel der gesetzlichen
          Krankenversicherung handelt.
        </p>
        <p className="mt-4">
          Das wird häufig verwechselt mit den sogenannten{" "}
          <Link href="/ratgeber/kostenfreie-pflegehilfsmittel-42-euro" className={LINK}>
            kostenfreien Pflegehilfsmitteln zum Verbrauch
          </Link>
          . Diese können bei Pflegebedürftigkeit von der Pflegekasse bezahlt werden, zum Beispiel Einmalhandschuhe,
          Desinfektionsmittel oder Bettschutzeinlagen. Für solche Verbrauchsprodukte übernimmt die Pflegekasse laut
          Bundesgesundheitsministerium bis zu 42 Euro pro Monat, wenn die Voraussetzungen erfüllt sind.
        </p>
        <p className="mt-4">Die Unterschiede im Überblick:</p>
        <PflegegradVsKrankenkasseTable />
        <p className="mt-4">
          Gerade Angehörige sollten diese Unterscheidung kennen. Ein Pflegegrad kann zwar im Alltag vieles erleichtern, ist
          aber nicht die Voraussetzung dafür, dass Inkontinenzhilfen auf Rezept verordnet werden.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="05" id="produkte" heading="Welche Inkontinenzprodukte bezahlt die Krankenkasse?">
        <p>
          Die Krankenkasse bezahlt nicht automatisch jedes beliebige Produkt aus dem Drogeriemarkt oder Online-Shop.
          Erstattungsfähig sind Produkte, die als Hilfsmittel geeignet sind und der medizinisch notwendigen Versorgung
          entsprechen. Die Produktgruppe 15 des Hilfsmittelverzeichnisses umfasst alle kassenfähigen Inkontinenzhilfen.
        </p>
        <p className="mt-4">Typische kassenfähige Inkontinenzprodukte sind:</p>
        <ArticleStepHeading>Inkontinenzvorlagen</ArticleStepHeading>
        <p className="mt-3">
          Vorlagen werden meist mit einer eng anliegenden Fixierhose oder Netzhose getragen. Sie sind häufig die klassische
          Regelversorgung, weil sie bei vielen Menschen gut anpassbar und hautfreundlich sind.
        </p>
        <ArticleStepHeading>Inkontinenzeinlagen</ArticleStepHeading>
        <p className="mt-3">
          Einlagen eignen sich eher bei leichteren Formen der Inkontinenz. Bei einer nur leichten Inkontinenz kann die
          Kostenübernahme schwieriger sein, weil Krankenkassen in der Regel mindestens eine mittelgradige Inkontinenz
          voraussetzen.
        </p>
        <ArticleStepHeading>Windelhosen oder Windelslips</ArticleStepHeading>
        <p className="mt-3">
          Diese Produkte haben seitliche Klebe- oder Klettverschlüsse und werden oft bei stärkerer Inkontinenz,
          Bettlägerigkeit oder höherem Pflegebedarf eingesetzt.
        </p>
        <ArticleStepHeading>Pants / Inkontinenzunterhosen</ArticleStepHeading>
        <p className="mt-3">
          Pants sehen normaler Unterwäsche ähnlich und werden wie Unterhosen angezogen. Sie können im Alltag sehr praktisch
          sein. Ob sie ohne Mehrkosten übernommen werden, hängt davon ab, ob sie medizinisch notwendig sind. Die
          Verbraucherzentrale weist darauf hin, dass bei Abweichungen von der Regelversorgung die medizinischen Gründe
          zwingend in der ärztlichen Verordnung dokumentiert werden sollten.
        </p>
        <ArticleStepHeading>Ableitende Inkontinenzhilfen</ArticleStepHeading>
        <p className="mt-3">
          Neben aufsaugenden Produkten gibt es auch ableitende Hilfsmittel, etwa bestimmte Urinableiter oder
          Katheterversorgungen. Hier gelten eigene medizinische Voraussetzungen.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="06" id="kosten" heading="Was kostet Inkontinenzmaterial auf Rezept 2026?">
        <p>
          Für gesetzlich Versicherte ist die wichtigste Unterscheidung zwischen der gesetzlichen Zuzahlung und der
          wirtschaftlichen Aufzahlung zu verstehen.
        </p>
        <ArticleStepHeading>Gesetzliche Zuzahlung</ArticleStepHeading>
        <p className="mt-3">
          Inkontinenzhilfen sind zum Verbrauch bestimmte Hilfsmittel. Für solche Hilfsmittel zahlen volljährige Versicherte
          laut Bundesgesundheitsministerium 10 Prozent der Kosten pro Packung, maximal aber 10 Euro für den gesamten
          Monatsbedarf.
        </p>
        <p className="mt-4">
          Das bedeutet praktisch: Wenn die Versorgung über Rezept läuft und keine zusätzliche Aufzahlung anfällt, zahlen
          Erwachsene höchstens 10 Euro pro Monat. Kinder und Jugendliche unter 18 Jahren sowie zuzahlungsbefreite Personen
          sind hiervon komplett befreit.
        </p>
        <ArticleStepHeading>Wirtschaftliche Aufzahlung</ArticleStepHeading>
        <p className="mt-3">
          Die wirtschaftliche Aufzahlung ist etwas anderes als die gesetzliche Zuzahlung. Sie entsteht, wenn Versicherte ein
          Produkt wählen, das über die medizinisch notwendige Regelversorgung hinausgeht – zum Beispiel wegen besonderem
          Komfort, einer bestimmten Marke oder einer höheren Stückzahl ohne medizinische Begründung.
        </p>
        <p className="mt-4">
          Die Verbraucherzentrale betont: Eine höherwertige Versorgung auf eigenen Wunsch kann Mehrkosten auslösen; diese
          Aufzahlung ist nicht mit der gesetzlichen Zuzahlung zu verwechseln.
        </p>
      </ArticleSectionHeading>

      <IncontinenceRecipeInlineCta />

      <ArticleSectionHeading sectionNum="07" id="aufzahlung" heading="Muss man eine Aufzahlung akzeptieren?">
        <p>
          Nein, nicht automatisch. Wenn ein Produkt medizinisch notwendig ist, muss die Versorgung ausreichend, zweckmäßig
          und wirtschaftlich sein. Gesetzlich Versicherte haben Anspruch auf individuell notwendige Inkontinenzprodukte in
          ausreichender Qualität und Menge ohne Mehrkosten.
        </p>
        <p className="mt-4">
          Der GKV-Spitzenverband führt in den Rechtsgrundlagen aus, dass Krankenkassenverträge eine hinreichende Anzahl an
          mehrkostenfreien Hilfsmitteln, Qualität, notwendige Beratung und wohnortnahe Versorgung sicherstellen müssen.
        </p>
        <p className="mt-4">Sie sollten aufmerksam werden, wenn der Versorger behauptet:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>„Das zahlt die Kasse grundsätzlich nicht.“</li>
          <li>„Sie müssen bei Pants immer privat aufzahlen.“</li>
          <li>„Auf Rezept gibt es nur unbrauchbare Produkte.“</li>
          <li>„Mehr als diese geringe Menge bekommen Sie von uns nicht.“</li>
        </ul>
        <p className="mt-4">
          Solche Aussagen sind oft unvollständig. Entscheidend ist immer die dokumentierte medizinische Notwendigkeit.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="08" id="ablauf" heading="Wie läuft der Antrag für Inkontinenzmaterial auf Rezept ab?">
        <ArticleStepHeading>Schritt 1: Ärztliche Diagnose einholen</ArticleStepHeading>
        <p className="mt-3">
          Sprechen Sie mit Ihrer Hausarztpraxis, der Urologie oder Gynäkologie. Für Mediziner ist Inkontinenz ein
          Alltagsthema. Je genauer Sie Ihren Alltag und den Verbrauch beschreiben, desto besser kann die Versorgung
          begründet werden.
        </p>
        <ArticleStepHeading>Schritt 2: Rezept korrekt ausstellen lassen</ArticleStepHeading>
        <p className="mt-3">
          Für die Kostenübernahme benötigen Sie eine ärztliche Verordnung. Achten Sie darauf, dass Diagnose, Produktart,
          benötigte Menge bzw. der Versorgungszeitraum genau vermerkt sind. Bei dauerhaftem Bedarf ist eine Dauerverordnung
          sinnvoll.
        </p>
        <ArticleStepHeading>Schritt 3: Krankenkasse kontaktieren</ArticleStepHeading>
        <p className="mt-3">
          Die Krankenkasse nennt Ihnen die Vertragspartner (z. B. spezialisierte Sanitätshäuser oder Apotheken). Gesetzlich
          Versicherte müssen die Produkte in der Regel über diese Vertragspartner beziehen.
        </p>
        <ArticleStepHeading>Schritt 4: Beratung und Bemusterung nutzen</ArticleStepHeading>
        <p className="mt-3">
          Der Vertragspartner muss Sie individuell beraten. Fragen Sie aktiv nach Gratis-Musterprodukten! Testen Sie diese
          mehrere Tage lang tagsüber und nachts auf Passform, Saugleistung und Hautverträglichkeit.
        </p>
        <ArticleStepHeading>Schritt 5: Lieferung starten</ArticleStepHeading>
        <p className="mt-3">
          Nach der Genehmigung liefert der Anbieter das Material regelmäßig diskret nach Hause. Die Abrechnung erfolgt
          direkt mit der Krankenkasse. Sie zahlen nur die gesetzliche Zuzahlung.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="09" id="rezept" heading="Was muss auf dem Rezept stehen?">
        <p>
          Je genauer das Rezept formuliert ist, desto weniger Spielraum haben Versorger, Sie mit unpassenden Produkten
          abzuspeisen. Ideal ist folgende Formulierung:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>
            <strong>Präzise Diagnose:</strong> z. B. Harn- oder Stuhlinkontinenz inklusive Schweregrad (mindestens
            mittelgradig).
          </li>
          <li>
            <strong>Produktart &amp; Menge:</strong> Genaue Nennung (z. B. anatomisch geformte Vorlagen oder Pants) sowie
            der monatliche Stückzahlbedarf.
          </li>
          <li>
            <strong>Versorgungszeitraum:</strong> z. B. „Monatsbedarf“ oder „Dauerverordnung für 12 Monate“.
          </li>
          <li>
            <strong>Medizinische Begründung:</strong> z. B. zur Vermeidung von Hautschäden (Dekubitusprophylaxe) oder zum
            Erhalt der Mobilität und Teilhabe.
          </li>
        </ul>
        <PflegegradCallout title="Beispiel für eine klare Begründung bei Pants">
          „Vorlagen mit Fixierhose sind aufgrund stark eingeschränkter Handmotorik / kognitiver Einschränkungen nicht
          ausreichend zweckmäßig. Zur selbstständigen Lebensführung und Sicherung des Heilerfolgs sind aufsaugende
          Inkontinenzpants medizinisch erforderlich.“
        </PflegegradCallout>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="10" id="menge" heading="Wie viel Inkontinenzmaterial steht mir zu?">
        <p>
          Es gibt keine gesetzlich pauschalierte Stückzahl. Der GKV-Spitzenverband hält ausdrücklich fest, dass die
          Stückzahl nicht allein anhand der reinen Ausscheidungsmenge berechnet werden darf. Hygienische Anforderungen und
          die pflegerische Situation sind ebenfalls zu beachten. Je nach Einzelfall und medizinischer Notwendigkeit können 5
          oder mehr Produkte innerhalb von 24 Stunden notwendig sein.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="11" id="nicht-passen" heading="Was tun, wenn die Produkte nicht passen?">
        <p>
          Viele Betroffene geben zu früh auf, wenn die gelieferten Kassenprodukte auslaufen oder Hautreizungen verursachen.
          Gehen Sie in diesem Fall strukturiert vor:
        </p>
        <ol className="mt-4 list-decimal space-y-3 pl-6">
          <li>
            <strong>Dokumentieren Sie das Problem:</strong> Wann läuft das Produkt aus? Kommt es zu Rötungen?
          </li>
          <li>
            <strong>Fordern Sie Alternativen:</strong> Kontaktieren Sie den Versorger und verlangen Sie eine erneute
            Beratung sowie andere Muster.
          </li>
          <li>
            <strong>Krankenkasse einschalten:</strong> Hilft der Versorger nicht weiter, wenden Sie sich unverzüglich an
            Ihre Krankenkasse. Diese steht in der Pflicht, Ihre ausreichende Versorgung vertraglich abzusichern.
          </li>
        </ol>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="12" id="ablehnung" heading="Was tun, wenn die Krankenkasse ablehnt?">
        <p>Eine Ablehnung ist kein Endurteil. Oft fehlen lediglich präzise ärztliche Begründungen auf dem Rezept.</p>
        <ol className="mt-4 list-decimal space-y-3 pl-6">
          <li>Lassen Sie sich die Ablehnung immer schriftlich geben.</li>
          <li>Bitten Sie den Arzt um ein ergänzendes, detailliertes Attest.</li>
          <li>Legen Sie innerhalb der genannten Frist (meist ein Monat) Widerspruch ein.</li>
          <li>Nutzen Sie bei Bedarf Unterstützung durch unabhängige Pflegeberatungen oder Sozialverbände (z. B. VdK).</li>
        </ol>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="13" id="fehler" heading="Häufige Fehler beim Inkontinenzmaterial auf Rezept">
        <ArticleStepHeading>Fehler 1: Aus Scham alles selbst kaufen</ArticleStepHeading>
        <p className="mt-3">
          Der Weg über das Rezept spart über das Jahr gerechnet oft mehrere hundert Euro.
        </p>
        <ArticleStepHeading>Fehler 2: Ein zu ungenaues Rezept akzeptieren</ArticleStepHeading>
        <p className="mt-3">
          Steht nur „Inkontinenzhilfen“ auf dem Schein, liefert der Versorger oft nur die aller günstigste
          Basis-Regelversorgung.
        </p>
        <ArticleStepHeading>Fehler 3: Verwechslung mit der Pflegekasse</ArticleStepHeading>
        <p className="mt-3">
          Inkontinenzmaterial auf Rezept ist eine Leistung der Krankenkasse. Die 42-Euro-Pauschale der Pflegekasse ist für
          andere Produkte (z. B. Bettschutzeinlagen) gedacht.
        </p>
        <ArticleStepHeading>Fehler 4: Aufzahlungen voreilig unterschreiben</ArticleStepHeading>
        <p className="mt-3">
          Unterschreiben Sie Verträge über wirtschaftliche Aufzahlungen erst, wenn Sie sicher sind, dass die
          zuzahlungsfreien Produkte medizinisch wirklich nicht ausreichen.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="14" id="beispiel" heading="Beispiel: So kann der Ablauf in der Praxis aussehen">
        <p>
          Frau M. versorgt ihren Vater zu Hause. Er verliert nachts regelmäßig Urin, tagsüber schafft er es wegen
          eingeschränkter Mobilität oft nicht rechtzeitig zur Toilette. Die Familie kauft die Pants bisher teuer im
          Drogeriemarkt.
        </p>
        <p className="mt-4">
          Beim Hausarzt schildert Frau M. die Situation detailreich. Der Arzt stellt eine mittelgradige Harninkontinenz
          fest und stellt eine Dauerverordnung aus. Da der Vater herkömmliche Vorlagen aufgrund einer leichten Demenz nachts
          eigenständig entfernt, begründet der Arzt die medizinische Notwendigkeit von Pants auf dem Rezept. Der
          Vertragspartner der Krankenkasse liefert daraufhin passende Muster und fortan die monatliche Versorgung frei von
          wirtschaftlichen Aufzahlungen direkt an die Haustür.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="15" id="checkliste" heading="Checkliste für Angehörige">
        <p>Nehmen Sie diese Notizen am besten direkt mit zum nächsten Arzttermin:</p>
        <ul className="mt-5 list-none space-y-3">
          <ChecklistItem>
            <strong>Häufigkeit:</strong> Wie oft am Tag/in der Nacht kommt es zu unkontrolliertem Urin- oder Stuhlverlust?
          </ChecklistItem>
          <ChecklistItem>
            <strong>Menge:</strong> Wie viele Produkte werden aktuell innerhalb von 24 Stunden verbraucht?
          </ChecklistItem>
          <ChecklistItem>
            <strong>Symptome:</strong> Gibt es bereits Hautprobleme, Rötungen oder Wundsein?
          </ChecklistItem>
          <ChecklistItem>
            <strong>Einschränkungen:</strong> Liegen kognitive Einschränkungen (z. B. Demenz) oder motorische Probleme (z.
            B. nach Schlaganfall, Rheuma) beim Toilettengang vor?
          </ChecklistItem>
          <ChecklistItem>
            <strong>Ziel der Versorgung:</strong> Wird das Material primär für die erholsame Nachtruhe, den Hautschutz oder
            die soziale Teilhabe tagsüber benötigt?
          </ChecklistItem>
          <ChecklistItem>
            <strong>Dauerverordnung:</strong> Wurde der Arzt aktiv auf eine Langzeitverordnung angesprochen?
          </ChecklistItem>
        </ul>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="16" id="faq-inkontinenz" heading="FAQ: Häufige Fragen zu Inkontinenzmaterial auf Rezept 2026">
        <PflegegradFaqAccordion items={INKONTINENZMATERIAL_AUF_REZEPT_FAQ} />
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="17" id="fazit" heading="Fazit: Inkontinenzmaterial auf Rezept kann den Alltag deutlich entlasten">
        <p>
          Die Versorgung mit Inkontinenzmaterial auf Rezept bietet Betroffenen und pflegenden Angehörigen eine enorme
          finanzielle und mentale Entlastung im Pflegealltag. Wichtig ist, die Scham zu überwinden, den tatsächlichen Bedarf
          präzise vom Arzt dokumentieren zu lassen und sich nicht mit unzureichenden oder pauschal kostenpflichtigen
          Angeboten der Versorger abzufinden.
        </p>
        <p className="mt-4">
          Sie haben einen gesetzlichen Anspruch auf eine Versorgung, die Ihre Lebensqualität sichert und pflegerisch
          einwandfrei funktioniert.
        </p>
      </ArticleSectionHeading>

      <IncontinenceRecipeEndCta />

      <section id="quellen" className="mt-14 scroll-mt-28 border-t border-neutral-200 pt-10">
        <h2 className="text-base font-semibold tracking-tight text-neutral-700">Quellen und fachliche Grundlagen</h2>
        <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-neutral-600">
          <li>
            Verbraucherzentrale – Inkontinenzhilfen auf Rezept:{" "}
            <a
              href="https://www.verbraucherzentrale.de/wissen/gesundheit-pflege/medizinische-hilfsmittel/inkontinenzhilfen-auf-rezept-11481"
              className={LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              verbraucherzentrale.de
            </a>
          </li>
          <li>
            Bundesgesundheitsministerium – Hilfsmittel und Zuzahlung:{" "}
            <a
              href="https://www.bundesgesundheitsministerium.de/themen/krankenversicherung/hilfsmittel.html"
              className={LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              bundesgesundheitsministerium.de
            </a>
          </li>
          <li>
            GKV-Spitzenverband – Hilfsmittelverzeichnis Produktgruppe 15:{" "}
            <a
              href="https://www.gkv-spitzenverband.de/krankenversicherung/hilfsmittel/hilfsmittelverzeichnis/hilfsmittelverzeichnis.jsp"
              className={LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              gkv-spitzenverband.de
            </a>
          </li>
          <li>
            AOK – Inkontinenzversorgung:{" "}
            <a
              href="https://www.aok.de/pk/leistungen/inkontinenzversorgung/"
              className={LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              aok.de
            </a>
          </li>
          <li>
            Bundesgesundheitsministerium – Pflegehilfsmittel zum Verbrauch:{" "}
            <a
              href="https://www.bundesgesundheitsministerium.de/themen/pflege/pflegepolitik/pflegehilfsmittel-und-wohnumfeldverbessernde-massnahmen.html"
              className={LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              bundesgesundheitsministerium.de
            </a>
          </li>
        </ul>
        <p className="mt-8 text-[0.95rem] text-neutral-600">
          Hinweis: Dieser Ratgeber ersetzt keine Rechtsberatung und keine Entscheidung Ihrer Krankenkasse. Prüfen Sie
          Bescheide und Fristen im Einzelfall.
        </p>
      </section>

      <section className="mt-12 rounded-2xl border border-dashed border-neutral-200/95 bg-neutral-50/40 px-5 py-7 sm:px-7">
        <h2 className="text-lg font-semibold tracking-tight text-[#0F4F68]">Passende Themen</h2>
        <ul className="mt-5 list-none space-y-2.5 text-[1rem] text-neutral-800">
          <li>
            <Link href="/ratgeber/kostenfreie-pflegehilfsmittel-42-euro" className={LINK}>
              Kostenfreie Pflegehilfsmittel (42 €)
            </Link>
          </li>
          <li>
            <Link href="/ratgeber/pflegegrad-beantragen" className={LINK}>
              Pflegegrad beantragen
            </Link>
          </li>
          <li>
            <Link href="/pflegeshop" className={LINK}>
              Pflegeshop &amp; Inkontinenzversorgung
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
          supportLine="Fragen zu Inkontinenzmaterial, Rezept oder Versorgung?"
          preselectedServices={["hilfsmittel", "pflegegrad_beantrag_widerspruch"]}
          contextNote="Ratgeber: Inkontinenzmaterial auf Rezept (mobil)"
        />
      </div>
    </div>
  );
}
