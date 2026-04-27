"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import {
  RATGEBER_BEITRAEGE,
  RATGEBER_CATEGORY_LABELS,
  type RatgeberBeitragMeta,
  type RatgeberCategoryId,
  getFeaturedRatgeberBeitrag,
  primaryCategoryLabel,
} from "@/config/ratgeber-betraege";

type SortMode = "neueste" | "beliebt" | "az";

const NAVY = "#0F4F68";
const CREAM_PAGE = "#FFFBF7";
const ORANGE = "#F78F2E";

const CATEGORY_ORDER: RatgeberCategoryId[] = ["finanzen", "pflege_zuhause", "entlastung", "recht"];

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  );
}

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 6h16v12H4V6z" strokeLinejoin="round" />
      <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeartOutlineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8L12 21l8.8-8.8a5.5 5.5 0 000-7.8z" />
    </svg>
  );
}

function TopicIcon({ kind }: { kind: RatgeberCategoryId }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24" as const, fill: "none" as const, stroke: "currentColor" as const, strokeWidth: 2, "aria-hidden": true as const };
  switch (kind) {
    case "finanzen":
      return (
        <svg {...common}>
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "pflege_zuhause":
      return (
        <svg {...common}>
          <path d="M3 11l9-8 9 8M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "entlastung":
      return (
        <svg {...common}>
          <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8L12 21l8.8-8.8a5.5 5.5 0 000-7.8z" strokeLinejoin="round" />
        </svg>
      );
    case "recht":
      return (
        <svg {...common}>
          <path d="M12 3l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V7l7-4z" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

function matchesCategory(beitrag: RatgeberBeitragMeta, cat: RatgeberCategoryId | "alle"): boolean {
  if (cat === "alle") return true;
  return beitrag.categories.includes(cat);
}

function haystackForBeitrag(beitrag: RatgeberBeitragMeta): string {
  return [beitrag.title, beitrag.excerpt, beitrag.tags.join(" ")].join(" ").toLocaleLowerCase("de");
}

function sortBeitraege(list: RatgeberBeitragMeta[], mode: SortMode): RatgeberBeitragMeta[] {
  const out = [...list];
  if (mode === "neueste") {
    out.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  } else if (mode === "beliebt") {
    out.sort((a, b) => b.views - a.views);
  } else {
    out.sort((a, b) => a.title.localeCompare(b.title, "de", { sensitivity: "base" }));
  }
  return out;
}

const SEARCH_SUGGESTIONS_MAX = 8;

export function RatgeberHub() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<RatgeberCategoryId | "alle">("alle");
  const [sortMode, setSortMode] = useState<SortMode>("neueste");
  const [searchFocused, setSearchFocused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const searchComboRef = useRef<HTMLDivElement>(null);

  const featured = useMemo(() => getFeaturedRatgeberBeitrag(), []);

  const featuredVisible = useMemo(() => {
    if (!matchesCategory(featured, activeCategory)) return false;
    const q = query.trim().toLocaleLowerCase("de");
    if (!q) return true;
    return haystackForBeitrag(featured).includes(q);
  }, [featured, activeCategory, query]);

  const filteredBySearchAndCat = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("de");
    return RATGEBER_BEITRAEGE.filter((b) => matchesCategory(b, activeCategory)).filter((beitrag) => {
      if (!q) return true;
      return haystackForBeitrag(beitrag).includes(q);
    });
  }, [query, activeCategory]);

  /** Vorschläge nur bei eingegebenem Begriff, gleiche Kategorie wie Filter. */
  const searchSuggestions = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("de");
    if (!q) return [];
    return RATGEBER_BEITRAEGE.filter((b) => matchesCategory(b, activeCategory))
      .filter((beitrag) => haystackForBeitrag(beitrag).includes(q))
      .slice(0, SEARCH_SUGGESTIONS_MAX);
  }, [query, activeCategory]);

  useEffect(() => {
    const onDocDown = (e: MouseEvent) => {
      if (!searchComboRef.current?.contains(e.target as Node)) {
        setSearchFocused(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  useEffect(() => {
    setHighlightIndex(-1);
  }, [query, activeCategory]);

  const gridBeitraege = useMemo(() => {
    const list = featuredVisible
      ? filteredBySearchAndCat.filter((b) => b.slug !== featured.slug)
      : filteredBySearchAndCat;
    return sortBeitraege(list, sortMode);
  }, [filteredBySearchAndCat, featured.slug, featuredVisible, sortMode]);

  const beliebtTop = useMemo(
    () => [...RATGEBER_BEITRAEGE].sort((a, b) => b.views - a.views).slice(0, 4),
    [],
  );

  const scrollToAlle = () => {
    document.getElementById("alle-ratgeber")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-w-0">
      {/* Hero: ein Block – Bild vollflächig, Text & Suche wie zuvor darüber */}
      <section className="relative w-full overflow-hidden" aria-labelledby="ratgeber-hub-heading">
        <div className="relative min-h-[13rem] w-full sm:min-h-[15.5rem] md:min-h-[18rem] lg:min-h-[19.5rem]">
          <Image
            src="/images/ratgeber_hintergrund.webp"
            alt=""
            fill
            className="object-cover object-[83%_center] md:object-center"
            sizes="100vw"
            priority
          />
          <div className="relative z-10 mx-auto flex min-h-[13rem] w-full max-w-7xl flex-col justify-between px-4 pb-4 pt-8 sm:min-h-[15.5rem] sm:px-6 sm:pb-5 sm:pt-10 md:min-h-[18rem] lg:min-h-[19.5rem] lg:px-[var(--ahs-page-gutter)] lg:pb-6 lg:pt-12">
            <div className="max-w-4xl">
              <p className="mb-2 flex items-center gap-2 sm:mb-3">
                <HeartOutlineIcon className="shrink-0 text-[#F78F2E]" />
                <span
                  className="text-[0.7rem] font-bold uppercase tracking-[0.18em] sm:text-xs"
                  style={{ color: NAVY }}
                >
                  Wissen, das entlastet
                </span>
              </p>
              <h1
                id="ratgeber-hub-heading"
                className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
                style={{ color: NAVY }}
              >
                Alltagshilfe-Süd Ratgeber
              </h1>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-neutral-700 sm:mt-3 sm:text-lg">
                Praxistipps, Erklärungen und konkrete Hilfen rund um Pflege, Betreuung und Entlastung im Alltag.
              </p>
            </div>

            <form
              className="mt-6 w-full max-w-4xl sm:mt-8"
              onSubmit={(e) => {
                e.preventDefault();
                setSearchFocused(false);
                setHighlightIndex(-1);
                if (highlightIndex >= 0 && searchSuggestions[highlightIndex]) {
                  window.location.assign(`/ratgeber/${searchSuggestions[highlightIndex].slug}`);
                  return;
                }
                scrollToAlle();
              }}
              role="search"
            >
              <div
                ref={searchComboRef}
                className="relative min-w-0"
                role="combobox"
                aria-expanded={searchFocused && query.trim().length > 0}
                aria-controls="ratgeber-search-suggestions"
                aria-haspopup="listbox"
              >
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 z-[1] h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onKeyDown={(e) => {
                    if (!searchSuggestions.length || !query.trim()) return;
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setHighlightIndex((i) => Math.min(i + 1, searchSuggestions.length - 1));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setHighlightIndex((i) => Math.max(i - 1, -1));
                    } else if (e.key === "Escape") {
                      setSearchFocused(false);
                      setHighlightIndex(-1);
                    }
                  }}
                  placeholder="Artikel durchsuchen …"
                  className="h-12 w-full rounded-2xl border border-neutral-200 bg-white py-3 pl-12 pr-[6.25rem] text-sm text-neutral-900 outline-none ring-[#0F4F68]/20 transition placeholder:text-neutral-500 focus:border-[#0F4F68]/35 focus:ring-4 sm:pr-[7rem]"
                  aria-label="Ratgeber durchsuchen"
                  aria-autocomplete="list"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 z-[2] h-9 -translate-y-1/2 rounded-xl px-3 text-sm font-semibold text-white transition hover:opacity-95 active:scale-[0.98] sm:right-2 sm:h-9 sm:px-5"
                  style={{ backgroundColor: NAVY }}
                >
                  Suchen
                </button>
                {searchFocused && query.trim() ? (
                  <div
                    id="ratgeber-search-suggestions"
                    role="listbox"
                    aria-label="Suchvorschläge"
                    className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[min(18rem,50vh)] overflow-y-auto rounded-2xl border border-neutral-200 bg-white py-1 shadow-lg"
                  >
                    {searchSuggestions.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-neutral-600">Keine passenden Artikel.</p>
                    ) : (
                      searchSuggestions.map((beitrag, idx) => (
                        <Link
                          key={beitrag.slug}
                          href={`/ratgeber/${beitrag.slug}`}
                          role="option"
                          aria-selected={idx === highlightIndex}
                          className={`flex flex-col gap-0.5 px-4 py-2.5 text-left text-sm transition hover:bg-[#F2F9FA] ${
                            idx === highlightIndex ? "bg-[#F2F9FA]" : ""
                          }`}
                          onMouseEnter={() => setHighlightIndex(idx)}
                          onClick={() => {
                            setSearchFocused(false);
                            setHighlightIndex(-1);
                          }}
                        >
                          <span className="font-semibold text-[#0F4F68]">{beitrag.title}</span>
                          <span className="line-clamp-1 text-xs text-neutral-600">{primaryCategoryLabel(beitrag)}</span>
                        </Link>
                      ))
                    )}
                  </div>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Themen-Pills */}
      <div className="w-full border-b border-neutral-100 bg-[#FFFCFA]">
        <Container className="max-w-7xl py-4">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => setActiveCategory("alle")}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeCategory === "alle"
                  ? "text-white shadow-sm"
                  : "border border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400"
              }`}
              style={activeCategory === "alle" ? { backgroundColor: NAVY } : undefined}
            >
              Alle Themen
            </button>
            {CATEGORY_ORDER.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveCategory(id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeCategory === id
                    ? "text-white shadow-sm"
                    : "border border-neutral-300 bg-white text-neutral-800 hover:border-neutral-400"
                }`}
                style={activeCategory === id ? { backgroundColor: NAVY } : undefined}
              >
                {RATGEBER_CATEGORY_LABELS[id]}
              </button>
            ))}
          </div>
        </Container>
      </div>

      <Container className="max-w-7xl space-y-10 pt-10 sm:space-y-12 sm:pt-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-10">
          {/* Empfohlener Artikel */}
          {featuredVisible ? (
            <section aria-labelledby="featured-heading">
              <p id="featured-heading" className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-neutral-500">
                Empfohlener Artikel
              </p>
              <Link
                href={`/ratgeber/${featured.slug}`}
                className="mt-4 flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_16px_48px_-20px_rgba(15,79,104,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_56px_-18px_rgba(15,79,104,0.28)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2 md:flex-row"
              >
                <div className="relative aspect-[16/10] w-full shrink-0 md:aspect-auto md:w-[46%] md:min-h-[280px]">
                  <span
                    className="absolute left-4 top-4 z-10 rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow"
                    style={{ backgroundColor: ORANGE }}
                  >
                    Top Thema
                  </span>
                  <Image src={featured.image} alt={featured.imageAlt} fill className="object-cover" sizes="(min-width: 768px) 400px, 100vw" />
                </div>
                <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <span className="font-semibold" style={{ color: NAVY }}>
                      {primaryCategoryLabel(featured)}
                    </span>
                    <span className="flex items-center gap-1.5 text-neutral-500">
                      <ClockIcon className="text-neutral-400" />
                      {featured.readMinutes} Min. Lesezeit
                    </span>
                  </div>
                  <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight sm:text-[1.65rem]" style={{ color: NAVY }}>
                    {featured.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-neutral-600">{featured.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold" style={{ color: NAVY }}>
                    Artikel lesen
                    <ArrowRightIcon />
                  </span>
                </div>
              </Link>
            </section>
          ) : null}

          {/* Raster */}
          <section id="alle-ratgeber" className="scroll-mt-24">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-2xl font-bold sm:text-3xl" style={{ color: NAVY }}>
                Alle Ratgeber
              </h2>
              <label className="flex items-center gap-2 text-sm text-neutral-600">
                <span className="shrink-0 font-medium">Sortieren nach:</span>
                <select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                  className="rounded-xl border border-neutral-300 bg-white py-2 pl-3 pr-8 text-sm font-semibold text-neutral-800 shadow-sm outline-none focus:border-[#0F4F68]/40 focus:ring-2 focus:ring-[#0F4F68]/15"
                >
                  <option value="neueste">Neueste zuerst</option>
                  <option value="beliebt">Beliebteste</option>
                  <option value="az">A–Z</option>
                </select>
              </label>
            </div>

            {gridBeitraege.length === 0 ? (
              <p className="mt-8 rounded-2xl border border-dashed border-neutral-200 bg-white p-8 text-center text-neutral-600">
                Keine Artikel für diese Auswahl. Andere Themen oder Suchbegriff probieren.
              </p>
            ) : (
              <ul className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {gridBeitraege.map((beitrag) => (
                  <li key={beitrag.slug}>
                    <Link
                      href={`/ratgeber/${beitrag.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_8px_30px_-12px_rgba(15,79,104,0.2)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_-14px_rgba(15,79,104,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden">
                        <Image
                          src={beitrag.image}
                          alt={beitrag.imageAlt}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-[1.03]"
                          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                          <span className="font-semibold" style={{ color: NAVY }}>
                            {primaryCategoryLabel(beitrag)}
                          </span>
                          <span className="flex items-center gap-1 text-neutral-500">
                            <ClockIcon className="h-3.5 w-3.5 text-neutral-400" />
                            {beitrag.readMinutes} Min.
                          </span>
                        </div>
                        <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug" style={{ color: NAVY }}>
                          {beitrag.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600">{beitrag.excerpt}</p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: NAVY }}>
                          Weiterlesen
                          <ArrowRightIcon className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="min-w-0 space-y-8 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_12px_36px_-16px_rgba(15,79,104,0.2)]">
            <h2 className="text-xl font-bold" style={{ color: NAVY }}>
              Beliebt
            </h2>
            <ol className="mt-5 space-y-4">
              {beliebtTop.map((beitrag, i) => (
                <li key={beitrag.slug}>
                  <Link
                    href={`/ratgeber/${beitrag.slug}`}
                    className="group flex items-start gap-3 rounded-xl border border-transparent p-1 transition hover:border-neutral-100 hover:bg-neutral-50/80"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: i === 0 ? ORANGE : NAVY }}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-bold leading-snug group-hover:underline" style={{ color: NAVY }}>
                        {beitrag.title}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-neutral-500">
                        <ClockIcon className="h-3 w-3" />
                        {beitrag.readMinutes} Min.
                      </p>
                    </div>
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-neutral-100">
                      <Image src={beitrag.image} alt="" fill className="object-cover" sizes="56px" />
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
            <button
              type="button"
              onClick={() => {
                setSortMode("beliebt");
                scrollToAlle();
              }}
              className="mt-6 w-full rounded-2xl border-2 py-3 text-sm font-semibold transition hover:bg-neutral-50"
              style={{ borderColor: NAVY, color: NAVY }}
            >
              Alle beliebten Beiträge ansehen
            </button>
          </div>

          <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_12px_36px_-16px_rgba(15,79,104,0.2)]">
            <h2 className="text-xl font-bold" style={{ color: NAVY }}>
              Themen
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {CATEGORY_ORDER.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveCategory(id)}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-center text-xs font-semibold transition sm:text-sm ${
                    activeCategory === id
                      ? "border-[#0F4F68]/40 bg-[#F2F9FA]"
                      : "border-neutral-200 bg-[#FAFAFA] hover:border-neutral-300"
                  }`}
                  style={{ color: NAVY }}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full border text-[#0F4F68]"
                    style={{ borderColor: `${NAVY}33`, background: `${CREAM_PAGE}` }}
                  >
                    <TopicIcon kind={id} />
                  </span>
                  {RATGEBER_CATEGORY_LABELS[id]}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setActiveCategory("alle")}
              className="mt-6 w-full rounded-2xl border-2 py-3 text-sm font-semibold transition hover:bg-neutral-50"
              style={{ borderColor: NAVY, color: NAVY }}
            >
              Alle Themen entdecken
            </button>
          </div>
        </aside>
      </div>

        {/* Newsletter */}
        <section
          className="rounded-2xl border border-[#F78F2E]/25 px-5 py-8 sm:px-10 sm:py-10"
          style={{ background: `linear-gradient(135deg, #FFF4E8 0%, #FFE8D4 100%)` }}
          aria-labelledby="newsletter-heading"
        >
          <div className="mx-auto flex max-w-4xl flex-col gap-6 md:flex-row md:items-center md:gap-10">
            <div className="flex shrink-0 justify-center md:justify-start">
              <span
                className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 bg-white shadow-sm"
                style={{ borderColor: `${ORANGE}55`, color: ORANGE }}
              >
                <EnvelopeIcon className="h-8 w-8" />
              </span>
            </div>
            <div className="min-w-0 flex-1 text-center md:text-left">
              <h2 id="newsletter-heading" className="text-xl font-bold sm:text-2xl" style={{ color: NAVY }}>
                Nie wieder einen wichtigen Ratgeber verpassen
              </h2>
              <p className="mt-2 text-sm text-neutral-700 sm:text-base">
                Melden Sie sich über unsere Kontaktseite – wir informieren Sie gern zu neuen Artikeln und Themen rund um Pflege
                und Alltag.
              </p>
            </div>
            <form
              className="flex w-full shrink-0 flex-col gap-3 sm:flex-row md:max-w-md"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.assign("/kontakt");
              }}
            >
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="Ihre E-Mail-Adresse"
                className="h-12 w-full flex-1 rounded-2xl border border-neutral-200 bg-white px-4 text-sm outline-none ring-[#0F4F68]/15 focus:ring-4"
              />
              <button
                type="submit"
                className="h-12 shrink-0 rounded-2xl px-6 text-sm font-bold text-white shadow-md transition hover:opacity-95"
                style={{ backgroundColor: ORANGE }}
              >
                Jetzt anmelden
              </button>
            </form>
          </div>
        </section>
      </Container>
    </div>
  );
}
