import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Entlastungsbetrag 131 Euro richtig nutzen",
  description:
    "Ratgeber: Wer Anspruch auf den Entlastungsbetrag hat, wofuer er genutzt werden kann und wie die Abrechnung mit der Pflegekasse funktioniert.",
};

const FAQS = [
  {
    q: "Wer hat Anspruch auf den Entlastungsbetrag?",
    a: "Alle Pflegebeduerftigen mit Pflegegrad 1 bis 5 in haeuslicher Versorgung.",
  },
  {
    q: "Muss ich den Betrag gesondert beantragen?",
    a: "Nein. Der Anspruch entsteht automatisch mit einem anerkannten Pflegegrad.",
  },
  {
    q: "Kann ich den Betrag bar ausgezahlt bekommen?",
    a: "Nein. Der Betrag ist zweckgebunden und wird ueber anerkannte Leistungen abgerechnet.",
  },
  {
    q: "Verfaellt nicht genutztes Budget?",
    a: "Ja. Nicht genutzte Betraege aus dem Vorjahr verfallen zum 30.06. des Folgejahres.",
  },
] as const;

export default function EntlastungsbetragRatgeberPage() {
  return (
    <article className="py-14 sm:py-20">
      <Container className="max-w-5xl">
        <header className="rounded-3xl border border-[#0F4F68]/12 bg-gradient-to-br from-white via-[#f8fcfd] to-[#eef7f9] p-6 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0F4F68]/80">Ratgeber Pflege</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-[#0F4F68] sm:text-4xl">
            Entlastungsbetrag 131 Euro sinnvoll nutzen
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-neutral-700 sm:text-lg">
            Pflegebeduerftige mit Pflegegrad koennen monatlich bis zu 131 Euro Entlastungsbetrag nutzen. In diesem
            Beitrag sehen Sie kompakt, wer anspruchsberechtigt ist, welche Leistungen moeglich sind und wie die
            Abrechnung sauber klappt.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-xl border border-[#0F4F68]/12 bg-white/90 p-3">
              <p className="font-semibold text-[#0F4F68]">Monatlich</p>
              <p className="mt-1 text-neutral-700">bis zu 131 Euro</p>
            </div>
            <div className="rounded-xl border border-[#0F4F68]/12 bg-white/90 p-3">
              <p className="font-semibold text-[#0F4F68]">Jaehrlich</p>
              <p className="mt-1 text-neutral-700">bis zu 1.572 Euro</p>
            </div>
            <div className="rounded-xl border border-[#0F4F68]/12 bg-white/90 p-3">
              <p className="font-semibold text-[#0F4F68]">Frist</p>
              <p className="mt-1 text-neutral-700">Nutzung bis 30.06. Folgejahr</p>
            </div>
          </div>
        </header>

        <section className="mt-10 rounded-2xl border border-[#0F4F68]/10 bg-white p-5 sm:p-7">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Voraussetzungen auf einen Blick</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm sm:text-base">
              <thead>
                <tr className="border-b border-[#0F4F68]/15 text-[#0F4F68]">
                  <th className="px-3 py-3 font-semibold">Punkt</th>
                  <th className="px-3 py-3 font-semibold">Was bedeutet das konkret?</th>
                </tr>
              </thead>
              <tbody className="text-neutral-700">
                <tr className="border-b border-neutral-200">
                  <td className="px-3 py-3 font-medium">Pflegegrad</td>
                  <td className="px-3 py-3">Ein anerkannter Pflegegrad 1 bis 5 liegt vor.</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="px-3 py-3 font-medium">Haeusliche Versorgung</td>
                  <td className="px-3 py-3">Die pflegebeduerftige Person lebt zuhause oder bei Angehoerigen.</td>
                </tr>
                <tr>
                  <td className="px-3 py-3 font-medium">Anerkannter Anbieter</td>
                  <td className="px-3 py-3">Die Leistung wird von einem zugelassenen Dienst erbracht.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-[#0F4F68]/10 bg-white p-5 sm:p-7">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Wofuer kann der Betrag eingesetzt werden?</h2>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              "Haushaltshilfe und Wohnungsreinigung",
              "Alltagsbegleitung und Betreuung",
              "Begleitung zu Arzt- und Behoerdenterminen",
              "Einkaufshilfe und Unterstuetzung im Alltag",
              "Tages- und Nachtpflege",
              "Kurzzeitpflege (anteilig moeglich)",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-xl border border-[#0F4F68]/10 bg-[#f8fcfd] p-3">
                <span
                  className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0F4F68] text-white"
                  aria-hidden
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                  </svg>
                </span>
                <p className="text-sm text-neutral-700 sm:text-base">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-[#0F4F68]/10 bg-white p-5 sm:p-7">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Beispiel: Budget uebers Jahr</h2>
          <p className="mt-3 text-neutral-700">
            Der Entlastungsbetrag kann angespart werden. Nicht genutzte Betraege aus einem Jahr muessen spaetestens bis
            zum 30.06. des Folgejahres eingesetzt werden.
          </p>
          <div className="mt-5 rounded-xl border border-[#0F4F68]/12 bg-[#f2f9fa] p-4">
            <div className="flex items-center justify-between text-sm text-[#0F4F68]">
              <span>Monatliche Ansparung</span>
              <span className="font-semibold">131 Euro</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white">
              <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-[#0F4F68] via-[#1a6e8e] to-[#3a97b8]" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-neutral-700 sm:grid-cols-4">
              <div className="rounded-lg bg-white p-2 text-center">3 Monate: 393 Euro</div>
              <div className="rounded-lg bg-white p-2 text-center">6 Monate: 786 Euro</div>
              <div className="rounded-lg bg-white p-2 text-center">9 Monate: 1.179 Euro</div>
              <div className="rounded-lg bg-white p-2 text-center">12 Monate: 1.572 Euro</div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-[#0F4F68]/10 bg-white p-5 sm:p-7">
          <h2 className="text-2xl font-bold text-[#0F4F68]">So funktioniert die Abrechnung</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm sm:text-base">
              <thead>
                <tr className="border-b border-[#0F4F68]/15 text-[#0F4F68]">
                  <th className="px-3 py-3 font-semibold">Schritt</th>
                  <th className="px-3 py-3 font-semibold">Vorgehen</th>
                </tr>
              </thead>
              <tbody className="text-neutral-700">
                <tr className="border-b border-neutral-200">
                  <td className="px-3 py-3 font-medium">1. Leistung waehlen</td>
                  <td className="px-3 py-3">Anerkannten Anbieter fuer passende Entlastungsleistung beauftragen.</td>
                </tr>
                <tr className="border-b border-neutral-200">
                  <td className="px-3 py-3 font-medium">2. Rechnung erhalten</td>
                  <td className="px-3 py-3">Nachweis mit Leistungsdatum und Betrag aufbewahren.</td>
                </tr>
                <tr>
                  <td className="px-3 py-3 font-medium">3. Einreichen</td>
                  <td className="px-3 py-3">Rechnung bei der Pflegekasse einreichen oder direktabrechnen lassen.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-[#0F4F68]/10 bg-white p-5 sm:p-7">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Haeufige Fragen</h2>
          <div className="mt-4 space-y-3">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-[#0F4F68]/12 bg-[#f8fcfd] p-4">
                <summary className="cursor-pointer list-none pr-6 font-semibold text-[#0F4F68]">{faq.q}</summary>
                <p className="mt-2 text-sm text-neutral-700 sm:text-base">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-[#0F4F68]/12 bg-gradient-to-r from-[#0F4F68] to-[#13617e] p-5 text-white sm:p-7">
          <h2 className="text-2xl font-bold">Unterstuetzung bei der Nutzung gewuenscht?</h2>
          <p className="mt-2 max-w-3xl text-white/90">
            Wir helfen Ihnen gern dabei, passende Entlastungsleistungen in Ihrer Region zu finden und den Anspruch
            unkompliziert zu nutzen.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/kontakt"
              className="inline-flex items-center rounded-lg bg-white px-4 py-2 font-semibold text-[#0F4F68] transition-colors hover:bg-[#e8f4f7] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0F4F68]"
            >
              Jetzt Kontakt aufnehmen
            </Link>
            <Link
              href="/standorte"
              className="inline-flex items-center rounded-lg border border-white/40 px-4 py-2 font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0F4F68]"
            >
              Standorte ansehen
            </Link>
          </div>
        </section>
      </Container>
    </article>
  );
}

