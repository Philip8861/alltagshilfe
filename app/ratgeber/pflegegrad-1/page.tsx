import type { Metadata } from "next";

import { Pflegegrad1Article } from "@/components/ratgeber/pflegegrad-1/Pflegegrad1Article";
import { RatgeberSidebarBeratungTeaser } from "@/components/ratgeber/RatgeberBeratungDialog";
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
            <aside className="hidden shrink-0 lg:block lg:w-[280px] lg:max-w-[280px]">
              <div className="sticky top-24 z-10 flex max-h-[calc(100dvh-5.5rem)] min-h-0 flex-col gap-5 self-start">
                <nav
                  aria-label="Inhalt"
                  className="relative shrink-0 overflow-hidden rounded-2xl border border-neutral-200/95 bg-white px-4 py-4 shadow-[0_2px_16px_-10px_rgba(15,79,104,0.1)] sm:px-5 sm:py-5"
                >
                  <div aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#0F4F68]/45 to-[#F78F2E]/35" />
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">Inhalt</p>
                  <ol className="mt-3 space-y-2.5">
                    {[...PFLEGEGRAD1_ARTICLE_TOC_ENTRIES].map((e, i) => (
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

                <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain [-webkit-overflow-scrolling:touch] [scrollbar-gutter:stable] pr-0.5">
                  <RatgeberSidebarBeratungTeaser
                    supportLine="Fragen zu Pflegegrad 1, Entlastungsbetrag oder Antrag?"
                    preselectedServices={["pflegegrad_beantrag_widerspruch"]}
                    contextNote="Ratgeber: Pflegegrad 1"
                    articleSectionIds={PFLEGEGRAD1_ARTICLE_TOC_ENTRIES.map((e) => e.id)}
                  />
                </div>
              </div>
            </aside>

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
