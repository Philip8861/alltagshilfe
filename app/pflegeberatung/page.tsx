import type { Metadata } from "next";
import Link from "next/link";
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
            <div className="mt-6 rounded-xl border border-[#0F4F68]/15 bg-[#F2F9FA]/45 p-4">
              <p className="text-sm font-semibold text-[#0F4F68]">Neu: Online Videoberatung</p>
              <p className="mt-1 text-sm text-neutral-700">
                Beratungsgespräch per sicherem Videocall mit Einladungslink und persönlichem Gesprächscode.
              </p>
              <Link
                href="/pflegeberatung/online-videoberatung"
                className="mt-3 inline-flex min-h-[42px] items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c3d52]"
              >
                Online Videoberatung starten
              </Link>
            </div>
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
