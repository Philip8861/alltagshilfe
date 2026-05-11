import { siteConfig } from "@/config/site";
import { features } from "@/config/features";
import type { MetadataRoute } from "next";
import leistungenData from "@/content/leistungen.json";
import { getAllStandortPageSlugs } from "@/config/standorte";
import { RATGEBER_BEITRAEGE } from "@/config/ratgeber-betraege";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.baseUrl;
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/ueber-uns`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/neuigkeiten`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.65 },
    { url: `${base}/kooperation`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.72 },
    { url: `${base}/barrierefreiheit`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.45 },
    { url: `${base}/kontakt`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/standorte`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/karriere`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/pflegeberatung`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    {
      url: `${base}/pflegeberatung/private-pflegeberatung`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${base}/pflegehilfsmittel/kostenfreie-pflegehilfsmittel`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/pflegehilfsmittel/pflegebox-konfigurator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${base}/pflegeshop`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/impressum`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/datenschutz`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/ratgeber`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.75 },
  ];
  const leistungen = leistungenData
    .filter(
      (item: { slug: string }) =>
        features.essenAufRaederVisible || item.slug !== "essen-auf-raeder"
    )
    .map(
    (item: { slug: string }) => ({
      url: `${base}/leistungen/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );
  const standortSeiten = getAllStandortPageSlugs().map(({ standortSlug }) => ({
    url: `${base}/standorte/${standortSlug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));
  const ratgeberArtikel = RATGEBER_BEITRAEGE.map((b) => ({
    url: `${base}/ratgeber/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.72,
  }));
  return [...staticRoutes, ...leistungen, ...standortSeiten, ...ratgeberArtikel];
}
