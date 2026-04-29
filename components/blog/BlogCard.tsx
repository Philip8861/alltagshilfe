import Image from "next/image";
import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog/types";

type Props = {
  post: BlogPostMeta;
  categoryTitle: string;
  featured?: boolean;
  /** Badge neben der Kategorie, wenn „featured“ (z. B. Blog-Übersicht vs. Kategorieseite) */
  featuredBadgeLabel?: string;
};

function fmtDeDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "long", year: "numeric" }).format(
      new Date(iso),
    );
  } catch {
    return iso;
  }
}

export function BlogCard({ post, categoryTitle, featured, featuredBadgeLabel }: Props) {
  return (
    <article
      className={`group rounded-2xl border border-[#0F4F68]/12 bg-white p-5 shadow-sm transition hover:border-[#0F4F68]/25 hover:shadow-md ${
        featured ? "ring-1 ring-[#F78F2E]/35" : ""
      }`}
    >
      {post.heroImage ? (
        <Link href={`/blog/${post.slug}`} className="relative -mx-5 -mt-5 mb-4 block aspect-[21/9] overflow-hidden rounded-t-2xl sm:aspect-[2.4/1]">
          <Image
            src={post.heroImage.src}
            alt={post.heroImage.alt}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, min(672px, 90vw)"
            priority={featured}
          />
        </Link>
      ) : null}
      <div className="flex flex-wrap items-center gap-2 gap-y-2 text-xs text-neutral-600">
        <span className="rounded-full bg-[#0F4F68]/10 px-2.5 py-1 font-semibold text-[#0F4F68]">{categoryTitle}</span>
        {featured ? (
          <span className="rounded-full bg-[#F78F2E]/15 px-2.5 py-1 font-semibold text-[#A3560D]">
            {featuredBadgeLabel ?? "Aktueller Schwerpunkt"}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1" title="Stand der Aktualität">
          <time dateTime={post.updatedAt}>{fmtDeDate(post.updatedAt)}</time>
        </span>
        <span aria-hidden>·</span>
        <span>{post.readMinutes} Min. Lesezeit</span>
      </div>
      <h2 className="mt-3 font-heading text-lg font-bold text-[#0F4F68] md:text-xl">
        <Link href={`/blog/${post.slug}`} className="hover:underline">
          {post.title}
        </Link>
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-neutral-700">{post.excerpt}</p>
      <p className="mt-4">
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#F78F2E] hover:underline focus:outline-none focus:ring-2 focus:ring-[#F78F2E]/50 focus:ring-offset-2"
        >
          Artikel lesen <span aria-hidden>→</span>
        </Link>
      </p>
    </article>
  );
}
