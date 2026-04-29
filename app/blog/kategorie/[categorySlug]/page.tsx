import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogCard } from "@/components/blog/BlogCard";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";
import { getCategoryBySlug, getCategorySlugList } from "@/lib/blog/categories";
import { getPostsInCategory } from "@/lib/blog/helpers";

type Props = { params: Promise<{ categorySlug: string }> };

export function generateStaticParams() {
  return getCategorySlugList().map((categorySlug) => ({ categorySlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const cat = getCategoryBySlug(categorySlug);
  if (!cat) return {};

  const canonical = `${siteConfig.baseUrl}/blog/kategorie/${cat.slug}`;
  return {
    title: cat.seoTitle,
    description: cat.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: cat.seoTitle,
      description: cat.metaDescription,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale === "de" ? "de_DE" : siteConfig.locale,
      type: "website",
    },
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { categorySlug } = await params;
  const cat = getCategoryBySlug(categorySlug);
  if (!cat) notFound();

  const posts = getPostsInCategory(cat.slug).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const topSlug = cat.featuredPostSlug;
  const topPost =
    topSlug ? posts.find((p) => p.slug === topSlug) : undefined;
  const listPosts = topPost ? posts.filter((p) => p.slug !== topPost.slug) : posts;

  const serviceLinks =
    cat.slug === "pflegegrad-leistungen"
      ? [
          { href: "/pflegeberatung/private-pflegeberatung", label: "Pflegeberatungseinsatz (§37.3)" },
          { href: "/leistungen/haushaltshilfe", label: "Haushaltshilfe" },
        ]
      : cat.slug === "haushaltshilfe-entlastungsbetrag"
        ? [
            { href: "/leistungen/haushaltshilfe", label: "Haushaltshilfe" },
            { href: "/leistungen/alltagsbegleitung-betreuung", label: "Alltagsbegleitung & Betreuung" },
          ]
        : cat.slug === "pflegehilfsmittel-42-euro"
          ? [
              { href: "/pflegehilfsmittel/kostenfreie-pflegehilfsmittel", label: "Kostenfreie Pflegehilfsmittelbox" },
              { href: "/pflegeshop", label: "Pflegeshop" },
            ]
          : cat.slug === "inkontinenzversorgung"
            ? [{ href: "/inkontinenzversorgung", label: "Inkontinenzversorgung übersicht" }]
            : cat.slug === "pflegeberatung"
              ? [{ href: "/pflegeberatung", label: "Pflegeberatung" }]
              : cat.slug === "regionale-hilfe"
                ? [{ href: "/standorte", label: "Standorte & Einzugsgebiet" }]
                : [{ href: "/kontakt", label: "Kontakt aufnehmen" }];

  return (
    <article className="min-w-0 bg-[#FFFBF7] pb-16 pt-0 sm:pb-24">
      <Container>
        <nav aria-label="Brotkrumen" className="py-12 text-sm text-neutral-600 sm:pt-16">
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
            <li>
              <Link href="/blog" className="text-[#0F4F68] underline-offset-4 hover:underline">
                Pflege‑Blog
              </Link>
            </li>
            <li className="contents">
              <span aria-hidden className="px-1">
                /
              </span>
            </li>
            <li className="font-medium text-[#0F4F68]">{cat.title}</li>
          </ol>
        </nav>

        <header className="max-w-3xl">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#0F4F68] md:text-[2.05rem]">{cat.title}</h1>
          <p className="mt-4 text-pretty leading-relaxed text-neutral-700">{cat.shortIntro}</p>
        </header>

        {topPost ? (
          <section aria-labelledby="blog-kategorie-top-heading" className="mt-12 max-w-4xl" id="top-thema">
            <p
              id="blog-kategorie-top-heading"
              className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 sm:text-sm"
            >
              Top-Thema
            </p>
            <div className="mt-4">
              <BlogCard
                post={topPost}
                categoryTitle={cat.title}
                featured
                featuredBadgeLabel="Top-Thema"
              />
            </div>
          </section>
        ) : null}

        {listPosts.length > 0 ? (
          <div className={topPost ? "mt-14" : "mt-12"}>
            {topPost ? (
              <h2 className="font-heading text-xl font-bold text-[#0F4F68] sm:text-2xl">Weitere Beiträge</h2>
            ) : null}
            <ul className={`grid list-none gap-8 md:grid-cols-2 ${topPost ? "mt-8" : ""}`}>
              {listPosts.map((post) => (
                <li key={post.slug}>
                  <BlogCard post={post} categoryTitle={cat.title} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {!topPost && posts.length === 0 ? (
          <p className="mt-12 max-w-2xl rounded-2xl border border-[#0F4F68]/12 bg-white p-6 text-neutral-700 shadow-sm">
            In dieser Kategorie liegt noch kein veröffentlichter Pflege‑Blog‑Beitrag vor. Für vertiefende Themen schauen Sie
            gern in den{" "}
            <Link href="/ratgeber" className="font-semibold text-[#0F4F68] underline-offset-4 hover:underline">
              Ratgeber
            </Link>{" "}
            oder unser{" "}
            <Link href="/blog" className="font-semibold text-[#0F4F68] underline-offset-4 hover:underline">
              Blog-Archiv
            </Link>
            .
          </p>
        ) : null}

        <section aria-labelledby="cat-services" className="mt-14 max-w-2xl">
          <h2 id="cat-services" className="font-heading text-xl font-bold text-[#0F4F68]">
            Passende Angebote
          </h2>
          <ul className="mt-4 list-none space-y-2">
            {serviceLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="font-semibold text-[#F78F2E] underline-offset-4 hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </article>
  );
}
