import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { VerwandteRatgeberBeitraege } from "@/components/ratgeber/VerwandteRatgeberBeitraege";

export const metadata: Metadata = {
  title: "Pflegegrad 2: Leistungen, Voraussetzungen & Pflichten (2026)",
  description:
    "Ratgeber: Pflegegrad 2 verständlich erklärt – Budgets 2026, Voraussetzungen, Pflegegeld/Pflegesachleistungen und Pflicht zum Beratungseinsatz nach §37.3.",
};

export default function Pflegegrad2RatgeberPage() {
  return (
    <article className="py-14 sm:py-20">
      <Container className="max-w-4xl">
        <header className="rounded-2xl border border-[#efcba7]/45 bg-gradient-to-br from-[#fffaf4] via-white to-[#f7fbfc] p-5 sm:p-7">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-[#0F4F68]">Ratgeber-Beitrag</p>
              <h1 className="mt-2 text-3xl font-bold leading-tight text-[#0F4F68] sm:text-4xl">
                Pflegegrad 2: alles, was Sie wissen müssen (2026)
              </h1>
              <p className="mt-4 text-base leading-relaxed text-neutral-700 sm:text-lg">
                Mit Pflegegrad 2 ändert sich die finanzielle Situation spürbar: Es gibt erstmals frei verfügbares
                Pflegegeld, Budgets für Pflegesachleistungen und ein großes Jahresbudget für Ersatzpflege. In diesem
                Leitfaden finden Sie die wichtigsten Zahlen für 2026, die Voraussetzungen sowie die Pflicht zum
                Beratungseinsatz nach §37.3 SGB XI.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center rounded-lg bg-[#0F4F68] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                >
                  Jetzt beraten lassen
                </Link>
                <a
                  href="/images/Ratgeber/Pflegegrad%202_%20alles%20was%20du%20Wissen%20musst.pdf"
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
                  alt="Ratgeber-Vorschaubild Pflegegrad 2"
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
          <h2 className="text-2xl font-bold text-[#0F4F68]">Wann wird Pflegegrad 2 bewilligt?</h2>
          <p>
            Pflegegrad 2 wird bewilligt, wenn der Medizinische Dienst (MD) eine <strong>erhebliche Beeinträchtigung der
            Selbstständigkeit</strong> feststellt. Im Alltag bedeutet das häufig: Einige Dinge funktionieren noch
            eigenständig – aber bei Körperpflege, Anziehen oder im Haushalt ist regelmäßige Unterstützung nötig.
          </p>
          <p>
            Grundlage ist das Neue Begutachtungsassessment. Für Pflegegrad 2 braucht es insgesamt{" "}
            <strong>mindestens 27 bis unter 47,5 Punkte</strong>.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Finanzielle Leistungen bei Pflegegrad 2 (Überblick 2026)</h2>
          <div className="overflow-x-auto rounded-xl border border-[#0F4F68]/12 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-[#0F4F68] text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Leistungsart</th>
                  <th className="px-4 py-3 text-left font-semibold">Anspruch (2026)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#0F4F68]/10">
                {[
                  ["Pflegegeld (häusliche Pflege)", "347 € monatlich"],
                  ["Pflegesachleistungen (ambulanter Dienst)", "796 € monatlich"],
                  ["Tages-/Nachtpflege", "721 € monatlich"],
                  ["Entlastungsbetrag", "131 € monatlich"],
                  ["Jahresbudget Kurzzeit- & Verhinderungspflege", "3.539 € jährlich"],
                  ["Wohnumfeldverbesserung", "bis zu 4.180 € je Maßnahme"],
                  ["Pflegehilfsmittel zum Verbrauch", "bis zu 42 € monatlich"],
                  ["Hausnotruf-Zuschuss", "bis zu 25,50 € monatlich"],
                  ["Zuschuss Pflegeheim", "805 € monatlich"],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <td className="px-4 py-3 text-neutral-700">{label}</td>
                    <td className="px-4 py-3 font-semibold text-[#0F4F68]">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Die größten Vorteile im Detail</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <strong>Wahl zwischen Pflegegeld und Pflegesachleistungen:</strong> 347 € monatlich bei privater Pflege
              oder bis zu 796 € für den ambulanten Pflegedienst.
            </li>
            <li>
              <strong>Jahresbudget 3.539 €:</strong> flexibel einsetzbar für Ersatzpflege, wenn Angehörige ausfallen
              oder Entlastung brauchen.
            </li>
            <li>
              <strong>Rentenpunkte für pflegende Angehörige:</strong> unter Voraussetzungen zahlt die Pflegekasse
              Rentenbeiträge.
            </li>
          </ol>
        </section>

        <section className="mt-8 space-y-4 text-neutral-700">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Wichtige Pflicht: Beratungseinsatz nach §37.3 SGB XI</h2>
          <div className="rounded-2xl border border-[#0F4F68]/12 bg-[#F2F9FA]/35 p-5">
            <p className="text-sm text-neutral-700">
              Wer <strong>Pflegegeld</strong> bezieht, muss regelmäßig einen Beratungseinsatz durch einen Pflegedienst
              oder eine anerkannte Beratungsstelle nachweisen.
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-neutral-700">
              <li>Häufigkeit: 1x pro Halbjahr</li>
              <li>Kosten: vollständig von der Pflegekasse übernommen</li>
              <li>Risiko bei Nichtbeachtung: Kürzung oder Stop des Pflegegelds</li>
            </ul>
            <p className="mt-4 text-sm text-neutral-700">
              Tipp: Planen Sie den nächsten Termin direkt nach dem Einsatz ein – so vermeiden Sie Fristprobleme.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-xl border border-[#0F4F68]/12 bg-[#f8fcfd] p-5">
          <h2 className="text-xl font-bold text-[#0F4F68]">Fazit</h2>
          <p className="mt-2 text-neutral-700">
            Pflegegrad 2 bringt spürbare finanzielle Entlastung – aber auch Pflichten. Wenn Sie Pflegegeld beziehen,
            denken Sie unbedingt an den Beratungseinsatz nach §37.3. Nutzen Sie Ihre Budgets konsequent, um den
            Pflegealltag einfacher und planbarer zu machen.
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

        <VerwandteRatgeberBeitraege currentSlug="pflegegrad-2-alles-was-du-wissen-musst" />
      </Container>
    </article>
  );
}

