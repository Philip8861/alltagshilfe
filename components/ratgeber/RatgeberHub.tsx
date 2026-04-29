"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import {
  RATGEBER_BEITRAEGE,
  RATGEBER_CATEGORY_LABELS,
  ratgeberHubCardImage,
  type RatgeberBeitragMeta,
  type RatgeberCategoryId,
  primaryCategoryLabel,
} from "@/config/ratgeber-betraege";
import { RatgeberMarquee } from "@/components/ratgeber/RatgeberMarquee";
import { displayArticleViews } from "@/lib/ratgeber/article-view-totals";

const ORANGE = "#F78F2E";
const NAVY = "#0F4F68";

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
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
  switch (kind) {
    case "pflegegrad_leistungen":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
          <path d="M14 2v6h6" />
          <path d="M8 13h8M8 17h6" />
        </svg>
      );
    case "haushalt_betreuung":
      return (
        <svg {...common}>
          <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
        </svg>
      );
    case "pflegehilfsmittel_42eur":
      return (
        <svg {...common}>
          <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          <path d="M3.27 6.96L12 12.01l8.73-5.05" />
        </svg>
      );
    case "inkontinenz":
      return (
        <svg {...common}>
          <path d="M12 22a7 7 0 007-7c0-4-7-13-7-13S5 11 5 15a7 7 0 007 7z" />
        </svg>
      );
    case "pflegeberatung_beratungseinsaetze":
      return (
        <svg {...common}>
          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8.5z" />
        </svg>
      );
    case "pflegende_angehoerige":
      return (
        <svg {...common}>
          <path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M17 4.13a4 4 0 010 7.75" />
        </svg>
      );
    case "pflegealltag_zuhause":
      return (
        <svg {...common}>
          <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 6.05l-.95-1a5.49 5.49 0 00-9.53 5.53c.28.93.71 1.8 1.28 2.56L12 21l9.05-11.62c.93-1.2 1.4-2.64 1.4-4.09a5.53 5.53 0 00-1.65-3.73v0z" />
        </svg>
      );
    case "antraege_checklisten_downloads":
      return (
        <svg {...common}>
          <path d="M9 5h4l5 5v11a2 2 0 01-2 2H9a2 2 0 01-2-2v-14a2 2 0 012-2z" />
          <path d="M9 13h7M9 17h7M14 5v5h5" />
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



const SEARCH_SUGGESTIONS_MAX = 8;

function hubIconCategory(beitrag: RatgeberBeitragMeta): RatgeberCategoryId {
  return beitrag.categories[0] ?? CATEGORY_ORDER[0];
}

function RatgeberArticleTeaserCard({
  beitrag,
  showTopBadge,
  getDisplayViews,
}: {
  beitrag: RatgeberBeitragMeta;
  showTopBadge: boolean;
  getDisplayViews: (b: RatgeberBeitragMeta) => number;
}) {
  const hubSrc = ratgeberHubCardImage(beitrag.slug);
  const ik = hubIconCategory(beitrag);
  const titleId = `ratgeber-teaser-${beitrag.slug}-title`;

  return (
    <Link
      href={`/ratgeber/${beitrag.slug}`}
      className="group flex h-full min-h-0 flex-col overflow-hidden rounded-[1.125rem] bg-white shadow-[0_10px_36px_-16px_rgba(15,79,104,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_44px_-18px_rgba(15,79,104,0.26)] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/50 focus-visible:ring-offset-2"
      aria-labelledby={titleId}
    >
      <div className="relative w-full shrink-0 overflow-hidden rounded-t-[1.125rem] bg-neutral-100 aspect-[4/5]">
        {showTopBadge ? (
          <span
            className="absolute left-2.5 top-2.5 z-20 rounded-md px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white shadow-sm sm:left-3 sm:top-3"
            style={{ backgroundColor: ORANGE }}
          >
            TOP THEMA
          </span>
        ) : null}
        <Image
          src={hubSrc}
          alt=""
          fill
          className="object-contain object-center transition duration-300 group-hover:scale-[1.02]"
          sizes="(min-width: 1280px) 26vw, (min-width: 768px) 32vw, 90vw"
          priority={false}
        />
        <div className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center bg-gradient-to-t from-black/[0.06] to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center p-3 sm:p-4">
          <span className="inline-flex h-[6.875rem] w-[6.875rem] items-center justify-center text-[#0F4F68] drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)] sm:h-[7.8125rem] sm:w-[7.8125rem] [&>svg]:h-full [&>svg]:w-full [&>svg]:max-h-[5.625rem] [&>svg]:max-w-[5.625rem]">
            <TopicIcon kind={ik} />
          </span>
        </div>
      </div>
      <div className="flex flex-col px-3 pb-3 pt-2.5 sm:px-4 sm:pb-4 sm:pt-3">
        <span id={titleId} className="line-clamp-3 text-left text-sm font-bold leading-snug tracking-tight sm:text-[0.95rem]" style={{ color: NAVY }}>
          {beitrag.title}
        </span>
        <div className="mt-3 flex flex-wrap items-start gap-x-5 gap-y-1 text-[0.7rem] leading-relaxed text-neutral-500 sm:text-xs">
          <span className="inline-flex items-center gap-1">
            <EyeIcon className="h-3 w-3 shrink-0 text-neutral-400" aria-hidden />
            {getDisplayViews(beitrag).toLocaleString("de-DE")} Aufrufe
          </span>
          <span className="inline-flex items-center gap-1">
            <ClockIcon className="h-3 w-3 shrink-0 text-neutral-400" aria-hidden />
            {beitrag.readMinutes} Min.
          </span>
        </div>
      </div>
    </Link>
  );
}

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
  const [searchFocused, setSearchFocused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [mobileTopicsOpen, setMobileTopicsOpen] = useState(false);
  /** views = Beliebtheit (Aufrufe), date = neueste zuerst */
  const [sortMode, setSortMode] = useState<"views" | "date">("views");
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

  const gridBeitraege = useMemo(() => {
    const arr = [...filteredBySearchAndCat];
    if (sortMode === "views") {
      arr.sort((a, b) => getDisplayViews(b) - getDisplayViews(a));
    } else {
      arr.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    }
    return arr;
  }, [filteredBySearchAndCat, sortMode, getDisplayViews]);

  const marqueeAlle = useMemo(
    () => [...RATGEBER_BEITRAEGE].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    [],
  );

  const scrollToAlle = () => {
    document.getElementById("alle-ratgeber")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const categoryLabel =
    activeCategory !== "alle" ? RATGEBER_CATEGORY_LABELS[activeCategory] : "";

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
            className="inline-flex min-h-[48px] w-full max-w-md items-center justify-center gap-2 rounded-2xl border border-neutral-300 bg-white px-6 py-3 text-sm font-bold text-neutral-800 shadow-sm transition hover:border-neutral-400 hover:bg-neutral-50"
          >
            <span>{mobileTopicsOpen ? "Auswahl schließen" : "Beliebte Artikel & Themen"}</span>
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
                Beliebte Artikel
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
            aria-label="Beliebte Artikel und Themen filtern"
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
              Beliebte Artikel
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

      <Container className="mx-auto max-w-6xl space-y-8 px-4 pt-6 sm:space-y-10 sm:px-6 sm:pt-8 lg:px-8">
        <div className="mx-auto min-h-0 min-w-0 max-w-6xl space-y-8 lg:space-y-10">
          <section id="alle-ratgeber" className="scroll-mt-24">
            {!isCategoryFocused ? (
              <div className="space-y-4">
                <p className="text-center text-sm font-semibold text-neutral-600 sm:text-base">Themen wählen</p>
                <div className="flex w-full justify-center">
                  <ul className="grid w-full max-w-md grid-cols-2 gap-3 justify-items-center sm:max-w-2xl sm:grid-cols-3 sm:gap-4 lg:max-w-4xl lg:grid-cols-4">
                    {CATEGORY_ORDER.map((id) => (
                      <li key={id} className="aspect-square w-full max-w-[10.25rem] min-w-0 sm:max-w-[11rem]">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCategory(id);
                            scrollToAlle();
                          }}
                          className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-200/95 bg-gradient-to-br from-white to-neutral-50/90 p-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/40 focus-visible:ring-offset-2 sm:gap-3 sm:p-4"
                          style={{ color: NAVY }}
                        >
                          <span className="flex h-[3.75rem] w-[3.75rem] shrink-0 items-center justify-center rounded-2xl border border-neutral-200/90 bg-white text-[#0F4F68] shadow-inner sm:h-[4.375rem] sm:w-[4.375rem] [&>svg]:scale-125">
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
              </div>
            ) : null}

            {!isCategoryFocused ? (
              <div className="mt-6 sm:mt-8">
                <RatgeberMarquee beitraege={marqueeAlle} getViews={getDisplayViews} />
              </div>
            ) : null}

            <div
              className={`flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between ${
                !isCategoryFocused ? "mt-6 sm:mt-8" : "mt-2 sm:mt-3"
              }`}
            >
              <h2 className="text-lg font-bold tracking-tight sm:text-xl" style={{ color: NAVY }}>
                {isCategoryFocused ? `${categoryLabel}` : "Artikel"}
              </h2>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <label htmlFor="ratgeber-sortierung" className="text-sm font-medium text-neutral-600">
                  Sortierung
                </label>
                <select
                  id="ratgeber-sortierung"
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value === "date" ? "date" : "views")}
                  className="min-h-[44px] min-w-[12rem] cursor-pointer rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 shadow-sm outline-none transition hover:border-neutral-400 focus:border-[#0F4F68]/40 focus:ring-2 focus:ring-[#0F4F68]/20"
                >
                  <option value="views">Beliebtheit (Aufrufe)</option>
                  <option value="date">Neueste zuerst</option>
                </select>
              </div>
            </div>

            {gridBeitraege.length === 0 ? (
              <p className="mx-auto mt-5 max-w-2xl rounded-2xl border border-dashed border-neutral-200 bg-white p-8 text-center text-neutral-600">
                Keine Artikel für diese Auswahl. Andere Themen oder Suchbegriff probieren.
              </p>
            ) : (
              <ul className="mx-auto mt-5 grid w-full max-w-6xl grid-cols-2 justify-items-stretch gap-x-4 gap-y-6 sm:max-w-none sm:gap-x-5 md:grid-cols-3 md:gap-y-7 lg:grid-cols-4 lg:gap-x-6 xl:gap-8">
                {gridBeitraege.map((beitrag, idx) => (
                  <li key={beitrag.slug} className="min-h-0 w-full justify-self-center">
                    <RatgeberArticleTeaserCard
                      beitrag={beitrag}
                      showTopBadge={idx < 2}
                      getDisplayViews={getDisplayViews}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </Container>
    </div>
  );
}
