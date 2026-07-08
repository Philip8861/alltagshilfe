import type { ReactNode } from "react";
import Link from "next/link";

import { InkoRatgeberArticleFooter } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/InkoRatgeberArticleFooter";
import { EINLAGEN_VORLAGEN_PANTS_WINDELN_FAQ } from "@/components/ratgeber/einlagen-vorlagen-pants-windeln/einlagen-vorlagen-pants-windeln-faq";
import { EINLAGEN_VORLAGEN_PANTS_WINDELN_TOC } from "@/components/ratgeber/einlagen-vorlagen-pants-windeln/einlagen-vorlagen-pants-windeln-toc";
import {
  InkontinenzProductBeratungCta,
  InkontinenzProductCtaBox,
  InkontinenzProductEndCta,
} from "@/components/ratgeber/einlagen-vorlagen-pants-windeln/InkontinenzProductCta";
import { PflegegradFaqAccordion } from "@/components/ratgeber/pflegegrad-beantragen/PflegegradFaqAccordion";
import {
  ArticleSectionHeading,
  ArticleStepHeading,
  PflegegradCallout,
} from "@/components/ratgeber/pflegegrad-beantragen/pflegegrad-visual-primitives";
import { INKO_PRODUKT_RATGEBER_SLUG } from "@/lib/ratgeber/inko-rezept-cta-config";
import { cn } from "@/lib/utils";

const PROSE = "text-[1.125rem] leading-[1.7] text-neutral-800";
const LINK = "font-medium text-[#0F4F68] underline-offset-2 hover:underline";

type CompareRow = {
  produkt: string;
  geeignetBei: string;
  vorteile: string;
  nachteile: string;
  rezept: string;
};

function ProductCompareTable() {
  const rows: CompareRow[] = [
    {
      produkt: "Einlagen",
      geeignetBei: "leichte Inkontinenz",
      vorteile: "diskret, einfach, dünn",
      nachteile: "begrenzte Saugkraft",
      rezept: "je nach medizinischer Notwendigkeit",
    },
    {
      produkt: "Vorlagen mit Fixierhose",
      geeignetBei: "mittlere bis stärkere Inkontinenz",
      vorteile: "gute Anpassung, hautfreundlich, verschiedene Saugstärken",
      nachteile: "Fixierhose nötig, kann verrutschen",
      rezept: "ja, häufige Regelversorgung",
    },
    {
      produkt: "Pants",
      geeignetBei: "mobile Personen, Selbstständigkeit, Demenz",
      vorteile: "wie Unterwäsche, diskret, einfache Toilettennutzung",
      nachteile: "Wechsel unterwegs teils aufwendiger, Begründung wichtig",
      rezept: "ja, bei medizinischer Notwendigkeit",
    },
    {
      produkt: "Windelhosen",
      geeignetBei: "schwere Inkontinenz, Pflege, Bettlägerigkeit",
      vorteile: "sehr sicher, gut im Liegen wechselbar",
      nachteile: "weniger diskret, pflegeproduktähnlich",
      rezept: "ja",
    },
    {
      produkt: "Bettschutzeinlagen",
      geeignetBei: "Zusatzschutz für Bett oder Stuhl",
      vorteile: "schützt Oberflächen",
      nachteile: "ersetzt kein körpernahes Produkt",
      rezept: "je nach Produktgruppe und Voraussetzung",
    },
    {
      produkt: "Ableitende Hilfsmittel",
      geeignetBei: "spezielle medizinische Situationen",
      vorteile: "gezielte Ableitung",
      nachteile: "ärztliche Begleitung nötig",
      rezept: "ja, bei Indikation",
    },
  ];

  return (
    <figure className="mt-6">
      <figcaption className="sr-only">Vergleich: Einlagen, Vorlagen, Pants, Windeln und Ergänzungsprodukte</figcaption>
      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-[0_2px_8px_-4px_rgba(15,79,104,0.12)]">
        <table className="w-full min-w-[min(100%,36rem)] border-collapse text-left text-[1.025rem] sm:text-[1.0425rem]">
          <thead>
            <tr className="border-b border-neutral-200 bg-gradient-to-br from-neutral-50 to-[#f6fafc]">
              <th
                scope="col"
                className="px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#5a959e] sm:px-5"
              >
                Produkt
              </th>
              <th
                scope="col"
                className="border-l border-neutral-100 px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#5a959e] sm:px-5"
              >
                Am besten geeignet bei
              </th>
              <th
                scope="col"
                className="border-l border-neutral-100 px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#5a959e] sm:px-5"
              >
                Vorteile
              </th>
              <th
                scope="col"
                className="border-l border-neutral-100 px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#5a959e] sm:px-5"
              >
                Nachteile
              </th>
              <th
                scope="col"
                className="border-l border-neutral-100 px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#5a959e] sm:px-5"
              >
                Rezept möglich?
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.produkt} className={i % 2 === 1 ? "bg-[#fafcfc]/95" : "bg-white"}>
                <th
                  scope="row"
                  className="border-b border-neutral-100 px-4 py-[0.8rem] align-top font-semibold leading-snug text-[#0F4F68] sm:px-5"
                >
                  {r.produkt}
                </th>
                <td className="border-b border-neutral-100 px-4 py-[0.8rem] align-top leading-relaxed text-neutral-800 sm:px-5">
                  {r.geeignetBei}
                </td>
                <td className="border-b border-neutral-100 px-4 py-[0.8rem] align-top leading-relaxed text-neutral-800 sm:px-5">
                  {r.vorteile}
                </td>
                <td className="border-b border-neutral-100 px-4 py-[0.8rem] align-top leading-relaxed text-neutral-800 sm:px-5">
                  {r.nachteile}
                </td>
                <td className="border-b border-neutral-100 px-4 py-[0.8rem] align-top leading-relaxed text-neutral-800 sm:px-5">
                  {r.rezept}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

function SuitabilityList({ geeignet, wenigerGeeignet }: { geeignet: string[]; wenigerGeeignet: string[] }) {
  return (
    <div className="mt-4 grid gap-6 sm:grid-cols-2">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#5a959e]">Geeignet für</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          {geeignet.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#5a959e]">Weniger geeignet für</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          {wenigerGeeignet.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ChecklistItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[#0F4F68]/25 bg-white text-xs text-neutral-400"
        aria-hidden
      >
        ☐
      </span>
      <span>{children}</span>
    </li>
  );
}

export function EinlagenVorlagenPantsWindelnArticle() {
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
            {[...EINLAGEN_VORLAGEN_PANTS_WINDELN_TOC].map((e, i) => (
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
          Inkontinenzmaterial ist nicht einfach nur „Windel oder Einlage“. Die richtige Auswahl hängt davon ab, wie stark
          die Inkontinenz ist, ob die Person mobil ist, ob Demenz oder Pflegebedürftigkeit vorliegt und ob das Produkt
          tagsüber oder nachts gebraucht wird.
        </p>
        <ul className="mt-5 list-disc space-y-2.5 pl-6">
          <li>
            <strong>Einlagen</strong> eignen sich eher bei leichter Inkontinenz und für Menschen, die nur geringe Mengen
            Urin verlieren.
          </li>
          <li>
            <strong>Vorlagen mit Fixierhose</strong> sind häufig eine gute Lösung bei mittlerer bis stärkerer Inkontinenz,
            weil sie körpernah getragen werden und gut anpassbar sind. Die Verbraucherzentrale weist darauf hin, dass
            anatomisch geformte Vorlagen mit Netz oder Fixierhose oft als hautfreundliche Versorgung gelten.
          </li>
          <li>
            <strong>Pants</strong> sehen normaler Unterwäsche ähnlich und werden wie Unterhosen angezogen. Sie können
            besonders sinnvoll sein, wenn Menschen mobil sind, sich selbstständig anziehen möchten oder bei kognitiven
            Einschränkungen andere Produkte nicht akzeptieren.
          </li>
          <li>
            <strong>Windelhosen oder Windelslips</strong> sind besonders praktisch bei stärkerer Inkontinenz, eingeschränkter
            Beweglichkeit, Bettlägerigkeit oder Pflege durch Angehörige.
          </li>
          <li>
            <strong>Bettschutzeinlagen</strong> schützen Matratze, Sofa oder Rollstuhl zusätzlich, ersetzen aber kein
            körpernahes Inkontinenzprodukt. Pflege.de beschreibt Bettschutzeinlagen als Ergänzung, nicht als Ersatz für
            andere Inkontinenzhilfsmittel.
          </li>
          <li>
            Auf Rezept ist vieles möglich, aber nicht jedes Wunschprodukt wird automatisch ohne Mehrkosten übernommen.
            Entscheidend sind medizinische Notwendigkeit, richtige Begründung und passende Versorgung.
          </li>
        </ul>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="02" id="bedeutung" heading="Warum das richtige Inkontinenzprodukt so wichtig ist">
        <p>
          Das passende Inkontinenzmaterial entscheidet nicht nur darüber, ob Kleidung trocken bleibt. Es beeinflusst auch
          Hautgesundheit, Schlaf, Mobilität, Selbstvertrauen und Pflegeaufwand.
        </p>
        <p className="mt-4">Ein ungeeignetes Produkt kann zu typischen Problemen führen:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Auslaufen trotz regelmäßigem Wechsel</li>
          <li>unangenehme Gerüche</li>
          <li>Wundsein und Hautreizungen</li>
          <li>Druckstellen durch falsche Größe</li>
          <li>Unsicherheit beim Verlassen der Wohnung</li>
          <li>häufiges Wechseln in der Nacht</li>
          <li>unnötig hohe Kosten durch falsche Produktauswahl</li>
          <li>Scham und Rückzug aus dem Alltag</li>
        </ul>
        <p className="mt-4">
          Gerade Angehörige merken oft erst spät, dass nicht die Inkontinenz allein das Problem ist, sondern die falsche
          Versorgung. Wenn ein Produkt nicht richtig sitzt oder nicht zur Alltagssituation passt, hilft auch eine höhere
          Saugstärke nicht immer.
        </p>
        <p className="mt-4">
          Die Verbraucherzentrale nennt bei der Auswahl von Inkontinenzhilfen unter anderem Größe und Gewicht, Trinkmenge,
          Saugstärke, Geschlecht und Hautprobleme als wichtige Kriterien.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="03" id="produkte" heading="Welche Inkontinenzprodukte gibt es?">
        <p>
          Inkontinenzprodukte lassen sich grob in körpernah getragene Produkte, schützende Ergänzungsprodukte und ableitende
          Hilfsmittel einteilen. Für die meisten Menschen geht es zuerst um die Frage: Einlage, Vorlage, Pants oder Windel?
        </p>

        <ArticleStepHeading>Inkontinenzeinlagen</ArticleStepHeading>
        <p className="mt-3">
          Inkontinenzeinlagen sind relativ dünne, aufsaugende Produkte. Sie werden in der Unterwäsche getragen und ähneln
          optisch oft Damenbinden, sind aber anders aufgebaut. Sie sind für Urinverlust entwickelt und können Flüssigkeit
          besser aufnehmen und einschließen.
        </p>
        <p className="mt-4">
          Einlagen eignen sich vor allem bei leichter Blasenschwäche, zum Beispiel wenn beim Husten, Lachen, Niesen,
          Treppensteigen oder Sport kleine Mengen Urin verloren gehen.
        </p>
        <SuitabilityList
          geeignet={[
            "leichte Harninkontinenz",
            "mobile Menschen",
            "Menschen, die sehr diskrete Produkte wünschen",
            "gelegentlichen Urinverlust",
            "Alltagssituationen mit geringem Risiko",
          ]}
          wenigerGeeignet={[
            "mittlere bis schwere Inkontinenz",
            "Stuhlinkontinenz",
            "nächtliches Auslaufen",
            "bettlägerige Personen",
            "Menschen mit hohem Wechselbedarf",
          ]}
        />
        <p className="mt-4">
          Ein häufiger Fehler: Betroffene nutzen zu lange einfache Einlagen, obwohl der Bedarf längst größer ist. Dann
          kommt es zu Auslaufen, Hautfeuchtigkeit und Unsicherheit.
        </p>

        <ArticleStepHeading>Inkontinenzvorlagen mit Fixierhose</ArticleStepHeading>
        <p className="mt-3">
          Vorlagen sind größer und saugstärker als einfache Einlagen. Sie werden meist mit einer speziellen Fixierhose
          oder Netzhose getragen, damit sie eng am Körper anliegen. Genau dieser körpernahe Sitz ist entscheidend, damit
          Flüssigkeit schnell aufgenommen wird und nichts verrutscht.
        </p>
        <p className="mt-4">
          Der GKV-Spitzenverband beschreibt Inkontinenzvorlagen als Produkte, die in einer Fixierhose getragen werden.
          Aufsaugende Inkontinenzhilfen sind mehrschichtig aufgebaut, sollen Urin aufsaugen, Stuhlgang auffangen,
          Dauerbefeuchtung der Haut vermeiden und Gerüche binden.
        </p>
        <SuitabilityList
          geeignet={[
            "mittlere Inkontinenz",
            "stärkeren Urinverlust",
            "Menschen mit empfindlicher Haut",
            "Versorgung tagsüber und nachts",
            "Pflegesituationen mit regelmäßigem Wechsel",
            "Personen, bei denen eine Fixierhose gut akzeptiert wird",
          ]}
          wenigerGeeignet={[
            "Menschen, die die Fixierhose nicht tolerieren",
            "stark unruhige Personen",
            "Personen mit Demenz, die Vorlagen herausziehen",
            "Menschen, die sich unterwegs besonders einfach selbst versorgen möchten",
          ]}
        />
        <p className="mt-4">
          Vorlagen sind oft eine sehr gute medizinische Versorgung. Sie wirken aber nur dann zuverlässig, wenn Größe,
          Saugstärke und Fixierhose zusammenpassen.
        </p>

        <div id="pants">
          <ArticleStepHeading>Pants beziehungsweise Inkontinenzunterhosen</ArticleStepHeading>
          <p className="mt-3">
            Pants werden wie normale Unterwäsche angezogen. Sie haben einen elastischen Bund, sitzen körpernah und werden
            zum Wechseln meist seitlich aufgerissen. Viele Menschen empfinden Pants als würdevoller und diskreter, weil
            sie weniger nach Pflegeprodukt aussehen.
          </p>
          <p className="mt-4">
            Der GKV-Spitzenverband beschreibt Inkontinenzunterhosen ohne Verschlusssystem als Produkte, die wegen ihres
            elastischen Hüftbundes wie normale Unterwäsche an und ausgezogen werden können. Gleichzeitig wird darauf
            hingewiesen, dass Pants gegenüber wiederverschließbaren Windelhosen nicht grundsätzlich einen medizinischen
            Vorteil haben, aber bei körperlichen oder kognitiven Einschränkungen im Einzelfall geeignet und notwendig
            sein können.
          </p>
          <SuitabilityList
            geeignet={[
              "mobile Menschen",
              "Menschen, die noch selbst zur Toilette gehen",
              "Personen mit Wunsch nach diskreter Versorgung",
              "Demenz, wenn andere Produkte entfernt werden",
              "eingeschränkte Handmotorik",
              "Menschen, die Vorlagen nicht akzeptieren",
              "Alltag, Spaziergänge, Termine und soziale Teilhabe",
            ]}
            wenigerGeeignet={[
              "bettlägerige Personen",
              "Pflegesituationen, in denen häufig im Liegen gewechselt wird",
              "sehr schwere Inkontinenz, wenn Saugstärke nicht ausreicht",
              "Menschen, bei denen das komplette Ausziehen beim Wechsel schwierig ist",
            ]}
          />
          <p className="mt-4">
            Wichtig: Pants sind beliebt, aber bei der Kostenübernahme auf Rezept kommt es stark auf die Begründung an.
            Wenn Pants medizinisch notwendig sind, sollte auf dem Rezept genau stehen, warum Vorlagen mit Fixierhose
            nicht ausreichend oder nicht zweckmäßig sind. Die Verbraucherzentrale weist ausdrücklich darauf hin, dass die
            Gründe für eine von der Regelversorgung abweichende Versorgung aus der ärztlichen Verordnung hervorgehen
            sollten.
          </p>
          <PflegegradCallout title="Beispiel für eine klare Begründung bei Pants">
            „Vorlagen mit Fixierhose sind aufgrund kognitiver Einschränkungen nicht ausreichend zweckmäßig. Pants werden
            besser akzeptiert und ermöglichen die selbstständige Lebensführung. Aufsaugende Inkontinenzpants sind
            medizinisch erforderlich.“
          </PflegegradCallout>
        </div>

        <InkontinenzProductCtaBox
          dataCta="inko-produkt-pants"
          clickEvent="inko_cta_inline_click"
          heading="Pants auf Rezept? Die Begründung ist entscheidend."
        >
          <p>
            Wir erklären Ihnen, worauf es bei Rezept, Krankenkasse und Produktauswahl ankommt – damit Pants bei medizinischer
            Notwendigkeit ohne unnötige Aufzahlung möglich sind.
          </p>
        </InkontinenzProductCtaBox>

        <ArticleStepHeading>Windelhosen oder Windelslips für Erwachsene</ArticleStepHeading>
        <p className="mt-3">
          Windelhosen, Windelslips oder Erwachsenenwindeln sind aufsaugende Inkontinenzprodukte mit seitlichen
          Verschlüssen. Sie können im Stehen oder Liegen angelegt werden und sind besonders praktisch, wenn Angehörige
          oder Pflegekräfte beim Wechsel helfen.
        </p>
        <p className="mt-4">
          Pflege.de beschreibt Windeln für Erwachsene als Produkte, die beim Anziehen an den Seiten mit Klebe- oder
          Klettstreifen verschlossen werden und sich dadurch auch bei weniger beweglichen oder bettlägerigen Personen
          einfacher anlegen lassen.
        </p>
        <SuitabilityList
          geeignet={[
            "stärkere Harninkontinenz",
            "Stuhlinkontinenz",
            "Bettlägerigkeit",
            "eingeschränkte Mobilität",
            "Versorgung im Liegen",
            "Nachtversorgung",
            "Pflege durch Angehörige oder Pflegekräfte",
          ]}
          wenigerGeeignet={[
            "sehr mobile Menschen, die sich selbstständig versorgen möchten",
            "Menschen, die eine möglichst unterwäscheähnliche Lösung wünschen",
            "Personen, die seitliche Verschlüsse als störend empfinden",
          ]}
        />
        <p className="mt-4">
          Windelhosen sind oft die zuverlässigste Lösung, wenn Sicherheit, Saugstärke und einfacher Wechsel im Vordergrund
          stehen.
        </p>

        <ArticleStepHeading>Bettschutzeinlagen und Inkontinenzunterlagen</ArticleStepHeading>
        <p className="mt-3">
          Bettschutzeinlagen werden auf Matratzen, Sesseln, Sofas oder Rollstühlen genutzt. Sie schützen Oberflächen vor
          Feuchtigkeit und erleichtern die Reinigung. Es gibt Einwegprodukte und waschbare Varianten.
        </p>
        <p className="mt-4">
          Wichtig ist: Bettschutzeinlagen sind eine Ergänzung. Sie ersetzen keine körpernah getragene Versorgung. Wer
          nachts regelmäßig ausläuft, braucht meist nicht nur eine Unterlage, sondern ein besser passendes Produkt für
          die Nacht.
        </p>
        <SuitabilityList
          geeignet={[
            "zusätzlichen Matratzenschutz",
            "nächtliche Sicherheit",
            "Pflegebett, Rollstuhl oder Lieblingssessel",
            "Menschen mit gelegentlichem Auslaufen",
            "Entlastung von Angehörigen",
          ]}
          wenigerGeeignet={[
            "stärkerer Harninkontinenz als alleinige Lösung",
            "Stuhlinkontinenz als alleinige Lösung",
            "regelmäßiger Nachtinkontinenz als alleinige Lösung",
            "Hautproblemen durch Feuchtigkeit als alleinige Lösung",
          ]}
        />

        <ArticleStepHeading>Ableitende Inkontinenzhilfen</ArticleStepHeading>
        <p className="mt-3">
          Ableitende Hilfsmittel fangen Urin nicht auf, sondern leiten ihn ab. Dazu gehören je nach medizinischer
          Situation zum Beispiel Urinbeutel, Katheter oder externe Urinableiter. Sie kommen nicht für jeden infrage und
          sollten immer ärztlich beziehungsweise pflegerisch begleitet werden.
        </p>
        <p className="mt-4">
          Der GKV-Spitzenverband führt in der Produktgruppe 15 neben aufsaugenden Hilfsmitteln auch ableitende
          Inkontinenzhilfen auf, darunter Urinbeutel, Stuhlauffangbeutel und verschiedene Katheterversorgungen.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="04" id="vergleich" heading="Vergleich: Einlagen, Vorlagen, Pants oder Windeln?">
        <p>
          Die folgende Übersicht hilft bei der ersten Orientierung. Entscheidend bleibt aber immer, wie das Produkt im
          Alltag sitzt und ob es zur konkreten Lebenssituation passt.
        </p>
        <ProductCompareTable />
        <InkontinenzProductCtaBox
          dataCta="inko-produkt-vergleich"
          clickEvent="inko_cta_inline_click"
          heading="Unsicher, welches Produkt passt?"
        >
          <p>
            Einlagen, Vorlagen, Pants oder Windeln: Wir helfen Ihnen persönlich bei der Auswahl. Lassen Sie sich kostenlos
            beraten und erhalten Sie auf Wunsch ein{" "}
            <Link href="/pflegeshop" className={LINK}>
              kostenloses Testpaket
            </Link>
            .
          </p>
        </InkontinenzProductCtaBox>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="05" id="leicht" heading="Welches Inkontinenzmaterial passt bei leichter Inkontinenz?">
        <p>
          Bei leichter Inkontinenz verlieren Betroffene meist nur kleine Mengen Urin. Häufig passiert das beim Husten,
          Niesen, Lachen, Heben, Treppensteigen oder Sport. Viele Menschen sind in dieser Phase noch vollständig mobil
          und möchten ein Produkt, das möglichst unsichtbar ist.
        </p>
        <p className="mt-4">
          In solchen Fällen können Inkontinenzeinlagen sinnvoll sein. Sie sind diskret, dünn und einfach zu wechseln.
          Wichtig ist aber, echte Inkontinenzeinlagen zu verwenden, nicht normale Damenbinden. Inkontinenzeinlagen sind
          für Urin entwickelt, binden Flüssigkeit anders und schützen besser vor Geruch.
        </p>
        <p className="mt-4">Typische Empfehlung bei leichter Inkontinenz:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>diskrete Einlagen für den Tag</li>
          <li>höhere Saugstärke für längere Termine</li>
          <li>Reserveprodukt für unterwegs</li>
          <li>bei zunehmendem Bedarf Wechsel auf Vorlagen prüfen</li>
        </ul>
        <p className="mt-4">
          Wenn Einlagen regelmäßig auslaufen, sich feucht anfühlen oder mehrmals täglich gewechselt werden müssen, sollte
          die Versorgung neu bewertet werden.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="06" id="mittel" heading="Welches Inkontinenzmaterial passt bei mittlerer Inkontinenz?">
        <p>
          Bei mittlerer Inkontinenz reichen einfache Einlagen oft nicht mehr aus. Betroffene verlieren größere Mengen
          Urin oder benötigen mehr Sicherheit über mehrere Stunden. Hier sind Vorlagen mit Fixierhose häufig eine gute
          Lösung.
        </p>
        <p className="mt-4">
          Sie bieten mehr Saugstärke, sitzen körpernah und können je nach Tageszeit angepasst werden. Tagsüber kann eine
          dünnere Vorlage ausreichen, nachts oder unterwegs kann eine stärkere Variante sinnvoll sein.
        </p>
        <p className="mt-4">Typische Empfehlung bei mittlerer Inkontinenz:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Vorlagen mit passender Fixierhose</li>
          <li>verschiedene Saugstärken für Tag und Nacht</li>
          <li>regelmäßige Hautkontrolle</li>
          <li>Test verschiedener Größen</li>
          <li>Beratung zur richtigen Anlage</li>
        </ul>
        <p className="mt-4">
          Besonders wichtig ist die Passform. Eine zu große Vorlage ist nicht automatisch sicherer. Wenn sie nicht eng
          anliegt, kann sie schneller auslaufen.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="07" id="schwer" heading="Welches Inkontinenzmaterial passt bei schwerer Inkontinenz?">
        <p>
          Bei schwerer Inkontinenz geht es vor allem um Sicherheit. Betroffene verlieren größere Mengen Urin, haben
          eventuell zusätzlich Stuhlinkontinenz oder benötigen Unterstützung beim Wechsel. Hier kommen häufig saugstarke
          Vorlagen, Windelhosen oder spezielle Nachtprodukte infrage.
        </p>
        <p className="mt-4">
          Bei Pflegebedürftigkeit oder Bettlägerigkeit sind Windelhosen oft praktischer, weil sie im Liegen gewechselt
          werden können. Bei mobilen Menschen können saugstarke Pants sinnvoll sein, wenn sie ausreichend schützen und
          die Person dadurch selbstständiger bleibt.
        </p>
        <p className="mt-4">Typische Empfehlung bei schwerer Inkontinenz:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>saugstarke Vorlagen oder Windelhosen</li>
          <li>Nachtversorgung mit höherer Saugstärke</li>
          <li>zusätzliche Bettschutzeinlage</li>
          <li>regelmäßiger Wechselplan</li>
          <li>Hautschutz und Hautkontrolle</li>
          <li>ärztliche Begründung bei besonderem Produktbedarf</li>
        </ul>
        <p className="mt-4">
          Die AOK weist darauf hin, dass medizinisch erforderliche Inkontinenzhilfen grundsätzlich mehrkostenfrei
          abzugeben oder zu liefern sind und dass die Lieferung in ausreichender Menge an den individuellen medizinisch
          notwendigen Bedarf angepasst sein soll.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="08" id="nacht" heading="Welche Produkte eignen sich nachts?">
        <p>
          Nachts gelten andere Regeln als tagsüber. Im Schlaf wird das Produkt länger getragen, Bewegungen sind anders
          und Betroffene merken Urinverlust oft nicht sofort. Deshalb reicht die Tagesversorgung nachts häufig nicht aus.
        </p>
        <p className="mt-4">Typische Probleme nachts:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Produkt läuft seitlich aus</li>
          <li>Bettwäsche ist morgens nass</li>
          <li>Haut ist lange feucht</li>
          <li>Angehörige müssen nachts wechseln</li>
          <li>Betroffene schlafen schlecht</li>
          <li>Scham und Frust nehmen zu</li>
        </ul>
        <p className="mt-4">
          Für die Nacht eignen sich je nach Situation saugstarke Vorlagen, Windelhosen oder spezielle Nacht-Pants.
          Zusätzlich kann eine Bettschutzeinlage sinnvoll sein. Sie sollte aber nicht die einzige Lösung sein.
        </p>
        <PflegegradCallout title="Praxis-Tipp">
          Wenn das Bett morgens nass ist, ist nicht immer die Saugstärke allein das Problem. Häufig passen Größe, Schnitt
          oder Anlage nicht richtig. Auch Trinkverhalten, Schlafposition und Wechselzeitpunkt spielen eine Rolle.
        </PflegegradCallout>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="09" id="demenz" heading="Welche Produkte eignen sich bei Demenz?">
        <p>
          Bei Demenz ist die Versorgung besonders sensibel. Viele Betroffene verstehen nicht, warum sie ein
          Inkontinenzprodukt tragen sollen. Manche ziehen Vorlagen heraus, öffnen Windeln oder lehnen sichtbare
          Pflegeprodukte ab.
        </p>
        <p className="mt-4">
          In solchen Fällen können Pants hilfreich sein, weil sie normaler Unterwäsche ähneln. Sie können Würde und
          Selbstständigkeit erhalten und werden oft besser akzeptiert.
        </p>
        <p className="mt-4">
          Der GKV-Spitzenverband nennt körperliche und/oder kognitive Einschränkungen ausdrücklich als mögliche
          Situation, in der Inkontinenzunterhosen ohne Verschlusssystem eine geeignete und notwendige Versorgung
          darstellen können, wenn Vorlagen und Netzhosen nicht bedarfsgerecht sind.
        </p>
        <p className="mt-4">Geeignet bei Demenz können sein:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Pants bei mobilen Personen</li>
          <li>Windelhosen bei stärkerer Pflegebedürftigkeit</li>
          <li>einfache Kleidung für schnellen Wechsel</li>
          <li>diskrete Produkte ohne „Krankenhausgefühl“</li>
          <li>feste Routinen beim Toilettengang</li>
        </ul>
        <p className="mt-4">
          Wichtig: Bei Demenz sollte auf dem Rezept genau begründet werden, warum ein bestimmtes Produkt notwendig ist.
          Zum Beispiel: „Vorlagen werden entfernt“, „Pants werden besser akzeptiert“, „selbstständiges An- und Ausziehen
          soll erhalten bleiben“.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="10" id="angehoerige" heading="Welche Produkte eignen sich für Angehörige in der Pflege?">
        <p>
          Angehörige brauchen eine Versorgung, die nicht nur theoretisch gut ist, sondern im Alltag funktioniert. Ein
          Produkt muss sicher sein, schnell gewechselt werden können, die Haut schützen und die Würde der betroffenen
          Person bewahren.
        </p>
        <p className="mt-4">
          Wenn die Person noch mobil ist, können Pants oder Vorlagen sinnvoll sein. Wenn sie überwiegend liegt oder beim
          Wechsel vollständig unterstützt werden muss, sind Windelhosen oft praktischer.
        </p>
        <p className="mt-4">Für die Pflege wichtig:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>einfache Handhabung</li>
          <li>guter Auslaufschutz</li>
          <li>richtige Größe</li>
          <li>verlässliche Nachtversorgung</li>
          <li>möglichst wenig Hautfeuchtigkeit</li>
          <li>diskrete Entsorgung</li>
          <li>ausreichende Liefermenge</li>
          <li>
            <Link href="/kontakt?thema=inkontinenzversorgung" className={LINK}>
              Beratung für Angehörige
            </Link>
          </li>
        </ul>
        <p className="mt-4">
          Gerade Angehörige sollten nicht zu lange allein ausprobieren. Eine gute Beratung spart Zeit, Geld und Nerven.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="11" id="stuhl" heading="Welche Produkte eignen sich bei Stuhlinkontinenz?">
        <p>
          Stuhlinkontinenz stellt andere Anforderungen als reine Harninkontinenz. Hier geht es nicht nur um Saugstärke,
          sondern auch um sicheren Sitz, Geruchsbindung, Hautschutz und einfache Reinigung.
        </p>
        <p className="mt-4">
          Bei Stuhlinkontinenz werden häufig Vorlagen mit Fixierhose oder Windelhosen eingesetzt. Pants können im
          Einzelfall geeignet sein, wenn die Person mobil ist und die Pants ausreichend Schutz bieten. Bei schwerer
          Stuhlinkontinenz oder Pflege im Liegen sind Windelhosen oft praktischer.
        </p>
        <p className="mt-4">
          Wichtig ist eine fachliche Beratung, weil Hautreizungen bei Stuhlinkontinenz besonders schnell entstehen
          können.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="12" id="geschlecht" heading="Frauen und Männer: Gibt es Unterschiede?">
        <p>
          Viele Inkontinenzprodukte sind unisex. Trotzdem kann das Geschlecht bei der Auswahl eine Rolle spielen, weil
          sich Körperbau, Sitz und Schwerpunkt des Urinverlustes unterscheiden können. Die Verbraucherzentrale nennt das
          Geschlecht als einen von mehreren Auswahlfaktoren, auch wenn viele aufsaugende Hilfsmittel für Frauen und
          Männer gleichermaßen geeignet sind.
        </p>
        <p className="mt-4">
          Für Frauen sind häufig anatomisch passende Einlagen oder Vorlagen wichtig. Bei Männern können je nach Art der
          Inkontinenz spezielle Einlagen, Vorlagen oder ableitende Systeme infrage kommen. Entscheidend ist nicht das
          Etikett „für Männer“ oder „für Frauen“, sondern ob das Produkt im Alltag sicher sitzt.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="13" id="rezept-kaufen" heading="Rezept oder selbst kaufen: Was ist sinnvoll?">
        <p>
          Viele Menschen kaufen Inkontinenzprodukte zunächst selbst. Das ist verständlich, aber auf Dauer oft teuer. Wenn
          eine mindestens mittelgradige Harn- oder Stuhlinkontinenz vorliegt und die Versorgung medizinisch notwendig ist,
          kann eine ärztliche Verordnung sinnvoll sein.
        </p>
        <p className="mt-4">
          Die Verbraucherzentrale erklärt, dass gesetzlich Krankenversicherte für Inkontinenzhilfen auf Kosten der
          Krankenkasse zunächst eine ärztliche Verordnung benötigen. Die Krankenkasse zahlt bei mindestens mittelgradiger
          Harn- und/oder Stuhlinkontinenz; als Richtwert nennt die Verbraucherzentrale mehr als 100 ml in vier Stunden.
        </p>
        <p className="mt-4">
          Auf dem Rezept sollten Diagnose, Produktart, Menge, Versorgungszeitraum und der medizinische Grund stehen. Je
          genauer die Verordnung ist, desto einfacher ist der Weg zur passenden Versorgung. Mehr dazu im Ratgeber{" "}
          <Link href="/ratgeber/inkontinenzmaterial-auf-rezept-anspruch-kosten-ablauf" className={LINK}>
            Inkontinenzmaterial auf Rezept: Anspruch, Kosten und Ablauf
          </Link>
          .
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="14" id="krankenkasse" heading="Zahlt die Krankenkasse Einlagen, Vorlagen, Pants oder Windeln?">
        <p>
          Grundsätzlich können aufsaugende Inkontinenzhilfen von der gesetzlichen Krankenkasse übernommen werden, wenn
          sie medizinisch notwendig sind. Die AOK nennt als Beispiele Windeln für Erwachsene, Inkontinenzvorlagen,
          Fixierhosen und Windelhosen. Die Versorgung erfolgt über Rezept und Vertragspartner wie Apotheke, Sanitätshaus
          oder andere Leistungserbringer.
        </p>
        <p className="mt-4">
          Die gesetzliche Zuzahlung für zum Verbrauch bestimmte Hilfsmittel wie Inkontinenzhilfen beträgt 10 Prozent der
          Kosten pro Packung, maximal aber 10 Euro für den gesamten Monatsbedarf. Das Bundesgesundheitsministerium nennt
          Inkontinenzhilfen ausdrücklich als Beispiel für zum Verbrauch bestimmte Hilfsmittel.
        </p>
        <p className="mt-4">
          Wichtig ist die Unterscheidung zwischen gesetzlicher Zuzahlung und freiwilliger Aufzahlung. Eine Aufzahlung
          kann entstehen, wenn Versicherte ein Produkt wünschen, das über das medizinisch notwendige Maß hinausgeht.
          Medizinisch notwendige Hilfsmittel und notwendige Dienstleistungen sind Teil des Anspruchs; wer Leistungen über
          das Notwendige hinaus wählt, muss Mehrkosten selbst tragen.
        </p>
        <p className="mt-4">
          Alltagshilfe-Süd unterstützt Sie bei der{" "}
          <Link href="/pflegeshop#qualitaetsversprechen-pflegeshop" className={LINK}>
            Inkontinenzversorgung auf Rezept
          </Link>{" "}
          – von der Beratung über das Rezept bis zur regelmäßigen Lieferung.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="15" id="testpaket" heading="Warum ein Testpaket so sinnvoll ist">
        <p>
          Inkontinenzprodukte kann man nicht zuverlässig nur nach Foto, Packungsgröße oder Saugstärke auswählen.
          Entscheidend ist, wie das Produkt am Körper sitzt und im Alltag funktioniert.
        </p>
        <p className="mt-4">Ein Testpaket hilft, typische Fragen zu klären:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Welche Größe sitzt richtig?</li>
          <li>Reicht die Saugstärke tagsüber?</li>
          <li>Brauche ich nachts ein anderes Produkt?</li>
          <li>Ist eine Vorlage oder Pants angenehmer?</li>
          <li>Gibt es Hautreizungen?</li>
          <li>Lässt sich das Produkt gut wechseln?</li>
          <li>Fühlt sich die Person sicher genug, das Haus zu verlassen?</li>
        </ul>
        <p className="mt-4">
          Gerade bei Angehörigen, Demenz, Nachtproblemen oder Unsicherheit zur Rezeptversorgung ist ein Testpaket oft der
          schnellste Weg zur passenden Lösung. Im{" "}
          <Link href="/pflegeshop" className={LINK}>
            Pflegeshop
          </Link>{" "}
          können Sie ein{" "}
          <Link href="/pflegeshop" className={LINK}>
            kostenloses Testpaket erhalten
          </Link>
          .
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="16" id="fehler" heading="Häufige Fehler bei der Auswahl von Inkontinenzmaterial">
        <ArticleStepHeading>Fehler 1: Zu kleine oder zu große Produkte verwenden</ArticleStepHeading>
        <p className="mt-3">
          Viele denken: größer bedeutet sicherer. Das stimmt nicht immer. Ein zu großes Produkt liegt oft nicht eng genug
          an und kann seitlich auslaufen. Ein zu kleines Produkt drückt, schneidet ein oder deckt nicht ausreichend ab.
        </p>
        <ArticleStepHeading>Fehler 2: Nur auf Saugstärke achten</ArticleStepHeading>
        <p className="mt-3">
          Saugstärke ist wichtig, aber nicht alles. Passform, Rücknässung, Hautverträglichkeit, Geruchsbindung und
          Wechselrhythmus sind genauso entscheidend.
        </p>
        <ArticleStepHeading>Fehler 3: Tagesprodukt auch nachts verwenden</ArticleStepHeading>
        <p className="mt-3">
          Nachts wird ein Produkt länger getragen. Deshalb braucht die Nachtversorgung oft mehr Saugstärke, anderen
          Schnitt oder zusätzliche Sicherheit.
        </p>
        <ArticleStepHeading>Fehler 4: Pants ohne medizinische Begründung auf Rezept erwarten</ArticleStepHeading>
        <p className="mt-3">
          Pants können sehr sinnvoll sein. Ohne gute medizinische Begründung kann es aber schwieriger werden, sie ohne
          Aufzahlung zu erhalten. Besonders wichtig sind Begründungen wie Demenz, eingeschränkte Handmotorik, Erhalt der
          Selbstständigkeit oder fehlende Eignung von Vorlagen.
        </p>
        <ArticleStepHeading>Fehler 5: Zu spät Beratung nutzen</ArticleStepHeading>
        <p className="mt-3">
          Wer monatelang selbst testet, gibt oft unnötig Geld aus. Eine gute Beratung kann schneller zum passenden
          Produkt führen.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="17" id="entscheidung" heading="Entscheidungshilfe: Welches Produkt passt wahrscheinlich?">
        <ul className="mt-2 list-none space-y-4">
          <li>
            <strong>Wenn Sie nur kleine Mengen Urin verlieren:</strong> Dann können Einlagen ausreichen. Achten Sie
            darauf, echte Inkontinenzeinlagen zu nutzen.
          </li>
          <li>
            <strong>Wenn Einlagen regelmäßig auslaufen:</strong> Dann sind Vorlagen mit Fixierhose oder saugstärkere
            Produkte wahrscheinlich sinnvoller.
          </li>
          <li>
            <strong>Wenn Sie mobil sind und normale Unterwäsche wünschen:</strong> Dann können Pants gut passen,
            besonders tagsüber und unterwegs.
          </li>
          <li>
            <strong>Wenn Angehörige beim Wechsel helfen:</strong> Dann können Vorlagen oder Windelhosen praktischer sein.
          </li>
          <li>
            <strong>Wenn die Person bettlägerig ist:</strong> Dann sind Windelhosen häufig einfacher zu wechseln als
            Pants.
          </li>
          <li>
            <strong>Wenn Demenz vorliegt:</strong> Dann können Pants sinnvoll sein, wenn sie besser akzeptiert werden.
            Bei stärkerem Pflegebedarf können Windelhosen geeigneter sein.
          </li>
          <li>
            <strong>Wenn nachts das Bett nass wird:</strong> Dann sollte die Nachtversorgung überprüft werden. Oft
            braucht es ein stärkeres oder anders sitzendes Produkt plus Bettschutzeinlage.
          </li>
        </ul>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="18" id="checkliste" heading="Checkliste für die Produktauswahl">
        <p>Bevor Sie ein Produkt dauerhaft nutzen oder auf Rezept beantragen, beantworten Sie diese Fragen:</p>
        <ul className="mt-5 list-none space-y-3">
          <ChecklistItem>Wie stark ist die Inkontinenz?</ChecklistItem>
          <ChecklistItem>Tritt sie tagsüber, nachts oder dauerhaft auf?</ChecklistItem>
          <ChecklistItem>Geht es nur um Urin oder auch um Stuhl?</ChecklistItem>
          <ChecklistItem>Ist die Person mobil?</ChecklistItem>
          <ChecklistItem>Kann sie sich selbst an und ausziehen?</ChecklistItem>
          <ChecklistItem>Gibt es Demenz oder kognitive Einschränkungen?</ChecklistItem>
          <ChecklistItem>Wird das Produkt im Stehen, Sitzen oder Liegen gewechselt?</ChecklistItem>
          <ChecklistItem>Gibt es Hautprobleme?</ChecklistItem>
          <ChecklistItem>Wie viele Produkte werden pro Tag gebraucht?</ChecklistItem>
          <ChecklistItem>Gibt es Auslaufen trotz regelmäßigem Wechsel?</ChecklistItem>
          <ChecklistItem>Wird ein Produkt für zuhause, unterwegs oder nachts gesucht?</ChecklistItem>
          <ChecklistItem>Soll die Versorgung über Rezept laufen?</ChecklistItem>
        </ul>
        <p className="mt-4">
          Diese Antworten helfen enorm bei Beratung, Testpaket und ärztischer Verordnung.
        </p>
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="19" id="beratung" heading="Wann sollten Sie professionelle Beratung nutzen?">
        <p>Beratung ist besonders sinnvoll, wenn:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Sie nicht wissen, welches Produkt passt</li>
          <li>Produkte regelmäßig auslaufen</li>
          <li>die Haut gereizt ist</li>
          <li>nachts Bettwäsche nass wird</li>
          <li>Demenz vorliegt</li>
          <li>Angehörige überfordert sind</li>
          <li>ein Rezept beantragt werden soll</li>
          <li>Pants ohne Aufzahlung benötigt werden</li>
          <li>der Verbrauch sehr hoch ist</li>
          <li>die Krankenkasse oder der Anbieter nur eingeschränkt hilft</li>
        </ul>
        <p className="mt-4">
          Eine gute Beratung betrachtet nicht nur das Produkt, sondern die ganze Situation: Mobilität, Haut, Pflegealltag,
          Schweregrad, Nachtversorgung, Rezept und Lieferung.
        </p>
        <InkontinenzProductBeratungCta />
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="20" id="faq-inko-produkte" heading="FAQ: Häufige Fragen zu Einlagen, Vorlagen, Pants und Windeln">
        <PflegegradFaqAccordion items={EINLAGEN_VORLAGEN_PANTS_WINDELN_FAQ} />
      </ArticleSectionHeading>

      <ArticleSectionHeading sectionNum="21" id="fazit" heading="Fazit: Das beste Inkontinenzprodukt ist das, das zu Ihrem Alltag passt">
        <p>
          Es gibt nicht das eine beste Inkontinenzmaterial für alle. Einlagen, Vorlagen, Pants und Windeln haben jeweils
          ihren richtigen Einsatzbereich.
        </p>
        <p className="mt-4">
          Einlagen passen eher bei leichter Blasenschwäche. Vorlagen mit Fixierhose sind oft eine gute Versorgung bei
          mittlerer Inkontinenz. Pants helfen mobilen Menschen, die Diskretion und Selbstständigkeit wünschen.
          Windelhosen sind häufig die bessere Wahl bei schwerer Inkontinenz, Bettlägerigkeit oder Pflege durch Angehörige.
        </p>
        <p className="mt-4">
          Entscheidend ist nicht, welches Produkt auf der Packung am besten klingt. Entscheidend ist, welches Produkt im
          Alltag sicher sitzt, die Haut schützt, nicht ausläuft und zur Lebenssituation passt.
        </p>
        <p className="mt-4">
          Wenn Sie unsicher sind,{" "}
          <Link href="/kontakt?thema=inkontinenzversorgung" className={LINK}>
            lassen Sie sich beraten
          </Link>{" "}
          und testen Sie verschiedene Produkte. So finden Sie schneller die Versorgung, die wirklich hilft.
        </p>
      </ArticleSectionHeading>

      <InkontinenzProductEndCta />

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
            Pflege.de – Inkontinenzprodukte und Windeln für Erwachsene:{" "}
            <a
              href="https://www.pflege.de/altenpflege/inkontinenz/inkontinenzprodukte/"
              className={LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              pflege.de
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
        </ul>
        <p className="mt-8 text-[0.95rem] text-neutral-600">
          Hinweis: Dieser Ratgeber ersetzt keine Rechtsberatung und keine Entscheidung Ihrer Krankenkasse. Prüfen Sie
          Bescheide und Fristen im Einzelfall.
        </p>
      </section>

      <InkoRatgeberArticleFooter currentSlug={INKO_PRODUKT_RATGEBER_SLUG} />
    </div>
  );
}
