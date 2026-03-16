import type { Metadata } from "next";
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
        <p className="mt-6 max-w-2xl text-neutral-600">
          Hilfreiche Tipps und Ratgeber rund um Pflege und Betreuung folgen in Kürze.
        </p>
      </Container>
    </article>
  );
}
