"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { RATGEBER_BEITRAEGE } from "@/config/ratgeber-betraege";

export function RatgeberUebersicht() {
  const [query, setQuery] = useState("");

  const alphabetischSortiert = useMemo(
    () =>
      [...RATGEBER_BEITRAEGE].sort((a, b) =>
        a.title.localeCompare(b.title, "de", { sensitivity: "base" })
      ),
    []
  );

  const gefilterteBeitraege = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("de");
    if (!q) return alphabetischSortiert;

    return alphabetischSortiert.filter((beitrag) => {
      const haystack = [beitrag.title, beitrag.excerpt, beitrag.tags.join(" ")].join(" ").toLocaleLowerCase("de");
      return haystack.includes(q);
    });
  }, [alphabetischSortiert, query]);

  const meistgesehen = useMemo(() => {
    return [...RATGEBER_BEITRAEGE].sort((a, b) => b.views - a.views).slice(0, 5);
  }, []);

  return (
    <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="rounded-3xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#0F4F68]">Alle Ratgeber</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Finden Sie schnell, was Sie brauchen. Aktuell {gefilterteBeitraege.length} Beitrag/Beiträge.
            </p>
          </div>

          <label className="w-full sm:w-[320px]">
            <span className="mb-1.5 block text-sm font-semibold text-[#0F4F68]/85">Suche</span>
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0F4F68]/70"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="z.B. Pflegegrad 1, Entlastungsbetrag, MDK..."
                className="w-full rounded-xl border border-[#0F4F68]/20 bg-white py-2.5 pl-10 pr-3 text-sm text-neutral-900 outline-none transition focus:border-[#0F4F68] focus:ring-2 focus:ring-[#0F4F68]/15"
                aria-label="Ratgeber nach Suchbegriff suchen"
              />
            </div>
          </label>
        </div>

        {gefilterteBeitraege.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-[#0F4F68]/10 bg-[#F2F9FA]/40 p-5 text-neutral-700">
            Keine Treffer für „{query}“. Versuchen Sie einen anderen Begriff.
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {gefilterteBeitraege.map((beitrag) => (
              <li key={beitrag.slug}>
                <Link
                  href={`/ratgeber/${beitrag.slug}`}
                  className="group flex items-start gap-4 rounded-2xl border border-[#0F4F68]/10 bg-[#F2F9FA]/30 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0F4F68]/25 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#0F4F68]/10 bg-white">
                    <Image
                      src={beitrag.image}
                      alt={beitrag.imageAlt}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#0F4F68]/10 px-3 py-0.5 text-xs font-bold text-[#0F4F68]">
                        Ratgeber
                      </span>
                      <span className="text-xs font-semibold text-[#0F4F68]/70">
                        {beitrag.views.toLocaleString("de-DE")} Aufrufe
                      </span>
                    </div>

                    <h3 className="mt-2 line-clamp-2 text-lg font-bold text-[#0F4F68]">{beitrag.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-700">{beitrag.excerpt}</p>

                    <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0F4F68]">
                      Beitrag lesen
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="M5 12h14" />
                        <path d="M13 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <aside className="rounded-3xl border border-[#0F4F68]/10 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-[#0F4F68]">Beliebt</h2>
            <p className="mt-1 text-sm text-neutral-600">Die meistgelesenen Ratgeber</p>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-[#F78F2E]/15 flex items-center justify-center border border-[#F78F2E]/25" aria-hidden>
            <svg className="h-5 w-5 text-[#F78F2E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-7z" />
            </svg>
          </div>
        </div>

        <ul className="mt-6 space-y-3">
          {meistgesehen.map((beitrag, index) => (
            <li key={`top-${beitrag.slug}`}>
              <Link
                href={`/ratgeber/${beitrag.slug}`}
                className="group flex items-start justify-between gap-4 rounded-2xl border border-[#0F4F68]/10 bg-[#F2F9FA]/25 p-4 transition hover:-translate-y-0.5 hover:border-[#0F4F68]/25 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
              >
                <div className="min-w-0">
                  <p className="text-xs font-extrabold uppercase tracking-wide text-[#F78F2E]">
                    Top {index + 1}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#0F4F68] line-clamp-2">{beitrag.title}</p>
                  <p className="mt-2 text-xs text-neutral-600">
                    {beitrag.views.toLocaleString("de-DE")} Aufrufe
                  </p>
                </div>

                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#0F4F68]/10 bg-white">
                  <Image src={beitrag.image} alt={beitrag.imageAlt} fill className="object-cover" sizes="48px" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}

