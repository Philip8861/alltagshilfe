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

function haystackForBeitrag(beitrag: RatgeberBeitragMeta): string {
  return [beitrag.title, beitrag.excerpt, beitrag.tags.join(" ")].join(" ").toLocaleLowerCase("de");
}

function matchesCategory(beitrag: RatgeberBeitragMeta, cat: RatgeberCategoryId): boolean {
  return beitrag.categories.includes(cat);
}



const SEARCH_SUGGESTIONS_MAX = 8;

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
  const titleId = `ratgeber-teaser-${beitrag.slug}-title`;

  return (
    <Link
      href={`/ratgeber/${beitrag.slug}`}
      className="group flex h-full min-h-0 flex-col overflow-hidden rounded-[0.85rem] shadow-[0_8px_28px_-14px_rgba(15,79,104,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-16px_rgba(15,79,104,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/50 focus-visible:ring-offset-2"
      style={{ backgroundColor: CARD_CANVAS }}
      aria-labelledby={titleId}
    >
      <div
        className="relative aspect-[3/2] w-full shrink-0 overflow-hidden rounded-t-[0.85rem]"
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
          alt={beitrag.imageAlt}
          fill
          className="object-cover object-center"
          sizes="(min-width: 1280px) 28vw, (min-width: 768px) 32vw, 48vw"
          priority={false}
        />
      </div>
      <div
        className="flex flex-col px-3.5 pb-3 pt-2 sm:px-5 sm:pb-4 sm:pt-2.5"
        style={{ backgroundColor: CARD_CANVAS }}
      >
        <p
          id={titleId}
          className="line-clamp-7 w-full hyphens-auto text-center text-[1.0625rem] font-extrabold leading-normal tracking-tight text-balance sm:text-[1.125rem] sm:leading-snug md:line-clamp-[8] md:text-[1.1875rem] md:leading-snug lg:text-[1.25rem] xl:text-[1.3125rem]"
          style={{ color: NAVY }}
        >
          {beitrag.title}
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-[0.75rem] leading-relaxed text-neutral-500 sm:mt-2.5 sm:text-[0.8125rem] sm:leading-relaxed">
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
  const [activeCategory, setActiveCategory] = useState<RatgeberCategoryId>("pflegegrad_leistungen");
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

  const categoryLabel = RATGEBER_CATEGORY_LABELS[activeCategory];

  const beliebtListe = useMemo(() => {
    const inCat = RATGEBER_BEITRAEGE.filter((b) => matchesCategory(b, activeCategory));
    const pool = inCat.length > 0 ? inCat : [...RATGEBER_BEITRAEGE];
    return [...pool].sort((a, b) => getDisplayViews(b) - getDisplayViews(a)).slice(0, 8);
  }, [getDisplayViews, activeCategory]);

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
      {/* Hero: mobil Bild oben (kürzeres Band, stärkeres Bild), Text & Suche darunter; ab md wie zuvor über dem Bild */}
      <section
        className="relative z-10 w-full px-3 sm:px-4 md:px-5"
        aria-labelledby="ratgeber-hub-heading"
      >
        <div className="relative isolate flex w-full flex-col overflow-hidden rounded-b-3xl bg-[#FFFCFA] md:min-h-[18rem] lg:min-h-[19.5rem]">
          {/* Mobil: Band noch niedriger; Bild nach rechts ausrichten (links stärker beschneiden) */}
          <div
            className="pointer-events-none relative z-0 h-[5.5rem] w-full shrink-0 overflow-hidden sm:h-[6.5rem] md:absolute md:inset-0 md:h-auto md:rounded-b-3xl"
            aria-hidden
          >
            <Image
              src="/images/Ratgeber/ratgeber.webp"
              alt=""
              fill
              className="object-cover object-[72%_center] scale-[1.18] max-md:-translate-x-[2%] md:translate-x-0 md:scale-100 md:object-contain md:object-center"
              sizes="(min-width: 768px) 96vw, 100vw"
              quality={92}
              priority
            />
          </div>
          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-4 pb-4 pt-3.5 sm:px-6 sm:pb-5 sm:pt-4 md:min-h-[18rem] md:pb-6 md:pt-12 lg:min-h-[19.5rem] lg:px-[var(--ahs-page-gutter)] lg:pt-12">
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

      <Container className="mx-auto max-w-[min(96rem,calc(100vw-1.5rem))] overflow-x-clip px-3 pt-5 sm:px-6 sm:pt-6 lg:pb-2 lg:pl-3 lg:pr-10 xl:pl-4 xl:pr-14 2xl:pl-6 2xl:pr-16">
        <section id="alle-ratgeber" className="scroll-mt-24">
          <div className="mx-auto mt-8 flex w-full max-w-full flex-col gap-8 lg:mt-10 lg:flex-row lg:flex-nowrap lg:items-start lg:justify-end lg:gap-10 lg:translate-x-[min(1.75rem,3.5vw)] xl:gap-14 xl:translate-x-[min(2.5rem,5vw)] 2xl:gap-16 2xl:translate-x-[min(3rem,5.5vw)]">
            <div className="flex w-full min-w-0 flex-col items-stretch lg:w-[62rem] lg:max-w-[62rem] lg:flex-none">
              <div className="w-full">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <h2 className="text-center text-base font-bold tracking-tight sm:text-left sm:text-lg" style={{ color: NAVY }}>
                    {categoryLabel}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
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
                  <ul className="mx-auto mt-4 grid w-full grid-cols-2 gap-x-4 gap-y-7 sm:gap-x-5 md:grid-cols-3 md:gap-y-8 lg:gap-x-5 lg:gap-y-10 xl:gap-x-6">
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
            </div>

            <aside
              className="w-full shrink-0 border border-neutral-200/80 bg-white/90 p-4 shadow-sm sm:p-4 lg:sticky lg:top-24 lg:w-[18rem] lg:max-w-[18rem] lg:flex-none lg:self-start lg:translate-x-2 xl:translate-x-3 2xl:translate-x-4"
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
                {beliebtListe.length === 0 ? (
                  <li className="rounded-lg border border-dashed border-neutral-200 bg-[#fafcfb] px-3 py-4 text-center text-[0.72rem] font-medium leading-snug text-neutral-500 sm:text-[0.75rem]">
                    Noch keine Artikel eingetragen.
                  </li>
                ) : (
                  beliebtListe.map((b, i) => (
                    <li key={b.slug}>
                      <Link
                        href={`/ratgeber/${b.slug}`}
                        className="group flex items-center gap-2.5 rounded-lg py-1.5 pr-1 transition hover:bg-[#F2F9FA]"
                      >
                        <span
                          className="flex h-[1.625rem] min-w-[1.625rem] shrink-0 items-center justify-center rounded text-[0.65rem] font-extrabold leading-none text-white"
                          style={{ backgroundColor: i === 0 ? ORANGE : NAVY }}
                          aria-hidden
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <span className="line-clamp-4 text-left text-[0.75rem] font-extrabold leading-snug text-[#0F4F68] group-hover:underline sm:text-[0.8rem]">
                            {b.title}
                          </span>
                          <span className="mt-0.5 block text-[0.6rem] text-neutral-500">
                            {getDisplayViews(b).toLocaleString("de-DE")} Aufrufe
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))
                )}
              </ol>
            </aside>
          </div>
        </section>
      </Container>
    </div>
  );
}
