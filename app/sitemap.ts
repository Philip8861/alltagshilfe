import { siteConfig } from "@/config/site";
import type { MetadataRoute } from "next";
import leistungenData from "@/content/leistungen.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.baseUrl;
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/ueber-uns`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/leistungen`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/kontakt`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/standorte`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/karriere`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/pflegeberatung`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    {
      url: `${base}/pflegehilfsmittel/kostenfreie-pflegehilfsmittel`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${base}/pflegebox`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/pflegeshop`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/inkontinenzversorgung`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/impressum`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/datenschutz`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
  const leistungen = leistungenData.map(
    (item: { slug: string }) => ({
      url: `${base}/leistungen/${item.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );
  return [...staticRoutes, ...leistungen];
}
