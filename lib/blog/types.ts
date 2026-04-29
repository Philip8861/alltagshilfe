/** Content-Modell Pflege-Blog (/blog – ergänzend zu /ratgeber). */

export type BlogCategorySlug =
  | "pflegegrad-leistungen"
  | "haushaltshilfe-entlastungsbetrag"
  | "pflegehilfsmittel-42-euro"
  | "inkontinenzversorgung"
  | "pflegeberatung"
  | "pflegende-angehoerige"
  | "pflegealltag-zu-hause"
  | "downloads-checklisten"
  | "regionale-hilfe";

export type BlogPostMeta = {
  slug: string;
  /** SEO & Link-Text – kann von der H1 auf der Seite abweichen */
  title: string;
  h1Title: string;
  excerpt: string;
  seoTitle: string;
  metaDescription: string;
  categorySlug: BlogCategorySlug;
  /** z. B. „Pflegegrad beantragen“ */
  subcategoryLabel?: string;
  tags: string[];
  primaryKeyword: string;
  secondaryKeywords: string[];
  publishedAt: string;
  updatedAt: string;
  readMinutes: number;
  /** Anzeige im Hero */
  authorName: string;
  heroImage?: { src: string; alt: string };
};

export type BlogCategoryDef = {
  slug: BlogCategorySlug;
  title: string;
  shortIntro: string;
  seoTitle: string;
  metaDescription: string;
};
