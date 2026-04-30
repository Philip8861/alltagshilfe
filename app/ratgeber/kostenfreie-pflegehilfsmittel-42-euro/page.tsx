import type { Metadata } from "next";

import { KostenfreiePflegehilfsmittel42Article } from "@/components/ratgeber/kostenfreie-pflegehilfsmittel-42/KostenfreiePflegehilfsmittel42Article";
import { KostenfreiePflegehilfsmittel42Hero } from "@/components/ratgeber/kostenfreie-pflegehilfsmittel-42/KostenfreiePflegehilfsmittel42Hero";
import { kostenfreiePflegehilfsmittel42FaqForJsonLd } from "@/components/ratgeber/kostenfreie-pflegehilfsmittel-42/kostenfreie-pflegehilfsmittel-42-faq";
import { KOSTENFREIE_PFLEGEHILFSMITTEL_42_TOC } from "@/components/ratgeber/kostenfreie-pflegehilfsmittel-42/kostenfreie-pflegehilfsmittel-42-toc";
import { RatgeberArticleDesktopSidebar } from "@/components/ratgeber/RatgeberArticleDesktopSidebar";
import { siteConfig } from "@/config/site";
import { serializeRatgeberArticleJsonSchemas } from "@/lib/ratgeber/article-jsonld";

const ARTICLE_PATH = "/ratgeber/kostenfreie-pflegehilfsmittel-42-euro" as const;

const META_TITLE = "Kostenfreie Pflegehilfsmittel: 42 € monatlich sichern";

const META_DESC =
  "Pflegebedürftige mit Pflegegrad haben Anspruch auf Pflegehilfsmittel im Wert von bis zu 42 € pro Monat. Voraussetzungen, Antrag, Produkte und Hilfe durch Alltagshilfe-Süd.";

const TOC_LINK =
  "text-[0.9375rem] font-medium text-neutral-700 underline-offset-[3px] decoration-neutral-300 hover:text-[#0F4F68] hover:underline";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  keywords: [
    "kostenfreie Pflegehilfsmittel 42 Euro",
    "Pflegehilfsmittel beantragen",
    "Pflegehilfsmittel zum Verbrauch",
    "42 Euro Pflegebox",
    "Pflegegrad Pflegehilfsmittel",
    "kostenlose Pflegehilfsmittel",
    "SGB XI",
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

export default function KostenfreiePflegehilfsmittel42RatgeberPage() {
  const faqLdItems = kostenfreiePflegehilfsmittel42FaqForJsonLd();
  const { articleLd, faqLd, breadcrumbLd } = serializeRatgeberArticleJsonSchemas({
    headline: "Kostenfreie Pflegehilfsmittel im Wert von 42 € monatlich",
    description: META_DESC,
    articlePath: ARTICLE_PATH,
    datePublishedISO: "2026-04-30T10:00:00+02:00",
    dateModifiedISO: "2026-04-30T10:00:00+02:00",
    imageUrl: "/images/Ratgeber/ratgeber_pflegehilfsmittel.webp",
    breadcrumbs: [
      { name: "Startseite", path: "/" },
      { name: "Ratgeber", path: "/ratgeber" },
      { name: "Kostenfreie Pflegehilfsmittel (42 €)", path: ARTICLE_PATH },
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
          <KostenfreiePflegehilfsmittel42Hero />

          <div className="mt-10 flex flex-col gap-10 lg:mt-12 lg:flex-row lg:items-stretch lg:gap-12">
            <RatgeberArticleDesktopSidebar
              tocEntries={KOSTENFREIE_PFLEGEHILFSMITTEL_42_TOC}
              tocLinkClassName={TOC_LINK}
              supportLine="Hilfe bei Pflegehilfsmitteln, Pflegegrad oder Antrag?"
              preselectedServices={["pflegebox", "pflegegrad_beantrag_widerspruch", "hilfsmittel"]}
              contextNote="Ratgeber: 42 € Pflegehilfsmittel"
            />

            <div className="min-w-0 w-full flex-1">
              <div className="mx-auto w-full max-w-[760px]">
                <KostenfreiePflegehilfsmittel42Article />
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
