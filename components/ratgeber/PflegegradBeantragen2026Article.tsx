import Link from "next/link";
import type { ReactNode } from "react";

/** Fließtext-Abschnitte ohne @tailwindcss/typography */
const flow = "space-y-4 text-base leading-relaxed text-neutral-800";
const h2 = "mt-10 scroll-mt-[calc(var(--ahs-header-white-min-height)+1rem)] text-2xl font-bold tracking-tight text-[#0F4F68] first:mt-0";
const h3 = "mt-6 text-xl font-semibold text-[#0F4F68]";

type TocItem = { id: string; label: string };

const TOC: TocItem[] = [
  { id: "kurzantwort", label: "Kurzantwort" },
  { id: "was-ist-ein-pflegegrad", label: "Was ist ein Pflegegrad?" },
  { id: "wann-pflegegrad-beantragen", label: "Wann beantragen?" },
  { id: "wer-darf-beantragen", label: "Wer kann beantragen?" },
  { id: "wo-beantragen", label: "Wo beantragt man?" },
  { id: "schritt-fuer-schritt", label: "Schritt für Schritt" },
  { id: "unterlagen", label: "Unterlagen" },
  { id: "md-mdk-begutachtung", label: "MD-/MDK-Begutachtung" },
  { id: "lebensbereiche", label: "Lebensbereiche" },
  { id: "pflegegrade-im-ueberblick", label: "Pflegegrade" },
  { id: "leistungen-2026", label: "Leistungen 2026" },
  { id: "pflegegrad-zu-niedrig", label: "Abgelehnt oder zu niedrig?" },
  { id: "fehler-vermeiden", label: "Typische Fehler" },
  { id: "angehoerige-vorbereitung", label: "Vorbereitung Angehörige" },
  { id: "wie-wir-unterstuetzen", label: "Wie wir unterstützen" },
  { id: "faq", label: "FAQ" },
];

function RatgeberCTABox(props: {
  title: string;
  children?: ReactNode;
  buttons: { href: string; label: string }[];
}) {
  return (
    <aside
      className="rounded-2xl border border-[#0F4F68]/12 bg-gradient-to-br from-[#f8fcfd] to-[#fff8f2] px-5 py-6 shadow-sm sm:px-7"
      role="note"
    >
      <p className="text-lg font-bold text-[#0F4F68]">{props.title}</p>
      {props.children ? <div className="mt-3 text-sm leading-relaxed text-neutral-700 sm:text-base">{props.children}</div> : null}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {props.buttons.map((b) => (
          <Link
            key={b.href + b.label}
            href={b.href}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#F78F2E] px-5 py-2.5 text-center text-sm font-bold text-white transition hover:bg-[#e67e22] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4F68]"
          >
            {b.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}

export function PflegegradBeantragen2026Article() {
  return (
    <>
      <nav
        aria-label="Sprungnavigation Inhaltsverzeichnis"
        className="rounded-2xl border border-[#0F4F68]/10 bg-white/90 p-5 shadow-sm sm:p-6"
      >
        <h2 className="text-lg font-bold text-[#0F4F68]">Inhaltsverzeichnis</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[#0F4F68] marker:font-semibold">
          {TOC.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="underline decoration-[#F78F2E]/50 underline-offset-2 hover:text-[#0c3d52]">
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <section id="kurzantwort" className={flow}>
        <h2 className={`${h2} !mt-6`}>Kurzantwort – welche nächsten Schritte sind sinnvoll?</h2>
        <p>
          Wer <strong>pflegegrad beantragen</strong> möchte, wendet sich an die jeweils zuständige Pflegekasse und beantragt dort die Feststellung des Pflegebedürfnisses. In der Folge kommt häufig ein Begutachtungsgespräch des Medizinischen Dienstes (MD) oder der{" "}
          <abbr title="Medizinischer Dienst bei den Krankenkassen (oder vergleichbar je nach Landesregelungen)">
            MDK
          </abbr>{" "}
          zustande; im Bescheid wird der Pflegegrad mitgeteilt. Die konkreten Zugangswege (online, postalisch, telefonisch) können je nach Kasse variieren – informieren Sie sich auf den offiziellen Seiten Ihrer Pflegekasse.
        </p>
        <p>
          Für Angehörige lohnt es sich, Unterlagen strukturiert zu sammeln, den Alltag ehrlich zu beschreiben und{" "}
          <Link href="/pflegeberatung/private-pflegeberatung" className="font-semibold text-[#0F4F68] underline underline-offset-2">
            Beratungsangebote
          </Link>{" "}
          mit einzubeziehen, sobald Unklarheit bleibt.{" "}
          <strong>Hinweis:</strong> Dieser Beitrag ist keine Rechtsberatung. Konkrete Fälle sollten zusätzlich mit der Pflegekasse oder entsprechend qualifizierten Stellen geklärt werden.
        </p>
      </section>

      <div className="mt-10 space-y-8">
        <RatgeberCTABox title="Sie möchten Unterstützung beim Pflegegrad-Antrag?" buttons={[{ href: "/kontakt", label: "Pflegeberatung anfragen" }]}>
          <p>
            Wir helfen Ihnen, die nächsten Schritten zu strukturieren und die Begutachtung aus Ihrer Alltagsperspektive vorzubereiten – ohne Druck und ohne Überforderungsrhetorik.
          </p>
        </RatgeberCTABox>

        <article className={flow}>
          <h2 className={h2} id="was-ist-ein-pflegegrad">
            Was ist ein Pflegegrad?
          </h2>
          <p>
            Der Pflegegrad beschreibt, wie stark die Selbstständigkeit im Alltag durch gesundheitliche Einschränkungen begrenzt ist. Für viele Leistungen ist er die zentrale Referenz der Pflegeversicherung – etwa für den&nbsp;
            <Link href="/ratgeber/entlastungsbetrag-131-euro" className="font-semibold text-[#0F4F68] underline underline-offset-2">
              Entlastungsbetrag für anerkannte Haushaltshilfe oder Betreuung
            </Link>
            , für{" "}
            <Link href="/pflegehilfsmittel/kostenfreie-pflegehilfsmittel" className="font-semibold text-[#0F4F68] underline underline-offset-2">
              Pflegehilfsmittel (z.&nbsp;B. monatliche Pauschale)
            </Link>{" "}
            oder für{" "}
            <Link href="/leistungen/haushaltshilfe" className="font-semibold text-[#0F4F68] underline underline-offset-2">
              Haushaltshilfe
            </Link>{" "}
            sowie{" "}
            <Link href="/leistungen/alltagsbegleitung-betreuung" className="font-semibold text-[#0F4F68] underline underline-offset-2">
              Alltagsbegleitung und Betreuung
            </Link>
            . Bewertet wird, welchen Hilfebedarf die pflegebedürftige Person in den genannten Bereichen konkret&nbsp;hat – nicht nur anhand eines Diagnoselabels.
          </p>
          <p>
            Erwähnenswerte Ergänzungen im Bedarfsfeld: Produktbereiche rund um&nbsp;
            <Link href="/inkontinenzversorgung" className="font-semibold text-[#0F4F68] underline underline-offset-2">
              Inkontinenzversorgung
            </Link>{" "}
            können je nach Situation ebenfalls strukturell zusammenkommen.&nbsp;Auch unser&nbsp;
            <Link href="/pflegeshop" className="font-semibold text-[#0F4F68] underline underline-offset-2">
              Pflegeshop
            </Link>{" "}
            bietet spätere Bezugsoptionen ohne den formalen Bewilligungsprozess des Pflegegrades zu&nbsp;ersetzen.
          </p>

          <h2 className={h2} id="wann-pflegegrad-beantragen">
            Wann sollte man einen Pflegegrad beantragen?
          </h2>
          <p>
            Wenn Einschränkungen nicht nur vorübergehend sind: bei zunehmender Gebrechlichkeit, nach Krankenhaus oder Reha, wenn Routinen im&nbsp;Haushalt und bei der Mobilisation immer schwerer werden oder wenn Unterstützung durch pflegende Angehörige regelmäßig nötiger wird.&nbsp;
            <Link href="/pflegeberatung" className="font-semibold text-[#0F4F68] underline underline-offset-2">
              Pflegeberatungseinrichtungen
            </Link>{" "}
            können früh Orientierung&nbsp;geben,&nbsp;sodass keine Zeit verloren geht – aber auch keine Panik&nbsp;geschürt&nbsp; wird.
          </p>

          <h2 className={h2} id="wer-darf-beantragen">
            Wer kann einen Pflegegrad beantragen?
          </h2>
          <p>
            Grundsätzlich die pflegebedürftige Versichertenperson&nbsp;persönlich. Angehörige können mit dokumentierter Vollmacht oder im gesetzlich/fachlich definierten Vertretungsrahmen aktiv werden; Betreuungslagen bleiben strikt dokumentationspflichtig.
          </p>

          <h2 className={h2} id="wo-beantragen">
            Wo beantragt man einen Pflegegrad?
          </h2>
          <p>
            Regelhaft&nbsp;über die zugewiesene Pflegekasse.&nbsp;Auf der entsprechenden Website finden sich Formblätter, Uploadstellen&nbsp; oder Postadresshinweise.&nbsp;Entscheiden Sie sich für eine nachvollziehbare Dokumentationsform (Kopie, Briefkopfdatum), damit Fristbezug später rekonstruiert werden kann.&nbsp;Auf Antragstellung folgt strukturell häufig der Einplanungshinweis der Begutachtung.
          </p>

          <h2 className={h2} id="schritt-fuer-schritt">
            Pflegegrad beantragen – Schritt-für-Schritt
          </h2>

          <h3 className={h3}>Schritt&nbsp;1: Pflegekasse kontaktieren</h3>
          <p>
            Kanalwahl (Telefon, Schriftform, digitale Portale)&nbsp;kasseabhängig; notieren&nbsp;Sie Datum sowie Namen dokumentierbar – das schafft Klarheit in Folgekorrespondenz.
          </p>

          <h3 className={h3}>Schritt&nbsp;2: Antrag stellen</h3>
          <p>Oft möglich ohne spezielle Form:&nbsp;kurz beschreiben, dass eine Feststellung des Pflegegrades beantragt wird und warum häuslicher Alltag strukturelle Begleitung brauchen kann.&nbsp;Wenn zusätzliche Kassenformblätter benannt&nbsp; sind, diese mit einreichen.&nbsp;Aufbewahrung mit Versanddatum&nbsp; dokumentieren.</p>

          <h3 className={h3}>Schritt&nbsp;3: Unterlagen sammeln</h3>
          <p>Facharzt-/Entlass‑Schreiben,&nbsp;kontinuierlicher Medikamentenplan, bereits genutzte haushälterische Hilfen oder bereits organisierte Begleitung sowie optional&nbsp; strukturierte Tagebuchnotizen stützen spätere Überprüfbarkeit ohne dramatisches Übertreiben.</p>

          <h3 className={h3}>Schritt&nbsp;4: Begutachtung vorbereiten</h3>
          <p>Wer konkret welche Routinen kann oder nicht ohne Hilfe strukturieren kann, ist glaubhafter&nbsp; als pauschaler Schmerzbezug ohne Alltagsbezug; vermeiden Sie Show-Effekt – realistisches Beschreiben ist nachhaltiger.</p>

          <h3 className={h3}>Schritt&nbsp;5: Bescheid prüfen</h3>
          <p>Den schriftlichen Bescheid strukturiert gegenlesen:&nbsp;if Angaben fehlen:&nbsp;rückgemeldete Prüfangaben nachfordern.&nbsp;Auch Widerspruchsfristen bleiben in jedem konkreten Bescheid beachtlich.</p>

          <h2 className={h2} id="unterlagen">
            Welche Unterlagen sind häufig wichtig?
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>ärztliche Verlaufshistorie,</li>
            <li>dokumentierter häuslicher Alltag,</li>
            <li>Medikamente und Therapien,</li>
            <li>geeignete Vollmachten für vertretende Angehörige.</li>
          </ul>
          <p>
            Wenn regionale Zuordnung wichtige Rolle&nbsp; bei&nbsp; späteren strukturellen&nbsp; Kontaktorganisationen haben kann: unsere Unterseiten zu&nbsp;
            <Link href="/standorte" className="font-semibold text-[#0F4F68] underline underline-offset-2">
              Standorten
            </Link>{" "}
            geben regionalen Überblick.
          </p>

          <h2 className={h2} id="md-mdk-begutachtung">
            Wie läuft die MD-/ MDK‑Begutachtung ab?
          </h2>
          <p>Strukturiert orientiert&nbsp; diese Begutachtung an dokumentierbaren alltagsbezogenen Fähigkeiten; Ergebnis fließt in den Kassenbescheid zur Pflegegradfeststellung.&nbsp;Terminwahl mit ruhiger Wohnraumsituation ohne Inszenierung ist meist zweckvoller.&nbsp;Auch Nachfragen dokumentieren erhöhen Transparenz.</p>

          <h2 className={h2} id="lebensbereiche">
            Die mehreren Lebens-/ Pflegebereiche im Blick behalten
          </h2>
          <p>
            Mobilisation, Orientierung/Umgang, Selbstversorgungsaktivitäten, Umgang mit krankheitstypischen Aufgaben, hauswirtschaftlicher Strukturbedarf und strukturelle Alltagsorganisation werden begutachtungsseitig bewertet – individuell ohne starre Gewichtungen pauschalisieren wir&nbsp; keine Einzelfälle ohne Bescheid.
          </p>

          <h2 className={h2} id="pflegegrade-im-ueberblick">
            Welche Pflegegrade gibt es?
          </h2>
          <p>
            Fünf anerkannte Pflegegrade und die&nbsp; Bewertungsoption ohne erreichten Grad nach individuellen Regelbefunden.&nbsp;Vertiefungen liefern z.&nbsp;B. gesonderte Ausführungen zu&nbsp;
            <Link href="/ratgeber/pflegegrad-1-der-ultimative-leitfaden" className="font-semibold text-[#0F4F68] underline underline-offset-2">
              Pflegegrad&nbsp;1
            </Link>{" "}
            oder&nbsp;
            <Link href="/ratgeber/pflegegrad-2-alles-was-du-wissen-musst" className="font-semibold text-[#0F4F68] underline underline-offset-2">
              Pflegegrad&nbsp;2
            </Link>{" "}
            bereits in unseren Ratgeberbeiträgen.
          </p>

          <h2 className={h2} id="leistungen-2026">
            Pflegebezogene Leistungen – allgemeiner Rahmen
          </h2>
          <p>
            Leistungen (Pflegegeld, Sachleistungsoptionen sowie Kombinationsoptionen sowie Entlastungsbeträge, Hilfs-/ Pflegehilfsmittelorganisationen unterliegen dem jeweils geltenden Rechts-/ Satzungsrahmen:&nbsp;europaweit konkreten Betragshöhen immer über aktuelle amtliche Dokumentationspfade der jeweiligen Jahre cross-check.&nbsp;Auch der Entlastungsbetrag ist struktureller Baustein: siehe  unser Tiefgang-Ratgeber&nbsp;
            <Link href="/ratgeber/entlastungsbetrag-131-euro">Entlastungsbetrag 131 Euro&nbsp;</Link>
            sowie Leistungen unseres&nbsp;
            <Link href="/leistungen/haushaltshilfe" className="font-semibold text-[#0F4F68] underline underline-offset-2">
              Haushaltshilfenangebots
            </Link>
            .
          </p>
        </article>

        <RatgeberCTABox
          title="Entlastungsbetrag für Haushaltshilfe & Betreuung"
          buttons={[{ href: "/leistungen/haushaltshilfe", label: "Haushaltshilfe prüfen" }]}
        >
          Mit anerkanntem Pflegegrad stehen strukturelle Entlastungen und der Entlastungsbetrag oft kombinierbar zur Verfügung – ohne Garantierung einzelbetraglicher Kombination ohne Bescheid.
        </RatgeberCTABox>

        <article className={flow}>
          <h2 className={h2} id="pflegegrad-zu-niedrig">
            Pflegegrad abgelehnt oder eingestuft als zu niedrig – was dann?
          </h2>
          <p>Zunächst Bescheid sorgfältig lesen, Widerspruchsfristen im Blick haben, erforderliche Aktenstände einholen:&nbsp;rückfragen dokumentieren:&nbsp;eine strukturierte Widerspruchsvorbereitung kann mit qualifizierten Beratungen besprochen werden.</p>

          <h2 className={h2} id="fehler-vermeiden">
            Typische Fehler beim Pflegegrad-Antrag
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>„Alles geht noch“ formulieren ohne konkreten Alltagsbezug.</li>
            <li>Unzureichende Vorbereitung auf Besuchsterminus vor Ort.</li>
            <li>fehlenden Nachhalt bei Folgeterminzusagen dokumentieren,</li>
            <li>schlecht lesbare oder ungewichtige Aktenstände,</li>
            <li>nicht dokumentierte bereits genutzte haushältige Hilfestrukturen.</li>
          </ul>

          <h2 className={h2} id="angehoerige-vorbereitung">
            Wie bereiten sich pflegende Angehörige vor?
          </h2>
          <p>Zusammentragen konkreten Alltagsbezugs (Routinen, Überlastphasen chronologisch dokumentieren ohne dramatisches Überspannen), strukturierten Familienbezug dokumentieren wenn auch psychische Entlast strukturelle Rolle spielt sowie optional psychosoziale Angebote strukturell konsultieren.</p>

          <h2 className={h2} id="wie-wir-unterstuetzen">
            Wie Alltagshilfe-Süd unterstützen kann
          </h2>
          <p>
            Wir strukturieren Alltagsbereiche dort, wo Unterstützung organisierbar  ist – etwa{" "}
            <Link href="/leistungen/alltagsbegleitung-betreuung" className="underline">
              Begleitung
            </Link>{" "}
            und{" "}
            <Link href="/leistungen/haushaltshilfe" className="underline">
              Unterstützung im Haushalt
            </Link>
            .&nbsp;Wir garantieren keine Leistungen der Pflegekasse – strukturieren Kommunikation und regionale Zuordnung.
          </p>
        </article>

        <RatgeberCTABox
          title="Pflegehilfsmittel (monatlicher Freibetrag)"
          buttons={[{ href: "/pflegehilfsmittel/kostenfreie-pflegehilfsmittel", label: "Pflegehilfsmittel anfragen" }]}
        >
          Über die strukturelle Pauschalgestaltungsoption über Hilfs-/Verbrauchshilfen hinaus dokumentieren wir Ihnen sachorientiert Bewilligungswege – jedoch ohne konkrete Erfolgsgarantieren je nach individuellen Bescheid.
        </RatgeberCTABox>

        <aside className="rounded-2xl border border-dashed border-[#0F4F68]/35 bg-[#F2F9FA]/50 p-6" aria-labelledby="download-heading">
          <h2 id="download-heading" className="text-xl font-bold text-[#0F4F68]">
            Pflegegrad beantragen 2026: Checkliste & weiterführende Ratgebertexte
          </h2>
          <p className="mt-2 text-neutral-700">
            Unser Ratgebereintrag {" "}
            <Link href="/ratgeber/pflegegrad-beantragen-checkliste" className="font-semibold text-[#0F4F68] underline">
              Pflegegrad beantragen: Checkliste&nbsp;unterlagen&nbsp;Begutachtung
            </Link>{" "}
            vertieft bereits strukturiert die Antragphasen.&nbsp;Eine eigene proprietäre PDF liegt nicht statisch bereit:&nbsp;dafür dokumentieren Kontaktüberweisungen strukturell keine toten Downloads&nbsp; ohne Dateivarliegen.
          </p>
          <div className="mt-5">
            <Link
              href="/kontakt"
              className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#0F4F68] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#0c3d52]"
            >
              Checkliste & Material beim Team anfordern
            </Link>
          </div>
        </aside>

        <RatgeberCTABox
          title="Nächste Schritte zusammen strukturieren"
          buttons={[
            { href: "/kontakt", label: "Pflegeberatung anfragen" },
            { href: "/leistungen/haushaltshilfe", label: "Haushaltshilfe anfragen" },
            { href: "/pflegehilfsmittel/kostenfreie-pflegehilfsmittel", label: "Pflegehilfsmittel anfragen" },
          ]}
        >
          Transparente Orientierung statt Überforderungsversprechens – konkrete Bescheid- und Kombinationsbezugspfad bleiben bei der Pflegekasse.
        </RatgeberCTABox>

        <section id="faq" className={`${flow} scroll-mt-[calc(var(--ahs-header-white-min-height)+6rem)]`}>
          <h2 className={h2}>FAQ – häufige Fragen</h2>

          <div className="mt-6 space-y-3">
            <details className="group rounded-2xl border border-[#0F4F68]/12 bg-white p-4 shadow-sm open:border-[#0F4F68]/22">
              <summary className="cursor-pointer font-semibold text-[#0F4F68]">
                Wie beantrage ich einen Pflegegrad?
              </summary>
              <p className="mt-2 text-neutral-700">
                Beim Pflege­kassen-Antrag: formlose oder strukturierte eingereichte Anträge zusammen mit konkretem Bezug häuslicher Einschränkungen strukturieren; je&nbsp;nach Kasse Zusatzformate nutzen wenn ausgewiesen.
              </p>
            </details>
            <details className="group rounded-2xl border border-[#0F4F68]/12 bg-white p-4 shadow-sm">
              <summary className="cursor-pointer font-semibold text-[#0F4F68]">
                Wer darf einen Pflegegrad beantragen?
              </summary>
              <p className="mt-2 text-neutral-700">Die pflege­bedürftige Person oder nachgewiesene Vertretung.</p>
            </details>
            <details className="rounded-2xl border border-[#0F4F68]/12 bg-white p-4 shadow-sm">
              <summary className="cursor-pointer font-semibold text-[#0F4F68]">
                Ab wann stehen konkrete Leistungen strukturell?
              </summary>
              <p className="mt-2 text-neutral-700">
                Entscheidungen folgen konkreten Bescheiden; zeitlicher Leistungsstart ist im Bescheid nachzulesen.
              </p>
            </details>
            <details className="rounded-2xl border border-[#0F4F68]/12 bg-white p-4 shadow-sm">
              <summary className="cursor-pointer font-semibold text-[#0F4F68]">
                Wie lange dauert die Entscheidung?
              </summary>
              <p className="mt-2 text-neutral-700">Rechtliche Orientierungen geben strukturelle Fristüberlegungen – konkreten Status erfragen Pflegekas­sen.</p>
            </details>
            <details className="rounded-2xl border border-[#0F4F68]/12 bg-white p-4 shadow-sm">
              <summary className="cursor-pointer font-semibold text-[#0F4F68]">
                Welche konkreten Einschläge prüfen MD/MDK?
              </summary>
              <p className="mt-2 text-neutral-700">Alltagsfähigkeit in struktureller Begutachtung – nicht singular Diagnose ohne Alltag.</p>
            </details>
            <details className="rounded-2xl border border-[#0F4F68]/12 bg-white p-4 shadow-sm">
              <summary className="cursor-pointer font-semibold text-[#0F4F68]">
                Was wenn der Pflegegrad abgelehnt oder eingestuft als&nbsp;„zu klein&quot; erfolgt?
              </summary>
              <p className="mt-2 text-neutral-700">
                Bescheid prüfen – Widerspruchsfristen einhalten strukturell dokumentieren wenn Beratungen einbezogen.
              </p>
            </details>
            <details className="rounded-2xl border border-[#0F4F68]/12 bg-white p-4 shadow-sm">
              <summary className="cursor-pointer font-semibold text-[#0F4F68]">
                Kann auch Pflegegrad&nbsp;1 infrage&nbsp;kommen?
              </summary>
              <p className="mt-2 text-neutral-700">Ja strukturelle Einstufungen bei geringerem Beeinträchtigungsbezug dokumentierbar ohne pauschalen Leistungsgarant.</p>
            </details>
            <details className="rounded-2xl border border-[#0F4F68]/12 bg-white p-4 shadow-sm">
              <summary className="cursor-pointer font-semibold text-[#0F4F68]">
                Unterlagen konkret strukturieren?
              </summary>
              <p className="mt-2 text-neutral-700">
                ArztBriefe, dokumentierter häuslicher Alltag, strukturelle Medikationen dokumentieren strukturelle Belege.
              </p>
            </details>
            <details className="rounded-2xl border border-[#0F4F68]/12 bg-white p-4 shadow-sm">
              <summary className="cursor-pointer font-semibold text-[#0F4F68]">
                MUSS ich beim MD „alles vorführen“?
              </summary>
              <p className="mt-2 text-neutral-700">Realitätsbezug hilft strukturelle Begutachtung – Inszenierung schadet meist strukturelle Glaubwürdigkeit.</p>
            </details>
            <details className="rounded-2xl border border-[#0F4F68]/12 bg-white p-4 shadow-sm">
              <summary className="cursor-pointer font-semibold text-[#0F4F68]">
                Kann Hilfe strukturelle Antrag vorbereiten?
              </summary>
              <p className="mt-2 text-neutral-700">
                Ja über Beratungspfad oder strukturelle regional organisierte Teamangebote wie {" "}
                <Link href="/standorte" className="font-semibold text-[#0F4F68] underline">
                  unsere regionalen Büros
                </Link>
                .
              </p>
            </details>
          </div>

          <p className="mt-8 rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            <strong>Hinweis Stand 2026:</strong> keine Rechts- oder Finanzberatung – individuelle Kombination/Leistungen verbindlich strukturelle Pflegekasseentscheidbezogen.
          </p>
        </section>
      </div>
    </>
  );
}
