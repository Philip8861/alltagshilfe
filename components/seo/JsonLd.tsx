import { siteConfig } from "@/config/site";

type OrganizationSchema = {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  description: string;
  url: string;
  logo: { "@type": "ImageObject"; url: string };
};

export function OrganizationJsonLd() {
  const schema: OrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.baseUrl}/images/logo_header.webp`,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
