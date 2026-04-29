import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import { PflegegradBeantragen2026Article } from "@/components/blog/PflegegradBeantragen2026Article";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/config/site";
import { RATGEBER_BEITRAEGE } from "@/config/ratgeber-betraege";
import { getCategoryBySlug } from "@/lib/blog/categories";
import { serializeBlogArticleJsonLd } from "@/lib/blog/json-ld";
import { getBlogPostBySlug, getAllBlogSlugParams } from "@/lib/blog/posts-data";

type Props = { params: Promise<{ slug: string }> };

const FAQ_JSON_LD: { question: string; answer: string }[] = [
  {
    question: "Wie beantrage ich einen Pflegegrad?",
    answer:
      "Der Antrag geht über Ihre Pflegekasse – je nach Einrichtung formlos, telefonisch, schriftlich oder über ein Online‑Portal.",
  },
  {
    question: "Wer darf einen Pflegegrad beantragen?",
    answer:
      "Betroffene Versichertenperson eigenständig oder Bevollmächtige bzw. Vollmacht mit nachgewiesener Vertretungsbefugnis.",
  },
  {
    question: "Ab wann stehen Leistungen zu?",
    answer:
      "Im Regelfall richtet sich der Beginn nach Bescheid und individuellen Voraussetzungen.",
  },
  {
    question: "Wie lange dauert die Entscheidung?",
    answer:
      "Es gelten beschleunigte Bearbeitungsfristen gegenüber Pflegekassen gesetzlich geregelte Eckwerte – Rückfragen direkt dort.",
  },
  {
    question: "Was evaluieren Medizinischer Dienst / MDK?",
    answer:
      "Die Selbstständigkeit in konkreten Alltagshandlungen strukturiert dokumentiert – keine Diagnoseisolation.",
  },
  {
    question: "Was tun bei Ablehnung oder zu niedriger Bewertung?",
    answer:
      "Aktenstände dokumentieren und Bescheid fristbewusst weiter prüfen, ggf. qualifiziert begleitenden Widerspruch erwägen.",
  },
  {
    question: "Kann schon Pflegegrad 1 angemessen sein?",
    answer:
      "Ja, bereits geringe Beeinträchtigung kann ausreichender Ausgangspunkt sein – konkrete Kombination liegt im Gutachtenbescheid.",
  },
  {
    question: "Welche Unterlagen zählen besonders?",
    answer:
      "Medizinische Verläufe, Pflegetagebuch, konkrete Alltagsliste, strukturierte Medikationsüberblick und Vollmachten.",
  },
  {
    question: "Muss beim MD‑Termin alles demonstriert werden?",
    answer:
      "Realistik und Transparenz statt choreografischer Inszenierung – konkrete Schilderungen statt Schönfärbung.",
  },
  {
    question: "Kann strukturelle Antragshilfe holen?",
    answer:
      "Ja – über Pflegeberatungen, Unterstützungspfad regionaler Standorte oder dokumentierte Fremdeinbindungen qualifiziert strukturieren.",
  },
];

export async function generateStaticParams() {
  return getAllBlogSlugParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  const url = `/blog/${post.slug}`;
  return {
    title: post.seoTitle,
    description: post.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: post.seoTitle,
      description: post.metaDescription,
      url,
      locale: siteConfig.locale === "de" ? "de_DE" : siteConfig.locale,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.metaDescription,
    },
  };
}

function RelatedRatgeberStrip() {
  const slugs = new Set(["entlastungsbetrag-131-euro", "pflegegrad-1-der-ultimative-leitfaden", "pflegegrad-beantragen-checkliste"]);
  const hits = RATGEBER_BEITRAEGE.filter((r) => slugs.has(r.slug));
  return (
    <aside className="mt-14 rounded-2xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#0F4F68]">Passende Themen aus unserem Ratgeber</h2>
      <p className="mt-2 text-sm text-neutral-600">
        Vertiefungen und bereits veröffentlichte Artikel rund um Pflegegrade und Entlastung.
      </p>
      <ul className="mt-5 divide-y divide-[#0F4F68]/10">
        {hits.map((r) => (
          <li key={r.slug} className="py-4 first:pt-0">
            <Link href={`/ratgeber/${r.slug}`} className="font-semibold text-[#0F4F68] underline-offset-4 hover:underline">
              {r.title}
            </Link>
            <p className="mt-2 text-sm text-neutral-700">{r.excerpt}</p>
          </li>
        ))}
      </ul>
      <Link href="/ratgeber" className="mt-4 inline-flex text-sm font-semibold text-[#F78F2E] hover:underline">
        Zum gesamten Ratgeberbereich →
      </Link>
    </aside>
  );
}

export default async function BlogSlugPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  let body: ReactNode = null;
  if (post.slug === "pflegegrad-beantragen-2026") {
    body = <PflegegradBeantragen2026Article />;
  }

  if (!body) notFound();

  const cat = getCategoryBySlug(post.categorySlug);
  const breadcrumbs = [
    { name: "Start", path: "/" },
    { name: "Pflege‑Blog", path: "/blog" },
    ...(cat ? [{ name: cat.title, path: `/blog/kategorie/${cat.slug}` }] : []),
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  const jsonLd = serializeBlogArticleJsonLd({
    headline: post.h1Title,
    description: post.metaDescription,
    articleUrlPath: `/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    imageUrl: post.heroImage?.src,
    breadcrumbs,
    faq: slug === "pflegegrad-beantragen-2026" ? FAQ_JSON_LD : [],
  });

  return (
    <article className="min-w-0 bg-[#FFFBF7] pb-16 pt-6 sm:pb-24 sm:pt-10">
      <Container className="max-w-3xl">
        <nav aria-label="Brotkrumen" className="text-sm text-neutral-600 mb-8">
          <ol className="flex flex-wrap gap-1">
            {breadcrumbs.map((b, i) => (
              <li key={b.path + b.name} className="contents">
                {i > 0 ? <span aria-hidden> / </span> : null}
                {i === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-[#0F4F68]">{b.name}</span>
                ) : (
                  <Link href={b.path} className="text-[#0F4F68] underline-offset-4 hover:underline">
                    {b.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <BlogArticleHero post={post} />

        <div className="mt-10 space-y-10">{body}</div>

        <RelatedRatgeberStrip />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Container>
    </article>
  );
}
