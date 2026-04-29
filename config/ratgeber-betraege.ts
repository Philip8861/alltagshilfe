/**
 * Zentrale Ratgeber-Metadaten für Verzeichnis, Verwandte Beiträge und Aufrufzahlen.
 */
export type RatgeberCategoryId =
  | "pflegegrad_leistungen"
  | "haushalt_betreuung"
  | "pflegehilfsmittel_42eur"
  | "inkontinenz"
  | "pflegeberatung_beratungseinsaetze"
  | "pflegende_angehoerige"
  | "pflegealltag_zuhause"
  | "antraege_checklisten_downloads";

export type RatgeberBeitragMeta = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  /** Referenz-Aufrufzahl (Fallback, wenn Live-Analytics nicht verfügbar). */
  views: number;
  tags: string[];
  /** Filter-Kategorien (Themen-Pills) – ein Beitrag kann mehreren zugeordnet sein. */
  categories: RatgeberCategoryId[];
  /** Rohtext-Menge (Seiteninhalt) zur Lesezeit-Schätzung (~200 Wörter/Min.). */
  approxWordCount: number;
  readMinutes: number;
  publishedAt: string;
  /** Wird als großer Empfehlungskasten („Top Thema“) oben angezeigt. */
  featured?: boolean;
};

/** Für informative Texte DE (Median ~175–225 W/min). */
export const RATGEBER_WORDS_PER_MINUTE = 200;

export function readMinutesFromWordCount(words: number): number {
  return Math.max(1, Math.round(words / RATGEBER_WORDS_PER_MINUTE));
}

export const RATGEBER_CATEGORY_LABELS: Record<RatgeberCategoryId, string> = {
  pflegegrad_leistungen: "Pflegegrad & Pflegeleistungen",
  haushalt_betreuung: "Haushaltshilfe & Betreuung",
  pflegehilfsmittel_42eur: "Pflegehilfsmittel & 42€ Pauschale",
  inkontinenz: "Inkontinenzversorgung",
  pflegeberatung_beratungseinsaetze: "Pflegeberatung & Beratungseinsätze",
  pflegende_angehoerige: "Pflegende Angehörige",
  pflegealltag_zuhause: "Pflegealltag zu Hause",
  antraege_checklisten_downloads: "Anträge, Checklisten & Downloads",
};

export const RATGEBER_BEITRAEGE: RatgeberBeitragMeta[] = [
  {
    slug: "pflegegrad-beantragen-2026",
    title: "Pflegegrad beantragen 2026: Schritt-für-Schritt-Anleitung für Angehörige",
    excerpt:
      "Pflegegrad beantragen 2026: So stellen Angehörige den Antrag richtig. Mit Ablauf, Fristen, MD-/MDK-Begutachtung, Leistungen und Checkliste.",
    image: "/images/Ratgeber/ratgeber.webp",
    imageAlt: "Ratgeber: Pflegegrad beantragen – Antrag, Begutachtung und Leistungen im Überblick",
    views: 0,
    tags: [
      "pflegegrad beantragen",
      "Pflegegrad Antrag",
      "MDK",
      "Pflegekasse",
      "Angehörige",
      "2026",
    ],
    categories: ["pflegegrad_leistungen", "antraege_checklisten_downloads", "pflegende_angehoerige"],
    approxWordCount: 3200,
    readMinutes: readMinutesFromWordCount(3200),
    publishedAt: "2026-01-15",
    featured: true,
  },
  {
    slug: "pflegegrad-beantragen-checkliste",
    title: "Pflegegrad beantragen: Checkliste, Unterlagen & Tipps 2026",
    excerpt:
      "Pflegegrad beantragen leicht erklärt: Checkliste zur Pflegekasse, Unterlagen, Pflegetagebuch und Begutachtung – gedacht für Angehörige.",
    image: "/images/Ratgeber/ratgeber.webp",
    imageAlt: "Pflegegrad beantragen: Checkliste und Tipps zur Begutachtung",
    views: 0,
    tags: [
      "Pflegegrad beantragen",
      "Pflegegrad Antrag",
      "Begutachtung",
      "Pflegekasse",
      "Angehörige",
      "MD",
    ],
    categories: [
      "antraege_checklisten_downloads",
      "pflegende_angehoerige",
      "pflegegrad_leistungen",
    ],
    approxWordCount: 2800,
    readMinutes: readMinutesFromWordCount(2800),
    publishedAt: "2026-04-27",
  },
  {
    slug: "hausnotruf-ratgeber",
    title: "Hausnotruf-Ratgeber: Sicherheit zu Hause einfach erklärt",
    excerpt:
      "Für wen ein Hausnotruf sinnvoll ist, was die Pflegekasse übernimmt und wie Sie das passende System für den Alltag auswählen.",
    image: "/images/Ratgeber/ratgeber.webp",
    imageAlt: "Vorschaubild Hausnotruf-Ratgeber",
    views: 489,
    tags: ["Hausnotruf", "Sicherheit", "Pflegekasse", "Pflegegrad", "Notfallhilfe"],
    categories: ["pflegealltag_zuhause", "pflegegrad_leistungen"],
    approxWordCount: 940,
    readMinutes: readMinutesFromWordCount(940),
    publishedAt: "2025-08-12",
  },
  {
    slug: "entlastungsbetrag-131-euro",
    title: "Entlastungsbetrag 131 Euro: so nutzen Sie Ihren Anspruch richtig",
    excerpt:
      "Wer Anspruch hat, welche Leistungen bezahlt werden, wie lange ungenutzte Beträge gültig sind und wie die Abrechnung mit der Pflegekasse funktioniert.",
    image: "/images/Ratgeber/Entlastungsbetrag_131_Euro.webp",
    imageAlt: "Symbolbild: Entlastungsbetrag 131 Euro – hauswirtschaftliche Entlastung und Pflegealltag",
    views: 1284,
    tags: ["Entlastungsbetrag", "Pflegekasse", "Abrechnung", "Pflegegrad"],
    categories: ["pflegegrad_leistungen", "haushalt_betreuung"],
    approxWordCount: 520,
    readMinutes: readMinutesFromWordCount(520),
    publishedAt: "2025-11-03",
    featured: true,
  },
  {
    slug: "pflegegrad-1-der-ultimative-leitfaden",
    title: "Pflegegrad 1: der ultimative Leitfaden (2026)",
    excerpt:
      "Leistungen, Voraussetzungen & Experten-Tipps – inklusive Vorbereitung auf die MDK-Begutachtung.",
    image: "/images/Ratgeber/pflegegrad1.webp",
    imageAlt: "Pflegegrad 1: Leistungen der Pflegeversicherung und Tipps zur MDK-Begutachtung",
    views: 623,
    tags: ["Pflegegrad 1", "MDK", "Begutachtung", "Leistungen", "Entlastungsbetrag"],
    categories: ["pflegegrad_leistungen"],
    approxWordCount: 1860,
    readMinutes: readMinutesFromWordCount(1860),
    publishedAt: "2026-02-18",
    featured: true,
  },
  {
    slug: "pflegegrad-2-alles-was-du-wissen-musst",
    title: "Pflegegrad 2: alles, was Sie wissen müssen (2026)",
    excerpt:
      "Leistungen, Voraussetzungen und wichtige Pflichten – inkl. Pflegegeld, Pflegesachleistungen und Beratungseinsatz nach §37.3.",
    image: "/images/Ratgeber/ratgeber.webp",
    imageAlt: "Vorschaubild Pflegegrad 2",
    views: 512,
    tags: ["Pflegegrad 2", "Pflegegeld", "Pflegesachleistungen", "Ersatzpflege", "§37.3"],
    categories: ["pflegegrad_leistungen", "pflegeberatung_beratungseinsaetze"],
    approxWordCount: 1320,
    readMinutes: readMinutesFromWordCount(1320),
    publishedAt: "2026-03-22",
  },
];

/** Aquarell-Teaserbilde für die Ratgeber-Hub-Karten (ein Bild pro Artikel, Fallback blog_7). */
const RATGEBER_HUB_CARD_IMAGES: Record<string, string> = {
  "pflegegrad-beantragen-2026": "/images/Ratgeber/blog_1.webp",
  "pflegegrad-beantragen-checkliste": "/images/Ratgeber/blog_2.webp",
  "hausnotruf-ratgeber": "/images/Ratgeber/blog_3.webp",
  "entlastungsbetrag-131-euro": "/images/Ratgeber/blog_4.webp",
  "pflegegrad-1-der-ultimative-leitfaden": "/images/Ratgeber/blog_5.webp",
  "pflegegrad-2-alles-was-du-wissen-musst": "/images/Ratgeber/blog_6.webp",
};

export function ratgeberHubCardImage(slug: string): string {
  return RATGEBER_HUB_CARD_IMAGES[slug] ?? "/images/Ratgeber/blog_7.webp";
}

export function getVerwandteRatgeberBeitraege(currentSlug: string, limit = 4): RatgeberBeitragMeta[] {
  const current = RATGEBER_BEITRAEGE.find((b) => b.slug === currentSlug);
  const others = RATGEBER_BEITRAEGE.filter((b) => b.slug !== currentSlug);
  if (!current) return others.slice(0, limit);
  const catSet = new Set(current.categories);
  const scored = others.map((b) => ({
    b,
    score: b.categories.reduce((acc, c) => acc + (catSet.has(c) ? 2 : 0), 0),
  }));
  scored.sort((a, b) => b.score - a.score || b.b.views - a.b.views);
  return scored.slice(0, limit).map((s) => s.b);
}

/**
 * Reihenfolge auf der Ratgeber-Übersicht: Platz 1 → Platz 2 (nur eingetragene Slugs müssen `featured: true` sein).
 */
const RATGEBER_FEATURED_HOME_ORDER = [
  "pflegegrad-beantragen-2026",
  "entlastungsbetrag-131-euro",
  "pflegegrad-1-der-ultimative-leitfaden",
] as const;

/**
 * Alle mit `featured: true`; Reihenfolge nach `RATGEBER_FEATURED_HOME_ORDER`, dann fehlende Plätze per Aufrufen.
 */
export function getFeaturedRatgeberBeitraege(limit = 2): RatgeberBeitragMeta[] {
  const featured = RATGEBER_BEITRAEGE.filter((b) => b.featured);
  const bySlug = new Map(featured.map((b) => [b.slug, b]));
  const ordered: RatgeberBeitragMeta[] = [];

  for (const slug of RATGEBER_FEATURED_HOME_ORDER) {
    const meta = bySlug.get(slug);
    if (meta) ordered.push(meta);
    if (ordered.length >= limit) return ordered;
  }

  const seenOrdered = new Set(ordered.map((b) => b.slug));
  const leftovers = [...featured.filter((b) => !seenOrdered.has(b.slug))].sort((a, b) => b.views - a.views);
  for (const m of leftovers) {
    ordered.push(m);
    if (ordered.length >= limit) break;
  }

  if (ordered.length >= limit) return ordered.slice(0, limit);

  const out = [...ordered];
  const seen = new Set(out.map((b) => b.slug));
  const rest = [...RATGEBER_BEITRAEGE]
    .filter((b) => !seen.has(b.slug))
    .sort((a, b) => b.views - a.views);
  for (const r of rest) {
    if (out.length >= limit) break;
    out.push(r);
    seen.add(r.slug);
  }
  return out.slice(0, limit);
}

/** @deprecated Einzel‑Featured – Nutzung: getFeaturedRatgeberBeitraege(1)[0]. */
export function getFeaturedRatgeberBeitrag(): RatgeberBeitragMeta {
  const [first] = getFeaturedRatgeberBeitraege(1);
  return first!;
}

/** Kategorie-Label für Anzeige unter dem Titel (erste passende). */
export function primaryCategoryLabel(beitrag: RatgeberBeitragMeta): string {
  const first = beitrag.categories[0];
  return first ? RATGEBER_CATEGORY_LABELS[first] : "Ratgeber";
}
