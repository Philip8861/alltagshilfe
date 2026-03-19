import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getStandortBySlug } from "@/config/standorte";
import { siteConfig } from "@/config/site";

const LEISTUNGEN = [
  "Haushaltshilfe",
  "Pflegeberatung nach §37.3 SGB XI",
  "Kostenfreie Pflegehilfsmittel",
];

/** Für den Test: nur einen Standort vorab generieren. Später: getAllStandortSlugs() für alle PLZ/Orte. */
export async function generateStaticParams() {
  return [{ slug: "87700-memmingen" }];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = getStandortBySlug(slug);
  if (!data) return { title: "Standort" };
  const title = `Haushaltshilfe in ${data.plz} ${data.ort} | ${siteConfig.name}`;
  const description = `Haushaltshilfe, Pflegeberatung und Pflegehilfsmittel in ${data.ort}. Ihr Ansprechpartner: ${data.standort.name}.`;
  return { title, description };
}

export default async function StandortSlugPage({ params }: Props) {
  const { slug } = await params;
  const data = getStandortBySlug(slug);
  if (!data) notFound();

  const { plz, ort, standort } = data;

  return (
    <article
      className="min-h-[60vh] w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14"
      style={{ backgroundColor: "#fafbfc" }}
    >
      <nav className="mb-8" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-neutral-600">
          <li>
            <Link
              href="/standorte"
              className="text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded"
            >
              Standorte
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="font-medium text-neutral-900" aria-current="page">
            {plz} {ort}
          </li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold text-[#0F4F68] sm:text-4xl mb-6">
        Haushaltshilfe in {plz} {ort}
      </h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#0F4F68] mb-4">
          Folgende Leistungen bieten wir hier an:
        </h2>
        <ul className="space-y-3">
          {LEISTUNGEN.map((leistung) => (
            <li key={leistung} className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F78F2E] text-white"
                aria-hidden
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className="text-neutral-800">{leistung}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-[#0F4F68]/15 bg-[#F2F9FA] p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-[#0F4F68] mb-4">
          Kontakt – {standort.name}
        </h2>
        <div className="flex flex-col gap-4 sm:gap-5">
          <div>
            <span className="block text-sm font-medium text-neutral-600 mb-1">Telefon</span>
            <a
              href={standort.phoneHref}
              className="text-xl font-bold text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded"
            >
              {standort.phone}
            </a>
          </div>
          <div>
            <span className="block text-sm font-medium text-neutral-600 mb-1">E-Mail</span>
            <a
              href={`mailto:${standort.email}`}
              className="text-lg font-semibold text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 rounded break-all"
            >
              {standort.email}
            </a>
          </div>
        </div>
      </section>

      <p className="mt-8 text-center">
        <Link
          href="/standorte"
          className="inline-flex items-center justify-center rounded-xl bg-[#0F4F68] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
        >
          Zurück zur Standortsuche
        </Link>
      </p>
    </article>
  );
}
