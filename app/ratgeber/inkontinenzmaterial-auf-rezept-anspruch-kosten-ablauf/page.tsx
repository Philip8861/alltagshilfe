import type { Metadata } from "next";

import { InkontinenzmaterialAufRezeptArticle } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/InkontinenzmaterialAufRezeptArticle";
import { IncontinenceRecipeCtaOrchestrator } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/IncontinenceRecipeCtaOrchestrator";
import { InkontinenzmaterialAufRezeptHero } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/InkontinenzmaterialAufRezeptHero";
import { inkontinenzmaterialAufRezeptFaqForJsonLd } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/inkontinenzmaterial-auf-rezept-faq";
import { INKONTINENZMATERIAL_AUF_REZEPT_TOC } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/inkontinenzmaterial-auf-rezept-toc";
import { RatgeberArticleDesktopSidebar } from "@/components/ratgeber/RatgeberArticleDesktopSidebar";
import {
  INKONTINENZMATERIAL_JSONLD_AUTHOR,
  INKONTINENZMATERIAL_JSONLD_REVIEWER,
} from "@/config/ratgeber-article-byline";
import { siteConfig } from "@/config/site";
import { serializeRatgeberArticleJsonSchemas } from "@/lib/ratgeber/article-jsonld";

const ARTICLE_PATH = "/ratgeber/inkontinenzmaterial-auf-rezept-anspruch-kosten-ablauf" as const;

const META_TITLE = "Inkontinenzmaterial auf Rezept 2026: Anspruch, Kosten & Ablauf einfach erklärt";

const META_DESC =
  "Inkontinenzmaterial auf Rezept? Erfahren Sie, wann die Krankenkasse zahlt, wie hoch die Zuzahlung 2026 ist und wie der Ablauf reibungslos funktioniert.";

const TOC_LINK =
  "text-[0.9375rem] font-medium text-neutral-700 underline-offset-[3px] decoration-neutral-300 hover:text-[#0F4F68] hover:underline";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  keywords: [
    "Inkontinenzmaterial auf Rezept",
    "Inkontinenzhilfen auf Rezept",
    "Windeln auf Rezept",
    "Inkontinenzmaterial Krankenkasse",
    "Inkontinenzmaterial Kosten",
    "Zuzahlung Inkontinenzmaterial",
    "Pflegegrad Inkontinenzmaterial",
    "Inkontinenzversorgung Krankenkasse",
  ],
  alternates: { canonical: ARTICLE_PATH },
  openGraph: {
    title: META_TITLE,
    description: META_DESC,
    url: ARTICLE_PATH,
    type: "article",
    siteName: siteConfig.name,
    locale: "de_DE",
    publishedTime: "2026-07-08T10:00:00+02:00",
    modifiedTime: "2026-07-08T10:00:00+02:00",
  },
};

export default function InkontinenzmaterialAufRezeptRatgeberPage() {
  const faqLdItems = inkontinenzmaterialAufRezeptFaqForJsonLd();
  const { articleLd, faqLd, breadcrumbLd } = serializeRatgeberArticleJsonSchemas({
    headline: "Inkontinenzmaterial auf Rezept 2026: Anspruch, Kosten & Ablauf einfach erklärt",
    description: META_DESC,
    articlePath: ARTICLE_PATH,
    datePublishedISO: "2026-07-08T10:00:00+02:00",
    dateModifiedISO: "2026-07-08T10:00:00+02:00",
    imageUrl: "/images/Ratgeber/inkontinenz_auf_rezept.webp",
    breadcrumbs: [
      { name: "Startseite", path: "/" },
      { name: "Ratgeber", path: "/ratgeber" },
      { name: "Inkontinenzmaterial auf Rezept", path: ARTICLE_PATH },
    ],
    faq: faqLdItems,
    author: INKONTINENZMATERIAL_JSONLD_AUTHOR,
    reviewer: INKONTINENZMATERIAL_JSONLD_REVIEWER,
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
          <InkontinenzmaterialAufRezeptHero />

          <div className="mt-10 flex flex-col gap-10 lg:mt-12 lg:flex-row lg:items-stretch lg:gap-12">
            <RatgeberArticleDesktopSidebar
              tocEntries={INKONTINENZMATERIAL_AUF_REZEPT_TOC}
              tocLinkClassName={TOC_LINK}
              supportLine="Hilfe bei Inkontinenzmaterial, Rezept oder Versorgung?"
              preselectedServices={["hilfsmittel", "pflegegrad_beantrag_widerspruch"]}
              contextNote="Ratgeber: Inkontinenzmaterial auf Rezept"
            />

            <div className="min-w-0 w-full flex-1">
              <div className="mx-auto w-full max-w-[760px]">
                <InkontinenzmaterialAufRezeptArticle />
              </div>
            </div>
          </div>
        </div>
      </article>
      <IncontinenceRecipeCtaOrchestrator />
    </>
  );
}
