import type { Metadata } from "next";
import Link from "next/link";

import {
  PflegegradBeantragenArticle,
  PFLEGEGRAD_ARTICLE_TOC_ENTRIES,
  pflegegradBeantragenFaqForJsonLd,
} from "@/components/ratgeber/pflegegrad-beantragen/PflegegradBeantragenArticle";
import { PflegegradRatgeberHero } from "@/components/ratgeber/pflegegrad-beantragen/PflegegradRatgeberHero";
import { siteConfig } from "@/config/site";
import { serializeRatgeberArticleJsonSchemas } from "@/lib/ratgeber/article-jsonld";

const ARTICLE_PATH = "/ratgeber/pflegegrad-beantragen" as const;

const META_TITLE = "Pflegegrad beantragen 2026: Schritt-für-Schritt-Anleitung";

const META_DESC =
  "Pflegegrad beantragen 2026: Antrag, Begutachtung, Unterlagen, Fristen, Pflegegeld und Tipps für Angehörige einfach erklärt.";

const TOC_LINK =
  "text-[0.9375rem] font-medium text-[#0F4F68] underline-offset-2 hover:underline";

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
    imageUrl: "/images/Ratgeber/ratgeber.webp",
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

          <div className="mt-10 flex flex-col gap-10 lg:mt-12 lg:flex-row lg:items-start lg:gap-12">
            <aside className="hidden shrink-0 lg:block lg:w-[200px]">
              <div className="sticky top-28 space-y-8">
                <nav aria-label="Inhalt">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">Inhalt</p>
                  <ol className="mt-3 space-y-2.5">
                    {[...PFLEGEGRAD_ARTICLE_TOC_ENTRIES].map((e, i) => (
                      <li key={e.id} className="text-sm leading-snug text-neutral-700">
                        <span className="text-neutral-400">{String(i + 1).padStart(2, "0")}</span>{" "}
                        <a href={`#${e.id}`} className={TOC_LINK}>
                          {e.label}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
                <div className="rounded-lg border border-neutral-200 bg-neutral-50/80 px-3 py-4">
                  <p className="text-sm font-semibold text-[#0F4F68]">Persönliche Beratung</p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    Sie möchten Unterstützung beim Pflegegrad-Antrag?
                  </p>
                  <Link
                    href="/kontakt"
                    className="mt-3 inline-flex text-sm font-semibold text-[#0F4F68] underline-offset-2 hover:underline"
                  >
                    Beratung anfragen
                  </Link>
                </div>
              </div>
            </aside>

            <div className="min-w-0 w-full flex-1">
              <div className="mx-auto w-full max-w-[780px]">
                <PflegegradBeantragenArticle />
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
