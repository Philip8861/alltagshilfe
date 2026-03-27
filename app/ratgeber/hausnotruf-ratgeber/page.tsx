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
                Ein selbstbestimmtes Leben im eigenen Zuhause ist für viele Menschen zentral. Ein Hausnotruf sorgt für
                schnelle Hilfe bei Stürzen oder akuten Schwächeanfällen und entlastet gleichzeitig Angehörige.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center rounded-lg bg-[#0F4F68] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                >
                  Jetzt beraten lassen
                </Link>
                <a
                  href="/images/Ratgeber/Blog-Autor_%20Hausnotruf-Ratgeber%20Erstellung.pdf"
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
            Ein Hausnotruf ist ein technisches Notrufsystem, das in Notsituationen per Knopfdruck Hilfe organisiert.
            Das System ist bewusst einfach aufgebaut und auch unter Stress intuitiv bedienbar.
          </p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <strong>Basisstation:</strong> zentral in der Wohnung, Stromanschluss, häufig mit integrierter SIM-Karte
              und Akku bei Stromausfall.
            </li>
            <li>
              <strong>Mobiler Sender:</strong> als Armband oder Kette tragbar, mit gut tastbarem Alarmknopf - ideal auch
              beim Duschen oder Baden.
            </li>
          </ol>
          <p>
            Nach dem Auslösen wird sofort eine Sprechverbindung zur 24h-Notrufzentrale aufgebaut. Wenn keine Antwort
            möglich ist, wird direkt Hilfe organisiert.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Kosten und Zuschüsse der Pflegekasse</h2>
          <p>
            Bei anerkanntem Pflegegrad übernimmt die Pflegekasse häufig die Grundversorgung des Hausnotrufs. Der
            monatliche Zuschuss liegt in der Regel bei <strong>25,50 Euro</strong>, einmalig kommen{" "}
            <strong>10,49 Euro</strong> für die Installation hinzu.
          </p>
          <p>Typische Voraussetzungen für die Kostenübernahme:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>anerkannter Pflegegrad (bereits ab Pflegegrad 1),</li>
            <li>alleinlebend oder über weite Tageszeiten ohne sofortige Hilfe,</li>
            <li>eingeschränkte Möglichkeit, im Notfall ein normales Telefon zu bedienen.</li>
          </ul>
          <p>
            Zusatzleistungen wie Schlüsseltresor, mobile Ortung oder erweiterte Servicepakete sind meist privat zu
            zahlen.
          </p>
          <p className="rounded-xl border border-[#0F4F68]/12 bg-[#F2F9FA]/45 p-4">
            <strong>Wichtiger Steuerhinweis:</strong> Laut BFH-Urteil (2023) ist ein klassischer Hausnotruf in der
            eigenen Wohnung in der Regel nicht als haushaltsnahe Dienstleistung steuerlich absetzbar.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Die perfekte Ergänzung: Notfalldose</h2>
          <p>
            Die Notfalldose enthält wichtige medizinische Informationen (Medikamente, Allergien, Vorerkrankungen,
            Notfallkontakte) und liegt in der Kühlschranktür. Aufkleber an Haustür und Kühlschrank zeigen dem
            Rettungsdienst sofort, wo die Daten zu finden sind.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Häufige Fragen (FAQ)</h2>
          <div className="space-y-3">
            <p>
              <strong>Übernimmt die Krankenkasse die Kosten?</strong>
              <br />
              In der Regel nicht. Zuständig ist fast immer die Pflegekasse.
            </p>
            <p>
              <strong>Was passiert bei versehentlichem Knopfdruck?</strong>
              <br />
              Die Zentrale meldet sich über Freisprechen, Sie geben kurz Entwarnung.
            </p>
            <p>
              <strong>Funktioniert der Notruf während eines Telefonats?</strong>
              <br />
              Moderne Systeme priorisieren den Notruf und stellen die Verbindung trotzdem her.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-xl border border-[#0F4F68]/12 bg-[#f8fcfd] p-5">
          <h2 className="text-xl font-bold text-[#0F4F68]">Fazit</h2>
          <p className="mt-2 text-neutral-700">
            Ein Hausnotruf ist weit mehr als Technik: Er erhöht die Sicherheit im Alltag, stärkt Selbstständigkeit und
            entlastet Angehörige. In Kombination mit einer Notfalldose entsteht ein sehr wirksames Sicherheitsnetz für
            zu Hause.
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

        <section className="mt-8 space-y-2 text-sm text-neutral-600">
          <h3 className="text-base font-bold text-[#0F4F68]">Quellen (Auszug)</h3>
          <p>Bundesverband Hausnotruf, Pflegekassen-Informationen, BFH-Urteil VI R 14/21, Pflege.de, Caritas.</p>
        </section>

        <VerwandteRatgeberBeitraege currentSlug="hausnotruf-ratgeber" />
      </Container>
    </article>
  );
}
