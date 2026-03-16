import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Neuigkeiten",
  description: `Aktuelles und Neuigkeiten – ${siteConfig.name}.`,
};

export default function NeuigkeitenPage() {
  return (
    <article className="py-16 sm:py-24">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl">
          Neuigkeiten
        </h1>
        <p className="mt-6 max-w-2xl text-neutral-600">
          Aktuelle Meldungen und Neuigkeiten folgen in Kürze.
        </p>
      </Container>
    </article>
  );
}
