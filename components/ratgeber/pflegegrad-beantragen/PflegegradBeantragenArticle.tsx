import type { ReactNode } from "react";
import Link from "next/link";

import { PFLEGEGRAD_ARTICLE_FAQ } from "@/components/ratgeber/pflegegrad-beantragen/pflegegrad-beantragen-faq-data";
import { cn } from "@/lib/utils";

const PROSE = "text-[1.125rem] leading-[1.7] text-neutral-800";
const LINK = "font-medium text-[#0F4F68] underline-offset-2 hover:underline";

export const PFLEGEGRAD_ARTICLE_TOC_ENTRIES = [
  { id: "kurzantwort", label: "Kurzantwort" },
  { id: "wann-beantragen", label: "Wann einen Pflegegrad beantragen?" },
  { id: "schritt-fuer-schritt", label: "Schritt für Schritt" },
  { id: "begutachtung-vorbereiten", label: "Begutachtung vorbereiten" },
  { id: "pflegegrade-leistungen", label: "Pflegegrade & Leistungen 2026" },
  { id: "haeufige-fehler", label: "Häufige Fehler" },
  { id: "widerspruch", label: "Wenn der Pflegegrad abgelehnt wird" },
  { id: "unterstuetzung-ahs", label: "Unterstützung durch Alltagshilfe-Süd" },
  { id: "checkliste", label: "Checkliste" },
  { id: "faq-pflegegrad", label: "Häufige Fragen" },
] as const;

function TocLinks({ className }: { className?: string }) {
  return (
    <ol className={`space-y-2.5 ${className ?? ""}`}>
      {[...PFLEGEGRAD_ARTICLE_TOC_ENTRIES].map((e, i) => (
        <li key={e.id} className="text-sm leading-snug text-neutral-700">
          <span className="text-neutral-400">{String(i + 1).padStart(2, "0")}</span>{" "}
          <a href={`#${e.id}`} className={`${LINK} text-[0.9375rem]`}>
            {e.label}
          </a>
        </li>
      ))}
    </ol>
  );
}

function ArticleH2({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className={cn(
        "scroll-mt-28 text-2xl font-semibold tracking-tight text-[#0F4F68] sm:text-[1.65rem] sm:leading-snug",
        className,
      )}
    >
      {children}
    </h2>
  );
}

function ArticleH3({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h3 id={id} className="mt-6 text-lg font-semibold text-[#0F4F68] scroll-mt-28">
      {children}
    </h3>
  );
}

export function pflegegradBeantragenFaqForJsonLd() {
  return PFLEGEGRAD_ARTICLE_FAQ.map((item) => ({ question: item.question, answer: item.answer }));
}

export function PflegegradBeantragenArticle() {
  return (
    <div className={`${PROSE} min-w-0`}>
      {/* Mobile TOC */}
      <details className="group mb-10 rounded-lg border border-neutral-200 bg-white lg:hidden">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-[#0F4F68] [&::-webkit-details-marker]:hidden">
          <span className="flex items-center justify-between gap-2">
            Inhalt
            <span aria-hidden className="text-neutral-400 transition group-open:rotate-180">
              ▾
            </span>
          </span>
        </summary>
        <nav className="border-t border-neutral-100 px-4 py-4" aria-label="Inhalt (mobil)">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Inhalt</p>
          <TocLinks className="mt-3" />
        </nav>
      </details>

      <ArticleH2 id="kurzantwort" className="mt-2 sm:mt-4">
        Kurzantwort: Wie beantragt man einen Pflegegrad?
      </ArticleH2>
      <p className="mt-4">
        Einen Pflegegrad beantragen Sie bei der <strong>Pflegekasse</strong> der betroffenen Person. Die Pflegekasse ist
        bei der jeweiligen Krankenkasse angesiedelt. Der Antrag kann telefonisch, schriftlich oder je nach Pflegekasse auch
        online gestellt werden. Wichtig ist, dass klar erkennbar ist, dass Leistungen der Pflegeversicherung beziehungsweise
        die Feststellung eines Pflegegrades beantragt werden.
      </p>
      <p className="mt-4">
        Nach dem Antrag beauftragt die Pflegekasse in der Regel den Medizinischen Dienst oder andere unabhängige Gutachter
        mit der Begutachtung. Bei privat Versicherten Personen erfolgt die Begutachtung üblicherweise über Medicproof.
        Geprüft wird nicht nur eine Diagnose, sondern vor allem, wie selbstständig die betroffene Person ihren Alltag noch
        bewältigen kann.
      </p>
      <p className="mt-4">
        <strong>Wichtig:</strong> Stellen Sie den Antrag möglichst früh. Leistungen der Pflegeversicherung werden
        grundsätzlich nur auf Antrag gewährt. Der Zeitpunkt der Antragstellung ist deshalb sehr wichtig.
      </p>

      <ArticleH2 id="wann-beantragen" className="mt-14">
        Wann sollte man einen Pflegegrad beantragen?
      </ArticleH2>
      <p className="mt-4">
        Ein Pflegegrad sollte beantragt werden, sobald regelmäßig Unterstützung im Alltag notwendig wird. Viele Angehörige
        warten zu lange, weil sie zunächst „einfach mithelfen“ und die zunehmende Belastung als selbstverständlich ansehen.
        Dadurch werden mögliche Leistungen oft später genutzt, als es eigentlich möglich wäre.
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

      <h3 id="wichtigste-fakten" className="mt-12 scroll-mt-28 text-xl font-semibold text-[#0F4F68]">
        Das Wichtigste auf einen Blick
      </h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[280px] border-collapse text-left text-[1.0625rem]">
          <tbody className="divide-y divide-neutral-200">
            <tr>
              <th className="border-b border-neutral-300 py-3 pr-4 align-top font-semibold text-[#0F4F68]">
                Zuständige Stelle
              </th>
              <td className="border-b border-neutral-300 py-3 text-neutral-800">
                Der Antrag wird bei der Pflegekasse gestellt. Diese ist bei der Krankenkasse der betroffenen Person
                eingerichtet.
              </td>
            </tr>
            <tr>
              <th className="py-3 pr-4 align-top font-semibold text-[#0F4F68]">Wer kann den Antrag stellen?</th>
              <td className="py-3 text-neutral-800">
                Die pflegebedürftige Person selbst oder eine bevollmächtigte Person, zum Beispiel Angehörige.
              </td>
            </tr>
            <tr>
              <th className="py-3 pr-4 align-top font-semibold text-[#0F4F68]">Wie kann der Antrag gestellt werden?</th>
              <td className="py-3 text-neutral-800">
                Telefonisch, schriftlich oder je nach Pflegekasse online. Aus Nachweisgründen ist eine schriftliche
                Bestätigung sinnvoll.
              </td>
            </tr>
            <tr>
              <th className="py-3 pr-4 align-top font-semibold text-[#0F4F68]">Was passiert danach?</th>
              <td className="py-3 text-neutral-800">
                Die Pflegekasse beauftragt den Medizinischen Dienst oder andere Gutachter. Bei privat Versicherten ist
                Medicproof zuständig.
              </td>
            </tr>
            <tr>
              <th className="py-3 pr-4 align-top font-semibold text-[#0F4F68]">Wie lange dauert die Entscheidung?</th>
              <td className="py-3 text-neutral-800">
                Die gesetzliche Bearbeitungsfrist beträgt grundsätzlich 25 Arbeitstage. In besonderen Situationen können
                kürzere Fristen gelten.
              </td>
            </tr>
            <tr>
              <th className="py-3 pr-4 align-top font-semibold text-[#0F4F68]">Was wird begutachtet?</th>
              <td className="py-3 text-neutral-800">
                Entscheidend ist, wie selbstständig die Person im Alltag ist und wobei regelmäßig Hilfe benötigt wird.
              </td>
            </tr>
            <tr>
              <th className="py-3 pr-4 align-top font-semibold text-[#0F4F68]">Was tun bei Ablehnung?</th>
              <td className="py-3 text-neutral-800">
                Gegen den Bescheid kann grundsätzlich innerhalb eines Monats nach Zugang Widerspruch eingelegt werden.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ArticleH2 id="schritt-fuer-schritt" className="mt-14">
        Schritt für Schritt: Pflegegrad beantragen
      </ArticleH2>

      <ArticleH3>Schritt 1: Pflegekasse kontaktieren</ArticleH3>
      <p className="mt-3">
        Der erste Schritt ist die Kontaktaufnahme mit der Pflegekasse. Sie können dort anrufen und sagen:
      </p>
      <blockquote className="my-4 border-l-2 border-[#0F4F68]/30 pl-4 text-neutral-700 italic">
        „Ich möchte für Frau/Herrn [Name] Leistungen der Pflegeversicherung beantragen und bitte um Prüfung eines
        Pflegegrades.“
      </blockquote>
      <p>
        Dieser Satz reicht in der Regel aus, damit das Verfahren angestoßen wird. Bitten Sie um eine schriftliche
        Bestätigung des Antragseingangs. Notieren Sie sich außerdem Datum, Uhrzeit und den Namen der Person, mit der Sie
        gesprochen haben.
      </p>
      <p className="mt-4">
        Das Antragsdatum ist wichtig, weil Leistungen der Pflegeversicherung grundsätzlich ab Antragstellung relevant
        werden können.
      </p>

      <ArticleH3>Schritt 2: Antragsformular ausfüllen</ArticleH3>
      <p className="mt-3">
        Nach der ersten Kontaktaufnahme sendet die Pflegekasse meist ein Formular zu. Darin werden persönliche Daten,
        Versicherungsnummer, Wohnsituation, behandelnde Ärzte, Angaben zur Pflegeperson und gewünschte Leistungen
        abgefragt.
      </p>
      <p className="mt-4">
        Füllen Sie das Formular sorgfältig aus und senden Sie es zeitnah zurück. Wenn Angehörige den Antrag stellen oder für
        die betroffene Person handeln, sollte eine Vollmacht vorliegen. Falls eine gesetzliche Betreuung besteht, sollte
        der Betreuerausweis bereitliegen.
      </p>
      <p className="mt-4">
        Tipp: Wenn Sie unsicher sind, welche Angaben wichtig sind, lassen Sie sich unterstützen. Alltagshilfe-Süd hilft
        bei der Orientierung und kann Sie beim Pflegegrad-Antrag begleiten.
      </p>

      <ArticleH3>Schritt 3: Unterlagen sammeln</ArticleH3>
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
        „Morgens Hilfe beim Aufstehen, Waschen des Rückens, Anziehen der Kompressionsstrümpfe und Erinnerung an Medikamente.“
      </p>

      <ArticleH3 id="begutachtung-vorbereiten">Schritt 4: Begutachtungstermin vorbereiten</ArticleH3>
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

      <ArticleH3>Schritt 5: Bescheid prüfen</ArticleH3>
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

      <ArticleH2 id="was-wird-begutachtet" className="mt-14">
        Was wird bei der Pflegebegutachtung geprüft?
      </ArticleH2>
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

      <PflegegradeLeistungenSection />

      <HaefigeFehlerSection />

      <ArticleH2 id="widerspruch" className="mt-14">
        Was tun, wenn der Pflegegrad abgelehnt wird?
      </ArticleH2>
      <p className="mt-4">
        Wenn die Pflegekasse keinen Pflegegrad bewilligt oder der Pflegegrad zu niedrig erscheint, können Sie Widerspruch
        einlegen. Die Frist beträgt grundsätzlich einen Monat ab Zugang des Bescheids. In der Regel steht die Frist auch in
        der Rechtsbehelfsbelehrung des Bescheids.
      </p>
      <p className="mt-4">
        Wichtig ist zuerst, die Frist zu sichern. Dafür kann zunächst ein kurzer Widerspruch reichen. Die ausführliche
        Begründung kann nachgereicht werden.
      </p>
      <p className="mt-4">Eine mögliche Formulierung lautet:</p>
      <blockquote className="my-4 border-l-2 border-[#0F4F68]/30 pl-4 text-neutral-700 italic">
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

      <ArticleH2 id="praxisbeispiel" className="mt-14">
        Praxisbeispiel: Warum Vorbereitung so wichtig ist
      </ArticleH2>
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

      <ArticleH2 id="unterstuetzung-ahs" className="mt-14">
        Wie Alltagshilfe-Süd unterstützen kann
      </ArticleH2>
      <p className="mt-4">
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
        Inkontinenzversorgung über Rezept. Bei der Inkontinenzversorgung können je nach Situation auch kostenlose
        Probeprodukte möglich sein.
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

      <p className="mt-10 text-neutral-700">
        Sie möchten Unterstützung beim Pflegegrad-Antrag oder beim Widerspruch? Wir helfen Ihnen gerne persönlich weiter –
        verständlich, zuverlässig und passend zu Ihrer Situation.
      </p>
      <Link
        href="/kontakt"
        className="mt-4 inline-flex min-h-[2.75rem] items-center justify-center rounded-lg border border-[#F78F2E] bg-[#F78F2E] px-6 text-[0.95rem] font-semibold text-white transition hover:bg-[#e8862a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
      >
        Jetzt Beratungsgespräch vereinbaren
      </Link>

      <ChecklisteSection />

      <ArticleH2 id="faq-pflegegrad" className="mt-14">
        Häufige Fragen zum Pflegegrad-Antrag
      </ArticleH2>
      <div className="mt-6 space-y-2">
        {PFLEGEGRAD_ARTICLE_FAQ.map((faq) => (
          <details
            key={faq.id}
            className="group border-b border-neutral-200 pb-2 text-[1.0625rem] last:border-b-0"
          >
            <summary className="cursor-pointer list-none py-2 text-left font-semibold text-[#0F4F68] [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-3">
                {faq.question}
                <span className="text-neutral-400 transition group-open:-rotate-180" aria-hidden>
                  ⌄
                </span>
              </span>
            </summary>
            <p className="pb-2 pt-1 text-neutral-700">{faq.answer}</p>
          </details>
        ))}
      </div>

      <QuellenSection />

      <RelatedSection />
    </div>
  );
}

function PflegegradeLeistungenSection() {
  return (
    <>
      <ArticleH2 id="pflegegrade-leistungen" className="mt-14 scroll-mt-28">
        Pflegegrade: Welche Einstufung ist möglich?
      </ArticleH2>
      <p className="mt-4">
        Die Pflegegrade reichen von Pflegegrad 1 bis Pflegegrad 5. Sie richten sich nach dem Grad der Beeinträchtigung der
        Selbstständigkeit oder Fähigkeiten.
      </p>
      <ul className="mt-4 list-none space-y-3">
        <li>
          <strong className="text-[#0F4F68]">Pflegegrad 1:</strong> 12,5 bis unter 27 Punkte – geringe Beeinträchtigung der
          Selbstständigkeit oder Fähigkeiten.
        </li>
        <li>
          <strong className="text-[#0F4F68]">Pflegegrad 2:</strong> 27 bis unter 47,5 Punkte – erhebliche Beeinträchtigung.
        </li>
        <li>
          <strong className="text-[#0F4F68]">Pflegegrad 3:</strong> 47,5 bis unter 70 Punkte – schwere Beeinträchtigung.
        </li>
        <li>
          <strong className="text-[#0F4F68]">Pflegegrad 4:</strong> 70 bis unter 90 Punkte – schwerste Beeinträchtigung.
        </li>
        <li>
          <strong className="text-[#0F4F68]">Pflegegrad 5:</strong> 90 bis 100 Punkte – schwerste Beeinträchtigung mit
          besonderen Anforderungen an die pflegerische Versorgung.
        </li>
      </ul>
      <p className="mt-4">Die Einstufung entscheidet darüber, welche Leistungen der Pflegeversicherung genutzt werden können.</p>

      <ArticleH3>Welche Leistungen können nach einem Pflegegrad wichtig werden?</ArticleH3>
      <p className="mt-3">
        Welche Leistungen genutzt werden können, hängt vom Pflegegrad und von der Versorgungssituation ab. Für die häusliche
        Pflege sind besonders Pflegegeld, Pflegesachleistungen, der Entlastungsbetrag, Pflegehilfsmittel, Verhinderungspflege,
        Wohnraumanpassung und Beratungsleistungen wichtig.
      </p>
      <p className="mt-4">2026 gelten nach aktueller Übersicht unter anderem folgende monatliche Beträge:</p>

      <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-neutral-500">Pflegegeld</p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[280px] border-collapse border border-neutral-200 text-[1rem]">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="px-3 py-2 text-left font-semibold text-[#0F4F68]">Pflegegrad</th>
              <th className="px-3 py-2 text-left font-semibold text-[#0F4F68]">Betrag</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-100">
              <td className="px-3 py-2">1</td>
              <td className="px-3 py-2">kein Pflegegeld</td>
            </tr>
            <tr className="border-b border-neutral-100">
              <td className="px-3 py-2">2</td>
              <td className="px-3 py-2">347 Euro</td>
            </tr>
            <tr className="border-b border-neutral-100">
              <td className="px-3 py-2">3</td>
              <td className="px-3 py-2">599 Euro</td>
            </tr>
            <tr className="border-b border-neutral-100">
              <td className="px-3 py-2">4</td>
              <td className="px-3 py-2">800 Euro</td>
            </tr>
            <tr>
              <td className="px-3 py-2">5</td>
              <td className="px-3 py-2">990 Euro</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-neutral-500">Pflegesachleistungen</p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[280px] border-collapse border border-neutral-200 text-[1rem]">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="px-3 py-2 text-left font-semibold text-[#0F4F68]">Pflegegrad</th>
              <th className="px-3 py-2 text-left font-semibold text-[#0F4F68]">Höchstbetrag (monatlich)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-100">
              <td className="px-3 py-2">1</td>
              <td className="px-3 py-2">keine Pflegesachleistungen</td>
            </tr>
            <tr className="border-b border-neutral-100">
              <td className="px-3 py-2">2</td>
              <td className="px-3 py-2">bis zu 796 Euro</td>
            </tr>
            <tr className="border-b border-neutral-100">
              <td className="px-3 py-2">3</td>
              <td className="px-3 py-2">bis zu 1.497 Euro</td>
            </tr>
            <tr className="border-b border-neutral-100">
              <td className="px-3 py-2">4</td>
              <td className="px-3 py-2">bis zu 1.859 Euro</td>
            </tr>
            <tr>
              <td className="px-3 py-2">5</td>
              <td className="px-3 py-2">bis zu 2.299 Euro</td>
            </tr>
          </tbody>
        </table>
      </div>

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
    </>
  );
}

function HaefigeFehlerSection() {
  return (
    <>
      <ArticleH2 id="haeufige-fehler" className="mt-14 scroll-mt-28">
        Häufige Fehler beim Pflegegrad-Antrag
      </ArticleH2>
      <p className="mt-4">
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
    </>
  );
}

function ChecklisteSection() {
  const items = [
    "Pflegekasse kontaktiert.",
    "Antrag schriftlich, telefonisch oder online gestellt.",
    "Datum der Antragstellung notiert.",
    "Schriftliche Bestätigung des Antragseingangs angefordert.",
    "Vollmacht vorbereitet, falls Angehörige handeln.",
    "Arztberichte gesammelt.",
    "Medikamentenplan bereitgelegt.",
    "Krankenhaus- oder Reha-Berichte gesammelt.",
    "Pflegetagebuch oder eigene Notizen geführt.",
    "Pflegeperson für den Begutachtungstermin eingeplant.",
    "Begutachtungstermin vorbereitet.",
    "Bescheid und Gutachten nach Erhalt geprüft.",
    "Bei Ablehnung oder zu niedriger Einstufung Widerspruchsfrist notiert.",
    "Bei Bedarf Beratung durch Alltagshilfe-Süd angefragt.",
  ];
  return (
    <>
      <ArticleH2 id="checkliste" className="mt-14 scroll-mt-28">
        Checkliste: Pflegegrad beantragen
      </ArticleH2>
      <p className="mt-4">
        Nutzen Sie diese Checkliste, um den Antrag vorzubereiten:
      </p>
      <ul className="mt-6 list-none space-y-2 border-l border-neutral-200 pl-4">
        {items.map((t) => (
          <li key={t} className="relative pl-6">
            <span className="absolute left-0 top-[0.35em] h-[0.42rem] w-[0.42rem] rounded-[1px] border border-[#0F4F68]/55" aria-hidden />
            <span className="-ml-px text-[#0F4F68]" aria-hidden>
              ✓{" "}
            </span>
            {t}
          </li>
        ))}
      </ul>
    </>
  );
}

function QuellenSection() {
  const linkClass = `${LINK}`;
  return (
    <section id="quellen-pflegegrad" className="mt-16 border-t border-neutral-200 pt-10">
      <h2 id="quellen-stand" className="text-xl font-semibold text-[#0F4F68] scroll-mt-28">
        Quellen &amp; Stand
      </h2>
      <p className="mt-4">
        <strong className="text-neutral-900">Stand des Artikels:</strong> April 2026
      </p>
      <p className="mt-3">
        <strong className="text-neutral-900">Fachliche Grundlage:</strong> Bundesgesundheitsministerium, Medizinischer Dienst
        Bund, Verbraucherzentrale, SGB XI.
      </p>
      <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-neutral-500">Quellen</p>
      <ul className="mt-3 list-none space-y-3 text-[1.0625rem]">
        <li>
          Bundesgesundheitsministerium: Pflegebedürftig – was nun?{" "}
          <a
            href="https://www.bundesgesundheitsministerium.de/themen/pflege/online-ratgeber-pflege/pflegebeduerftig-was-nun"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            bundesgesundheitsministerium.de (extern)
          </a>
        </li>
        <li>
          Bundesgesundheitsministerium: Leistungsansprüche der Versicherten im Jahr 2026 (PDF){" "}
          <a
            href="https://www.bundesgesundheitsministerium.de/fileadmin/Dateien/3_Downloads/P/Pflegeversicherung_Leistungsbeitraege/Uebersicht_Leistungsbetraege_2026.pdf"
            className={linkClass}
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
            className={linkClass}
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
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            verbraucherzentrale.de
          </a>
        </li>
        <li>
          SGB XI §33 Leistungsvoraussetzungen{" "}
          <a
            href="https://www.sozialgesetzbuch-sgb.de/sgbxi/33.html"
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            sozialgesetzbuch-sgb.de
          </a>
        </li>
      </ul>
      <p className="mt-8 text-neutral-600">
        Hinweis: Dieser Artikel dient der allgemeinen Orientierung und ersetzt keine individuelle Pflegeberatung oder
        Rechtsberatung.
      </p>
    </section>
  );
}

function RelatedSection() {
  const suggestions = [
    "Entlastungsbetrag 2026: Wer hat Anspruch und wie nutzt man ihn?",
    "Pflegegeld 2026: Höhe, Anspruch und Auszahlung",
    "Pflegehilfsmittel zum Verbrauch: Was zahlt die Pflegekasse?",
    "Pflegegrad abgelehnt: So funktioniert der Widerspruch",
    "Pflegeberatung nach §37.3 SGB XI einfach erklärt",
  ];
  return (
    <section className="mt-12 border-t border-neutral-100 pt-8">
      <h2 className="text-lg font-semibold text-[#0F4F68]">Weitere Ratgeber</h2>
      <p className="mt-2 text-[1rem] text-neutral-600">
        Diese Themenseiten bereiten wir schrittweise vor. Aktuell finden Sie in der{" "}
        <Link href="/ratgeber" className={LINK}>
          Ratgeber-Übersicht
        </Link>{" "}
        bereits unsere anderen Beiträge.
      </p>
      <ul className="mt-4 list-none space-y-2 text-[1rem] text-neutral-700">
        {suggestions.map((s) => (
          <li key={s} className="border-l border-neutral-200 pl-3">
            {s}
          </li>
        ))}
      </ul>
    </section>
  );
}
