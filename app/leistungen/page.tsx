import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import leistungenData from "@/content/leistungen.json";
import { siteConfig } from "@/config/site";

type LeistungItem = {
  slug: string;
  title: string;
  description: string;
};

export const metadata: Metadata = {
  title: "Leistungen",
  description: `Unsere Leistungen im Überblick – ${siteConfig.name}. Haushaltshilfe, Betreuung, Pflegeberatung, Pflegehilfsmittelbox, Essen auf Räder, Einkaufsservice und mehr.`,
};

const icons: Record<string, string> = {
  haushaltshilfe: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  "betreuung-beschaeftigung":
    "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
  "pflegeberatung-einsaetze":
    "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  pflegehilfsmittelbox:
    "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  "essen-auf-raeder":
    "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  einkaufsservice:
    "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
  "hilfe-nach-operation":
    "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
};

function CardIcon({ slug }: { slug: string }) {
  const d = icons[slug] || icons.haushaltshilfe;
  return (
    <span
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0F4F68]/10 text-[#0F4F68]"
      aria-hidden
    >
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
      </svg>
    </span>
  );
}

export default function LeistungenPage() {
  const items = leistungenData as LeistungItem[];

  return (
    <article className="overflow-hidden">
      <section className="relative border-b border-[#0F4F68]/15 bg-[#F2F9FA]/60 py-[3.2rem] sm:py-16">
        <Container>
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-[#0F4F68]">
            {siteConfig.name}
          </p>
          <h1 className="mt-3 text-center text-4xl font-bold tracking-tight text-[#0F4F68] sm:text-5xl">
            Unsere Leistungen
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-neutral-600">
            Von der Haushaltshilfe über Betreuung und Pflegeberatung bis zur
            Pflegehilfsmittelbox – wir unterstützen Sie im Alltag.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
          <ul className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/leistungen/${item.slug}`}
                  className="group flex flex-col rounded-2xl border border-[#0F4F68]/15 bg-white p-6 shadow-sm transition-all hover:border-[#0F4F68]/30 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                >
                  <div className="flex items-start gap-4">
                    <CardIcon slug={item.slug} />
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-bold text-[#0F4F68] group-hover:underline">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-[#0F4F68] group-hover:underline">
                    Mehr erfahren
                    <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </article>
  );
}
