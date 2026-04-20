import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StandortLanding } from "@/components/standorte/StandortLanding";
import { buildStandortLocalBusinessJsonLd, getStandortBySlug, getAllStandortSlugs } from "@/config/standorte";
import { siteConfig } from "@/config/site";

export async function generateStaticParams() {
  return getAllStandortSlugs();
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = getStandortBySlug(slug);
  if (!data) return { title: "Standort" };
  const { plz, ort, standort } = data;
  const title = `Pflegeberatung, Haushaltshilfe & Betreuung in ${plz} ${ort} | ${siteConfig.name}`;
  const metaDescRaw = `${standort.localIntro[0]} Kontakt: ${standort.phone}.`;
  const description =
    metaDescRaw.length > 160 ? `${metaDescRaw.slice(0, 157).trim()}…` : metaDescRaw;
  const path = `/standorte/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
    },
  };
}

export default async function StandortSlugPage({ params }: Props) {
  const { slug } = await params;
  const data = getStandortBySlug(slug);
  if (!data) notFound();

  const { plz, ort, standort } = data;
  const base = siteConfig.baseUrl.replace(/\/$/, "");
  const pageUrl = `${base}/standorte/${slug}`;

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
        name: `${plz} ${ort}`,
        item: pageUrl,
      },
    ],
  };

  const localBusinessJsonLd = buildStandortLocalBusinessJsonLd({
    pageUrl,
    siteUrl: base,
    organizationName: siteConfig.name,
    plz,
    ort,
    standort,
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
          <li aria-current="page">
            {plz} {ort}
          </li>
        </ol>
      </nav>
      <StandortLanding slug={slug} plz={plz} ort={ort} standort={standort} />
    </>
  );
}
