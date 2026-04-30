import type { Metadata } from "next";

import { RatgeberPlatzhalterArticleView } from "@/components/ratgeber/platzhalter/RatgeberPlatzhalterArticleView";
import { siteConfig } from "@/config/site";
import { serializeRatgeberArticleJsonSchemas } from "@/lib/ratgeber/article-jsonld";

const SLUG = "platzhalter-layout-a" as const;
const PATH = `/ratgeber/${SLUG}` as const;

const PLATZHALTER_FAQ = [
  {
    question: "Ist dieser Ratgeber-Beitrag echt?",
    answer:
      "Nein. Diese Seite ist nur ein interner Platzhalter zum Testen des Ratgeber-Rasters (z. B. vier Karten nebeneinander). Inhalte sind bewusst reduziert.",
  },
];

export const metadata: Metadata = {
  title: `Platzhalter Ratgeber A (Layout) | ${siteConfig.name}`,
  description: "Interner Platzhalter für Layout-Tests in der Ratgeber-Übersicht – kein inhaltlicher Ratgeber.",
  robots: { index: false, follow: true },
  alternates: { canonical: PATH },
};

export default function PlatzhalterLayoutAPage() {
  const { articleLd, faqLd, breadcrumbLd } = serializeRatgeberArticleJsonSchemas({
    headline: "Demo-Ratgeber Platzhalter A (Layout)",
    description:
      "Interner Platzhalter zum Prüfen von vier Karten nebeneinander in der Ratgeber-Übersicht. Kein medizinischer oder rechtlicher Rat.",
    articlePath: PATH,
    datePublishedISO: "2026-04-30T12:00:00+02:00",
    dateModifiedISO: "2026-04-30T12:00:00+02:00",
    imageUrl: "/images/Ratgeber/ratgeber.webp",
    breadcrumbs: [
      { name: "Startseite", path: "/" },
      { name: "Ratgeber", path: "/ratgeber" },
      { name: "Platzhalter A", path: PATH },
    ],
    faq: PLATZHALTER_FAQ,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <article className="min-w-0 bg-white pb-16 pt-0 sm:pb-24">
        <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6 lg:px-8">
          <RatgeberPlatzhalterArticleView
            slug={SLUG}
            title="Demo-Ratgeber Platzhalter A (Layout-Test)"
            breadcrumbLabel="Platzhalter A"
            body="Diese Seite dient nur der Vorschau mit vier Artikelkarten in einer Reihe. Vor der Live-Schaltung bitte löschen oder durch echte Inhalte ersetzen."
          />
        </div>
      </article>
    </>
  );
}
