import { siteConfig } from "@/config/site";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/partner/", "/en/partner/", "/test", "/landing"],
      },
    ],
    sitemap: `${siteConfig.baseUrl}/sitemap.xml`,
  };
}
