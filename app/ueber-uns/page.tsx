import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Über uns",
  description: `Alltagshilfe Süd: Hauswirtschaftsdienst, Betreuungsdienst und Pflegeberatung mit regionaler Stärke im Allgäu, Bodenseeraum, Augsburg und Engen/Konstanz.`,
};

export default function UeberUnsPage() {
  const staerken = [
    {
      title: "Menschlich & nah",
      text: "Wir begleiten Familien auf Augenhöhe - empathisch, verlässlich und mit festen Ansprechpartnern.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />
        </svg>
      ),
    },
    {
      title: "Pflegekompetenz",
      text: "Gegründet von examinierten Krankenpflegern mit langjähriger Praxiserfahrung in der Versorgung.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M12 3v18M3 12h18" />
          <path d="M5 5h14v14H5z" />
        </svg>
      ),
    },
    {
      title: "Regional stark",
      text: "Allgäu, Bodenseeregion, Augsburg und Engen/Konstanz - kurze Wege, schnelle Hilfe, echte Nähe.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M12 21s6-6.7 6-11a6 6 0 1 0-12 0c0 4.3 6 11 6 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      ),
    },
  ] as const;

  const meilensteine = [
    "2020: Erste Idee und Zertifizierung als Grundlage für den Aufbau.",
    "01.04.2021: Offizielle Gründung durch Philip Sonntag und Valentin Maucher.",
    "01.04.2022: Eröffnung des Standorts Wangen für die Bodenseeregion.",
    "01.10.2023: Start der kostenfreien Pflegeboxen aus eigenem Lager im Allgäu.",
    "03.06.2024: Anerkennung als Pflegeberatungsstelle mit eigenen Beraterinnen und Beratern.",
    "01.12.2025: Aufbau der betrieblichen Pflegeberatung für Unternehmen.",
    "Anfang 2026: Umzug in größere Räumlichkeiten nach Bad Grönenbach.",
  ] as const;

  return (
    <article className="py-16 sm:py-24">
      <Container>
        <header className="max-w-5xl">
          <p className="inline-flex rounded-full bg-[#0F4F68]/8 px-4 py-1 text-sm font-semibold text-[#0F4F68]">
            Alltagshilfe Süd
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Über uns
          </h1>
          <p className="mt-4 max-w-4xl text-lg leading-relaxed text-neutral-700">
            Als Hauswirtschaftsdienst, Betreuungsdienst und Pflegeberatung begleiten wir Menschen im Alltag mit dem
            Ziel, Selbstbestimmung, Sicherheit und Lebensqualität im gewohnten Zuhause zu erhalten.
          </p>
        </header>

        <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3" aria-label="Unsere Stärken">
          {staerken.map((item) => (
            <article key={item.title} className="rounded-2xl border border-[#0F4F68]/12 bg-white p-5 shadow-sm">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#F78F2E]/15 text-[#0F4F68]">
                {item.icon}
              </span>
              <h2 className="mt-3 text-lg font-bold text-[#0F4F68]">{item.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-neutral-700">{item.text}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 max-w-4xl space-y-5 text-neutral-700" aria-label="Unternehmensgeschichte Alltagshilfe Süd">
          <p>
            Die Alltagshilfe Süd ist ein professioneller Hauswirtschaftsdienst und Betreuungsdienst, der 2021 aus
            fast einem Jahrzehnt praktischer Erfahrung in der Pflege entstanden ist. Unser Ziel ist klar: Menschen
            mit Unterstützungsbedarf ein sicheres, selbstbestimmtes und möglichst unabhängiges Leben im gewohnten
            Zuhause zu ermöglichen.
          </p>
          <p>
            Die erste Idee und Zertifizierung erfolgte bereits 2020. Am 01.04.2021 wurde die Alltagshilfe Süd
            offiziell von Philip Sonntag und Valentin Maucher gegründet - beide gelernte Krankenpfleger mit dem
            Anspruch, den Pflegealltag von Familien spürbar zu entlasten. In den Anfangsjahren waren die Gründer
            täglich selbst im Einsatz und konnten so die Bedürfnisse in der Region sehr genau kennenlernen.
          </p>
          <p>
            Mit der steigenden Nachfrage wuchs unser Unternehmen kontinuierlich weiter: 2022 kam der Standort Wangen
            für die Bodenseeregion hinzu, 2024 folgte der Umzug nach Sulzberg und Anfang 2026 der nächste Schritt in
            größere Räumlichkeiten nach Bad Grönenbach. Heute verbinden wir lokale Nähe mit professionellen Prozessen
            und persönlicher Betreuung.
          </p>
          <p>
            Unser Leistungsportfolio wurde gezielt erweitert: Seit 01.10.2023 bieten wir kostenfreie Pflegeboxen an,
            seit 03.06.2024 sind wir offiziell anerkannte Pflegeberatungsstelle mit eigenen Pflegeberaterinnen und
            Pflegeberatern an allen Standorten. Mit der betrieblichen Pflegeberatung unterstützen wir seit 01.12.2025
            zusätzlich Unternehmen dabei, Beruf und Pflege besser zu vereinbaren.
          </p>
          <p>
            Auch in Zukunft bleiben wir in Bewegung: Mit der Inkontinenzversorgung und weiteren regionalen Projekten
            entwickeln wir unsere Angebote stetig weiter. Dabei bleibt unser Anspruch unverändert: verlässlich,
            menschlich und hochprofessionell im Pflegealltag für Familien in Süddeutschland.
          </p>
        </section>

        <section className="mt-10 rounded-2xl border border-[#0F4F68]/12 bg-[#F2F9FA] p-6 sm:p-7" aria-label="Meilensteine">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Unsere Meilensteine</h2>
          <ul className="mt-4 space-y-2.5">
            {meilensteine.map((punkt) => (
              <li key={punkt} className="flex items-start gap-3 text-neutral-700">
                <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F78F2E] text-white">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span>{punkt}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3" aria-label="Einblicke in die Alltagshilfe Süd">
          <figure className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_25px_rgba(15,79,104,0.18)]">
            <Image
              src="/images/startseite_front.webp"
              alt="Platzhalterbild: Alltagshilfe Süd im Einsatz"
              width={1200}
              height={900}
              className="h-52 w-full object-cover"
              unoptimized
            />
          </figure>
          <figure className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_25px_rgba(15,79,104,0.18)]">
            <Image
              src="/images/standort_gemeinsam.webp"
              alt="Platzhalterbild: Team und Betreuung vor Ort"
              width={1200}
              height={900}
              className="h-52 w-full object-cover"
            />
          </figure>
          <figure className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_25px_rgba(15,79,104,0.18)]">
            <Image
              src="/images/Kontakt_Bild.webp"
              alt="Platzhalterbild: Persönliche Beratung und Kontakt"
              width={1200}
              height={900}
              className="h-52 w-full object-cover"
              unoptimized
            />
          </figure>
        </section>
      </Container>
    </article>
  );
}
