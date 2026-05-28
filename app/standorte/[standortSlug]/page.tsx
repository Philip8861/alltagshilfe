import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StandortLanding } from "@/components/standorte/StandortLanding";
import {
  buildStandortLocalBusinessJsonLd,
  findStandortByPageSlug,
  getAllStandortPageSlugs,
  getStandortPageImage,
  resolvePlzContextForStandortPage,
} from "@/config/standorte";
import { siteConfig } from "@/config/site";

export async function generateStaticParams() {
  return getAllStandortPageSlugs();
}

type Props = {
  params: Promise<{ standortSlug: string }>;
  searchParams?: Promise<{ plz?: string; ort?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { standortSlug } = await params;
  const sp = await searchParams;
  const standort = findStandortByPageSlug(standortSlug);
  if (!standort) return { title: "Standort" };
  const plzContext = resolvePlzContextForStandortPage(standort, sp);
  const geo = plzContext ? ` in ${plzContext.plz} ${plzContext.ort}` : "";
  const title = `Pflegeberatung, Haushaltshilfe & Betreuung${geo} | ${standort.name} | ${siteConfig.name}`;
  const metaDescRaw = `${standort.localIntro[0]} Kontakt: ${standort.phone}.`;
  const description =
    metaDescRaw.length > 160 ? `${metaDescRaw.slice(0, 157).trim()}…` : metaDescRaw;
  const path = `/standorte/${standort.pageSlug}`;
  const ogImage = getStandortPageImage(standort.pageSlug);
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      locale: "de_DE",
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          alt: `${standort.name} – Haushaltshilfe, Pflegeberatung und Betreuung`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function StandortPage({ params, searchParams }: Props) {
  const { standortSlug } = await params;
  const sp = await searchParams;
  const standort = findStandortByPageSlug(standortSlug);
  if (!standort) notFound();

  const plzContext = resolvePlzContextForStandortPage(standort, sp);

  const base = siteConfig.baseUrl.replace(/\/$/, "");
  const pageUrl = `${base}/standorte/${standort.pageSlug}`;

  const breadcrumbLabel = plzContext
    ? `${plzContext.plz} ${plzContext.ort}`
    : standort.name;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Standorte",
        item: `${base}/standorte`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: breadcrumbLabel,
        item: pageUrl,
      },
    ],
  };

  const localBusinessJsonLd = buildStandortLocalBusinessJsonLd({
    pageUrl,
    siteUrl: base,
    organizationName: siteConfig.name,
    standort,
    plzContext,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            ...localBusinessJsonLd,
          }),
        }}
      />
      <nav className="sr-only" aria-label="Brotkrumen-Navigation">
        <ol>
          <li>
            <a href={`${base}/standorte`}>Standorte</a>
          </li>
          <li aria-current="page">{breadcrumbLabel}</li>
        </ol>
      </nav>
      <StandortLanding standort={standort} plzContext={plzContext} />
    </>
  );
}
