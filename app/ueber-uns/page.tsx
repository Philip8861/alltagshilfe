import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Über uns",
  description: `Alltagshilfe Süd: Hauswirtschaftsdienst, Betreuungsdienst und Pflegeberatung mit regionaler Stärke im Allgäu, Bodenseeraum, Augsburg und Engen/Konstanz.`,
};

export default function UeberUnsPage() {
  return (
    <article className="py-16 sm:py-24">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Über uns
        </h1>
        <div className="mt-8 max-w-4xl space-y-5 text-neutral-700">
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
        </div>

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
