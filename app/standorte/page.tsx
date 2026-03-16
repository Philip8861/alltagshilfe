import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Standorte",
  description: `Unsere Standorte – ${siteConfig.name}. Augsburg und Umgebung.`,
};

/** Vereinfachte Kontur Augsburg (grober Umriss) + Punkte für anliegende Orte – rein schematisch. */
function AugsburgSkizze() {
  return (
    <figure className="mx-auto w-full max-w-md" aria-hidden>
      <svg
        viewBox="0 0 320 280"
        className="h-auto w-full text-[#0F4F68]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      >
        <title>Skizze Augsburg und Umgebung</title>
        <path
          d="M160 85 c 28 0 52 12 68 32 c 18 22 22 48 18 72 c -4 22 -18 42 -38 55 c -22 14 -50 18 -78 12 c -26 -6 -48 -22 -60 -44 c -14 -24 -16 -52 -8 -78 c 8 -26 26 -48 50 -60 c 22 -10 48 -10 68 0 Z"
          className="fill-[#0F4F68]/08 stroke-[#0F4F68]"
        />
        <circle cx="160" cy="145" r="6" className="fill-[#0F4F68]" aria-hidden />
        <circle cx="115" cy="75" r="4" className="fill-[#F78F2E]" aria-hidden />
        <circle cx="205" cy="70" r="4" className="fill-[#F78F2E]" aria-hidden />
        <circle cx="245" cy="120" r="4" className="fill-[#F78F2E]" aria-hidden />
        <circle cx="250" cy="175" r="4" className="fill-[#F78F2E]" aria-hidden />
        <circle cx="210" cy="225" r="4" className="fill-[#F78F2E]" aria-hidden />
        <circle cx="155" cy="245" r="4" className="fill-[#F78F2E]" aria-hidden />
        <circle cx="95" cy="230" r="4" className="fill-[#F78F2E]" aria-hidden />
        <circle cx="55" cy="175" r="4" className="fill-[#F78F2E]" aria-hidden />
        <circle cx="65" cy="120" r="4" className="fill-[#F78F2E]" aria-hidden />
      </svg>
      <figcaption className="mt-2 text-center text-sm text-neutral-500">
        Schematische Darstellung – Augsburg (blau) und anliegende Orte (orange)
      </figcaption>
    </figure>
  );
}

export default function StandortePage() {
  return (
    <article className="py-16 sm:py-24">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl">
          Standorte
        </h1>
        <p className="mt-4 max-w-2xl text-neutral-600">
          Unsere Standorte im Überblick – aktuell mit einem Teststandort Augsburg.
        </p>

        <section className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="rounded-2xl border border-[#0F4F68]/15 bg-[#F2F9FA]/50 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[#0F4F68]">Augsburg</h2>
            <p className="mt-1 text-neutral-600">Standort Augsburg und Umgebung</p>
            <dl className="mt-6 space-y-2 text-sm">
              <div>
                <dt className="font-semibold text-neutral-700">Anschrift</dt>
                <dd className="text-neutral-600">Musterstraße 1, 86150 Augsburg</dd>
              </div>
              <div>
                <dt className="font-semibold text-neutral-700">Telefon</dt>
                <dd>
                  <a
                    href="tel:+4983349893330"
                    className="text-[#0F4F68] hover:underline"
                  >
                    08334 / 9893330
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-neutral-700">Erreichbarkeit</dt>
                <dd className="text-neutral-600">Mo–Do 08:30–16:00 Uhr, Fr 08:30–12:00 Uhr</dd>
              </div>
            </dl>
            <Link
              href="/kontakt"
              className="mt-6 inline-block rounded-lg bg-[#0F4F68] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
            >
              Kontakt aufnehmen
            </Link>
          </div>

          <div className="rounded-2xl border border-[#0F4F68]/15 bg-white p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-[#0F4F68]">Augsburg und Umgebung</h3>
            <p className="mt-2 text-sm text-neutral-600">
              Grobe Skizze: Augsburg-Umriss und anliegende Orte (Testdarstellung).
            </p>
            <div className="mt-6">
              <AugsburgSkizze />
            </div>
          </div>
        </section>

        <p className="mt-10 text-sm text-neutral-500">
          Dies ist eine Testseite. Weitere Standorte und echte Karten können Sie später ergänzen.
        </p>
      </Container>
    </article>
  );
}
