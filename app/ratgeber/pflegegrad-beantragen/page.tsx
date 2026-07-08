import type { Metadata } from "next";

import { PflegegradBeantragenArticle } from "@/components/ratgeber/pflegegrad-beantragen/PflegegradBeantragenArticle";
import { RatgeberArticleDesktopSidebar } from "@/components/ratgeber/RatgeberArticleDesktopSidebar";
import { PflegegradRatgeberHero } from "@/components/ratgeber/pflegegrad-beantragen/PflegegradRatgeberHero";
import { PFLEGEGRAD_ARTICLE_TOC_ENTRIES } from "@/components/ratgeber/pflegegrad-beantragen/pflegegrad-toc-config";
import { pflegegradBeantragenFaqForJsonLd } from "@/components/ratgeber/pflegegrad-beantragen/pflegegrad-beantragen-faq-data";
import { siteConfig } from "@/config/site";
import { serializeRatgeberArticleJsonSchemas } from "@/lib/ratgeber/article-jsonld";

const ARTICLE_PATH = "/ratgeber/pflegegrad-beantragen" as const;

const META_TITLE = "Pflegegrad beantragen 2026: Schritt-für-Schritt-Anleitung";

const META_DESC =
  "Pflegegrad beantragen 2026: Antrag, Begutachtung, Unterlagen, Fristen, Pflegegeld und Tipps für Angehörige einfach erklärt.";

const TOC_LINK =
  "text-[0.9375rem] font-medium text-neutral-700 underline-offset-[3px] decoration-neutral-300 hover:text-[#0F4F68] hover:underline";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  keywords: [
    "Pflegegrad beantragen",
    "Pflegegrad Antrag",
    "Pflegegrad beantragen 2026",
    "Pflegekasse Antrag",
    "MD Begutachtung",
    "Pflegegrad abgelehnt",
    "Pflegegrad Widerspruch",
    "Pflegegeld beantragen",
    "Pflegeleistungen 2026",
    "Pflegeberatung",
    "Pflegehilfsmittel",
    "Entlastungsbetrag",
  ],
  alternates: { canonical: ARTICLE_PATH },
  openGraph: {
    title: META_TITLE,
    description: META_DESC,
    url: ARTICLE_PATH,
    type: "article",
    siteName: siteConfig.name,
    locale: "de_DE",
    publishedTime: "2026-04-29T08:00:00+02:00",
    modifiedTime: "2026-04-29T08:00:00+02:00",
  },
};

export default function PflegegradBeantragenRatgeberPage() {
  const faqLdItems = pflegegradBeantragenFaqForJsonLd();
  const { articleLd, faqLd, breadcrumbLd } = serializeRatgeberArticleJsonSchemas({
    headline: "Pflegegrad beantragen: So erhalten Sie Schritt für Schritt die richtige Unterstützung",
    description:
      "Pflegegrad beantragen 2026: Antrag, Begutachtung, Unterlagen, Fristen, Pflegegeld und Tipps für Angehörige einfach erklärt.",
    articlePath: ARTICLE_PATH,
    datePublishedISO: "2026-04-29T08:00:00+02:00",
    dateModifiedISO: "2026-04-29T08:00:00+02:00",
    imageUrl: "/images/Ratgeber/Pflegegrad_beantragen.webp",
    breadcrumbs: [
      { name: "Startseite", path: "/" },
      { name: "Ratgeber", path: "/ratgeber" },
      { name: "Pflegegrad beantragen", path: ARTICLE_PATH },
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
          <PflegegradRatgeberHero />

          <div className="mt-10 flex flex-col gap-10 lg:mt-12 lg:flex-row lg:items-stretch lg:gap-12">
            <RatgeberArticleDesktopSidebar
              tocEntries={PFLEGEGRAD_ARTICLE_TOC_ENTRIES}
              tocLinkClassName={TOC_LINK}
            />

            <div className="min-w-0 w-full flex-1">
              <div className="mx-auto w-full max-w-[760px]">
                <PflegegradBeantragenArticle />
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
