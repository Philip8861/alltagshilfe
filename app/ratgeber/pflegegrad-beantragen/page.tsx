import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { RatgeberArticleHero } from "@/components/ratgeber/RatgeberArticleHero";
import { RatTocNav } from "@/components/ratgeber/article/RatgeberArticleUi";
import {
  PflegegradBeantragenArticle,
  PFLEGEGRAD_ARTICLE_TOC_ENTRIES,
  pflegegradBeantragenFaqForJsonLd,
} from "@/components/ratgeber/pflegegrad-beantragen/PflegegradBeantragenArticle";
import { VerwandteRatgeberBeitraege } from "@/components/ratgeber/VerwandteRatgeberBeitraege";
import { siteConfig } from "@/config/site";
import { serializeRatgeberArticleJsonSchemas } from "@/lib/ratgeber/article-jsonld";

const ARTICLE_PATH = "/ratgeber/pflegegrad-beantragen" as const;

const META_TITLE = "Pflegegrad beantragen 2026: Schritt-für-Schritt-Anleitung";

const META_DESC =
  "Pflegegrad beantragen 2026: Antrag, Begutachtung, Unterlagen, Fristen, Pflegegeld und Tipps für Angehörige einfach erklärt.";

/** TOC-Einträge als normales Array (readonly-Tuple nicht direkt `{ id; label }[]`-kompatibel) */
const TOC_NAV_ENTRIES = [...PFLEGEGRAD_ARTICLE_TOC_ENTRIES].map((e) => ({
  id: e.id,
  label: e.label,
}));

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
    "Pflegegeld beantragen",
    "Pflegeleistungen 2026",
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
      { name: "Start", path: "/" },
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

      <article className="min-w-0 bg-[#FFFBF7] pb-16 pt-0 sm:pb-24">
        <RatgeberArticleHero
          title="Pflegegrad beantragen: So erhalten Sie Schritt für Schritt die richtige Unterstützung"
          topicCategoryBadge="Pflegegrad & Pflegeleistungen"
          lead={`Wenn im Alltag dauerhaft Hilfe gebraucht wird, ist der erste Schritt oft: einen Pflegegrad beantragen. So werden Leistungen der Pflegeversicherung wie Pflegegeld, Entlastungsbetrag oder Hilfsmittel nutzbar. Dieser Ratgeber führt Sie verständlich durch Antrag, Begutachtung und typische Stolpersteine – besonders für Angehörige.`}
          updatedDisplay="April 2026"
          updatedISO="2026-04-29"
          belowImageSlot={
            <nav aria-label="Brotkrumen" className="text-sm leading-relaxed text-neutral-600">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="font-medium text-[#0F4F68] underline underline-offset-2 hover:text-[#0c3d52]">
                    Start
                  </Link>
                </li>
                <li aria-hidden className="text-neutral-400">
                  /
                </li>
                <li>
                  <Link
                    href="/ratgeber"
                    className="font-medium text-[#0F4F68] underline underline-offset-2 hover:text-[#0c3d52]"
                  >
                    Ratgeber
                  </Link>
                </li>
                <li aria-hidden className="text-neutral-400">
                  /
                </li>
                <li className="font-semibold text-neutral-800">Pflegegrad beantragen</li>
              </ol>
            </nav>
          }
        />

        <Container className="pb-4 sm:pb-6">
          <div className="mx-auto flex w-full max-w-[min(76rem,100%)] flex-col gap-12 lg:flex-row lg:items-start lg:gap-14">
            <aside className="sticky top-28 order-2 hidden w-full max-w-[18rem] shrink-0 self-start lg:order-none lg:block">
              <div className="max-h-[min(70vh,32rem)] overflow-y-auto rounded-2xl border border-[#0F4F68]/11 bg-[#fafcfb] px-4 py-4 shadow-sm">
                <RatTocNav entries={TOC_NAV_ENTRIES} />
              </div>
            </aside>
            <div className="min-w-0 flex-1">
              <div className="mx-auto w-full max-w-[51rem]">
                <PflegegradBeantragenArticle />
              </div>
              <VerwandteRatgeberBeitraege currentSlug="pflegegrad-beantragen" />
            </div>
          </div>
        </Container>
      </article>
    </>
  );
}
