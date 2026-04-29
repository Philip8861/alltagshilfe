"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import {
  RATGEBER_BEITRAEGE,
  RATGEBER_CATEGORY_LABELS,
  type RatgeberBeitragMeta,
  type RatgeberCategoryId,
  primaryCategoryLabel,
} from "@/config/ratgeber-betraege";
import { RatgeberMarquee } from "@/components/ratgeber/RatgeberMarquee";
import { displayArticleViews } from "@/lib/ratgeber/article-view-totals";

type SortMode = "neueste" | "beliebt" | "az";

const NAVY = "#0F4F68";
const ORANGE = "#F78F2E";

const CATEGORY_ORDER: RatgeberCategoryId[] = [
  "pflegegrad_leistungen",
  "haushalt_betreuung",
  "pflegehilfsmittel_42eur",
  "inkontinenz",
  "pflegeberatung_beratungseinsaetze",
  "pflegende_angehoerige",
  "pflegealltag_zuhause",
  "antraege_checklisten_downloads",
];

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
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

function HeartOutlineIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8L12 21l8.8-8.8a5.5 5.5 0 000-7.8z" />
    </svg>
  );
}

function TopicIcon({ kind }: { kind: RatgeberCategoryId }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24" as const,
    fill: "none" as const,
    stroke: "currentColor" as const,
    strokeWidth: 2,
    "aria-hidden": true as const,
  };
  switch (kind) {
    case "pflegegrad_leistungen":
      return (
        <svg {...common}>
          <path d="M12 3v18M6 8h12M8 16h8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 5h6M9 19h6" strokeLinecap="round" />
        </svg>
      );
    case "haushalt_betreuung":
      return (
        <svg {...common}>
          <path d="M3 11l9-8 9 8M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 18v-4h6v4" strokeLinecap="round" />
        </svg>
      );
    case "pflegehilfsmittel_42eur":
      return (
        <svg {...common}>
          <rect x="4" y="6" width="16" height="14" rx="2" strokeLinejoin="round" />
          <path d="M8 10h8M8 14h5" strokeLinecap="round" />
        </svg>
      );
    case "inkontinenz":
      return (
        <svg {...common}>
          <path
            d="M12 3c-3 4-5 7-5 10a5 5 0 0010 0c0-3-2-6-5-10z"
            strokeLinejoin="round"
          />
          <path d="M10 14h4" strokeLinecap="round" />
        </svg>
      );
    case "pflegeberatung_beratungseinsaetze":
      return (
        <svg {...common}>
          <path
            d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "pflegende_angehoerige":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" strokeLinecap="round" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" />
        </svg>
      );
    case "pflegealltag_zuhause":
      return (
        <svg {...common}>
          <path d="M3 11l9-8 9 8M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "antraege_checklisten_downloads":
      return (
        <svg {...common}>
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" strokeLinejoin="round" />
          <path d="M9 5a2 2 0 012-2h2a2 2 0 012 2v0a2 2 0 01-2 2H9a2 2 0 01-2-2v0z" strokeLinejoin="round" />
          <path d="M9 12h6M9 16h6" strokeLinecap="round" />
        </svg>
      );
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function matchesCategory(beitrag: RatgeberBeitragMeta, cat: RatgeberCategoryId | "alle"): boolean {
  if (cat === "alle") return true;
  return beitrag.categories.includes(cat);
}

function haystackForBeitrag(beitrag: RatgeberBeitragMeta): string {
  return [beitrag.title, beitrag.excerpt, beitrag.tags.join(" ")].join(" ").toLocaleLowerCase("de");
}

function sortBeitraege(
  list: RatgeberBeitragMeta[],
  mode: SortMode,
  getViews: (b: RatgeberBeitragMeta) => number,
): RatgeberBeitragMeta[] {
  const out = [...list];
  if (mode === "neueste") {
    out.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  } else if (mode === "beliebt") {
    out.sort((a, b) => getViews(b) - getViews(a));
  } else {
    out.sort((a, b) => a.title.localeCompare(b.title, "de", { sensitivity: "base" }));
  }
  return out;
}

const SEARCH_SUGGESTIONS_MAX = 8;

export type RatgeberHubProps = {
  /** Summen aus Middleware-Analytics (site_page_views_daily), je slug. */
  initialArticleViewTotals?: Record<string, number>;
  /** true, wenn Supabase-Daten erfolgreich geladen wurden. */
  articleViewsLive?: boolean;
};

export function RatgeberHub(props?: RatgeberHubProps) {
  const { initialArticleViewTotals, articleViewsLive = false } = props ?? {};
  const totals = useMemo(() => initialArticleViewTotals ?? {}, [initialArticleViewTotals]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<RatgeberCategoryId | "alle">("alle");
  const [sortMode, setSortMode] = useState<SortMode>("neueste");
  const [searchFocused, setSearchFocused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [mobileTopicsOpen, setMobileTopicsOpen] = useState(false);
  const searchComboRef = useRef<HTMLDivElement>(null);
  const mobileTopicsRef = useRef<HTMLDivElement>(null);

  const getDisplayViews = useCallback(
    (b: RatgeberBeitragMeta) => displayArticleViews(b.slug, b.views, totals, articleViewsLive),
    [totals, articleViewsLive],
  );

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

  const isCategoryFocused = activeCategory !== "alle";

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!mobileTopicsRef.current?.contains(e.target as Node)) setMobileTopicsOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  /** „Alle“: Sortierung wählbar; einzelnes Thema: nur nach Aufrufen. */
  const gridBeitraege = useMemo(() => {
    if (isCategoryFocused) {
      return [...filteredBySearchAndCat].sort((a, b) => getDisplayViews(b) - getDisplayViews(a));
    }
    return sortBeitraege(filteredBySearchAndCat, sortMode, getDisplayViews);
  }, [filteredBySearchAndCat, isCategoryFocused, sortMode, getDisplayViews]);

  const beliebtTop = useMemo(
    () => [...RATGEBER_BEITRAEGE].sort((a, b) => getDisplayViews(b) - getDisplayViews(a)).slice(0, 4),
    [getDisplayViews],
  );

  const marqueeAlle = useMemo(
    () => [...RATGEBER_BEITRAEGE].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    [],
  );

  const scrollToAlle = () => {
    document.getElementById("alle-ratgeber")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const categoryLabel =
    activeCategory !== "alle" ? RATGEBER_CATEGORY_LABELS[activeCategory] : "";

  const iconCategoryForBeitrag = (beitrag: RatgeberBeitragMeta): RatgeberCategoryId =>
    beitrag.categories[0] ?? CATEGORY_ORDER[0];

  return (
    <div className="min-w-0">
      {/* Hero: ein Block – Bild vollflächig, Text & Suche wie zuvor darüber */}
      <section
        className="relative z-10 w-full px-3 sm:px-4 md:px-5"
        aria-labelledby="ratgeber-hub-heading"
      >
        <div className="relative isolate min-h-[13rem] w-full rounded-b-3xl bg-[#FFFCFA] sm:min-h-[15.5rem] md:min-h-[18rem] lg:min-h-[19.5rem]">
          {/* Hintergrundbild in eigenem Layer clippen (untere Ecken) */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-b-3xl" aria-hidden>
            <Image
              src="/images/Ratgeber/ratgeber.webp"
              alt=""
              fill
              className="object-contain object-center"
              sizes="(min-width: 768px) 96vw, 100vw"
              quality={92}
              priority
            />
          </div>
          <div className="relative z-10 mx-auto flex min-h-[13rem] w-full max-w-7xl flex-col px-4 pb-4 pt-8 sm:min-h-[15.5rem] sm:px-6 sm:pb-5 sm:pt-10 md:min-h-[18rem] lg:min-h-[19.5rem] lg:px-[var(--ahs-page-gutter)] lg:pb-6 lg:pt-12">
            <div className="w-full max-w-4xl">
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
              <form
                className="mt-4 w-full max-w-[min(100%,33.6rem)] sm:mt-5"
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
                className="relative z-20 min-w-0"
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
                    className="absolute left-0 right-0 top-full z-30 mt-1 max-h-[min(26rem,72vh)] overflow-y-auto overscroll-contain rounded-2xl border border-neutral-200 bg-white py-1 shadow-xl ring-1 ring-black/5"
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
        </div>
      </section>

      {/* Mobil: Themen-Dropdown mittig unter dem Hero */}
      <div ref={mobileTopicsRef} className="relative z-10 px-4 md:hidden">
        <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center">
          <button
            type="button"
            aria-expanded={mobileTopicsOpen}
            aria-controls="ratgeber-mobile-themen-panel"
            onClick={() => setMobileTopicsOpen((o) => !o)}
            className="inline-flex min-h-[48px] w-full max-w-md items-center justify-center gap-2 rounded-2xl border-2 px-6 py-3 text-sm font-bold shadow-sm transition hover:bg-neutral-50"
            style={{ borderColor: NAVY, color: NAVY }}
          >
            <span>{mobileTopicsOpen ? "Alle Themen schließen" : "Alle Themen öffnen"}</span>
            <svg
              className={`h-5 w-5 shrink-0 transition-transform ${mobileTopicsOpen ? "rotate-180" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {mobileTopicsOpen ? (
            <div
              id="ratgeber-mobile-themen-panel"
              role="region"
              aria-label="Ratgeber-Themen wählen"
              className="mt-3 w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-2 shadow-xl"
            >
              <button
                type="button"
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                  activeCategory === "alle" ? "bg-[#0F4F68] text-white" : "hover:bg-neutral-50"
                }`}
                onClick={() => {
                  setActiveCategory("alle");
                  setMobileTopicsOpen(false);
                }}
                style={activeCategory !== "alle" ? { color: NAVY } : undefined}
              >
                Alle Themen
              </button>
              {CATEGORY_ORDER.map((id) => (
                <button
                  key={id}
                  type="button"
                  className={`mt-1 w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                    activeCategory === id ? "bg-[#0F4F68] text-white" : "hover:bg-neutral-50"
                  }`}
                  onClick={() => {
                    setActiveCategory(id);
                    setMobileTopicsOpen(false);
                    scrollToAlle();
                  }}
                  style={activeCategory !== id ? { color: NAVY } : undefined}
                >
                  {RATGEBER_CATEGORY_LABELS[id]}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Desktop: Themen mittig */}
      <div className="relative z-0 mt-2 hidden w-full border-b border-neutral-100 bg-[#FFFCFA] md:mt-2.5 md:block">
        <Container className="max-w-7xl py-4">
          <div
            className="flex flex-wrap justify-center gap-x-2 gap-y-2.5 px-2"
            aria-label="Ratgeber nach Thema filtern"
          >
            <button
              type="button"
              onClick={() => setActiveCategory("alle")}
              className={`rounded-full px-4 py-2 text-center text-sm font-semibold transition ${
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
                onClick={() => {
                  setActiveCategory(id);
                  scrollToAlle();
                }}
                className={`rounded-full px-4 py-2 text-center text-sm font-semibold transition ${
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

      <Container className="max-w-[min(100%,96rem)] space-y-10 pt-10 sm:space-y-12 sm:pt-12 lg:px-6 xl:pl-10 xl:pr-12 2xl:pr-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(17.5rem,20rem)] lg:items-start lg:justify-items-stretch lg:gap-x-10 xl:gap-x-14 2xl:gap-x-[4.25rem]">
        <div className="min-w-0 space-y-10 lg:space-y-12">
          <section id="alle-ratgeber" className="scroll-mt-24">
            {isCategoryFocused ? <h2 className="sr-only">{categoryLabel}</h2> : null}

            {!isCategoryFocused ? (
              <div className="space-y-4">
                <p className="text-center text-sm font-semibold text-neutral-600 sm:text-base">Themen wählen</p>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                  {CATEGORY_ORDER.map((id) => (
                    <li key={id} className="aspect-square min-h-0">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCategory(id);
                          scrollToAlle();
                        }}
                        className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-[#0F4F68]/12 bg-gradient-to-br from-white via-[#FAFCFE] to-[#E8F2F6] p-3 text-center shadow-[0_10px_36px_-18px_rgba(15,79,104,0.35)] ring-1 ring-[#0F4F68]/8 transition hover:-translate-y-0.5 hover:border-[#0F4F68]/28 hover:shadow-[0_16px_44px_-16px_rgba(15,79,104,0.38)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2 sm:gap-3 sm:p-4"
                        style={{ color: NAVY }}
                      >
                        <span
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border bg-white/90 text-[#0F4F68] shadow-inner sm:h-14 sm:w-14"
                          style={{ borderColor: `${NAVY}22` }}
                        >
                          <TopicIcon kind={id} />
                        </span>
                        <span className="line-clamp-3 text-[0.7rem] font-bold leading-tight sm:text-xs">
                          {RATGEBER_CATEGORY_LABELS[id]}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {!isCategoryFocused ? (
              <div className="mt-10">
                <RatgeberMarquee beitraege={marqueeAlle} getViews={getDisplayViews} />
              </div>
            ) : null}

            <div
              className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end ${
                !isCategoryFocused ? "mt-10 sm:mt-12" : "mt-2 sm:mt-3"
              }`}
            >
              {!isCategoryFocused ? (
                <label className="flex w-full items-center justify-end gap-2 text-sm text-neutral-600 sm:text-base">
                  <span className="shrink-0 font-medium">Sortieren nach:</span>
                  <select
                    value={sortMode}
                    onChange={(e) => setSortMode(e.target.value as SortMode)}
                    className="rounded-xl border border-neutral-300 bg-white py-2.5 pl-3 pr-9 text-sm font-semibold text-neutral-800 shadow-sm outline-none focus:border-[#0F4F68]/40 focus:ring-2 focus:ring-[#0F4F68]/15 sm:text-base"
                  >
                    <option value="neueste">Neueste zuerst</option>
                    <option value="beliebt">Beliebteste</option>
                    <option value="az">A–Z</option>
                  </select>
                </label>
              ) : (
                <p className="text-right text-sm font-medium text-neutral-500">
                  Sortierung: Beliebtheit (Aufrufe) · {categoryLabel}
                </p>
              )}
            </div>

            {gridBeitraege.length === 0 ? (
              <p className="mt-8 rounded-2xl border border-dashed border-neutral-200 bg-white p-8 text-center text-neutral-600">
                Keine Artikel für diese Auswahl. Andere Themen oder Suchbegriff probieren.
              </p>
            ) : isCategoryFocused ? (
              <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
                {gridBeitraege.map((beitrag, idx) => {
                  const ik = iconCategoryForBeitrag(beitrag);
                  return (
                    <li key={beitrag.slug} className="aspect-square min-h-0">
                      <Link
                        href={`/ratgeber/${beitrag.slug}`}
                        className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border-2 border-[#0F4F68]/12 bg-gradient-to-br from-[#FFFCFA] via-white to-[#EEF6F9] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_32px_-20px_rgba(15,79,104,0.45)] ring-1 ring-[#0F4F68]/10 transition hover:-translate-y-1 hover:border-[#0F4F68]/26 hover:shadow-[0_18px_44px_-18px_rgba(15,79,104,0.38)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2 sm:p-4"
                        aria-labelledby={`kat-card-${beitrag.slug}-title`}
                      >
                        {idx < 2 ? (
                          <span
                            className="absolute left-2 top-2 z-10 rounded-md px-2 py-0.5 text-[0.58rem] font-bold uppercase tracking-wide text-white shadow sm:left-2.5 sm:top-2.5 sm:text-[0.62rem]"
                            style={{ backgroundColor: ORANGE }}
                          >
                            TOP THEMA
                          </span>
                        ) : null}
                        <div className="flex min-h-[5rem] flex-1 flex-col items-center justify-center rounded-xl bg-white/85 p-3 shadow-inner ring-1 ring-[#0F4F68]/10 sm:min-h-[6rem]">
                          <span
                            className="text-[#0F4F68] transition-transform group-hover:scale-105 [&>svg]:h-9 [&>svg]:w-9 sm:[&>svg]:h-11 sm:[&>svg]:w-11"
                            aria-hidden
                          >
                            <TopicIcon kind={ik} />
                          </span>
                        </div>
                        <div className="mt-3 flex min-h-0 flex-1 flex-col">
                          <span
                            id={`kat-card-${beitrag.slug}-title`}
                            className="line-clamp-4 text-center text-[0.72rem] font-bold leading-snug tracking-tight sm:text-sm"
                            style={{ color: NAVY }}
                          >
                            {beitrag.title}
                          </span>
                          <span className="mt-auto flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 pt-2 text-center text-[0.62rem] text-neutral-600 sm:text-[0.7rem]">
                            <EyeIcon className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
                            <span>{getDisplayViews(beitrag).toLocaleString("de-DE")}</span>
                            <span className="text-neutral-300" aria-hidden>
                              ·
                            </span>
                            <ClockIcon className="h-3 w-3 shrink-0 opacity-80" aria-hidden />
                            <span>{beitrag.readMinutes} Min.</span>
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ul className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-7">
                {gridBeitraege.map((beitrag) => {
                  const ik = iconCategoryForBeitrag(beitrag);
                  return (
                    <li key={beitrag.slug}>
                      <Link
                        href={`/ratgeber/${beitrag.slug}`}
                        className="group flex h-full flex-col rounded-2xl border border-black/[0.08] bg-white p-5 shadow-[0_8px_28px_-14px_rgba(15,79,104,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-16px_rgba(15,79,104,0.28)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2 sm:p-6"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-[#FAFBFC]"
                            style={{ borderColor: `${NAVY}18`, color: NAVY }}
                            aria-hidden
                          >
                            <TopicIcon kind={ik} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-semibold" style={{ color: NAVY }}>
                              {primaryCategoryLabel(beitrag)}
                            </span>
                            <h3 className="mt-1 line-clamp-2 text-lg font-bold leading-snug sm:text-xl" style={{ color: NAVY }}>
                              {beitrag.title}
                            </h3>
                          </div>
                        </div>
                        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600 sm:text-[0.95rem]">
                          {beitrag.excerpt}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                          <span className="inline-flex items-center gap-1">
                            <EyeIcon className="h-3.5 w-3.5 shrink-0 text-neutral-400" aria-hidden />
                            {getDisplayViews(beitrag).toLocaleString("de-DE")} Aufrufe
                          </span>
                          <span className="text-neutral-300" aria-hidden>
                            ·
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <ClockIcon className="h-3.5 w-3.5 text-neutral-400" aria-hidden />
                            {beitrag.readMinutes} Min.
                          </span>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: NAVY }}>
                          Weiterlesen
                          <ArrowRightIcon className="h-4 w-4" />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <aside className="min-w-0 lg:sticky lg:top-24 lg:col-start-2 lg:row-start-1 lg:w-full lg:justify-self-end lg:pl-2 xl:pl-6 2xl:pl-10">
          <div className="rounded-2xl border-2 border-[#0F4F68]/10 bg-white p-8 shadow-[0_20px_48px_-22px_rgba(15,79,104,0.35)] sm:p-10 lg:max-w-none">
            <div className="border-b border-neutral-200/90 pb-6 text-center">
              <h2 className="text-xl font-bold sm:text-2xl" style={{ color: NAVY }}>
                Beliebte Artikel
              </h2>
              <p className="mt-1.5 text-xs text-neutral-500 sm:text-sm">Nach Aufrufen – meist gelesen</p>
            </div>
            <ol className="mt-6 space-y-4 sm:space-y-5">
              {beliebtTop.map((beitrag, i) => (
                <li key={beitrag.slug}>
                  <Link
                    href={`/ratgeber/${beitrag.slug}`}
                    className="group flex items-start gap-3 rounded-xl border border-transparent px-1 py-2 transition hover:border-neutral-100 hover:bg-neutral-50/80 sm:gap-4"
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
                      style={{ backgroundColor: i === 0 ? ORANGE : NAVY }}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="line-clamp-2 text-sm font-bold leading-snug group-hover:underline" style={{ color: NAVY }}>
                        {beitrag.title}
                      </p>
                      <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
                        <span className="inline-flex items-center gap-1">
                          <EyeIcon className="h-3 w-3 text-neutral-400" aria-hidden />
                          {getDisplayViews(beitrag).toLocaleString("de-DE")}
                        </span>
                        <span className="text-neutral-300" aria-hidden>
                          ·
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <ClockIcon className="h-3 w-3 text-neutral-400" aria-hidden />
                          {beitrag.readMinutes} Min.
                        </span>
                      </p>
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
              className="mt-8 w-full rounded-2xl border-2 py-3.5 text-sm font-semibold transition hover:bg-neutral-50 sm:text-base"
              style={{ borderColor: NAVY, color: NAVY }}
            >
              Alle beliebten Beiträge ansehen
            </button>
          </div>
        </aside>
      </div>
      </Container>
    </div>
  );
}
