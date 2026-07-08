import type { Metadata } from "next";

import { PflegegeldrechnerArticle } from "@/components/ratgeber/pflegegeldrechner/PflegegeldrechnerArticle";
import { PflegegeldrechnerHero } from "@/components/ratgeber/pflegegeldrechner/PflegegeldrechnerHero";
import { PFLEGEGELDRECHNER_TOC_ENTRIES } from "@/components/ratgeber/pflegegeldrechner/pflegegeldrechner-toc-config";
import { pflegegeldrechnerFaqForJsonLd } from "@/components/ratgeber/pflegegeldrechner/pflegegeldrechner-faq-data";
import { RatgeberArticleDesktopSidebar } from "@/components/ratgeber/RatgeberArticleDesktopSidebar";
import { siteConfig } from "@/config/site";
import { serializeRatgeberArticleJsonSchemas } from "@/lib/ratgeber/article-jsonld";

const ARTICLE_PATH = "/ratgeber/pflegegeldrechner" as const;

const META_TITLE = "Pflegegeldrechner 2026: Pflegegeld je Pflegegrad berechnen";

const META_DESC =
  "Berechnen Sie schnell Ihr monatliches Pflegegeld 2026. Pflegegrad auswählen und Betrag sofort sehen. Alltagshilfe-Süd hilft beim Antrag und Widerspruch.";

const TOC_LINK =
  "text-[0.9375rem] font-medium text-neutral-700 underline-offset-[3px] decoration-neutral-300 hover:text-[#0F4F68] hover:underline";

const H1 = "Pflegegeldrechner 2026: So viel Pflegegeld steht Ihnen zu";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  keywords: [
    "Pflegegeldrechner",
    "Pflegegeld 2026",
    "Pflegegeld berechnen",
    "Pflegegeld Pflegegrad",
    "Pflegegeld Tabelle",
    "häusliche Pflege",
    "Pflegekasse",
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

export default function PflegegeldrechnerRatgeberPage() {
  const faqLdItems = pflegegeldrechnerFaqForJsonLd();
  const { articleLd, faqLd, breadcrumbLd } = serializeRatgeberArticleJsonSchemas({
    headline: H1,
    description: META_DESC,
    articlePath: ARTICLE_PATH,
    datePublishedISO: "2026-04-30T10:00:00+02:00",
    dateModifiedISO: "2026-04-30T10:00:00+02:00",
    imageUrl: "/images/Ratgeber/pflegegrad_rechner.webp",
    breadcrumbs: [
      { name: "Startseite", path: "/" },
      { name: "Ratgeber", path: "/ratgeber" },
      { name: "Pflegegeldrechner", path: ARTICLE_PATH },
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
          <PflegegeldrechnerHero />

          <div className="mt-10 flex flex-col gap-10 lg:mt-12 lg:flex-row lg:items-stretch lg:gap-12">
            <RatgeberArticleDesktopSidebar
              tocEntries={[...PFLEGEGELDRECHNER_TOC_ENTRIES]}
              tocLinkClassName={TOC_LINK}
            />

            <div className="min-w-0 w-full flex-1">
              <div className="mx-auto w-full max-w-[760px]">
                <PflegegeldrechnerArticle />
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
