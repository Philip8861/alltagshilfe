import Link from "next/link";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogCategoryCard } from "@/components/blog/BlogCategoryCard";
import { Container } from "@/components/layout/Container";
import { BLOG_CATEGORIES } from "@/lib/blog/categories";
import { getAllBlogPostsSorted } from "@/lib/blog/posts-data";
import type { BlogPostMeta } from "@/lib/blog/types";

const FEATURED_SLUG = "pflegegrad-beantragen-2026";

const CATEGORY_GRID_ORDER = [
  "pflegegrad-leistungen",
  "haushaltshilfe-entlastungsbetrag",
  "pflegehilfsmittel-42-euro",
  "inkontinenzversorgung",
  "pflegeberatung",
  "pflegende-angehoerige",
  "pflegealltag-zu-hause",
  "downloads-checklisten",
  "regionale-hilfe",
] as const;

function categoryTitleForSlug(slug: BlogPostMeta["categorySlug"]) {
  const c = BLOG_CATEGORIES.find((x) => x.slug === slug);
  return c?.title ?? slug;
}

export function BlogOverview() {
  const sorted = getAllBlogPostsSorted();
  const featured = sorted.find((p) => p.slug === FEATURED_SLUG) ?? sorted[0];
  const remaining = sorted.filter((p) => p.slug !== featured?.slug);

  const gridCategories = CATEGORY_GRID_ORDER.map((slug) =>
    BLOG_CATEGORIES.find((c) => c.slug === slug),
  ).filter(Boolean) as typeof BLOG_CATEGORIES;

  return (
    <article className="min-w-0 bg-[#FFFBF7] pb-16 pt-0 sm:pb-24">
      <Container>
        <header className="py-12 sm:py-16">
          <nav aria-label="Brotkrumen" className="text-sm text-neutral-600 mb-8">
            <ol className="flex flex-wrap gap-1">
              <li>
                <Link href="/" className="text-[#0F4F68] underline-offset-4 hover:underline">
                  Startseite
                </Link>
              </li>
              <li className="contents">
                <span aria-hidden className="px-1">
                  /
                </span>
              </li>
              <li className="font-medium text-[#0F4F68]">Pflege‑Blog</li>
            </ol>
          </nav>
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.12em] text-[#0F4F68]/85">
            Ratgeber &amp; Orientierung
          </p>
          <h1 className="font-heading mt-3 text-balance text-3xl font-bold tracking-tight text-[#0F4F68] md:text-[2.05rem]">
            Pflege-Ratgeber für Angehörige und pflegebedürftige Menschen
          </h1>
          <p className="mt-4 max-w-3xl text-pretty leading-relaxed text-neutral-700">
            Hier finden Sie sorgfältig recherchierte Hilfestellungen rund um Pflegegrad, Begutachtung, Versorgungsbausteine
            und den Alltag zu Hause. Die Texte ergänzen unser{" "}
            <Link href="/ratgeber" className="font-semibold text-[#0F4F68] underline-offset-4 hover:underline">
              Ratgeber-Archiv
            </Link>{" "}
            – mit klarem Fokus auf verständliche Schritt-für-Schritt-Orientierung, ohne dünne Keyword-Seiten.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/pflegeberatung"
              className="inline-flex min-h-[44px] min-w-[220px] items-center justify-center rounded-xl bg-[#F78F2E] px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#ea8230] focus:outline-none focus:ring-2 focus:ring-[#F78F2E]/60 focus:ring-offset-2"
            >
              Pflegeberatung anfragen
            </Link>
            <Link
              href="/standorte"
              className="inline-flex min-h-[44px] min-w-[200px] items-center justify-center rounded-xl border border-[#0F4F68]/25 bg-white px-5 py-3 text-base font-semibold text-[#0F4F68] transition hover:bg-white/95 focus:outline-none focus:ring-2 focus:ring-[#0F4F68]/35 focus:ring-offset-2"
            >
              Einzugsgebiet prüfen
            </Link>
          </div>
        </header>

        {featured ? (
          <section aria-labelledby="blog-featured-heading">
            <h2 id="blog-featured-heading" className="sr-only">
              Aktueller Schwerpunkttext
            </h2>
            <BlogCard post={featured} categoryTitle={categoryTitleForSlug(featured.categorySlug)} featured />
          </section>
        ) : null}

        {remaining.length > 0 ? (
          <section aria-labelledby="blog-recent-heading" className={featured ? "mt-14 sm:mt-16" : "mt-0"}>
            <h2 id="blog-recent-heading" className="font-heading text-2xl font-bold text-[#0F4F68]">
              Weitere Beiträge
            </h2>
            <ul className="mt-8 grid list-none gap-8 md:grid-cols-2">
              {remaining.map((post) => (
                <li key={post.slug}>
                  <BlogCard post={post} categoryTitle={categoryTitleForSlug(post.categorySlug)} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="blog-categories-heading" className="mt-14 sm:mt-20">
          <h2 id="blog-categories-heading" className="font-heading text-2xl font-bold text-[#0F4F68]">
            Themen im Pflege-Blog
          </h2>
          <p className="mt-3 max-w-3xl text-pretty text-neutral-700">
            Wählen Sie ein Thema – die Übersichtsseiten verlinken zu allen veröffentlichten Artikeln der jeweiligen Kategorie.
            Regionale PLZ-„Massenseiten“ bauen wir bewusst nicht; stattdessen finden Sie zentrale Hilfe unter{" "}
            <Link href="/standorte" className="font-semibold text-[#0F4F68] underline-offset-4 hover:underline">
              Standorte &amp; Einzugsgebiet
            </Link>
            .
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gridCategories.map((c) => (
              <BlogCategoryCard key={c.slug} slug={c.slug} title={c.title} intro={c.shortIntro} />
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-[#0F4F68]/12 bg-[#0F4F68]/[0.06] px-6 py-8 sm:px-8 sm:mt-20">
          <h2 className="font-heading text-xl font-bold text-[#0F4F68] md:text-2xl">
            Direkter Kontakt zur Pflegeberatung
          </h2>
          <p className="mt-3 max-w-2xl text-neutral-700">
            Haushaltshilfe, Betreuung, Pflegehilfsmittel oder Beratung – wir unterstützen Sie bei den nächsten Schritten für
            Ihre konkrete Situation.
          </p>
          <Link
            href="/kontakt"
            className="mt-6 inline-flex min-h-[44px] min-w-[240px] items-center justify-center rounded-xl bg-[#F78F2E] px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#ea8230] focus:outline-none focus:ring-2 focus:ring-[#F78F2E]/60 focus:ring-offset-2"
          >
            Jetzt Kontakt aufnehmen
          </Link>
        </section>
      </Container>
    </article>
  );
}
