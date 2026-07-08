import type { Metadata } from "next";

import { EinlagenVorlagenPantsWindelnArticle } from "@/components/ratgeber/einlagen-vorlagen-pants-windeln/EinlagenVorlagenPantsWindelnArticle";
import { EinlagenVorlagenPantsWindelnHero } from "@/components/ratgeber/einlagen-vorlagen-pants-windeln/EinlagenVorlagenPantsWindelnHero";
import { einlagenVorlagenPantsWindelnFaqForJsonLd } from "@/components/ratgeber/einlagen-vorlagen-pants-windeln/einlagen-vorlagen-pants-windeln-faq";
import { EINLAGEN_VORLAGEN_PANTS_WINDELN_TOC } from "@/components/ratgeber/einlagen-vorlagen-pants-windeln/einlagen-vorlagen-pants-windeln-toc";
import { IncontinenceRecipeCtaProvider } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/IncontinenceRecipeCtaProvider";
import { RatgeberArticleDesktopSidebar } from "@/components/ratgeber/RatgeberArticleDesktopSidebar";
import {
  INKONTINENZMATERIAL_JSONLD_AUTHOR,
  INKONTINENZMATERIAL_JSONLD_REVIEWER,
} from "@/config/ratgeber-article-byline";
import { siteConfig } from "@/config/site";
import { serializeRatgeberArticleJsonSchemas } from "@/lib/ratgeber/article-jsonld";

const ARTICLE_PATH = "/ratgeber/einlagen-vorlagen-pants-windeln-inkontinenzmaterial" as const;

const META_TITLE = "Einlagen, Vorlagen, Pants oder Windeln: Welches Inkontinenzmaterial passt zu mir?";

const META_DESC =
  "Einlagen, Vorlagen, Pants oder Windeln? Erfahren Sie, welches Inkontinenzmaterial zu Ihrer Situation passt und wann Beratung sinnvoll ist.";

const TOC_LINK =
  "text-[0.9375rem] font-medium text-neutral-700 underline-offset-[3px] decoration-neutral-300 hover:text-[#0F4F68] hover:underline";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  keywords: [
    "welches Inkontinenzmaterial passt zu mir",
    "Inkontinenz Einlagen",
    "Inkontinenz Vorlagen",
    "Inkontinenz Pants",
    "Windeln für Erwachsene",
    "Inkontinenzprodukte Vergleich",
    "Inkontinenzmaterial Testpaket",
    "Inkontinenzversorgung Beratung",
  ],
  alternates: { canonical: ARTICLE_PATH },
  openGraph: {
    title: META_TITLE,
    description: META_DESC,
    url: ARTICLE_PATH,
    type: "article",
    siteName: siteConfig.name,
    locale: "de_DE",
    publishedTime: "2026-07-08T12:00:00+02:00",
    modifiedTime: "2026-07-08T12:00:00+02:00",
  },
};

export default function EinlagenVorlagenPantsWindelnRatgeberPage() {
  const faqLdItems = einlagenVorlagenPantsWindelnFaqForJsonLd();
  const { articleLd, faqLd, breadcrumbLd } = serializeRatgeberArticleJsonSchemas({
    headline: META_TITLE,
    description: META_DESC,
    articlePath: ARTICLE_PATH,
    datePublishedISO: "2026-07-08T12:00:00+02:00",
    dateModifiedISO: "2026-07-08T12:00:00+02:00",
    imageUrl: "/images/Ratgeber/Landing_page.webp",
    breadcrumbs: [
      { name: "Startseite", path: "/" },
      { name: "Ratgeber", path: "/ratgeber" },
      { name: "Welches Inkontinenzmaterial passt?", path: ARTICLE_PATH },
    ],
    faq: faqLdItems,
    author: INKONTINENZMATERIAL_JSONLD_AUTHOR,
    reviewer: INKONTINENZMATERIAL_JSONLD_REVIEWER,
  });

  return (
    <IncontinenceRecipeCtaProvider>
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
          <EinlagenVorlagenPantsWindelnHero />

          <div className="mt-10 flex flex-col gap-10 lg:mt-12 lg:flex-row lg:items-stretch lg:gap-12">
            <RatgeberArticleDesktopSidebar
              tocEntries={EINLAGEN_VORLAGEN_PANTS_WINDELN_TOC}
              tocLinkClassName={TOC_LINK}
            />

            <div className="min-w-0 w-full flex-1">
              <div className="mx-auto w-full max-w-[760px]">
                <EinlagenVorlagenPantsWindelnArticle />
              </div>
            </div>
          </div>
        </div>
      </article>
    </IncontinenceRecipeCtaProvider>
  );
}
