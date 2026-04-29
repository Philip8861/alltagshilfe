import { RATGEBER_BEITRAEGE } from "@/config/ratgeber-betraege";
import type { BlogPostMeta } from "@/lib/blog/types";
import { BLOG_POSTS } from "@/lib/blog/posts-data";

const MAX_RELATED = 6;

/** Verwandte Blog-Posts: gleiche Kategorie, dann gemeinsame Tags; aktuellen Slug ausschließen. */
export function getRelatedBlogPosts(current: BlogPostMeta, limit = MAX_RELATED): BlogPostMeta[] {
  const others = BLOG_POSTS.filter((p) => p.slug !== current.slug);
  const cat = current.categorySlug;
  const sameCat = others.filter((p) => p.categorySlug === cat);
  const tagSet = new Set(current.tags);
  const scored = [...sameCat].map((p) => ({
    p,
    score: p.tags.reduce((acc, t) => acc + (tagSet.has(t) ? 2 : 0), 0),
  }));
  scored.sort((a, b) => b.score - a.score || b.p.updatedAt.localeCompare(a.p.updatedAt));
  let out = scored.map((s) => s.p);
  if (out.length < limit) {
    const rest = others.filter((o) => !out.includes(o));
    out = [...out, ...rest];
  }
  return out.slice(0, limit);
}

export type RatgeberCrossCard = {
  slug: string;
  title: string;
  excerpt: string;
};

/**
 * Pflege-Themen aus dem bestehenden Ratgeber (/ratgeber), die zur Artikel-Reise passen –
 * nur bereits veröffentlichte Slugs, keine Platzhalter-URLs.
 */
export function getSuggestedRatgeberForPflegegradPage(): RatgeberCrossCard[] {
  const wantSlugs = new Set([
    "pflegegrad-1-der-ultimative-leitfaden",
    "pflegegrad-2-alles-was-du-wissen-musst",
    "entlastungsbetrag-131-euro",
    "pflegegrad-beantragen-checkliste",
  ]);
  return RATGEBER_BEITRAEGE.filter((b) => wantSlugs.has(b.slug)).map((b) => ({
    slug: b.slug,
    title: b.title,
    excerpt: b.excerpt,
  }));
}
