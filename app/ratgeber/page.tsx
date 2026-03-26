import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { RatgeberVerzeichnis } from "@/components/ratgeber/RatgeberVerzeichnis";
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
          Praxistipps, Erklärungen und konkrete Hilfen rund um Pflege, Betreuung und Entlastung im Alltag.
        </p>
        <RatgeberVerzeichnis />
      </Container>
    </article>
  );
}
