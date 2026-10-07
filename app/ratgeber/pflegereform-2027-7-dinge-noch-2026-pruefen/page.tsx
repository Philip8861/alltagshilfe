import type { Metadata } from "next";

import { Pflegereform2027Article } from "@/components/ratgeber/pflegereform-2027/Pflegereform2027Article";
import { Pflegereform2027Hero } from "@/components/ratgeber/pflegereform-2027/Pflegereform2027Hero";
import { pflegereform2027FaqForJsonLd } from "@/components/ratgeber/pflegereform-2027/pflegereform2027-faq-data";
import { PFLEGEREFORM2027_ARTICLE_TOC_ENTRIES } from "@/components/ratgeber/pflegereform-2027/pflegereform2027-toc-config";
import { RatgeberArticleDesktopSidebar } from "@/components/ratgeber/RatgeberArticleDesktopSidebar";
import { VerwandteRatgeberBeitraege } from "@/components/ratgeber/VerwandteRatgeberBeitraege";
import { PFLEGEREFORM_2027_SLUG } from "@/config/ratgeber-betraege";
import { siteConfig } from "@/config/site";
import { serializeRatgeberArticleJsonSchemas } from "@/lib/ratgeber/article-jsonld";

const ARTICLE_PATH = `/ratgeber/${PFLEGEREFORM_2027_SLUG}` as const;

const HEADLINE = "Pflegereform 2027: Diese 7 Dinge sollten Pflegebedürftige und Angehörige noch 2026 prüfen";

/** Root-Layout hängt „| Alltagshilfe-Süd“ per Template an. */
const META_TITLE = "Pflegereform 2027: 7 Dinge noch 2026 prüfen – News zur Pflegereform";

const META_DESC =
  "Pflegereform 2027 (Stand 7. Oktober 2026): Was sich bei Pflegegraden, Entlastungsbetrag und Budgets ändern könnte – und welche 7 Dinge Pflegebedürftige und Angehörige noch 2026 prüfen sollten.";

const PUBLISHED_ISO = "2026-10-07T09:00:00+02:00";

const TOC_LINK =
  "text-[0.9375rem] font-medium text-neutral-700 underline-offset-[3px] decoration-neutral-300 hover:text-[#0F4F68] hover:underline";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  keywords: [
    "Pflegereform 2027",
    "Pflegeneuordnungsgesetz",
    "Pflegereform News",
    "Pflegegrad 2027 Schwellenwerte",
    "Entlastungsbetrag Pflegegrad 1",
    "Sozialraumbudget 175 Euro",
    "Höherstufung Pflegegrad 2026",
    "Verhinderungspflege Kurzzeitpflege 2026",
    "betriebliche Pflegeberatung",
    "Pflege und Beruf",
  ],
  alternates: { canonical: ARTICLE_PATH },
  openGraph: {
    title: META_TITLE,
    description: META_DESC,
    url: ARTICLE_PATH,
    type: "article",
    siteName: siteConfig.name,
    locale: "de_DE",
    publishedTime: PUBLISHED_ISO,
    modifiedTime: PUBLISHED_ISO,
    images: [{ url: "/images/Ratgeber/pflegereform_2027_familie_tablet.webp", width: 1080, height: 720, alt: HEADLINE }],
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESC,
    images: ["/images/Ratgeber/pflegereform_2027_familie_tablet.webp"],
  },
};

export default function Pflegereform2027RatgeberPage() {
  const { articleLd, faqLd, breadcrumbLd } = serializeRatgeberArticleJsonSchemas({
    headline: HEADLINE,
    description: META_DESC,
    articlePath: ARTICLE_PATH,
    datePublishedISO: PUBLISHED_ISO,
    dateModifiedISO: PUBLISHED_ISO,
    imageUrl: "/images/Ratgeber/pflegereform_2027_familie_tablet.webp",
    breadcrumbs: [
      { name: "Startseite", path: "/" },
      { name: "Ratgeber", path: "/ratgeber" },
      { name: "Pflegereform 2027", path: ARTICLE_PATH },
    ],
    faq: pflegereform2027FaqForJsonLd(),
  });

  // News-Beitrag: zusätzlich als NewsArticle kennzeichnen (Article-Schema bleibt kompatibel).
  const newsArticleLd = { ...articleLd, "@type": "NewsArticle", articleSection: "News zur Pflegereform" };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <article className="min-w-0 bg-white pb-16 pt-0 sm:pb-24">
        <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6 lg:px-8">
          <Pflegereform2027Hero />

          <div className="mt-10 flex flex-col gap-10 lg:mt-12 lg:flex-row lg:items-stretch lg:gap-12">
            <RatgeberArticleDesktopSidebar tocEntries={PFLEGEREFORM2027_ARTICLE_TOC_ENTRIES} tocLinkClassName={TOC_LINK} />

            <div className="min-w-0 w-full flex-1">
              <div className="mx-auto w-full max-w-[760px]">
                <Pflegereform2027Article />
                <VerwandteRatgeberBeitraege currentSlug={PFLEGEREFORM_2027_SLUG} />
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
