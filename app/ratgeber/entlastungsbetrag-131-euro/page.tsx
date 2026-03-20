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
        <header>
          <p className="text-sm font-semibold text-[#0F4F68]">Ratgeber-Beitrag</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-[#0F4F68] sm:text-4xl">
            Entlastungsbetrag 131 Euro sinnvoll nutzen
          </h1>
          <p className="mt-4 text-base leading-relaxed text-neutral-700 sm:text-lg">
            Pflegebeduerftige Menschen mit Pflegegrad haben Anspruch auf den Entlastungsbetrag von 131 Euro pro Monat
            (1.572 Euro pro Jahr). Dieser Beitrag erklaert kompakt, wie Sie den Betrag richtig einsetzen und worauf Sie
            achten sollten.
          </p>
        </header>

        <section className="mt-10 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Voraussetzungen</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Es liegt ein anerkannter Pflegegrad (1 bis 5) vor.</li>
            <li>Die Versorgung findet in der haeuslichen Umgebung statt.</li>
            <li>Die Leistung wird von einem anerkannten Anbieter erbracht.</li>
          </ul>
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
          <ul className="list-disc space-y-2 pl-5">
            <li>Haushaltsnahe Dienstleistungen (z. B. Reinigung, Waesche, Einkaufen)</li>
            <li>Alltagsbegleitung und Betreuung</li>
            <li>Begleitung zu Arztterminen oder Behoerdengaengen</li>
            <li>Tages- und Nachtpflege</li>
            <li>Kurzzeitpflege (anteilig)</li>
          </ul>
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

