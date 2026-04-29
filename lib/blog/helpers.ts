import type { BlogCategorySlug } from "@/lib/blog/types";
import { BLOG_POSTS } from "@/lib/blog/posts-data";

export function getPostsInCategory(categorySlug: BlogCategorySlug) {
  return BLOG_POSTS.filter((p) => p.categorySlug === categorySlug);
}
