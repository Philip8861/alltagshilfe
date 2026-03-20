import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Ratgeber",
  description: `Ratgeber zur Pflege – ${siteConfig.name}.`,
};

export default function RatgeberPage() {
  return (
    <article className="py-16 sm:py-24">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl">
          Ratgeber
        </h1>
        <p className="mt-4 max-w-3xl text-neutral-600">
          Praxistipps, Erklaerungen und konkrete Hilfen rund um Pflege, Betreuung und Entlastung im Alltag.
        </p>

        <section className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <article className="rounded-2xl border border-[#0F4F68]/12 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0F4F68]/80">Blog-Beitrag</p>
            <h2 className="mt-2 text-xl font-bold text-[#0F4F68]">
              Entlastungsbetrag 131 Euro: so nutzen Sie Ihren Anspruch richtig
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700">
              Wer Anspruch hat, welche Leistungen bezahlt werden, wie lange ungenutzte Betraege gueltig sind und wie die
              Abrechnung mit der Pflegekasse funktioniert.
            </p>
            <Link
              href="/ratgeber/entlastungsbetrag-131-euro"
              className="mt-4 inline-flex items-center rounded-lg bg-[#0F4F68] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
            >
              Beitrag lesen
            </Link>
          </article>
        </section>
      </Container>
    </article>
  );
}
