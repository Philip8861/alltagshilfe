import {
  RATGEBER_ARTICLE_JSONLD_AUTHOR,
  RATGEBER_ARTICLE_JSONLD_REVIEWER,
} from "@/config/ratgeber-article-byline";
import { siteConfig } from "@/config/site";

function absolutize(path: string): string {
  const base = siteConfig.baseUrl.replace(/\/?$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  try {
    return new URL(p, `${base}/`).href;
  } catch {
    return `${base}${p}`;
  }
}

export type RatgeberFaqForJsonLd = { question: string; answer: string };

type JsonLdPerson = {
  "@type": "Person";
  name: string;
  jobTitle?: string;
  worksFor?: { "@type": "Organization"; name: string };
};

export function serializeRatgeberArticleJsonSchemas(params: {
  headline: string;
  description: string;
  articlePath: string;
  datePublishedISO: string;
  dateModifiedISO: string;
  imageUrl?: string;
  breadcrumbs: { name: string; path: string }[];
  faq: RatgeberFaqForJsonLd[];
  author?: JsonLdPerson;
  reviewer?: JsonLdPerson;
}): { articleLd: Record<string, unknown>; faqLd: Record<string, unknown>; breadcrumbLd: Record<string, unknown> } {
  const pageUrl = absolutize(params.articlePath);
  const image = params.imageUrl ? absolutize(params.imageUrl) : undefined;

  const articleLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.headline,
    description: params.description,
    inLanguage: "de-DE",
    datePublished: params.datePublishedISO,
    dateModified: params.dateModifiedISO,
    author: { ...(params.author ?? RATGEBER_ARTICLE_JSONLD_AUTHOR) },
    contributor: { ...(params.reviewer ?? RATGEBER_ARTICLE_JSONLD_REVIEWER) },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
  };
  if (image) articleLd.image = image;

  const faqLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: params.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  const breadcrumbLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: params.breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: absolutize(b.path),
    })),
  };

  return { articleLd, faqLd, breadcrumbLd };
}
