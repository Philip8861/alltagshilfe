import { siteConfig } from "@/config/site";

function abs(path: string) {
  const base = siteConfig.baseUrl.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export type FaqLd = { question: string; answer: string };

export function serializeBlogArticleJsonLd(params: {
  headline: string;
  description: string;
  articleUrlPath: string;
  datePublished: string;
  dateModified: string;
  imageUrl?: string;
  breadcrumbs: { name: string; path: string }[];
  faq: FaqLd[];
}) {
  const articleUrl = abs(params.articleUrlPath);
  const blogPosting: Record<string, unknown> = {
    "@type": "BlogPosting",
    headline: params.headline,
    description: params.description,
    datePublished: params.datePublished,
    dateModified: params.dateModified,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
  };
  if (params.imageUrl) {
    blogPosting.image = params.imageUrl.startsWith("http") ? params.imageUrl : abs(params.imageUrl);
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

  const graph: unknown[] = [blogPosting, breadcrumb];

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
