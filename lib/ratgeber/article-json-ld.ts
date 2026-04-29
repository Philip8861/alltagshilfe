import { siteConfig } from "@/config/site";

function abs(path: string) {
  const base = siteConfig.baseUrl.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export type FaqLdRatgeber = { question: string; answer: string };

/** JSON-LD Graph: Article, BreadcrumbList, optional FAQPage (wie Ratgeber-Langartikel). */
export function serializeRatgeberArticleJsonLd(params: {
  headline: string;
  description: string;
  articleUrlPath: string;
  datePublished: string;
  dateModified: string;
  imageUrl?: string;
  breadcrumbs: { name: string; path: string }[];
  faq: FaqLdRatgeber[];
}) {
  const articleUrl = abs(params.articleUrlPath);
  const article: Record<string, unknown> = {
    "@type": "Article",
    headline: params.headline,
    description: params.description,
    datePublished: params.datePublished,
    dateModified: params.dateModified,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
  };
  if (params.imageUrl) {
    article.image = params.imageUrl.startsWith("http") ? params.imageUrl : abs(params.imageUrl);
  }

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: params.breadcrumbs.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };

  const graph: unknown[] = [article, breadcrumb];

  if (params.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: params.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
