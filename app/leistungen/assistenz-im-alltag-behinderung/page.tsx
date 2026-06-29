import type { Metadata } from "next";
import Link from "next/link";
import { AssistenzImAlltagBehinderungLanding } from "@/components/leistungen/AssistenzImAlltagBehinderungLanding";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";
import { buildLeistungBreadcrumbJsonLd, buildLeistungServiceJsonLd } from "@/lib/leistung-service-jsonld";

const PATH = "/leistungen/assistenz-im-alltag-behinderung" as const;
const PAGE_TITLE = "Assistenz im Alltag für Menschen mit Behinderung";
const META_DESCRIPTION =
  "Alltagshilfe-Süd bietet Assistenz im Alltag für Menschen mit Behinderung, Mütter, Väter und Familien. Unterstützung bei Haushalt, Terminen, Einkaufen, Behördenwegen und sozialer Teilhabe. Kostenübernahme durch den Bezirk Schwaben nach Antrag und Bewilligung möglich.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: META_DESCRIPTION,
  keywords: [
    "Assistenz im Alltag für Menschen mit Behinderung",
    "Alltagsassistenz",
    "Alltagsbegleitung für Menschen mit Behinderung",
    "Hilfe im Alltag bei Behinderung",
    "persönliche Assistenz",
    "ambulante Assistenz",
    "Eingliederungshilfe",
    "Assistenzleistungen SGB IX",
    "Bezirk Schwaben",
    "Elternassistenz",
    "Mütter und Väter mit Behinderung",
    "Unterstützung im Alltag",
    "soziale Teilhabe",
    "Begleitung zu Arztterminen",
    "Unterstützung bei Behördenwegen",
    "Haushalt und Tagesstruktur",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    title: `${PAGE_TITLE} | ${siteConfig.name}`,
    description: META_DESCRIPTION,
  },
};

const serviceJsonLd = buildLeistungServiceJsonLd({
  path: PATH,
  name: PAGE_TITLE,
  description: META_DESCRIPTION,
  serviceType: ["Alltagsassistenz", "Assistenzleistungen", "Eingliederungshilfe"],
});

const breadcrumbJsonLd = buildLeistungBreadcrumbJsonLd({
  path: PATH,
  pageName: PAGE_TITLE,
});

export default function AssistenzImAlltagBehinderungPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Container className="py-4 sm:py-5">
        <nav aria-label="Brotkrumen" className="text-sm text-neutral-600">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="font-medium text-[#0F4F68] hover:underline">
                Startseite
              </Link>
            </li>
            <li aria-hidden className="text-neutral-400">
              /
            </li>
            <li>
              <Link href="/#unsere-leistungen" className="font-medium text-[#0F4F68] hover:underline">
                Leistungen
              </Link>
            </li>
            <li aria-hidden className="text-neutral-400">
              /
            </li>
            <li aria-current="page" className="text-neutral-700">
              {PAGE_TITLE}
            </li>
          </ol>
        </nav>
      </Container>
      <AssistenzImAlltagBehinderungLanding />
    </>
  );
}
