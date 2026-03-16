import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Nachricht gesendet",
  description: `Ihre Nachricht wurde gesendet – ${siteConfig.name}.`,
};

export default function KontaktDankePage() {
  return (
    <article className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Vielen Dank
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            Ihre Nachricht wurde gesendet. Wir melden uns in Kürze bei Ihnen.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-neutral-900 px-6 py-3 font-medium text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
          >
            Zur Startseite
          </Link>
        </div>
      </Container>
    </article>
  );
}
