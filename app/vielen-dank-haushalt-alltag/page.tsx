import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { FbLandingHaushaltAlltagsDankeGtmEvent } from "@/components/analytics/FbLandingHaushaltAlltagsDankeGtmEvent";
import { siteConfig } from "@/config/site";

const PATH = "/vielen-dank-haushalt-alltag" as const;

export const metadata: Metadata = {
  title: "Anfrage eingegangen",
  description: `Ihre Anfrage zu Haushaltshilfe & Alltagsbegleitung ist bei ${siteConfig.name} eingegangen.`,
  alternates: { canonical: PATH },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function VielenDankHaushaltAlltagPage() {
  return (
    <article className="py-16 sm:py-24">
      <Container>
        <FbLandingHaushaltAlltagsDankeGtmEvent />
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-2xl bg-[#F2F9FA] p-8 sm:p-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0F4F68] sm:text-4xl">
              Vielen Dank! Ihre Anfrage ist bei uns eingegangen.
            </h1>
            <p className="mt-4 text-lg text-neutral-700">Wir melden uns in Kürze bei Ihnen zurück.</p>
          </div>
          <Link
            href="/landing/haushaltshilfe-alltagsbegleitung"
            className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#F78F2E] px-8 py-3 font-bold text-white shadow-md transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2"
          >
            Zurück zur Übersicht
          </Link>
        </div>
      </Container>
    </article>
  );
}
