import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Über uns",
  description: `Alltagshilfe Süd: Hauswirtschaftsdienst, Betreuungsdienst und Pflegeberatung mit regionaler Stärke im Allgäu, Bodenseeraum, Augsburg und Engen/Konstanz.`,
};

export default function UeberUnsPage() {
  const meilensteine = [
    { titel: "2020", text: "Erste Idee und Zertifizierung als Grundlage für den Aufbau.", icon: "start" },
    { titel: "01.04.2021", text: "Offizielle Gründung durch Philip Sonntag und Valentin Maucher.", icon: "gruendung" },
    { titel: "01.04.2022", text: "Eröffnung des Standorts Wangen für die Bodenseeregion.", icon: "standort" },
    { titel: "01.10.2023", text: "Start der kostenfreien Pflegeboxen aus eigenem Lager im Allgäu.", icon: "box" },
    { titel: "03.06.2024", text: "Anerkennung als Pflegeberatungsstelle mit eigenen Beraterinnen und Beratern.", icon: "beratung" },
    { titel: "2025", text: "Namensänderung von Alltagshilfe-Allgäu zu Alltagshilfe-Süd.", icon: "rename" },
    { titel: "01.12.2025", text: "Aufbau der betrieblichen Pflegeberatung für Unternehmen.", icon: "business" },
    { titel: "Anfang 2026", text: "Umzug in größere Räumlichkeiten nach Bad Grönenbach.", icon: "move" },
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

        <section className="relative mt-10 max-w-5xl overflow-hidden rounded-3xl border border-[#0F4F68]/10 bg-[#F2F9FA] p-6 sm:p-8" aria-label="Unternehmensgeschichte Alltagshilfe Süd">
          <svg
            className="pointer-events-none absolute left-0 top-0 h-10 w-full -translate-y-[70%] sm:h-14"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden
          >
            <path d="M0,120 C240,36 430,12 600,25 C820,42 1015,94 1200,120 L1200,120 L0,120 Z" fill="#F2F9FA" />
          </svg>
          <div className="space-y-5 text-neutral-700">
          <p>
            Die Alltagshilfe Süd ist ein professioneller Hauswirtschaftsdienst und Betreuungsdienst, der 2021 aus
            fast einem Jahrzehnt praktischer Erfahrung in der Pflege entstanden ist. Unser Ziel ist klar: Menschen
            mit Unterstützungsbedarf ein sicheres, selbstbestimmtes und möglichst unabhängiges Leben im gewohnten
            Zuhause zu ermöglichen.
          </p>
          <p>
            Die erste Idee und Zertifizierung erfolgte bereits 2020. Am 01.04.2021 wurde die Alltagshilfe Süd
            offiziell von Philip Sonntag und Valentin Maucher gegründet - beide Gesundheits- und Krankenpfleger mit dem
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
            Pflegeberatern an allen Standorten. 2025 erfolgte außerdem die Namensänderung von Alltagshilfe-Allgäu zu
            Alltagshilfe-Süd. Mit der betrieblichen Pflegeberatung unterstützen wir seit 01.12.2025
            zusätzlich Unternehmen dabei, Beruf und Pflege besser zu vereinbaren.
          </p>
          <p>
            Auch in Zukunft bleiben wir in Bewegung: Mit der Inkontinenzversorgung und weiteren regionalen Projekten
            entwickeln wir unsere Angebote stetig weiter. Dabei bleibt unser Anspruch unverändert: verlässlich,
            menschlich und hochprofessionell im Pflegealltag für Familien in Süddeutschland.
          </p>
          </div>
        </section>

        <section className="relative mt-10 overflow-hidden rounded-3xl border border-[#0F4F68]/12 bg-white p-6 sm:p-7" aria-label="Meilensteine">
          <svg
            className="pointer-events-none absolute left-0 top-0 h-10 w-full -translate-y-[60%] sm:h-14"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden
          >
            <path d="M0,120 C230,34 430,12 620,24 C830,38 1015,88 1200,120 L1200,120 L0,120 Z" fill="#F2F9FA" />
          </svg>
          <h2 className="text-2xl font-bold text-[#0F4F68]">Unsere Meilensteine</h2>
          <ul className="mt-5 space-y-4">
            {meilensteine.map((punkt, idx) => (
              <li key={`${punkt.titel}-${punkt.text}`} className="relative flex items-start gap-4 text-neutral-700">
                {idx < meilensteine.length - 1 && (
                  <span className="absolute left-[19px] top-11 h-10 w-[3px] rounded-full bg-[#F78F2E]/70" aria-hidden />
                )}
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F78F2E]/15 text-[#0F4F68] ring-1 ring-[#F78F2E]/40">
                  {punkt.icon === "start" && <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>}
                  {punkt.icon === "gruendung" && <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 10l8-6 8 6v10H4z" /></svg>}
                  {punkt.icon === "standort" && <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s6-6.7 6-11a6 6 0 1 0-12 0c0 4.3 6 11 6 11z" /></svg>}
                  {punkt.icon === "box" && <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7" /></svg>}
                  {punkt.icon === "beratung" && <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 5h16v10H7l-3 3V5z" /></svg>}
                  {punkt.icon === "rename" && <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h9M4 12h6M4 17h7M14 12h6M17 9l3 3-3 3" /></svg>}
                  {punkt.icon === "business" && <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18v13H3zM9 7V4h6v3" /></svg>}
                  {punkt.icon === "move" && <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M16 5l5 7-5 7M8 5l-5 7 5 7" /></svg>}
                </span>
                <span className="pt-0.5">
                  <strong className="text-[#0F4F68]">{punkt.titel}:</strong> {punkt.text}
                </span>
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
