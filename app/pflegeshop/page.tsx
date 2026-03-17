import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Pflegeshop",
  description: `Pflegeshop – ${siteConfig.name}.`,
};

const PLEGEBEDARF_URL = "https://deinPflegebedarf.de";

export default function PflegeshopPage() {
  return (
    <article className="py-16 sm:py-24">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl">
          Pflegeshop
        </h1>
        <p className="mt-6 max-w-2xl text-neutral-600">
          Unser Pflegeshop wird in Kooperation mit deinPflegebedarf.de betrieben. Dort finden Sie ein breites Sortiment an Pflegehilfsmitteln und Produkten für den Pflegealltag.
        </p>
        <a
          href={PLEGEBEDARF_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F4F68] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
        >
          Zum Pflegeshop auf deinPflegebedarf.de
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </Container>
    </article>
  );
}
