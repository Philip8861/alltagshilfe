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
import { displayArticleViews } from "@/lib/ratgeber/article-view-totals";

const ORANGE = "#F78F2E";
const NAVY = "#0F4F68";
/** Wie die Aquarell-Blog-Teaser (blog_1–blog_7), ohne grauen Rand */
const CARD_CANVAS = "#FEFEFE";

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

/** Einheitlich 24×24, mittig, gleiche Strichdicke für alle Kategorien. */
function TopicIcon({ kind }: { kind: RatgeberCategoryId }) {
  const s = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-full w-full shrink-0",
    "aria-hidden": true as const,
  };
  switch (kind) {
    case "pflegegrad_leistungen":
      return (
        <svg {...s}>
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9" />
          <path d="M13 2v7h7" />
          <path d="M8 13h8M8 17h5" />
        </svg>
      );
    case "haushalt_betreuung":
      return (
        <svg {...s}>
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M9 22V12h6v10" />
        </svg>
      );
    case "pflegehilfsmittel_42eur":
      return (
        <svg {...s}>
          <path d="m7.5 4.27 9 5.15a2 2 0 0 1 1 1.73v9.7a2 2 0 0 1-1 1.73l-9 5.17a2 2 0 0 1-2 0l-9-5.17a2 2 0 0 1-1-1.73v-9.7a2 2 0 0 1 1-1.73l9-5.15a2 2 0 0 1 2 0z" />
          <path d="M3.29 10.71 12 14.93l8.71-4.22" />
        </svg>
      );
    case "inkontinenz":
      return (
        <svg {...s}>
          <path d="M12 22a8 8 0 0 0 8-8c0-4.5-8-13-8-13S4 9.5 4 14a8 8 0 0 0 8 8z" />
        </svg>
      );
    case "pflegeberatung_beratungseinsaetze":
      return (
        <svg {...s}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "pflegende_angehoerige":
      return (
        <svg {...s}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "pflegealltag_zuhause":
      return (
        <svg {...s}>
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      );
    case "antraege_checklisten_downloads":
      return (
        <svg {...s}>
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="M9 14h6M9 18h6M15 11h4" />
        </svg>
      );
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

function haystackForBeitrag(beitrag: RatgeberBeitragMeta): string {
  return [beitrag.title, beitrag.excerpt, beitrag.tags.join(" ")].join(" ").toLocaleLowerCase("de");
}

function matchesCategory(beitrag: RatgeberBeitragMeta, cat: RatgeberCategoryId | "alle"): boolean {
  if (cat === "alle") return true;
  return beitrag.categories.includes(cat);
}



const SEARCH_SUGGESTIONS_MAX = 8;

function hubIconCategory(beitrag: RatgeberBeitragMeta): RatgeberCategoryId {
  return beitrag.categories[0] ?? CATEGORY_ORDER[0];
}

const overlayIconSvgClass =
  "block h-full w-full max-h-[6rem] max-w-[6rem] shrink-0 [overflow:visible]";
const OV = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.85,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: overlayIconSvgClass,
  "aria-hidden": true as const,
};

/** Eigenes Overlay-Symbol je Artikel-Slug — saubere Formen auf dem Aquarell. */
function HubOverlayIcon({
  slug,
  fallbackCategory,
}: {
  slug: string;
  fallbackCategory: RatgeberCategoryId;
}) {
  switch (slug) {
    case "pflegegrad-beantragen-2026":
      return (
        <svg {...OV}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M9 13h8" />
          <path d="M9 17h5" />
        </svg>
      );
    case "pflegegrad-beantragen-checkliste":
      return (
        <svg {...OV}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="m9 14 2 2 7-9" />
        </svg>
      );
    case "hausnotruf-ratgeber":
      return (
        <svg {...OV}>
          <rect x="6" y="3" width="12" height="18" rx="2" ry="2" />
          <path d="M11 17h3" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case "entlastungsbetrag-131-euro":
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden className={overlayIconSvgClass}>
          <text
            x="12"
            y="16"
            dominantBaseline="middle"
            textAnchor="middle"
            stroke="none"
            fill="currentColor"
            fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
            fontWeight={700}
            fontSize={21}
          >
            €
          </text>
        </svg>
      );
    case "pflegegrad-1-der-ultimative-leitfaden":
      return (
        <svg {...OV}>
          <path d="M6 3h12v18H6z" />
          <path d="M9 9h7M9 13h7M9 17h5" />
        </svg>
      );
    case "pflegegrad-2-alles-was-du-wissen-musst":
      return (
        <svg {...OV}>
          <circle cx="12" cy="8" r="5" />
          <path d="M4 21c0-3.5 3.5-6 8-6s8 2.5 8 6" />
        </svg>
      );
    default:
      return (
        <span className="flex h-full w-full items-center justify-center text-[#0F4F68]">
          <span className="block h-[5.125rem] w-[5.125rem] shrink-0 [&>svg]:h-full [&>svg]:w-full">
            <TopicIcon kind={fallbackCategory} />
          </span>
        </span>
      );
  }
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
      className="group flex h-full min-h-0 flex-col overflow-hidden rounded-[0.85rem] shadow-[0_8px_28px_-14px_rgba(15,79,104,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-16px_rgba(15,79,104,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/50 focus-visible:ring-offset-2"
      style={{ backgroundColor: CARD_CANVAS }}
      aria-labelledby={titleId}
    >
      <div
        className="relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-t-[0.85rem]"
        style={{ backgroundColor: CARD_CANVAS }}
      >
        {showTopBadge ? (
          <span
            className="absolute left-2 top-2 z-20 rounded px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-wide text-white shadow-sm sm:left-2.5 sm:top-2.5 sm:text-[0.6rem]"
            style={{ backgroundColor: ORANGE }}
          >
            TOP THEMA
          </span>
        ) : null}
        <Image
          src={hubSrc}
          alt=""
          fill
          className="object-contain object-center"
          sizes="(min-width: 1280px) 18vw, (min-width: 768px) 22vw, 42vw"
          priority={false}
        />
        <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center p-3">
          <div className="flex h-[5.5rem] w-[5.5rem] shrink-0 items-center justify-center sm:h-[6.25rem] sm:w-[6.25rem] md:h-[6.5rem] md:w-[6.5rem]">
            <HubOverlayIcon slug={beitrag.slug} fallbackCategory={ik} />
          </div>
        </div>
      </div>
      <div
        className="flex flex-col px-2.5 pb-2.5 pt-2 sm:px-3 sm:pb-3 sm:pt-2.5"
        style={{ backgroundColor: CARD_CANVAS }}
      >
        <span
          id={titleId}
          className="line-clamp-3 text-left text-xs font-extrabold leading-snug tracking-tight text-balance sm:text-sm"
          style={{ color: NAVY }}
        >
          {beitrag.title}
        </span>
        <div className="mt-2 flex flex-wrap items-start gap-x-3 gap-y-0.5 text-[0.6rem] leading-relaxed text-neutral-500 sm:text-[0.65rem]">
          <span className="inline-flex items-center gap-1">
            <EyeIcon className="h-2.5 w-2.5 shrink-0 text-neutral-400" aria-hidden />
            {getDisplayViews(beitrag).toLocaleString("de-DE")} Aufrufe
          </span>
          <span className="inline-flex items-center gap-1">
            <ClockIcon className="h-2.5 w-2.5 shrink-0 text-neutral-400" aria-hidden />
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

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!mobileTopicsRef.current?.contains(e.target as Node)) setMobileTopicsOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const isCategoryFocused = activeCategory !== "alle";
  const categoryLabel = activeCategory !== "alle" ? RATGEBER_CATEGORY_LABELS[activeCategory] : "";

  const beliebtListe = useMemo(() => {
    return [...RATGEBER_BEITRAEGE]
      .sort((a, b) => getDisplayViews(b) - getDisplayViews(a))
      .slice(0, 8);
  }, [getDisplayViews]);

  const gridBeitraege = useMemo(() => {
    const arr = [...filteredBySearchAndCat];
    if (sortMode === "views") {
      arr.sort((a, b) => getDisplayViews(b) - getDisplayViews(a));
    } else {
      arr.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    }
    return arr;
  }, [filteredBySearchAndCat, sortMode, getDisplayViews]);

  const scrollToAlle = () => {
    document.getElementById("alle-ratgeber")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

      <div ref={mobileTopicsRef} className="relative z-10 px-4 md:hidden">
        <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center">
          <button
            type="button"
            aria-expanded={mobileTopicsOpen}
            aria-controls="ratgeber-mobile-themen-panel"
            onClick={() => setMobileTopicsOpen((o) => !o)}
            className="inline-flex min-h-[48px] w-full max-w-md items-center justify-center gap-2 rounded-2xl border border-neutral-300 bg-white px-6 py-3 text-sm font-bold text-neutral-800 shadow-sm transition hover:border-neutral-400 hover:bg-neutral-50"
          >
            <span>{mobileTopicsOpen ? "Auswahl schließen" : "Themen & Filter"}</span>
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
              aria-label="Themenbereich Ratgeber wählen"
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
                Alle Artikel
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

      <div className="relative z-0 mt-2 hidden w-full border-b border-neutral-100 bg-[#FFFCFA] md:mt-2.5 md:block">
        <Container className="max-w-7xl py-4">
          <div
            className="flex flex-wrap justify-center gap-x-2 gap-y-2.5 px-2"
            aria-label="Themenbereiche filtern"
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
              Alle Artikel
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

      <Container className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 sm:pt-6 lg:px-8">
        <section id="alle-ratgeber" className="scroll-mt-24">
          {!isCategoryFocused ? (
            <div className="mx-auto mb-8 max-w-4xl space-y-4">
              <p className="text-center text-sm font-semibold text-neutral-600 sm:text-base">Themen wählen</p>
              <div className="flex w-full justify-center">
                <ul className="grid w-full max-w-md grid-cols-2 gap-3 justify-items-center sm:max-w-2xl sm:grid-cols-3 sm:gap-4 lg:max-w-4xl lg:grid-cols-4">
                  {CATEGORY_ORDER.map((id) => (
                    <li key={id} className="aspect-square w-full max-w-[9.5rem] min-w-0 sm:max-w-[10.25rem]">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCategory(id);
                          scrollToAlle();
                        }}
                        className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-200/95 bg-gradient-to-br from-white to-neutral-50/90 p-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/40 focus-visible:ring-offset-2 sm:gap-2.5 sm:p-3.5"
                        style={{ color: NAVY }}
                      >
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-neutral-200/90 bg-white text-[#0F4F68] shadow-inner sm:h-14 sm:w-14 [&>svg]:scale-110">
                          <TopicIcon kind={id} />
                        </span>
                        <span className="line-clamp-3 text-[0.65rem] font-bold leading-tight sm:text-[0.7rem]">
                          {RATGEBER_CATEGORY_LABELS[id]}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-8 lg:mt-10 lg:flex-row lg:items-start lg:gap-8 xl:gap-10">
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <h2 className="text-base font-bold tracking-tight sm:text-lg" style={{ color: NAVY }}>
                  {isCategoryFocused ? categoryLabel : "Artikel"}
                </h2>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <label htmlFor="ratgeber-sortierung" className="text-xs font-medium text-neutral-600 sm:text-sm">
                    Sortierung
                  </label>
                  <select
                    id="ratgeber-sortierung"
                    value={sortMode}
                    onChange={(e) => setSortMode(e.target.value === "date" ? "date" : "views")}
                    className="min-h-[44px] min-w-[11.5rem] cursor-pointer rounded-xl border border-neutral-300 bg-white px-2.5 py-2 text-xs font-semibold text-neutral-900 shadow-sm outline-none transition hover:border-neutral-400 focus:border-[#0F4F68]/40 focus:ring-2 focus:ring-[#0F4F68]/20 sm:min-w-[12rem] sm:px-3 sm:text-sm"
                  >
                    <option value="views">Beliebtheit (Aufrufe)</option>
                    <option value="date">Neueste zuerst</option>
                  </select>
                </div>
              </div>

              {gridBeitraege.length === 0 ? (
                <p
                  className="mx-auto mt-4 rounded-2xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-600 sm:p-8"
                  style={{ backgroundColor: CARD_CANVAS }}
                >
                  Keine Artikel für diese Auswahl. Anderes Thema wählen oder Suchbegriff anpassen.
                </p>
              ) : (
                <ul className="mx-auto mt-4 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 md:grid-cols-3 md:gap-y-7 lg:grid-cols-4 lg:gap-x-4 xl:gap-x-5">
                  {gridBeitraege.map((beitrag, idx) => (
                    <li key={beitrag.slug} className="min-h-0 w-full justify-self-stretch">
                      <RatgeberArticleTeaserCard
                        beitrag={beitrag}
                        showTopBadge={idx < 2}
                        getDisplayViews={getDisplayViews}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <aside
              className="w-full shrink-0 border border-neutral-200/80 bg-white/90 p-4 shadow-sm sm:p-4 lg:sticky lg:top-24 lg:w-[15rem] lg:max-w-[15rem] xl:w-[16rem] xl:max-w-[16rem]"
              style={{ borderRadius: "0.85rem" }}
              aria-labelledby="ratgeber-beliebt-heading"
            >
              <h3
                id="ratgeber-beliebt-heading"
                className="border-b border-neutral-200/90 pb-2.5 text-[0.7rem] font-extrabold uppercase tracking-[0.12em] text-neutral-500"
              >
                Beliebte Artikel
              </h3>
              <ol className="mt-3 space-y-2">
                {beliebtListe.map((b, i) => (
                  <li key={b.slug}>
                    <Link
                      href={`/ratgeber/${b.slug}`}
                      className="group flex items-start gap-2 rounded-lg py-1 pr-1 transition hover:bg-[#F2F9FA]"
                    >
                      <span
                        className="flex h-[1.625rem] min-w-[1.625rem] shrink-0 items-center justify-center rounded text-[0.65rem] font-extrabold leading-none text-white"
                        style={{ backgroundColor: i === 0 ? ORANGE : NAVY }}
                        aria-hidden
                      >
                        {i + 1}
                      </span>
                      <span className="relative block h-[3.85rem] w-[4.05rem] shrink-0 overflow-hidden rounded-md shadow-sm ring-1 ring-neutral-100" style={{ backgroundColor: CARD_CANVAS }}>
                        <Image
                          src={ratgeberHubCardImage(b.slug)}
                          alt=""
                          fill
                          className="object-contain object-center"
                          sizes="128px"
                        />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="line-clamp-3 text-left text-[0.7rem] font-extrabold leading-snug text-[#0F4F68] group-hover:underline">
                          {b.title}
                        </span>
                        <span className="mt-0.5 block text-[0.6rem] text-neutral-500">
                          {getDisplayViews(b).toLocaleString("de-DE")} Aufrufe
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </section>
      </Container>
    </div>
  );
}
