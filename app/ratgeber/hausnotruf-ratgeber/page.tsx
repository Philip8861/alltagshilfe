import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { VerwandteRatgeberBeitraege } from "@/components/ratgeber/VerwandteRatgeberBeitraege";

export const metadata: Metadata = {
  title: "Hausnotruf-Ratgeber: Sicherheit zu Hause einfach erklärt",
  description:
    "Hausnotruf verständlich erklärt: Für wen er sinnvoll ist, welche Kosten die Pflegekasse übernimmt und worauf Sie bei der Auswahl achten sollten.",
};

export default function HausnotrufRatgeberPage() {
  return (
    <article className="py-14 sm:py-20">
      <Container className="max-w-4xl">
        <header className="rounded-2xl border border-[#efcba7]/45 bg-gradient-to-br from-[#fffaf4] via-white to-[#f7fbfc] p-5 sm:p-7">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-[#0F4F68]">Ratgeber-Beitrag</p>
              <h1 className="mt-2 text-3xl font-bold leading-tight text-[#0F4F68] sm:text-4xl">
                Hausnotruf-Ratgeber: Sicherheit zu Hause einfach erklärt
              </h1>
              <p className="mt-4 text-base leading-relaxed text-neutral-700 sm:text-lg">
                Ein Hausnotruf gibt Sicherheit im Alltag - für pflegebedürftige Menschen und für Angehörige. In diesem
                Ratgeber erfahren Sie, wann ein Hausnotruf sinnvoll ist, was die Pflegekasse übernimmt und worauf Sie
                bei Auswahl und Einrichtung achten sollten.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center rounded-lg bg-[#0F4F68] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                >
                  Jetzt beraten lassen
                </Link>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[260px]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <Image
                  src="/images/Ratgeber/ratgeber.webp"
                  alt="Ratgeber-Vorschaubild Hausnotruf"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-[1.02]"
                  sizes="260px"
                  priority
                />
              </div>
            </div>
          </div>
        </header>

        <section className="mt-10 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Was ist ein Hausnotruf?</h2>
          <p>
            Der Hausnotruf ist ein Notrufsystem, das per Knopfdruck schnelle Hilfe organisiert. Üblicherweise trägt
            die betroffene Person einen Notrufsender am Handgelenk oder als Kette. Im Notfall wird sofort eine
            Notrufzentrale informiert, die Angehörige, Pflegedienst oder Rettungsdienst kontaktiert.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Für wen ist ein Hausnotruf besonders sinnvoll?</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              "Menschen mit Sturzrisiko oder Gangunsicherheit",
              "Alleinlebende mit Pflegegrad",
              "Personen mit chronischen Erkrankungen",
              "Seniorinnen und Senioren mit erhöhtem Sicherheitsbedürfnis",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-[#0F4F68]/12 bg-white/95 p-4 shadow-sm">
                <p className="text-sm font-semibold text-[#0F4F68]">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Kosten und Zuschuss der Pflegekasse</h2>
          <div className="rounded-2xl border border-[#0F4F68]/12 bg-[#F2F9FA]/35 p-5">
            <p>
              Bei anerkanntem Pflegegrad kann die Pflegekasse den Hausnotruf im Regelfall mit einem monatlichen
              Zuschuss unterstützen (typisch bis zu 25,50 Euro). Voraussetzung ist, dass ein anerkannter Anbieter
              genutzt wird und die Versorgung zu Hause erfolgt.
            </p>
            <p className="mt-3">
              Wichtig: Zusatzleistungen wie Schlüsseltresor, mobile Ortung oder erweitertes Servicepaket können
              zusätzliche Kosten verursachen. Lassen Sie sich vor Vertragsabschluss die Preisstruktur klar auflisten.
            </p>
          </div>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Checkliste: So wählen Sie den passenden Hausnotruf</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              "24/7 besetzte Notrufzentrale",
              "Einfache Bedienung und gut tragbarer Sender",
              "Klare Regelung für Schlüsselhinterlegung",
              "Kurze Reaktionszeiten im Notfall",
              "Transparente Monatskosten ohne versteckte Gebühren",
              "Testphase oder kürzere Kündigungsfrist",
            ].map((item) => (
              <div key={item} className="rounded-xl border border-[#0F4F68]/12 bg-white/95 p-4 shadow-sm">
                <p className="text-sm font-semibold text-[#0F4F68]">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-xl border border-[#0F4F68]/12 bg-[#f8fcfd] p-5">
          <h2 className="text-xl font-bold text-[#0F4F68]">Fazit</h2>
          <p className="mt-2 text-neutral-700">
            Ein Hausnotruf ist eine praktische Sicherheitslösung für den Alltag und kann Familien deutlich entlasten.
            Wer frühzeitig das passende System wählt, verbessert die Versorgungssicherheit zu Hause nachhaltig.
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

        <VerwandteRatgeberBeitraege currentSlug="hausnotruf-ratgeber" />
      </Container>
    </article>
  );
}
