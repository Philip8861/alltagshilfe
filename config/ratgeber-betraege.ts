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

/** Einheitliche Lesezeit für Übersicht, Karten und Artikel-Meta (Quelle: `RATGEBER_BEITRAEGE`). */
export function getRatgeberBeitragReadMinutes(slug: string): number {
  const b = RATGEBER_BEITRAEGE.find((x) => x.slug === slug);
  return b?.readMinutes ?? readMinutesFromWordCount(2000);
}

export const RATGEBER_CATEGORY_LABELS: Record<RatgeberCategoryId, string> = {
  pflegegrad_leistungen: "Pflegegrad & Pflegeleistungen",
  haushalt_betreuung: "Haushaltshilfe & Betreuung",
  pflegehilfsmittel_42eur: "Pflegehilfsmittel & 42€ Pauschale",
  inkontinenz: "Inkontinenzversorgung",
  pflegeberatung_beratungseinsaetze: "Pflegeberatung & Beratungseinsätze",
  pflegende_angehoerige: "Pflegende Angehörige",
  pflegealltag_zuhause: "Pflegealltag zu Hause",
  antraege_checklisten_downloads: "Anträge, Rechner & Downloads",
};

const PFLEGEGRAD_BEANTRAGEN_WORDS = 1600;
const PFLEGEGRAD1_WORDS = 3000;
const PFLEGEGELDRECHNER_WORDS = 520;

export const RATGEBER_BEITRAEGE: RatgeberBeitragMeta[] = [
  {
    slug: "pflegegrad-1",
    title: "Pflegegrad 1: Voraussetzungen, Leistungen und Tipps für Angehörige",
    excerpt:
      "Pflegegrad 1 steht für eine geringe Beeinträchtigung im Alltag – mit Entlastungsbetrag, Pflegehilfsmitteln und weiteren Ansprüchen. So beantragen Sie Leistungen und nutzen Unterstützung sinnvoll.",
    image: "/images/Ratgeber/pflegegrad_1.webp",
    imageAlt: "Pflegegrad 1: Leistungen, Antrag und Entlastung im Alltag verständlich erklärt",
    views: 540,
    tags: [
      "Pflegegrad 1",
      "Pflegegrad 1 Leistungen",
      "Pflegegrad 1 Entlastungsbetrag",
      "Pflegegrad 1 beantragen",
      "Entlastungsbetrag",
      "Pflegehilfsmittel",
      "Haushaltshilfe Pflegegrad 1",
    ],
    categories: ["pflegegrad_leistungen", "pflegende_angehoerige"],
    approxWordCount: PFLEGEGRAD1_WORDS,
    readMinutes: readMinutesFromWordCount(PFLEGEGRAD1_WORDS),
    publishedAt: "2026-04-30",
  },
  {
    slug: "pflegegrad-beantragen",
    title: "Pflegegrad beantragen: So erhalten Sie Schritt für Schritt die richtige Unterstützung",
    excerpt:
      "Wer im Alltag dauerhaft Unterstützung benötigt, kann einen Pflegegrad beantragen. Dieser Ratgeber erklärt Schritt für Schritt, wie der Antrag funktioniert, wie die Begutachtung abläuft und worauf Angehörige achten sollten.",
    image: "/images/Ratgeber/Pflegegrad_beantragen.webp",
    imageAlt:
      "Pflegegrad beantragen: Antrag, Unterlagen und Weg zur Begutachtung – verständlich erklärt",
    views: 720,
    tags: [
      "Pflegegrad beantragen",
      "Pflegegrad Antrag",
      "Pflegegrad beantragen 2026",
      "Pflegekasse Antrag",
      "MD Begutachtung",
      "Pflegegrad abgelehnt",
      "Pflegegeld beantragen",
      "Pflegeleistungen 2026",
    ],
    categories: ["pflegegrad_leistungen"],
    approxWordCount: PFLEGEGRAD_BEANTRAGEN_WORDS,
    readMinutes: readMinutesFromWordCount(PFLEGEGRAD_BEANTRAGEN_WORDS),
    publishedAt: "2026-04-29",
    featured: true,
  },
  {
    slug: "pflegegeldrechner",
    title: "Pflegegeldrechner 2026: Pflegegeld je Pflegegrad berechnen",
    excerpt:
      "Berechnen Sie schnell Ihr monatliches Pflegegeld 2026. Pflegegrad auswählen und Betrag sofort sehen. Alltagshilfe-Süd hilft beim Antrag und Widerspruch.",
    image: "/images/Ratgeber/pflegegrad_rechner.webp",
    imageAlt: "Pflegegeldrechner: Beträge nach Pflegegrad 2026 übersichtlich",
    views: 120,
    tags: [
      "Pflegegeldrechner",
      "Pflegegeld 2026",
      "Pflegegeld berechnen",
      "Pflegegeld Pflegegrad",
      "häusliche Pflege",
      "Pflegekasse",
    ],
    categories: ["antraege_checklisten_downloads", "pflegegrad_leistungen"],
    approxWordCount: PFLEGEGELDRECHNER_WORDS,
    readMinutes: readMinutesFromWordCount(PFLEGEGELDRECHNER_WORDS),
    publishedAt: "2026-04-30",
  },
];

/** Aquarell-Teaserbilde für Ratgeber-Hub-Karten (optional pro Slug). */
const RATGEBER_HUB_CARD_IMAGES: Record<string, string> = {
  "pflegegrad-1": "/images/Ratgeber/pflegegrad_1.webp",
  "pflegegrad-beantragen": "/images/Ratgeber/Pflegegrad_beantragen.webp",
  pflegegeldrechner: "/images/Ratgeber/pflegegrad_rechner.webp",
};

export function ratgeberHubCardImage(slug: string): string {
  return RATGEBER_HUB_CARD_IMAGES[slug] ?? "/images/Ratgeber/ratgeber.webp";
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
 * Reihenfolge auf der Ratgeber-Übersicht: Platz 1 → Platz 2 (nur eingetragene Slugs mit `featured: true`).
 */
const RATGEBER_FEATURED_HOME_ORDER: readonly string[] = ["pflegegrad-beantragen"];

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

/** @deprecated Nutzung: getFeaturedRatgeberBeitraege(1)[0] */
export function getFeaturedRatgeberBeitrag(): RatgeberBeitragMeta | undefined {
  const [first] = getFeaturedRatgeberBeitraege(1);
  return first;
}

/** Kategorie-Label für Anzeige unter dem Titel (erste passende). */
export function primaryCategoryLabel(beitrag: RatgeberBeitragMeta): string {
  const first = beitrag.categories[0];
  return first ? RATGEBER_CATEGORY_LABELS[first] : "Ratgeber";
}
