import type { BlogPostMeta } from "@/lib/blog/types";

export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: "pflegegrad-beantragen-2026",
    title: "Pflegegrad beantragen 2026: Schritt-für-Schritt-Anleitung für Angehörige",
    h1Title: "Pflegegrad beantragen 2026: Schritt-für-Schritt-Anleitung für Angehörige",
    excerpt:
      "Pflegegrad beantragen 2026: So stellen Angehörige den Antrag richtig. Mit Ablauf, Fristen, MD-/MDK-Begutachtung, Leistungen und Checkliste.",
    seoTitle: "Pflegegrad beantragen 2026: Anleitung, Antrag & Tipps",
    metaDescription:
      "Pflegegrad beantragen 2026: Schritt-für-Schritt-Anleitung für Angehörige. Antrag bei der Pflegekasse, Begutachtung, Leistungen, Fristen und FAQ.",
    categorySlug: "pflegegrad-leistungen",
    subcategoryLabel: "Pflegegrad beantragen",
    tags: [
      "pflegegrad-beantragen",
      "pflegegrad-2026",
      "pflegegrad-antrag",
      "md-begutachtung",
      "mdk-begutachtung",
      "pflegeberatung",
      "pflegeleistungen",
      "angehörige",
      "pflegekasse",
      "entlastungsbetrag",
      "pflegehilfsmittel",
    ],
    primaryKeyword: "pflegegrad beantragen",
    secondaryKeywords: [
      "pflegegrad beantragen 2026",
      "pflegegrad antrag",
      "pflegegrad antrag stellen",
      "pflegegrad beantragen angehörige",
      "mdk begutachtung vorbereiten",
      "pflegegrad leistungen 2026",
    ],
    publishedAt: "2026-01-15",
    updatedAt: "2026-04-29",
    readMinutes: 16,
    authorName: "Redaktion Alltagshilfe-Süd",
    heroImage: {
      src: "/images/Ratgeber/ratgeber.webp",
      alt: "Ratgeber: Pflegegrad beantragen – Antrag, Begutachtung und Leistungen im Überblick",
    },
  },
];

export function getBlogPostBySlug(slug: string): BlogPostMeta | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllBlogPostsSorted(): BlogPostMeta[] {
  return [...BLOG_POSTS].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getAllBlogSlugParams(): { slug: string }[] {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}
