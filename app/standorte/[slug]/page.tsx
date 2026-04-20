import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { StandortLanding } from "@/components/standorte/StandortLanding";
import { Container } from "@/components/layout/Container";
import { getStandortBySlug, getAllStandortSlugs } from "@/config/standorte";
import { siteConfig } from "@/config/site";

export async function generateStaticParams() {
  return getAllStandortSlugs();
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = getStandortBySlug(slug);
  if (!data) return { title: "Standort" };
  const { plz, ort } = data;
  const title = `Pflegeberatung, Haushaltshilfe & Betreuung in ${plz} ${ort} | ${siteConfig.name}`;
  const description = `Haushaltshilfe, Alltagsbegleitung, Pflegeberatung und Pflegehilfsmittel in ${ort}. Jetzt Kontakt aufnehmen – ${data.standort.name}.`;
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="w-full bg-[#fafbfc] pt-6 sm:pt-8">
        <Container className="w-full">
          <nav className="mx-auto max-w-7xl" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-neutral-600">
              <li>
                <Link
                  href="/standorte"
                  className="text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded"
                >
                  Standorte
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="font-medium text-neutral-900" aria-current="page">
                {plz} {ort}
              </li>
            </ol>
          </nav>
        </Container>
      </div>
      <StandortLanding plz={plz} ort={ort} standort={standort} />
    </>
  );
}
