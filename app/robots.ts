import { siteConfig } from "@/config/site";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/partner/", "/en/partner/"] },
    ],
    sitemap: `${siteConfig.baseUrl}/sitemap.xml`,
  };
}
