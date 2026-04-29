import Image from "next/image";
import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog/types";
import { getCategoryBySlug } from "@/lib/blog/categories";

type Props = { post: BlogPostMeta };

export function BlogArticleHero({ post }: Props) {
  const cat = getCategoryBySlug(post.categorySlug);
  return (
    <header className="rounded-2xl border border-[#0F4F68]/12 bg-gradient-to-br from-[#fffaf4] via-white to-[#f7fbfc] p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[#0F4F68]">
        {cat ? (
          <Link
            href={`/blog/kategorie/${cat.slug}`}
            className="rounded-full bg-[#0F4F68]/10 px-3 py-1 text-[#0F4F68] transition hover:bg-[#0F4F68]/18"
          >
            {cat.title}
          </Link>
        ) : null}
        {post.subcategoryLabel ? <span className="text-neutral-500">· {post.subcategoryLabel}</span> : null}
      </div>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_minmax(0,0.42fr)] lg:items-start">
        <div>
          <h1 className="text-balance text-3xl font-extrabold leading-tight text-[#0F4F68] sm:text-4xl lg:text-[2.125rem]">
            {post.h1Title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-neutral-700">{post.excerpt}</p>
          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-neutral-600">
            <span>
              Lesedauer: ca.{" "}
              <span className="font-semibold text-[#0F4F68]">{post.readMinutes} Min.</span>
            </span>
            <span aria-hidden>|</span>
            <span>
              Stand:&nbsp;<time dateTime={post.updatedAt}>{new Date(post.updatedAt).toLocaleDateString("de-DE")}</time>
              {" · "}Aktualisiert
            </span>
            <span aria-hidden>|</span>
            <span className="italic">{post.authorName}</span>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/kontakt"
              className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-[#F78F2E] px-6 py-3 text-base font-bold text-white shadow hover:bg-[#e67e22] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4F68]"
            >
              Pflegeberatung anfragen
            </Link>
            <Link
              href="#download-heading"
              className="inline-flex min-h-[46px] items-center justify-center rounded-xl border border-[#0F4F68]/35 bg-white px-6 py-3 text-base font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]"
            >
              Checkliste&nbsp;/ PDF-Hinweis
            </Link>
          </div>
          <div className="mt-8 rounded-xl border border-[#0F4F68]/14 bg-[#F2F9FA]/50 p-4 text-sm leading-relaxed text-neutral-700">
            <strong className="text-[#0F4F68]">Orientierungshinweis:</strong> Hier finden Sie allgemeine, leicht übersetzte
            Information – keine Rechts‑ oder Pflege­kassen­beratung im Einzel­fall. Überprüfen Sie verbindliche Leistungen
            über Bescheid bzw.&nbsp;kassen­spezifische Informationen.
          </div>
        </div>
        {post.heroImage ? (
          <div className="relative mx-auto w-full max-w-sm lg:justify-self-end">
            <div className="relative aspect-[5/4] overflow-hidden rounded-2xl border border-[#0F4F68]/10 shadow-[0_12px_32px_-16px_rgba(15,79,104,0.45)]">
              <Image src={post.heroImage.src} alt={post.heroImage.alt} fill className="object-cover object-center" sizes="384px" priority />
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
