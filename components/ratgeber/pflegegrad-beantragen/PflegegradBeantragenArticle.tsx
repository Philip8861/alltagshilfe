import Link from "next/link";
import {
  RatArtH2,
  RatBenefitsTable,
  RatChecklistCard,
  RatExternalLink,
  RatFaqAccordion,
  RatInfoBox,
  RatProseParagraph,
  RatQuoteBox,
  RatQuickAnswerBox,
  RatResponsiveTable,
  RatServiceCtaSection,
  RatSourcesFooter,
  RatStepCard,
  RatTocNav,
} from "@/components/ratgeber/article/RatgeberArticleUi";

export const PFLEGEGRAD_ARTICLE_TOC_ENTRIES = [
  { id: "wann-pflegegrad-beantragen", label: "Wann sollte man beantragen?" },
  { id: "schritt-fuer-schritt-pflegegrad", label: "Schritt für Schritt" },
  { id: "was-wird-geprueft-md", label: "Was wird begutachtet?" },
  { id: "pflegegrade-punkte", label: "Welcher Pflegegrad?" },
  { id: "leistungen-nach-pflegegrad", label: "Leistungen 2026" },
  { id: "haeufige-fehler-ant", label: "Häufige Fehler" },
  { id: "pflegegrad-abgelehnt-md", label: "Wenn es abgelehnt wird" },
  { id: "praxisbeispiel-mueller", label: "Praxisbeispiel" },
  { id: "alltagshilfe-suend", label: "Alltagshilfe-Süd" },
  { id: "checkliste-pflegegrad", label: "Checkliste" },
  { id: "faq-pflegegrad-antrag", label: "Häufige Fragen" },
  { id: "quellen-pflegegrad", label: "Quellen" },
] as const;

const TOC_ENTRIES = PFLEGEGRAD_ARTICLE_TOC_ENTRIES;

const FAQ_ACCORDION = [
  {
    id: "faq-antwort-beantrag-wo",
    q: "Wie beantrage ich einen Pflegegrad?",
    a:
      "Sie stellen den Antrag bei der Pflegekasse der betroffenen Person. Diese ist bei der Krankenkasse eingerichtet. Der Antrag kann telefonisch gestellt werden; viele Pflegekassen bieten zusätzlich schriftliche oder digitale Möglichkeiten an.",
  },
  {
    id: "faq-angehoerige-beantragen",
    q: "Können Angehörige den Pflegegrad beantragen?",
    a:
      "Ja, Angehörige oder andere vertraute Personen können den Antrag stellen, wenn sie dazu bevollmächtigt sind. Eine schriftliche Vollmacht ist deshalb sehr empfehlenswert.",
  },
  {
    id: "faq-dauer-entscheidung",
    q: "Wie lange dauert es, bis die Pflegekasse entscheidet?",
    a:
      "Die gesetzliche Bearbeitungsfrist beträgt grundsätzlich 25 Arbeitstage. In besonderen Situationen, etwa bei Krankenhausaufenthalt oder palliativer Versorgung, gelten kürzere Fristen.",
  },
  {
    id: "faq-begutachtung-angehoeriger",
    q: "Muss bei der Begutachtung ein Angehöriger dabei sein?",
    a:
      "Es ist sehr empfehlenswert. Angehörige kennen den Alltag oft genauer und können ergänzen, welche Hilfe regelmäßig nötig ist.",
  },
  {
    id: "faq-diagnose-oder-alltag",
    q: "Was zählt mehr: Diagnose oder Alltag?",
    a:
      "Für den Pflegegrad ist nicht allein die Diagnose entscheidend. Wichtig ist, wie stark die Selbstständigkeit im Alltag eingeschränkt ist und wobei regelmäßig Unterstützung benötigt wird.",
  },
  {
    id: "faq-ablehnung",
    q: "Was kann ich tun, wenn der Pflegegrad abgelehnt wird?",
    a:
      "Sie können Widerspruch einlegen. Die Frist beträgt grundsätzlich einen Monat ab Zugang des Bescheids. Fordern Sie das Gutachten an, prüfen Sie die Bewertung und begründen Sie den Widerspruch möglichst konkret.",
  },
];

export function pflegegradBeantragenFaqForJsonLd() {
  return FAQ_ACCORDION.map((item) => ({ question: item.q, answer: item.a }));
}

export function PflegegradBeantragenArticle() {
  return (
    <>
      {/* Mobile-Inhaltsverzeichnis */}
      <div className="mb-10 rounded-2xl border border-[#0F4F68]/11 bg-[#fafcfb] px-4 py-4 shadow-sm lg:hidden">
        <RatTocNav entries={[...PFLEGEGRAD_ARTICLE_TOC_ENTRIES]} />
      </div>

      <RatQuickAnswerBox
        title="Kurzantwort: Wie beantragt man einen Pflegegrad?"
        note={
          <>
            <strong className="text-[#92400e]">Wichtig:</strong> Stellen Sie den Antrag möglichst früh. Leistungen der
            Pflegeversicherung werden grundsätzlich nur auf Antrag gewährt und frühestens ab dem Zeitpunkt, zu dem die
            Voraussetzungen vorliegen. Wird der Antrag später gestellt, können Leistungen vom Beginn des Monats der
            Antragstellung an gewährt werden.
          </>
        }
      >
        <RatProseParagraph>
          Einen <strong>Pflegegrad beantragen</strong> Sie bei der Pflegekasse der betroffenen Person. Die Pflegekasse ist
          bei der jeweiligen Krankenkasse angesiedelt. Der Antrag kann auch telefonisch gestellt werden. Angehörige,
          Nachbarn oder Bekannte können den Antrag ebenfalls stellen, wenn sie dazu bevollmächtigt sind. Nach Antragstellung
          beauftragt die Pflegekasse den Medizinischen Dienst oder andere unabhängige Gutachter mit der Begutachtung; bei
          privat Versicherten erfolgt die Begutachtung über Medicproof.
        </RatProseParagraph>
      </RatQuickAnswerBox>

      <div className="mt-12 space-y-8">
        <RatResponsiveTable
          caption="Das Wichtigste auf einen Blick"
          head={["Frage", "Antwort"]}
          rows={[
            ["Wo wird der Pflegegrad beantragt?", "Bei der Pflegekasse der betroffenen Person. Diese ist bei der Krankenkasse eingerichtet."],
            ["Wer darf den Antrag stellen?", "Die pflegebedürftige Person selbst oder eine bevollmächtigte Person, zum Beispiel Angehörige."],
            ["Wie kann der Antrag gestellt werden?", "Telefonisch, schriftlich oder je nach Pflegekasse online. Wichtig ist, dass der Antrag eindeutig gestellt wird."],
            [
              "Was passiert danach?",
              "Die Pflegekasse beauftragt den Medizinischen Dienst oder andere Gutachter mit der Begutachtung. Bei Privatversicherten ist Medicproof zuständig.",
            ],
            ["Wie lange dauert die Entscheidung?", "Die gesetzliche Bearbeitungsfrist beträgt grundsätzlich 25 Arbeitstage."],
            ["Was wird begutachtet?", "Entscheidend ist, wie selbstständig die Person im Alltag noch ist und wobei sie Hilfe braucht."],
            ["Was tun bei Ablehnung?", "Innerhalb eines Monats nach Zugang des Bescheids kann Widerspruch eingelegt werden."],
          ]}
        />
      </div>

      <article className="mt-14 space-y-14 text-neutral-900">
        <section className="space-y-6">
          <RatArtH2 id={TOC_ENTRIES[0].id}>Wann sollte man einen Pflegegrad beantragen?</RatArtH2>
          <RatProseParagraph>
            Ein Pflegegrad sollte beantragt werden, sobald regelmäßig Unterstützung im Alltag notwendig wird. Das gilt
            nicht nur bei körperlichen Einschränkungen, sondern auch bei Demenz, psychischen Erkrankungen,
            Orientierungsproblemen oder wenn die Organisation des Alltags nicht mehr allein gelingt.
          </RatProseParagraph>
          <p className="text-[1.0625rem] font-semibold text-[#0F4F68]">Typische Anzeichen sind:</p>
          <ul className="list-none space-y-3 text-[1.0625rem] leading-relaxed text-neutral-800">
            {[
              "Die Person braucht Hilfe beim Waschen, Anziehen oder Essen.",
              "Medikamente werden vergessen oder falsch eingenommen.",
              "Arzttermine, Haushalt oder Einkäufe sind allein nicht mehr möglich.",
              "Es besteht Sturzgefahr oder Unsicherheit beim Gehen.",
              "Angehörige müssen täglich unterstützen.",
              "Die Person ist zeitlich oder örtlich nicht mehr sicher orientiert.",
              "Es gibt Inkontinenz, nächtliche Unruhe oder starken Betreuungsbedarf.",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#F78F2E]" aria-hidden />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <RatInfoBox tone="blue" title="Orientierung für Angehörige">
            Ein häufiger Fehler ist, zu lange zu warten. Viele Angehörige übernehmen zunächst immer mehr Aufgaben, ohne
            einen Antrag zu stellen. Dadurch geht wertvolle Unterstützung verloren.
          </RatInfoBox>
        </section>

        <section className="space-y-8">
          <RatArtH2 id={TOC_ENTRIES[1].id}>Schritt-für-Schritt: Pflegegrad beantragen</RatArtH2>

          <RatStepCard step={1} title="Pflegekasse kontaktieren">
            <RatProseParagraph>
              Der erste Schritt ist die Kontaktaufnahme mit der Pflegekasse. Diese ist bei der Krankenkasse der betroffenen
              Person eingerichtet. Sie können dort anrufen und sagen:
            </RatProseParagraph>
            <RatQuoteBox>
              „Ich möchte für Frau/Herrn [Name] Leistungen der Pflegeversicherung beantragen und bitte um Prüfung eines
              Pflegegrades.“
            </RatQuoteBox>
            <RatProseParagraph>
              Dieser Satz reicht grundsätzlich aus, damit der Antrag angestoßen wird. Bitten Sie die Pflegekasse außerdem um
              eine schriftliche Bestätigung des Antragseingangs.
            </RatProseParagraph>
            <RatInfoBox tone="green" title="Praxis-Hinweis">
              Notieren Sie sich Datum, Uhrzeit und den Namen der Person, mit der Sie gesprochen haben. Das Antragsdatum ist
              wichtig für mögliche Leistungsansprüche.
            </RatInfoBox>
          </RatStepCard>

          <RatStepCard step={2} title="Antragsformular ausfüllen">
            <RatProseParagraph>
              Nach der ersten Kontaktaufnahme schickt die Pflegekasse meist ein Formular zu. Darin werden grundlegende Angaben
              abgefragt, zum Beispiel persönliche Daten, Krankenversicherungsnummer, Wohnsituation, behandelnde Ärzte,
              gewünschte Leistungsart, Angaben zur Pflegeperson sowie eine Kontoverbindung für mögliche Leistungen.
            </RatProseParagraph>
            <RatProseParagraph>
              Füllen Sie das Formular sorgfältig aus und senden Sie es zeitnah zurück. Wenn Sie unsicher sind, können Sie{" "}
              <Link href="/pflegeberatung" className="font-semibold text-[#0F4F68] underline underline-offset-2">
                Unterstützung durch eine Pflegeberatung
              </Link>{" "}
              nutzen.
            </RatProseParagraph>
            <RatInfoBox tone="blue">
              Die Pflegekasse muss nach einem Antrag außerdem eine frühzeitige und umfassende Pflegeberatung anbieten. Nach
              Antragstellung soll dafür unmittelbar ein konkreter Beratungstermin angeboten werden, der innerhalb von zwei
              Wochen durchgeführt wird.
            </RatInfoBox>
          </RatStepCard>

          <RatStepCard step={3} title="Unterlagen vorbereiten">
            <RatProseParagraph>
              Vor der Begutachtung sollten alle wichtigen Unterlagen gesammelt werden. Je besser die Situation dokumentiert
              ist, desto leichter kann der tatsächliche Hilfebedarf nachvollzogen werden.
            </RatProseParagraph>
            <RatResponsiveTable
              caption="Wichtige Unterlagen"
              head={["Unterlage", "Warum sie wichtig ist"]}
              rows={[
                ["Arztberichte", "Sie zeigen Diagnosen, Einschränkungen und Krankheitsverlauf."],
                ["Medikamentenplan", "Er zeigt, welche Behandlung regelmäßig notwendig ist."],
                ["Krankenhaus- oder Reha-Berichte", "Sie belegen Verschlechterungen oder neue Pflegebedarfe."],
                ["Pflegedokumentation", "Falls bereits ein Dienst eingebunden ist, kann diese sehr hilfreich sein."],
                ["Schwerbehindertenausweis", "Kann ergänzende Hinweise auf Einschränkungen geben."],
                ["Vollmacht oder Betreuerausweis", "Wichtig, wenn Angehörige den Antrag begleiten oder stellen."],
                ["Eigene Notizen / Pflegetagebuch", "Zeigt den tatsächlichen Alltag besser als eine Momentaufnahme."],
              ]}
            />
            <RatInfoBox tone="green" title="Praxis-Tipp">
              Schreiben Sie mindestens 7 bis 14 Tage lang auf, wobei Hilfe benötigt wird – nicht nur „Waschen“, sondern zum
              Beispiel: „Morgens Hilfe beim Aufstehen, Waschen des Rückens, Anziehen der Kompressionsstrümpfe, Erinnerung an
              Medikamente.“
            </RatInfoBox>
          </RatStepCard>

          <RatStepCard step={4} title="Auf die Begutachtung vorbereiten">
            <RatProseParagraph>
              Nach Antragstellung beauftragt die Pflegekasse den Medizinischen Dienst oder andere unabhängige Gutachter. Bei
              privat Versicherten erfolgt die Begutachtung durch Medicproof.
            </RatProseParagraph>
            <RatProseParagraph>
              Die Begutachtung findet in der Regel als persönliches Gespräch statt. Die Erstbegutachtung erfolgt laut
              Medizinischem Dienst immer als Hausbesuch, damit die Gutachterin oder der Gutachter die Alltagssituation vor Ort
              einschätzen kann.
            </RatProseParagraph>
            <RatInfoBox tone="amber">
              Bei der Begutachtung sollte möglichst eine vertraute Pflegeperson anwesend sein. Das ist wichtig, weil
              Betroffene ihren Hilfebedarf häufig kleiner darstellen – aus Scham, Gewohnheit oder weil sie an guten Tagen
              besser zurechtkommen.
            </RatInfoBox>
          </RatStepCard>
        </section>

        <section className="space-y-6">
          <RatArtH2 id={TOC_ENTRIES[2].id}>Was wird bei der Pflegebegutachtung geprüft?</RatArtH2>
          <RatProseParagraph>
            Bei der Begutachtung geht es nicht allein um Diagnosen. Entscheidend ist, wie selbstständig die Person ihren Alltag
            bewältigen kann. Der Medizinische Dienst beurteilt die Selbstständigkeit in sechs Lebensbereichen.
          </RatProseParagraph>
          <RatResponsiveTable
            caption="Die sechs Module im Überblick"
            head={["Modul", "Was geprüft wird"]}
            rows={[
              [
                "1. Mobilität",
                "Kann die Person aufstehen, gehen, Treppen steigen oder ihre Körperhaltung ändern?",
              ],
              [
                "2. Kognitive und kommunikative Fähigkeiten",
                "Erkennt die Person Zeiten, Orte, Personen und kann sie Bedürfnisse mitteilen?",
              ],
              [
                "3. Verhaltensweisen und psychische Problemlagen",
                "Gibt es Ängste, Unruhe, Aggression, nächtliches Umherwandern oder starken Betreuungsbedarf?",
              ],
              [
                "4. Selbstversorgung",
                "Wie selbstständig sind Körperpflege, Duschen, Anziehen, Essen, Trinken und Toilettengänge möglich?",
              ],
              [
                "5. Umgang mit krankheitsbedingten Anforderungen",
                "Wird Hilfe bei Medikamenten, Verbänden, Arztbesuchen, Therapien oder Messungen benötigt?",
              ],
              [
                "6. Gestaltung des Alltagslebens und sozialer Kontakte",
                "Kann die Person ihren Tagesablauf planen, sich beschäftigen und Kontakte pflegen?",
              ],
            ]}
          />
          <RatProseParagraph>
            Aus den einzelnen Bewertungen wird ein Gesamtpunktwert gebildet. Ab 12,5 Punkten liegt Pflegebedürftigkeit vor. Die
            Pflegegrade reichen von Pflegegrad 1 bis Pflegegrad 5.
          </RatProseParagraph>
        </section>

        <section className="space-y-6">
          <RatArtH2 id={TOC_ENTRIES[3].id}>Pflegegrade: Welche Punktzahl führt zu welchem Pflegegrad?</RatArtH2>
          <RatResponsiveTable
            caption="Punktbereiche und Pflegegrade"
            head={["Pflegegrad", "Gesamtpunkte", "Bedeutung"]}
            rows={[
              ["Pflegegrad 1", "12,5 bis unter 27", "Geringe Beeinträchtigung der Selbstständigkeit oder Fähigkeiten"],
              ["Pflegegrad 2", "27 bis unter 47,5", "Erhebliche Beeinträchtigung"],
              ["Pflegegrad 3", "47,5 bis unter 70", "Schwere Beeinträchtigung"],
              ["Pflegegrad 4", "70 bis unter 90", "Schwerste Beeinträchtigung"],
              ["Pflegegrad 5", "90 bis 100", "Schwerste Beeinträchtigung mit besonderen Anforderungen an die pflegerische Versorgung"],
            ]}
          />
          <RatInfoBox tone="blue">
            Pflegebedürftige Kinder bis 18 Monate werden pauschal einen Pflegegrad höher eingestuft. Eine besondere
            Bedarfskonstellation kann außerdem unabhängig vom Schwellenwert zu Pflegegrad 5 führen, wenn ein außergewöhnlich
            hoher Unterstützungsbedarf besteht.
          </RatInfoBox>
        </section>

        <section className="space-y-6">
          <RatArtH2 id={TOC_ENTRIES[4].id}>Diese Leistungen können nach einem Pflegegrad wichtig werden</RatArtH2>
          <RatProseParagraph>
            Die konkreten Leistungen hängen vom Pflegegrad und von der Versorgungssituation ab. Für die häusliche Pflege sind
            vor allem Pflegegeld, Pflegesachleistungen, Entlastungsbetrag und Pflegehilfsmittel relevant.
          </RatProseParagraph>
          <RatBenefitsTable
            caption="Leistungen 2026 (Überblick für die häusliche Pflege – Zahlen je nach Krankenkassenstand)"
            head={[
              "Leistung 2026",
              "Pflegegrad 1",
              "Pflegegrad 2",
              "Pflegegrad 3",
              "Pflegegrad 4",
              "Pflegegrad 5",
            ]}
            body={[
              ["Pflegegeld monatlich", "–", "347 €", "599 €", "800 €", "990 €"],
              ["Pflegesachleistungen monatlich", "–", "796 €", "1.497 €", "1.859 €", "2.299 €"],
              ["Entlastungsbetrag monatlich", "131 €", "131 €", "131 €", "131 €", "131 €"],
              ["Pflegehilfsmittel zum Verbrauch monatlich", "bis 42 €", "bis 42 €", "bis 42 €", "bis 42 €", "bis 42 €"],
              [
                "Wohnumfeldverbessernde Maßnahmen",
                "bis 4.180 € je Maßnahme",
                "bis 4.180 €",
                "bis 4.180 €",
                "bis 4.180 €",
                "bis 4.180 €",
              ],
            ]}
          />
          <RatProseParagraph>
            Pflegegeld und Pflegesachleistungen können in vielen Fällen auch kombiniert werden. Der Entlastungsbetrag beträgt 2026 bis
            zu 131 Euro monatlich, also bis zu 1.572 Euro im Jahr, und gilt auch für Pflegebedürftige mit Pflegegrad 1 in häuslicher
            Pflege – er ist zweckgebunden für qualitätsgesicherte Entlastungs- und Unterstützungsleistungen einzusetzen. Mehr zu
            hilfreichen Angeboten finden Sie unter{" "}
            <Link href="/leistungen/haushaltshilfe" className="font-semibold text-[#0F4F68] underline underline-offset-2">
              Haushaltshilfe
            </Link>
            ,{" "}
            <Link href="/leistungen/alltagsbegleitung-betreuung" className="font-semibold text-[#0F4F68] underline underline-offset-2">
              Alltagsbegleitung
            </Link>{" "}
            und zur{" "}
            <Link href="/pflegehilfsmittel/kostenfreie-pflegehilfsmittel" className="font-semibold text-[#0F4F68] underline underline-offset-2">
              Pflegehilfsmittel-Versorgung
            </Link>
            .
          </RatProseParagraph>
        </section>

        <section className="space-y-6">
          <RatArtH2 id={TOC_ENTRIES[5].id}>Häufige Fehler beim Pflegegrad-Antrag</RatArtH2>
          <div className="space-y-4">
            <RatInfoBox tone="amber" title="Fehler 1: Den Alltag zu positiv darstellen">
              Viele Menschen sagen bei der Begutachtung: „Das geht schon noch.“ Für die Einstufung ist aber entscheidend, was
              regelmäßig tatsächlich nicht mehr allein gelingt. Beschreiben Sie nicht den besten Tag, sondern den normalen
              Alltag.
            </RatInfoBox>
            <RatInfoBox tone="amber" title="Fehler 2: Nur körperliche Einschränkungen erwähnen">
              Auch Demenz, Orientierungslosigkeit, psychische Belastungen, nächtliche Unruhe oder fehlende Tagesstruktur können
              für den Pflegegrad wichtig sein.
            </RatInfoBox>
            <RatInfoBox tone="amber" title="Fehler 3: Keine Pflegeperson beim Termin dabei">
              Eine vertraute Person kann ergänzen, was die betroffene Person vergisst oder aus Scham nicht sagt.
            </RatInfoBox>
            <RatInfoBox tone="amber" title="Fehler 4: Keine Beispiele nennen">
              Allgemeine Aussagen wie „braucht Hilfe“ sind zu ungenau. Besser ist: „Sie kann die Medikamente nicht selbst
              richten und vergisst die Einnahme mehrmals pro Woche.“
            </RatInfoBox>
            <RatInfoBox tone="amber" title="Fehler 5: Den Bescheid nicht prüfen">
              Nach der Entscheidung sollte das Gutachten genau gelesen werden. Prüfen Sie, ob der tatsächliche Hilfebedarf
              korrekt erfasst wurde.
            </RatInfoBox>
          </div>
        </section>

        <section className="space-y-6">
          <RatArtH2 id={TOC_ENTRIES[6].id}>Was tun, wenn der Pflegegrad abgelehnt wird?</RatArtH2>
          <RatProseParagraph>
            Wenn die Pflegekasse keinen Pflegegrad bewilligt oder der Pflegegrad zu niedrig erscheint, können Sie Widerspruch
            einlegen. Betroffene haben ab Zugang des Bescheids grundsätzlich einen Monat Zeit. Fehlt eine ordnungsgemäße
            Rechtsbehelfsbelehrung, kann die Frist länger sein.
          </RatProseParagraph>
          <ol className="list-decimal space-y-2 pl-6 text-[1.0625rem] leading-relaxed text-neutral-800">
            <li>
              <strong className="text-[#0F4F68]">Frist sichern:</strong> Legen Sie zunächst schriftlich Widerspruch ein.
            </li>
            <li>
              <strong className="text-[#0F4F68]">Gutachten anfordern oder prüfen:</strong> Schauen Sie genau, welche Einschränkungen
              nicht berücksichtigt wurden.
            </li>
            <li>
              <strong className="text-[#0F4F68]">Begründung nachreichen:</strong> Beschreiben Sie konkret, warum die Einschätzung
              nicht passt.
            </li>
            <li>
              <strong className="text-[#0F4F68]">Nachweise beilegen:</strong> Arztberichte, Pflegetagebuch oder Stellungnahmen können
              helfen.
            </li>
            <li>
              <strong className="text-[#0F4F68]">Beratung nutzen:</strong> Eine Pflegeberatung kann bei der Einordnung unterstützen –
              etwa über unsere{" "}
              <Link href="/pflegeberatung" className="font-semibold text-[#0F4F68] underline underline-offset-2">
                Pflegeberatungsangebote
              </Link>
              .
            </li>
          </ol>
          <RatQuoteBox>
            „Hiermit lege ich fristgerecht Widerspruch gegen den Bescheid vom [Datum] ein. Eine ausführliche Begründung reiche ich
            nach. Bitte senden Sie mir das vollständige Gutachten zu.“
          </RatQuoteBox>
        </section>

        <section className="space-y-5 rounded-[1.35rem] border border-orange-100/90 bg-[#fff9f4] px-6 py-8 shadow-sm sm:px-9">
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#ea8c36]">Praxisbeispiel</p>
          <RatArtH2 id={TOC_ENTRIES[7].id}>Warum Vorbereitung so wichtig ist</RatArtH2>
          <RatProseParagraph>
            Frau Müller ist 82 Jahre alt und lebt allein. Ihre Tochter hilft täglich beim Einkaufen, bei Medikamenten, beim
            Duschen und bei der Wäsche. Frau Müller sagt beim Begutachtungstermin aber mehrfach: „Ich komme eigentlich gut zurecht.“
          </RatProseParagraph>
          <RatProseParagraph>
            Ohne Vorbereitung könnte dadurch der Eindruck entstehen, dass nur wenig Hilfe nötig ist. Hat die Tochter jedoch ein
            Pflegetagebuch geführt, kann sie etwa Folgendes zeigen:
          </RatProseParagraph>
          <ul className="list-none space-y-2.5 text-[1.0625rem] leading-relaxed text-neutral-800">
            {[
              "Duschen ist nur mit Hilfe möglich.",
              "Medikamente müssen täglich vorbereitet und kontrolliert werden.",
              "Einkaufen und Kochen gelingen nicht mehr selbstständig.",
              "Nachts besteht Sturzgefahr.",
              "Termine werden vergessen.",
              "Die Wohnung kann nicht mehr allein sauber gehalten werden.",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#F78F2E]" aria-hidden />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <RatProseParagraph>
            So entsteht ein realistisches Bild des Alltags – und genau darum geht es bei der Pflegebegutachtung.
          </RatProseParagraph>
        </section>

        <section className="space-y-5">
          <RatServiceCtaSection labelledBy={TOC_ENTRIES[8].id}>
            <RatArtH2 id={TOC_ENTRIES[8].id}>Wann Alltagshilfe-Süd unterstützen kann</RatArtH2>
            <RatProseParagraph>
              Ein Pflegegrad-Antrag ist für viele Familien der Beginn einer neuen Lebensphase. Neben dem Antrag selbst geht es oft
              darum, den Alltag neu zu organisieren: Wer hilft im Haushalt? Welche Leistungen können genutzt werden? Welche
              Hilfsmittel sind sinnvoll?
            </RatProseParagraph>
            <ul className="list-disc space-y-2 pl-5 text-[1.0625rem] leading-relaxed text-neutral-800">
              <li>
                <Link href="/leistungen/haushaltshilfe" className="font-semibold text-[#0F4F68] underline underline-offset-2">
                  Haushalt &amp; häusliche Versorgung
                </Link>{" "}
                – Entlastungsleistungen
              </li>
              <li>
                <Link href="/pflegeberatung" className="font-semibold text-[#0F4F68] underline underline-offset-2">
                  Pflegeberatung
                </Link>
              </li>
              <li>
                <Link href="/pflegehilfsmittel/kostenfreie-pflegehilfsmittel" className="font-semibold text-[#0F4F68] underline underline-offset-2">
                  Pflegehilfsmittel
                </Link>{" "}
                und{" "}
                <Link href="/pflegeshop" className="font-semibold text-[#0F4F68] underline underline-offset-2">
                  Pflegeshop
                </Link>
              </li>
              <li>
                <Link href="/inkontinenzversorgung" className="font-semibold text-[#0F4F68] underline underline-offset-2">
                  Inkontinenzversorgung
                </Link>
              </li>
              <li>
                <Link href="/leistungen/essen-auf-raeder" className="font-semibold text-[#0F4F68] underline underline-offset-2">
                  Essen auf Rädern
                </Link>
              </li>
            </ul>
            <div className="mt-8 rounded-2xl bg-white/80 px-5 py-6 shadow-inner sm:px-7">
              <p className="text-lg font-bold text-[#0F4F68]">
                Sie möchten wissen, welche Unterstützung in Ihrer Situation möglich ist?
              </p>
              <p className="mt-2 text-[1.0625rem] leading-relaxed text-neutral-700">
                Wir helfen Ihnen bei der ersten Orientierung und zeigen, welche Angebote zu Ihrem Pflegegrad und Ihrer
                Situation passen können.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/kontakt"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#F78F2E] px-6 py-3 text-center text-base font-bold text-white shadow-md transition hover:bg-[#e67e22] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
                >
                  Jetzt Unterstützung anfragen
                </Link>
                <Link
                  href="/pflegeberatung/private-pflegeberatung"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-[#0F4F68]/30 bg-white px-6 py-3 text-center text-base font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]"
                >
                  Mehr zur Pflegeberatung
                </Link>
              </div>
            </div>
          </RatServiceCtaSection>
        </section>

        <section className="space-y-5">
          <RatArtH2 id={TOC_ENTRIES[9].id}>Checkliste: Pflegegrad beantragen</RatArtH2>
          <RatChecklistCard
            items={[
              "Pflegekasse kontaktiert",
              "Antrag schriftlich oder telefonisch gestellt",
              "Antragseingang notiert",
              "Vollmacht vorbereitet, falls Angehörige handeln",
              "Arztberichte gesammelt",
              "Medikamentenplan bereitgelegt",
              "Krankenhaus- oder Reha-Berichte gesammelt",
              "Pflegetagebuch geführt",
              "Pflegeperson für Begutachtung eingeplant",
              "Bescheid und Gutachten geprüft",
              "Bei Bedarf Widerspruchsfrist notiert",
            ]}
          />
        </section>

        <section className="space-y-5">
          <RatArtH2 id={TOC_ENTRIES[10].id}>Häufige Fragen zum Pflegegrad-Antrag</RatArtH2>
          <RatFaqAccordion items={FAQ_ACCORDION} />
        </section>

        <section className="space-y-4">
          <RatArtH2 id={TOC_ENTRIES[11].id}>Quellen und Stand des Artikels</RatArtH2>
          <RatSourcesFooter
            suppressBuiltinTitle
            updatedLabel="April 2026 (Inhaltlich geprüft; Leistungsbeträge Anfang 2026, bitte Bescheid Ihrer Pflegekasse zugrunde legen.)"
          >
          <p>
            <strong>Fachliche Grundlage:</strong> Bundesgesundheitsministerium, Medizinischer Dienst Bund, Verbraucherzentrale, SGB
            XI.
          </p>
          <ul className="space-y-2.5">
            <li>
              Bundesgesundheitsministerium: Pflegebedürftig – was nun? –{" "}
              <RatExternalLink href="https://www.bundesgesundheitsministerium.de/themen/pflege/online-ratgeber-pflege/pflegebeduerftig-was-nun">
                bundesgesundheitsministerium.de
              </RatExternalLink>
            </li>
            <li>
              Bundesgesundheitsministerium: Leistungen der Pflegeversicherung im Überblick –{" "}
              <RatExternalLink href="https://www.bundesgesundheitsministerium.de/themen/pflege/online-ratgeber-pflege/leistungen-der-pflegeversicherung/leistungen-im-ueberblick">
                bundesgesundheitsministerium.de
              </RatExternalLink>
            </li>
            <li>
              Bundesgesundheitsministerium: Übersicht Leistungsbeträge 2026 –{" "}
              <RatExternalLink href="https://www.bundesgesundheitsministerium.de/fileadmin/Dateien/3_Downloads/P/Pflegeversicherung_Leistungsbeitraege/Uebersicht_Leistungsbetraege_2026_VA.pdf">
                PDF beim BMG
              </RatExternalLink>
            </li>
            <li>
              Medizinischer Dienst Bund: Fragen und Antworten zur Pflegebegutachtung –{" "}
              <RatExternalLink href="https://md-bund.de/themen/pflegebeduerftigkeit-und-pflegebegutachtung/fragen-und-antworten.html">
                md-bund.de
              </RatExternalLink>
            </li>
            <li>
              Verbraucherzentrale: Pflegegrad abgelehnt – Widerspruch und Klage –{" "}
              <RatExternalLink href="https://www.verbraucherzentrale.de/wissen/gesundheit-pflege/pflegeantrag-und-leistungen/pflegegrad-abgelehnt-so-wehren-sie-sich-mit-widerspruch-und-klage-11547">
                verbraucherzentrale.de
              </RatExternalLink>
            </li>
            <li>
              SGB XI § 33 –{" "}
              <RatExternalLink href="https://www.sozialgesetzbuch-sgb.de/sgbxi/33.html">sozialgesetzbuch-sgb.de</RatExternalLink>
            </li>
          </ul>
        </RatSourcesFooter>
        </section>
      </article>

      {/* Weitere Themenvorschläge (ohne tote Links) */}
      <section aria-labelledby="themenvorschau-heading" className="mt-16 rounded-2xl border border-[#0F4F68]/10 bg-[#fafcfb] px-5 py-6 sm:px-7">
        <h2 id="themenvorschau-heading" className="text-lg font-bold text-[#0F4F68]">
          Weitere Themen rund um Pflegegrade und Leistungen
        </h2>
        <p className="mt-2 text-[1.02rem] leading-relaxed text-neutral-700">
          Entlastungsbetrag, Pflegegeld, Hilfsmittel und Beratungspflicht sind häufige Folgethemen nach einem{" "}
          <strong>Pflegegrad beantragen</strong>. Aktuell können Sie diese Themen bereits inhaltlich mit uns oder Ihrer Pflegekasse
          abstimmen; ausführliche Ratgebertexte bereiten wir kontinuierlich vor – einen Überblick finden Sie in der{" "}
          <Link href="/ratgeber" className="font-semibold text-[#0F4F68] underline underline-offset-2">
            Ratgeber-Übersicht
          </Link>
          .
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            "Entlastungsbetrag: Wer hat Anspruch und wie nutzt man ihn?",
            "Pflegegeld: Höhe, Anspruch und Auszahlung",
            "Pflegehilfsmittel zum Verbrauch: Was übernimmt die Pflegekasse?",
            "Pflichtberatung nach § 37 Abs. 3 SGB XI – erste Orientierung nach dem Pflegegrad",
          ].map((t) => (
            <li
              key={t}
              className="rounded-xl border border-dashed border-[#0F4F68]/22 bg-white/90 px-4 py-3 text-sm font-medium leading-snug text-neutral-700"
            >
              {t}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
