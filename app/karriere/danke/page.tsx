import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Bewerbung gesendet",
  description: `Ihre Bewerbung wurde gesendet – ${siteConfig.name}.`,
};

export default function KarriereDankePage() {
  return (
    <article className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl">
            Vielen Dank
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            Ihre Bewerbung wurde gesendet. Wir melden uns in Kürze bei Ihnen.
          </p>
          <Link
            href="/karriere"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#0F4F68] px-6 py-3 font-medium text-white hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
          >
            Zurück zur Karriere
          </Link>
        </div>
      </Container>
    </article>
  );
}
