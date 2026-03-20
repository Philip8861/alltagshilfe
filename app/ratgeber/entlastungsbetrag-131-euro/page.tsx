import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Entlastungsbetrag 131 Euro richtig nutzen",
  description:
    "Ratgeber: Wer Anspruch auf den Entlastungsbetrag hat, wofuer er genutzt werden kann und wie die Abrechnung mit der Pflegekasse funktioniert.",
};

export default function EntlastungsbetragRatgeberPage() {
  return (
    <article className="py-14 sm:py-20">
      <Container className="max-w-4xl">
        <header className="rounded-2xl border border-[#0F4F68]/12 bg-gradient-to-br from-white to-[#f2f9fa] p-5 sm:p-7">
          <p className="text-sm font-semibold text-[#0F4F68]">Ratgeber-Beitrag</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-[#0F4F68] sm:text-4xl">
            Entlastungsbetrag 131 Euro sinnvoll nutzen
          </h1>
          <p className="mt-4 text-base leading-relaxed text-neutral-700 sm:text-lg">
            Pflegebeduerftige Menschen mit Pflegegrad haben Anspruch auf den Entlastungsbetrag von 131 Euro pro Monat
            (1.572 Euro pro Jahr). Dieser Beitrag erklaert kompakt, wie Sie den Betrag richtig einsetzen und worauf Sie
            achten sollten.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-xl border border-[#0F4F68]/12 bg-white p-3 text-[#0F4F68]">
              <p className="font-semibold">Monatlich</p>
              <p className="mt-1 text-neutral-700">131 Euro</p>
            </div>
            <div className="rounded-xl border border-[#0F4F68]/12 bg-white p-3 text-[#0F4F68]">
              <p className="font-semibold">Jaehrlich</p>
              <p className="mt-1 text-neutral-700">1.572 Euro</p>
            </div>
            <div className="rounded-xl border border-[#0F4F68]/12 bg-white p-3 text-[#0F4F68]">
              <p className="font-semibold">Frist</p>
              <p className="mt-1 text-neutral-700">bis 30.06. Folgejahr</p>
            </div>
          </div>
        </header>

        <section className="mt-10 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Voraussetzungen</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[#0F4F68]/12 bg-white p-4">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0F4F68] text-white" aria-hidden>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5.2v6.1c0 5.1 3.4 9.8 8 10.7 4.6-.9 8-5.6 8-10.7V5.2L12 2z" /></svg>
              </div>
              <p className="mt-2 text-sm">Anerkannter Pflegegrad (1 bis 5)</p>
            </div>
            <div className="rounded-xl border border-[#0F4F68]/12 bg-white p-4">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0F4F68] text-white" aria-hidden>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2 3.5 10v10.3h6.2v-6.3h4.6v6.3h6.2V10L12 3.2z" /></svg>
              </div>
              <p className="mt-2 text-sm">Haeusliche Versorgung</p>
            </div>
            <div className="rounded-xl border border-[#0F4F68]/12 bg-white p-4">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0F4F68] text-white" aria-hidden>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v11H7.6L4 18.6V4z" /></svg>
              </div>
              <p className="mt-2 text-sm">Leistung ueber anerkannten Anbieter</p>
            </div>
          </div>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Was ist der Entlastungsbetrag?</h2>
          <p>
            Der Entlastungsbetrag ist eine zweckgebundene Leistung der Pflegekasse. Er wird nicht bar ausgezahlt,
            sondern fuer bestimmte Unterstuetzungsangebote eingesetzt. Ziel ist die Entlastung pflegender Angehoeriger
            und die Foerderung der Selbststaendigkeit der pflegebeduerftigen Person.
          </p>
          <p>
            Der Betrag ist fuer alle Pflegegrade gleich hoch. Nicht genutzte Betraege werden in Folgemonate
            uebertragen und koennen bis zum 30.06. des Folgejahres genutzt werden.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Wofuer kann der Betrag genutzt werden?</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              "Haushaltsnahe Dienstleistungen (z. B. Reinigung, Waesche, Einkaufen)",
              "Alltagsbegleitung und Betreuung",
              "Begleitung zu Arztterminen oder Behoerdengaengen",
              "Tages- und Nachtpflege",
              "Kurzzeitpflege (anteilig)",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-[#0F4F68]/10 bg-[#f8fcfd] p-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0F4F68] text-white" aria-hidden>
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" /></svg>
                </span>
                <p className="text-sm">{item}</p>
              </div>
            ))}
          </div>
          <p>Wichtig: Die Abrechnung ist nur mit anerkannten Anbietern moeglich.</p>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Vorteile im Ueberblick</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Direkt nutzbar, kein separater Antrag notwendig</li>
            <li>Monatlich bis zu 131 Euro zusaetzlich</li>
            <li>Keine Kuerzung von Pflegegeld oder Pflegesachleistungen</li>
            <li>Rueckwirkende Nutzung innerhalb der Frist moeglich</li>
            <li>Spuerbare Entlastung im Pflegealltag</li>
          </ul>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Haeufige Fragen (FAQ)</h2>
          <div className="space-y-3">
            <p>
              <strong>Kann der Entlastungsbetrag bar ausgezahlt werden?</strong>
              <br />
              Nein, der Betrag wird ausschliesslich fuer anerkannte Leistungen verwendet.
            </p>
            <p>
              <strong>Wie hoch ist der Betrag aktuell?</strong>
              <br />
              131 Euro pro Monat, unabhaengig vom Pflegegrad.
            </p>
            <p>
              <strong>Kann ich nicht genutzte Betraege sammeln?</strong>
              <br />
              Ja, bis zum 30.06. des Folgejahres.
            </p>
            <p>
              <strong>Wird der Entlastungsbetrag auf andere Leistungen angerechnet?</strong>
              <br />
              Nein, es ist eine zusaetzliche Leistung der Pflegeversicherung.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-xl border border-[#0F4F68]/12 bg-[#f8fcfd] p-5">
          <h2 className="text-xl font-bold text-[#0F4F68]">Fazit</h2>
          <p className="mt-2 text-neutral-700">
            Der Entlastungsbetrag ist eine wichtige Unterstuetzung im Pflegealltag. Wer den Anspruch fruehzeitig nutzt,
            kann sich und Angehoerige spuergbar entlasten und wichtige Hilfen im Alltag finanzieren.
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
              Zurueck zum Ratgeber
            </Link>
          </div>
        </section>
      </Container>
    </article>
  );
}

