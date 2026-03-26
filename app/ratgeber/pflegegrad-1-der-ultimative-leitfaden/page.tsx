import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { VerwandteRatgeberBeitraege } from "@/components/ratgeber/VerwandteRatgeberBeitraege";

export const metadata: Metadata = {
  title: "Pflegegrad 1: Leistungen, Voraussetzungen & Experten-Tipps (2026)",
  description: `Ratgeber: Pflegegrad 1 verständlich erklärt – inklusive Leistungen, Voraussetzungen und Tipps für die MDK-Begutachtung.`,
};

export default function Pflegegrad1RatgeberPage() {
  return (
    <article className="py-14 sm:py-20">
      <Container className="max-w-4xl">
        <header className="rounded-2xl border border-[#efcba7]/45 bg-gradient-to-br from-[#fffaf4] via-white to-[#f7fbfc] p-5 sm:p-7">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-[#0F4F68]">Ratgeber-Beitrag</p>
              <h1 className="mt-2 text-3xl font-bold leading-tight text-[#0F4F68] sm:text-4xl">
                Pflegegrad 1: der ultimative Leitfaden (2026)
              </h1>
              <p className="mt-4 text-base leading-relaxed text-neutral-700 sm:text-lg">
                Viele denken: „Pflegegrad 1 lohnt sich doch gar nicht!“ Doch auch in dieser Einstiegsstufe gibt es
                wertvolle Unterstützungsleistungen. Dieser Beitrag zeigt Ihnen kompakt, was Pflegegrad 1 bedeutet,
                welche Voraussetzungen gelten und wie Sie sich optimal auf die Begutachtung vorbereiten.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center rounded-lg bg-[#0F4F68] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                >
                  Jetzt beraten lassen
                </Link>
                <a
                  href="/images/Ratgeber/Pflegegrad%201_%20Der%20ultimative%20Leitfaden.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg border border-[#0F4F68]/25 px-4 py-2 font-semibold text-[#0F4F68] transition-colors hover:bg-[#f2f9fa] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                >
                  PDF herunterladen
                </a>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[260px]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src="/images/Ratgeber/ratgeber.webp"
                  alt="Ratgeber-Vorschaubild Pflegegrad 1"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                  sizes="260px"
                  priority
                />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3">
                <div className="rounded-xl border border-[#0F4F68]/12 bg-white/95 p-3 text-[#0F4F68] shadow-sm">
                  <p className="font-semibold">Anerkennung</p>
                  <p className="mt-1 text-neutral-700 text-sm">mind. 12,5 bis &lt; 27 Punkte</p>
                </div>
                <div className="rounded-xl border border-[#0F4F68]/12 bg-white/95 p-3 text-[#0F4F68] shadow-sm">
                  <p className="font-semibold">Entlastung</p>
                  <p className="mt-1 text-neutral-700 text-sm">131 Euro pro Monat</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-10 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Was ist der Pflegegrad 1?</h2>
          <p>
            Der Pflegegrad 1 ist der Einstieg in das deutsche Pflegesystem. Er richtet sich an Menschen, bei
            denen eine „geringe Beeinträchtigung der Selbstständigkeit“ festgestellt wurde. Das heißt: Sie
            kommen im Alltag grundsätzlich noch weitgehend allein zurecht, benötigen aber punktuelle
            Unterstützung – zum Beispiel bei der Haushaltsführung, beim Einkaufen oder bei beginnenden
            Einschränkungen, etwa durch Demenz oder körperliche Beschwerden.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Welche Voraussetzungen gelten?</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#0F4F68]/12 bg-gradient-to-br from-white to-[#fff8f0] p-4">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0F4F68] text-white" aria-hidden>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2 4 5.2v6.1c0 5.1 3.4 9.8 8 10.7 4.6-.9 8-5.6 8-10.7V5.2L12 2z" stroke="white" strokeWidth="2" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-semibold">Punkte im Assessment</p>
              <p className="mt-1 text-sm text-neutral-600">mind. 12,5 bis unter 27 Punkte</p>
            </div>
            <div className="rounded-xl border border-[#0F4F68]/12 bg-gradient-to-br from-white to-[#fff8f0] p-4">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0F4F68] text-white" aria-hidden>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <path d="M12 7v5l3 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-semibold">Dauer der Beeinträchtigung</p>
              <p className="mt-1 text-sm text-neutral-600">mind. voraussichtlich 6 Monate</p>
            </div>
          </div>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Was zahlt die Pflegekasse wirklich? (Stand 2026)</h2>
          <p className="text-sm text-neutral-600">
            Die folgenden Beträge sind eine kompakte Orientierung. Details können je nach Situation variieren.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { label: "Entlastungsbetrag", value: "131 € monatlich" },
              { label: "Pflegehilfsmittel zum Verbrauch", value: "bis zu 42 € monatlich" },
              { label: "Wohnumfeldverbesserung", value: "bis zu 4.180 € je Maßnahme" },
              { label: "Wohngruppenzuschlag", value: "224 € monatlich" },
              { label: "Digitale Pflegeanwendungen (DiPA)", value: "bis zu 53 € monatlich" },
              { label: "Zuschuss zum Pflegeheim", value: "131 € monatlich" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-[#0F4F68]/12 bg-white/95 p-4 shadow-sm"
              >
                <p className="text-sm font-semibold text-[#0F4F68]">{item.label}</p>
                <p className="mt-2 text-lg font-extrabold text-neutral-800">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Die 3 wichtigsten Vorteile im Detail</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                title: "1) Entlastungsbetrag (131 €)",
                text: "Sie erhalten jeden Monat 131 Euro für qualifizierte Dienstleistungen. Das kann je nach Konstellation auch Unterstützung im Alltag und hauswirtschaftliche Hilfe umfassen.",
              },
              {
                title: "2) Zuschuss für Umbauten",
                text: "Wenn eine bodengleiche Dusche, ein Treppenlift oder eine ähnliche Maßnahme nötig ist, kann ein Zuschuss bis zu 4.180 Euro pro Maßnahme anfallen – auf Antrag.",
              },
              {
                title: "3) Pflegehilfsmittel (42 €)",
                text: "Für Verbrauchsmittel wie Desinfektionsmittel, Einmalhandschuhe oder Bettschutzeinlagen stehen monatlich bis zu 42 Euro zur Verfügung.",
              },
            ].map((card, idx) => (
              <div
                key={card.title}
                className="relative rounded-xl border border-[#0F4F68]/12 bg-gradient-to-br from-white to-[#fff8f0] p-4"
              >
                <div className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F78F2E]/15 text-[#F78F2E]">
                  <span className="text-xs font-extrabold">{idx + 1}</span>
                </div>
                <p className="mt-2 text-sm font-bold text-[#0F4F68]">{card.title}</p>
                <p className="mt-2 text-sm text-neutral-700">{card.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">In 4 Schritten erfolgreich zum Pflegegrad 1</h2>
          <ol className="space-y-3">
            {[
              ["Antrag stellen", "Rufen Sie Ihre Pflegekasse an oder nutzen Sie die vorgesehenen Wege (Kontakt/Schriftform). Der Leistungsanspruch beginnt ab Antragseingang."],
              ["Formulare ausfüllen", "Nach der Antragstellung erhalten Sie einen Fragebogen. Ausführlich und ehrlich ausfüllen – das hilft bei der Bewertung."],
              ["Begutachtungstermin", "Ein Gutachter des MD (oder Medicproof) prüft Ihre Selbstständigkeit zu Hause oder (seltener) per Video-Call."],
              ["Bescheid erhalten", "Die Pflegekasse stellt nach Antragseingang den schriftlichen Bescheid zu. Zeitliche Abläufe folgen gesetzlichen Vorgaben."],
            ].map(([title, text], i) => (
              <li key={title} className="rounded-xl border border-[#0F4F68]/12 bg-white/95 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F4F68] text-white" aria-hidden>
                    <span className="text-sm font-extrabold">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0F4F68]">{title}</p>
                    <p className="mt-1 text-sm text-neutral-700">{text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">3 Goldene Tipps für den Gutachter-Besuch</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              {
                title: "Tipp 1: Pflegetagebuch führen",
                text: "Dokumentieren Sie über mindestens 1–2 Wochen sehr konkret: wann, wie oft und wobei Sie Unterstützung brauchen. Das erhöht die Aussagekraft.",
              },
              {
                title: "Tipp 2: Keine „Fassadenhaltung“",
                text: "Viele berichten, sie würden sich beim Termin zusammenreißen. Wichtig ist: zeigen Sie den Alltag möglichst realistisch – auch an einem schwierigen Tag.",
              },
              {
                title: "Tipp 3: Unterstützung dabei haben",
                text: "Planen Sie eine zweite Person ein (Angehörige, Vertraute oder professionelle Beratung). So gehen wichtige Punkte weniger schnell verloren.",
              },
            ].map((card) => (
              <div key={card.title} className="rounded-xl border border-[#0F4F68]/12 bg-gradient-to-br from-white to-[#fff8f0] p-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0F4F68]/10 text-[#0F4F68]" aria-hidden>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <p className="mt-3 text-sm font-bold text-[#0F4F68]">{card.title}</p>
                <p className="mt-2 text-sm text-neutral-700">{card.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Was tun bei einem Ablehnungsbescheid?</h2>
          <p>
            Wenn Ihr Antrag auf Pflegegrad 1 abgelehnt wurde, weil die Punktzahl knapp nicht erreicht wurde:
            Geben Sie nicht auf. Sie haben in der Regel Zeit, schriftlich Widerspruch einzulegen. Holen Sie
            sich das Gutachten und prüfen Sie die Bewertung (am besten mit Unterstützung).
          </p>
        </section>

        <section className="mt-10 rounded-xl border border-[#0F4F68]/12 bg-[#f8fcfd] p-5">
          <h2 className="text-xl font-bold text-[#0F4F68]">Quellen (Auswahl)</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-neutral-700">
            <li>
              <a className="underline hover:text-neutral-900" href="https://box4pflege.de/ratgeber/welche-voraussetzungen-fuer-pflegegrad-1/" target="_blank" rel="noopener noreferrer">
                Voraussetzungen für Pflegegrad 1 (box4pflege)
              </a>
            </li>
            <li>
              <a className="underline hover:text-neutral-900" href="https://www.pflege.de/pflegekasse-pflegefinanzierung/pflegeleistungen/zusaetzliche-betreuungsleistungen-entlastungsleistungen-entlastungsbetrag/" target="_blank" rel="noopener noreferrer">
                Entlastungsbetrag erklärt (pflege.de)
              </a>
            </li>
            <li>
              <a className="underline hover:text-neutral-900" href="https://www.bundesgesundheitsministerium.de/pflege-zu-hause/leistungen-bei-pflegegrad-1" target="_blank" rel="noopener noreferrer">
                Leistungen bei Pflegegrad 1 (BMG)
              </a>
            </li>
          </ul>
          <p className="mt-4 text-xs text-neutral-500">
            Hinweis: Dieser Beitrag ersetzt keine Rechts- oder Fachberatung. Inhalte wurden aus der bereitgestellten PDF und öffentlich zugänglichen Quellen zusammengefasst.
          </p>
        </section>

        <section className="mt-10 rounded-xl border border-[#0F4F68]/12 bg-[#f8fcfd] p-5">
          <h2 className="text-xl font-bold text-[#0F4F68]">Fazit</h2>
          <p className="mt-2 text-neutral-700">
            Pflegegrad 1 ist mehr als „nur wenig Unterstützung“. Mit dem richtigen Plan wissen Sie, welche Leistungen
            möglich sind und wie Sie sich auf die Begutachtung vorbereiten. Nutzen Sie die Chance, frühe Entlastung
            aufzubauen – und lassen Sie sich im Zweifel individuell beraten.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/kontakt"
              className="inline-flex items-center rounded-lg bg-[#0F4F68] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
            >
              Jetzt Kontakt aufnehmen
            </Link>
            <Link
              href="/ratgeber"
              className="inline-flex items-center rounded-lg border border-[#0F4F68]/25 px-4 py-2 font-semibold text-[#0F4F68] transition-colors hover:bg-[#f2f9fa] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
            >
              Zurück zum Ratgeber
            </Link>
          </div>
        </section>

        <VerwandteRatgeberBeitraege currentSlug="pflegegrad-1-der-ultimative-leitfaden" />
      </Container>
    </article>
  );
}

