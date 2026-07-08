import type { Metadata } from "next";

import { Pflegegrad1Article } from "@/components/ratgeber/pflegegrad-1/Pflegegrad1Article";
import { RatgeberArticleDesktopSidebar } from "@/components/ratgeber/RatgeberArticleDesktopSidebar";
import { Pflegegrad1RatgeberHero } from "@/components/ratgeber/pflegegrad-1/Pflegegrad1RatgeberHero";
import { PFLEGEGRAD1_ARTICLE_TOC_ENTRIES } from "@/components/ratgeber/pflegegrad-1/pflegegrad1-toc-config";
import { pflegegrad1FaqForJsonLd } from "@/components/ratgeber/pflegegrad-1/pflegegrad1-faq-data";
import { VerwandteRatgeberBeitraege } from "@/components/ratgeber/VerwandteRatgeberBeitraege";
import { siteConfig } from "@/config/site";
import { serializeRatgeberArticleJsonSchemas } from "@/lib/ratgeber/article-jsonld";

const ARTICLE_PATH = "/ratgeber/pflegegrad-1" as const;

const META_DESC =
  "Pflegegrad 1 bedeutet erste Einschränkungen im Alltag. Erfahren Sie, welche Leistungen 2026 möglich sind, wie der Antrag läuft und wie Alltagshilfe-Süd unterstützen kann.";

const TOC_LINK =
  "text-[0.9375rem] font-medium text-neutral-700 underline-offset-[3px] decoration-neutral-300 hover:text-[#0F4F68] hover:underline";

const META_TITLE = "Pflegegrad 1: Leistungen, Voraussetzungen & Tipps | Alltagshilfe-Süd";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  keywords: [
    "Pflegegrad 1",
    "Pflegegrad 1 Leistungen",
    "Pflegegrad 1 Geld",
    "Pflegegrad 1 Entlastungsbetrag",
    "Pflegegrad 1 beantragen",
    "Haushaltshilfe Pflegegrad 1",
    "Pflegegrad 1 Voraussetzungen",
    "Pflegegrad 1 Widerspruch",
    "Pflegehilfsmittel Pflegegrad 1",
  ],
  alternates: { canonical: ARTICLE_PATH },
  openGraph: {
    title: META_TITLE,
    description: META_DESC,
    url: ARTICLE_PATH,
    type: "article",
    siteName: siteConfig.name,
    locale: "de_DE",
    publishedTime: "2026-04-30T10:00:00+02:00",
    modifiedTime: "2026-04-30T10:00:00+02:00",
  },
};

export default function Pflegegrad1RatgeberPage() {
  const faqLdItems = pflegegrad1FaqForJsonLd();
  const { articleLd, faqLd, breadcrumbLd } = serializeRatgeberArticleJsonSchemas({
    headline: "Pflegegrad 1: Voraussetzungen, Leistungen und Tipps für Angehörige",
    description:
      "Pflegegrad 1 bedeutet erste Einschränkungen im Alltag. Der Ratgeber erklärt Leistungen, Antrag, Entlastungsbetrag und Unterstützung durch Alltagshilfe-Süd.",
    articlePath: ARTICLE_PATH,
    datePublishedISO: "2026-04-30T10:00:00+02:00",
    dateModifiedISO: "2026-04-30T10:00:00+02:00",
    imageUrl: "/images/Ratgeber/pflegegrad_1.webp",
    breadcrumbs: [
      { name: "Startseite", path: "/" },
      { name: "Ratgeber", path: "/ratgeber" },
      { name: "Pflegegrad 1", path: ARTICLE_PATH },
    ],
    faq: faqLdItems,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd),
        }}
      />

      <article className="min-w-0 bg-white pb-16 pt-0 sm:pb-24">
        <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6 lg:px-8">
          <Pflegegrad1RatgeberHero />

          <div className="mt-10 flex flex-col gap-10 lg:mt-12 lg:flex-row lg:items-stretch lg:gap-12">
            <RatgeberArticleDesktopSidebar
              tocEntries={PFLEGEGRAD1_ARTICLE_TOC_ENTRIES}
              tocLinkClassName={TOC_LINK}
            />

            <div className="min-w-0 w-full flex-1">
              <div className="mx-auto w-full max-w-[760px]">
                <Pflegegrad1Article />
                <VerwandteRatgeberBeitraege currentSlug="pflegegrad-1" />
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
