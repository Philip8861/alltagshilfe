import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

type LandingPageProps = {
  title: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
};

async function getLandingContent(slug: string): Promise<LandingPageProps | null> {
  try {
    const data = await import(`@/content/landing/${slug}.json`);
    return data.default as LandingPageProps;
  } catch {
    return null;
  }
}

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [{ slug: "example" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getLandingContent(slug);
  if (!data) return {};
  return {
    title: data.title,
    description: data.description,
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  };
}

export default async function LandingPage({ params }: Props) {
  const { slug } = await params;
  const data = await getLandingContent(slug);
  if (!data) notFound();

  return (
    <article className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {data.heroTitle}
          </h1>
          <p className="mt-4 text-lg text-neutral-600">{data.heroSubtitle}</p>
          <div className="mt-10">
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-6 py-3 font-medium text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
            >
              {data.ctaText}
            </Link>
          </div>
        </div>
      </Container>
    </article>
  );
}
