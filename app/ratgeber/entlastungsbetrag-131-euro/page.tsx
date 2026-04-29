import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { RatgeberArticleHero } from "@/components/ratgeber/RatgeberArticleHero";
import { VerwandteRatgeberBeitraege } from "@/components/ratgeber/VerwandteRatgeberBeitraege";

const HERO_ART = "/images/Ratgeber/Entlastungsbetrag_131_Euro.webp";

export const metadata: Metadata = {
  title: "Entlastungsbetrag 131 Euro richtig nutzen",
  description:
    "Ratgeber: Wer Anspruch auf den Entlastungsbetrag hat, wofür er genutzt werden kann und wie die Abrechnung mit der Pflegekasse funktioniert.",
};

export default function EntlastungsbetragRatgeberPage() {
  return (
    <article className="min-w-0 pb-14 sm:pb-20">
      <RatgeberArticleHero title="Entlastungsbetrag 131 Euro sinnvoll nutzen" />

      <Container className="max-w-4xl pt-10 sm:pt-12">
        <p className="text-lg leading-relaxed text-neutral-700">
          Pflegebedürftige Menschen mit Pflegegrad haben Anspruch auf den Entlastungsbetrag von 131 Euro pro Monat (1.572 Euro
          pro Jahr). Dieser Beitrag erklärt kompakt, wie Sie den Betrag richtig einsetzen und worauf Sie achten sollten.
        </p>
        <div className="mt-6 rounded-xl border border-[#0F4F68]/12 bg-[#F2F9FA]/40 p-4 text-sm text-neutral-700">
          <p>
            <strong className="text-[#0F4F68]">Kurzüberblick:</strong> 131 Euro monatlich, 1.572 Euro jährlich,
            Übertrag ungenutzter Beträge bis 30.06. des Folgejahres.
          </p>
        </div>

        <section className="mt-10 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Voraussetzungen</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Anerkannter Pflegegrad (1 bis 5)</li>
            <li>Häusliche Versorgung</li>
            <li>Abrechnung über anerkannte Anbieter</li>
          </ul>
        </section>

        <figure className="relative mt-12 overflow-hidden rounded-2xl border border-[#0F4F68]/10 bg-gradient-to-r from-[#F2F9FA] via-white to-[#FFF8F2] shadow-[0_20px_50px_-28px_rgba(15,79,104,0.35)] sm:mt-14">
          <div className="pointer-events-none absolute -right-12 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-[#F78F2E]/15 blur-2xl" aria-hidden />
          <div className="grid gap-0 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] sm:items-stretch">
            <div className="relative min-h-[200px] sm:min-h-[240px]">
              <Image
                src={HERO_ART}
                alt=""
                fill
                className="object-cover object-[center_40%]"
                sizes="(min-width: 640px) 45vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent sm:from-black/20" aria-hidden />
            </div>
            <figcaption className="flex flex-col justify-center p-6 sm:p-8">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#F78F2E]">Im Blick</span>
              <p className="mt-2 text-lg font-bold leading-snug text-[#0F4F68] sm:text-xl">
                Jeden Monat stehen 131 Euro bereit – gezielt einsetzen, nicht verschenken.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                Die Pflegekasse vergütet die Leistung direkt mit anerkannten Anbietern. So bleibt mehr Luft im Alltag – ohne
                andere Leistungen zu kürzen.
              </p>
            </figcaption>
          </div>
        </figure>

        <section className="mt-10 space-y-4 text-neutral-700 sm:mt-12">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Was ist der Entlastungsbetrag?</h2>
          <p>
            Der Entlastungsbetrag ist eine zweckgebundene Leistung der Pflegekasse. Er wird nicht bar ausgezahlt,
            sondern für bestimmte Unterstützungsangebote eingesetzt. Ziel ist die Entlastung pflegender Angehöriger
            und die Förderung der Selbstständigkeit der pflegebedürftigen Person.
          </p>
          <p>
            Der Betrag ist für alle Pflegegrade gleich hoch. Nicht genutzte Beträge werden in Folgemonate
            übertragen und können bis zum 30.06. des Folgejahres genutzt werden.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Wofür kann der Betrag genutzt werden?</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Haushaltsnahe Dienstleistungen (z. B. Reinigung, Wäsche, Einkaufen)</li>
            <li>Alltagsbegleitung und Betreuung</li>
            <li>Begleitung zu Arztterminen oder Behördengängen</li>
            <li>Tages- und Nachtpflege</li>
            <li>Kurzzeitpflege (anteilig)</li>
          </ul>
          <p>Wichtig: Die Abrechnung ist nur mit anerkannten Anbietern möglich.</p>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Vorteile im Überblick</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Direkt nutzbar, kein separater Antrag notwendig</li>
            <li>Monatlich bis zu 131 Euro zusätzlich</li>
            <li>Keine Kürzung von Pflegegeld oder Pflegesachleistungen</li>
            <li>Rückwirkende Nutzung innerhalb der Frist möglich</li>
            <li>Spürbare Entlastung im Pflegealltag</li>
          </ul>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Häufige Fragen (FAQ)</h2>
          <div className="space-y-3">
            <p>
              <strong>Kann der Entlastungsbetrag bar ausgezahlt werden?</strong>
              <br />
              Nein, der Betrag wird ausschließlich für anerkannte Leistungen verwendet.
            </p>
            <p>
              <strong>Wie hoch ist der Betrag aktuell?</strong>
              <br />
              131 Euro pro Monat, unabhängig vom Pflegegrad.
            </p>
            <p>
              <strong>Kann ich nicht genutzte Beträge sammeln?</strong>
              <br />
              Ja, bis zum 30.06. des Folgejahres.
            </p>
            <p>
              <strong>Wird der Entlastungsbetrag auf andere Leistungen angerechnet?</strong>
              <br />
              Nein, es ist eine zusätzliche Leistung der Pflegeversicherung.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-xl border border-[#0F4F68]/12 bg-[#f8fcfd] p-5">
          <h2 className="text-xl font-bold text-[#0F4F68]">Fazit</h2>
          <p className="mt-2 text-neutral-700">
            Der Entlastungsbetrag ist eine wichtige Unterstützung im Pflegealltag. Wer den Anspruch frühzeitig nutzt,
            kann sich und Angehörige spürbar entlasten und wichtige Hilfen im Alltag finanzieren.
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

        <VerwandteRatgeberBeitraege currentSlug="entlastungsbetrag-131-euro" />
      </Container>
    </article>
  );
}

