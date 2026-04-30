import type { Metadata } from "next";

import { PflegegradBeantragenArticle } from "@/components/ratgeber/pflegegrad-beantragen/PflegegradBeantragenArticle";
import { RatgeberSidebarBeratungTeaser } from "@/components/ratgeber/RatgeberBeratungDialog";
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
            <aside className="hidden shrink-0 lg:block lg:w-[240px] lg:max-w-[240px]">
              <div className="sticky top-24 z-10 flex max-h-[calc(100dvh-6rem)] flex-col gap-6 self-start overflow-y-auto overscroll-contain py-1 [-webkit-overflow-scrolling:touch] [scrollbar-gutter:stable]">
                <nav
                  aria-label="Inhalt"
                  className="relative overflow-hidden rounded-2xl border border-neutral-200/95 bg-white px-4 py-4 shadow-[0_2px_16px_-10px_rgba(15,79,104,0.1)] sm:px-5 sm:py-5"
                >
                  <div aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#0F4F68]/45 to-[#F78F2E]/35" />
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">Inhalt</p>
                  <ol className="mt-3 space-y-2.5">
                    {[...PFLEGEGRAD_ARTICLE_TOC_ENTRIES].map((e, i) => (
                      <li key={e.id} className="flex gap-1.5 text-sm leading-snug">
                        <span className="w-7 shrink-0 font-semibold tabular-nums text-[#F78F2E]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <a href={`#${e.id}`} className={TOC_LINK}>
                          {e.label}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>

                <RatgeberSidebarBeratungTeaser
                  supportLine="Sie möchten Unterstützung beim Pflegegrad-Antrag?"
                  preselectedServices={["pflegegrad_beantrag_widerspruch"]}
                  contextNote="Ratgeber: Pflegegrad beantragen"
                  articleSectionIds={PFLEGEGRAD_ARTICLE_TOC_ENTRIES.map((e) => e.id)}
                />
              </div>
            </aside>

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
