import { siteConfig } from "@/config/site";

type LeistungServiceSchemaParams = {
  path: string;
  name: string;
  description: string;
  serviceType: string[];
};

export function buildLeistungServiceJsonLd(params: LeistungServiceSchemaParams) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: params.name,
    description: params.description,
    serviceType: params.serviceType,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.baseUrl,
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Schwaben" },
      { "@type": "AdministrativeArea", name: "Bayern" },
    ],
    url: `${siteConfig.baseUrl}${params.path}`,
  };
}

export function buildLeistungBreadcrumbJsonLd(params: { path: string; pageName: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Startseite",
        item: siteConfig.baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Leistungen",
        item: `${siteConfig.baseUrl}/#unsere-leistungen`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: params.pageName,
        item: `${siteConfig.baseUrl}${params.path}`,
      },
    ],
  };
}
