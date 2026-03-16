import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Kooperation",
  description: `Kooperation und Partnerschaft – ${siteConfig.name}.`,
};

export default function KooperationPage() {
  return (
    <article className="py-16 sm:py-24">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl">
          Kooperation
        </h1>
        <p className="mt-6 max-w-2xl text-neutral-600">
          Informationen zu Kooperationen und Partnerschaften folgen in Kürze.
        </p>
      </Container>
    </article>
  );
}
