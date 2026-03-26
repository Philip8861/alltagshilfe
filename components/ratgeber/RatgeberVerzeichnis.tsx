"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

type Beitrag = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  views: number;
  tags: string[];
};

const BEITRAEGE: Beitrag[] = [
  {
    slug: "entlastungsbetrag-131-euro",
    title: "Entlastungsbetrag 131 Euro: so nutzen Sie Ihren Anspruch richtig",
    excerpt:
      "Wer Anspruch hat, welche Leistungen bezahlt werden, wie lange ungenutzte Beträge gültig sind und wie die Abrechnung mit der Pflegekasse funktioniert.",
    image: "/images/Ratgeber/ratgeber.webp",
    imageAlt: "Vorschaubild Entlastungsbetrag 131 Euro",
    views: 1284,
    tags: ["Entlastungsbetrag", "Pflegekasse", "Abrechnung", "Pflegegrad"],
  },
  {
    slug: "pflegegrad-1-der-ultimative-leitfaden",
    title: "Pflegegrad 1: der ultimative Leitfaden (2026)",
    excerpt: "Leistungen, Voraussetzungen & Experten-Tipps – inklusive Vorbereitung auf die MDK-Begutachtung.",
    image: "/images/Ratgeber/ratgeber.webp",
    imageAlt: "Vorschaubild Pflegegrad 1 Leitfaden",
    views: 623,
    tags: ["Pflegegrad 1", "MDK", "Begutachtung", "Leistungen", "Entlastungsbetrag"],
  },
];

export function RatgeberVerzeichnis() {
  const [query, setQuery] = useState("");

  const alphabetischSortiert = useMemo(
    () =>
      [...BEITRAEGE].sort((a, b) =>
        a.title.localeCompare(b.title, "de", { sensitivity: "base" })
      ),
    []
  );

  const gefilterteBeitraege = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("de");
    if (!q) return alphabetischSortiert;
    return alphabetischSortiert.filter((beitrag) => {
      const haystack = [
        beitrag.title,
        beitrag.excerpt,
        beitrag.tags.join(" "),
      ]
        .join(" ")
        .toLocaleLowerCase("de");
      return haystack.includes(q);
    });
  }, [alphabetischSortiert, query]);

  const meistgesehen = useMemo(
    () => [...BEITRAEGE].sort((a, b) => b.views - a.views).slice(0, 5),
    []
  );

  return (
    <section className="mt-10 grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-2xl border border-[#0F4F68]/10 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl font-bold text-[#0F4F68]">Beitragsverzeichnis</h2>
          <label className="w-full sm:w-[320px]">
            <span className="mb-1.5 block text-sm font-semibold text-[#0F4F68]/85">
              Beitrag suchen
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Suchbegriff eingeben..."
              className="w-full rounded-xl border border-[#0F4F68]/20 bg-white px-3 py-2 text-sm text-neutral-800 outline-none transition focus:border-[#0F4F68] focus:ring-2 focus:ring-[#0F4F68]/15"
            />
          </label>
        </div>

        <p className="mt-3 text-sm text-neutral-600">
          Alle Beiträge sind alphabetisch sortiert. Aktuell {gefilterteBeitraege.length} Beitrag/Beiträge gefunden.
        </p>

        <ul className="mt-5 space-y-4">
          {gefilterteBeitraege.map((beitrag) => (
            <li key={beitrag.slug} className="rounded-xl border border-[#0F4F68]/10 bg-[#F2F9FA]/45 p-4 transition hover:shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative h-24 w-full overflow-hidden rounded-lg sm:h-20 sm:w-36">
                  <Image src={beitrag.image} alt={beitrag.imageAlt} fill className="object-cover" sizes="144px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#0F4F68]/80">Ratgeber</p>
                  <h3 className="mt-1 text-lg font-bold text-[#0F4F68]">{beitrag.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-700">{beitrag.excerpt}</p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-[#0F4F68]/75">{beitrag.views.toLocaleString("de-DE")} Aufrufe</span>
                    <Link
                      href={`/ratgeber/${beitrag.slug}`}
                      className="inline-flex items-center rounded-lg bg-[#0F4F68] px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#0c3d52]"
                    >
                      Lesen
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="h-fit rounded-2xl border border-[#0F4F68]/10 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-[#0F4F68]">Meistgesehene Beiträge</h2>
        <ul className="mt-4 space-y-3">
          {meistgesehen.map((beitrag, index) => (
            <li key={`top-${beitrag.slug}`} className="rounded-xl border border-[#0F4F68]/10 bg-[#F2F9FA]/45 p-3">
              <p className="text-xs font-bold text-[#F78F2E]">Top {index + 1}</p>
              <Link href={`/ratgeber/${beitrag.slug}`} className="mt-1 block text-sm font-semibold text-[#0F4F68] hover:underline">
                {beitrag.title}
              </Link>
              <p className="mt-1 text-xs text-neutral-600">{beitrag.views.toLocaleString("de-DE")} Aufrufe</p>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
