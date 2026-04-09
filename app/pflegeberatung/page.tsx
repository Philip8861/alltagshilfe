import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Pflegeberatung",
  description: `Pflegeberatung – privat und betrieblich – ${siteConfig.name}.`,
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
              Beratung nach Paragraf 37 Absatz 3 SGB XI: wir entlasten Angehörige, sichern Fristen und Pflegegeld – kostenlos
              über Ihre Pflegekasse, mit fester Ansprechperson und Erinnerungssystem.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/pflegeberatung/private-pflegeberatung"
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
              >
                Zur privaten Pflegeberatung
              </Link>
              <Link
                href="/pflegeberatung/online-videoberatung"
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl border-2 border-[#0F4F68]/25 px-4 py-2 text-sm font-semibold text-[#0F4F68] hover:bg-[#F2F9FA] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
              >
                Online-Videoberatung
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
