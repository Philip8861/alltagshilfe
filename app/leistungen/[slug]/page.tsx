import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import leistungenData from "@/content/leistungen.json";

type Section = { title?: string; text?: string; bullets?: string[] };
type LeistungItem = {
  slug: string;
  title: string;
  description: string;
  intro?: string;
  sections?: Section[];
  highlight?: string;
};

type Props = { params: Promise<{ slug: string }> };

/** Slugs mit eigener Route unter `app/leistungen/<slug>/page.tsx` (Landing mit Hero & Sektionen). */
const SLUGS_WITH_DEDICATED_PAGE = new Set(["haushaltshilfe", "alltagsbegleitung-betreuung"]);

export async function generateStaticParams() {
  return (leistungenData as LeistungItem[])
    .filter((item) => !SLUGS_WITH_DEDICATED_PAGE.has(item.slug))
    .map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = (leistungenData as LeistungItem[]).find((l) => l.slug === slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.description,
  };
}

export default async function LeistungPage({ params }: Props) {
  const { slug } = await params;
  const item = (leistungenData as LeistungItem[]).find((l) => l.slug === slug);
  if (!item) notFound();

  return (
    <article className="py-16 sm:py-24">
      <Container>
        <Link
          href="/#unsere-leistungen"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded"
        >
          ← Zurück zur Leistungsübersicht
        </Link>

        <header className="mt-6">
          <h1 className="text-3xl font-bold tracking-tight text-[#0F4F68] sm:text-4xl">
            {item.title}
          </h1>
          <p className="mt-2 text-lg text-neutral-600">{item.description}</p>
          {item.highlight && (
            <div className="mt-4 inline-block rounded-xl bg-[#F78F2E]/15 px-4 py-2 text-sm font-semibold text-[#0F4F68]">
              {item.highlight}
            </div>
          )}
        </header>

        <div className="mt-10 max-w-3xl space-y-10">
          {item.intro && (
            <p className="text-neutral-700 leading-relaxed">{item.intro}</p>
          )}

          {item.sections?.map((section, idx) => (
            <section key={idx} className="space-y-3">
              {section.title && (
                <h2 className="text-xl font-semibold text-[#0F4F68]">
                  {section.title}
                </h2>
              )}
              {section.text && (
                <p className="text-neutral-700 leading-relaxed">{section.text}</p>
              )}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="list-none space-y-2 pl-0">
                  {section.bullets.map((bullet, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-neutral-700"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F4F68]"
                        aria-hidden
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </Container>
    </article>
  );
}
