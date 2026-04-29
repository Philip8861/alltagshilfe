import { siteConfig } from "@/config/site";
import type { MetadataRoute } from "next";
import leistungenData from "@/content/leistungen.json";
import { getAllStandortPageSlugs } from "@/config/standorte";
import { getCategorySlugList } from "@/lib/blog/categories";
import { getAllBlogSlugParams } from "@/lib/blog/posts-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.baseUrl;
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/ueber-uns`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
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
      url: `${base}/pflegeberatung/online-videoberatung`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.65,
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
  const standortSeiten = getAllStandortPageSlugs().map(({ standortSlug }) => ({
    url: `${base}/standorte/${standortSlug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));
  const blogPosts = getAllBlogSlugParams().map(({ slug }) => ({
    url: `${base}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.72,
  }));
  const blogCategories = getCategorySlugList().map((categorySlug) => ({
    url: `${base}/blog/kategorie/${categorySlug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.68,
  }));
  return [...staticRoutes, ...leistungen, ...standortSeiten, ...blogPosts, ...blogCategories];
}
