import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Pflegeberatung",
  description: `Pflegeberatung – ${siteConfig.name}.`,
};

export default function PflegeberatungPage() {
  return (
    <article className="py-16 sm:py-24">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Pflegeberatung
        </h1>
        <p className="mt-4 max-w-2xl text-neutral-600">
          Wir unterstützen Sie in allen Fragen rund um Pflege – privat und betrieblich.
        </p>

        <div className="mt-16 space-y-16">
          <section id="private-pflegeberatung" aria-labelledby="private-heading">
            <h2
              id="private-heading"
              className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl"
            >
              Private Pflegeberatung
            </h2>
            <p className="mt-4 max-w-3xl text-neutral-600">
              In der privaten Pflegeberatung beraten wir Sie und Ihre Angehörigen zu allen Themen der Pflege: von der Antragstellung über Leistungen der Pflegekasse bis zur Organisation der Pflege zu Hause oder in einer Einrichtung. Wir nehmen uns Zeit für Ihre individuelle Situation.
            </p>
          </section>

          <section id="betriebliche-pflegeberatung" aria-labelledby="betrieblich-heading">
            <h2
              id="betrieblich-heading"
              className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl"
            >
              Betriebliche Pflegeberatung
            </h2>
            <p className="mt-4 max-w-3xl text-neutral-600">
              Als betriebliche Pflegeberatung unterstützen wir Arbeitgeber und Beschäftigte: bei der Vereinbarkeit von Beruf und Pflege, bei der Information über Rechte und Leistungen sowie bei der Suche nach passenden Ansprechpartnern. So bleiben Ihre Mitarbeiterinnen und Mitarbeiter handlungsfähig, wenn Angehörige pflegebedürftig werden.
            </p>
          </section>
        </div>
      </Container>
    </article>
  );
}
