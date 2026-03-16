import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Über uns",
  description: `Erfahren Sie mehr über ${siteConfig.name} – unsere Werte, unser Team und unsere Arbeitsweise.`,
};

export default function UeberUnsPage() {
  return (
    <article className="py-16 sm:py-24">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Über uns
        </h1>
        <div className="mt-8 max-w-3xl space-y-4 text-neutral-600">
          <p>
            Wir sind ein Team von Experten mit dem Anspruch, unsere Kunden
            zielgerichtet und auf Augenhöhe zu unterstützen. Qualität,
            Zuverlässigkeit und partnerschaftliche Zusammenarbeit stehen bei uns
            im Mittelpunkt.
          </p>
          <p>
            Unser Ziel ist es, maßgeschneiderte Lösungen zu entwickeln, die
            nachhaltig wirken und Ihren Anforderungen gerecht werden.
          </p>
        </div>
      </Container>
    </article>
  );
}
