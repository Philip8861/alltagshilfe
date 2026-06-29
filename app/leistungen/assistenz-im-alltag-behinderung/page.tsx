import type { Metadata } from "next";
import { AssistenzImAlltagBehinderungLanding } from "@/components/leistungen/AssistenzImAlltagBehinderungLanding";
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
      <AssistenzImAlltagBehinderungLanding />
    </>
  );
}
