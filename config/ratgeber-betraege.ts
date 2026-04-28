/**
 * Zentrale Ratgeber-Metadaten für Verzeichnis, Verwandte Beiträge und Aufrufzahlen.
 */
export type RatgeberCategoryId = "finanzen" | "pflege_zuhause" | "entlastung" | "recht";

export type RatgeberBeitragMeta = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  views: number;
  tags: string[];
  /** Filter-Kategorien (Themen-Pills) – ein Beitrag kann mehreren zugeordnet sein. */
  categories: RatgeberCategoryId[];
  readMinutes: number;
  publishedAt: string;
  /** Wird als großer Empfehlungskasten oben angezeigt. */
  featured?: boolean;
};

export const RATGEBER_CATEGORY_LABELS: Record<RatgeberCategoryId, string> = {
  finanzen: "Finanzen & Leistungen",
  pflege_zuhause: "Pflege zu Hause",
  entlastung: "Entlastung",
  recht: "Recht & Organisation",
};

export const RATGEBER_BEITRAEGE: RatgeberBeitragMeta[] = [
  {
    slug: "hausnotruf-ratgeber",
    title: "Hausnotruf-Ratgeber: Sicherheit zu Hause einfach erklärt",
    excerpt:
      "Für wen ein Hausnotruf sinnvoll ist, was die Pflegekasse übernimmt und wie Sie das passende System für den Alltag auswählen.",
    image: "/images/Ratgeber/ratgeber.webp",
    imageAlt: "Vorschaubild Hausnotruf-Ratgeber",
    views: 489,
    tags: ["Hausnotruf", "Sicherheit", "Pflegekasse", "Pflegegrad", "Notfallhilfe"],
    categories: ["pflege_zuhause", "entlastung"],
    readMinutes: 6,
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
    categories: ["finanzen", "entlastung"],
    readMinutes: 5,
    publishedAt: "2025-11-03",
    featured: true,
  },
  {
    slug: "pflegegrad-1-der-ultimative-leitfaden",
    title: "Pflegegrad 1: der ultimative Leitfaden (2026)",
    excerpt:
      "Leistungen, Voraussetzungen & Experten-Tipps – inklusive Vorbereitung auf die MDK-Begutachtung.",
    image: "/images/Ratgeber/ratgeber.webp",
    imageAlt: "Vorschaubild Pflegegrad 1 Leitfaden",
    views: 623,
    tags: ["Pflegegrad 1", "MDK", "Begutachtung", "Leistungen", "Entlastungsbetrag"],
    categories: ["finanzen", "recht"],
    readMinutes: 8,
    publishedAt: "2026-02-18",
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
    categories: ["finanzen", "recht"],
    readMinutes: 7,
    publishedAt: "2026-03-22",
  },
];

export function getVerwandteRatgeberBeitraege(currentSlug: string, limit = 4): RatgeberBeitragMeta[] {
  return RATGEBER_BEITRAEGE.filter((b) => b.slug !== currentSlug).slice(0, limit);
}

/** Erste Markierung mit `featured: true`, sonst Beitrag mit den meisten Aufrufen. */
export function getFeaturedRatgeberBeitrag(): RatgeberBeitragMeta {
  const featured = RATGEBER_BEITRAEGE.find((b) => b.featured);
  if (featured) return featured;
  return [...RATGEBER_BEITRAEGE].sort((a, b) => b.views - a.views)[0]!;
}

/** Kategorie-Label für Anzeige unter dem Titel (erste passende). */
export function primaryCategoryLabel(beitrag: RatgeberBeitragMeta): string {
  const first = beitrag.categories[0];
  return first ? RATGEBER_CATEGORY_LABELS[first] : "Ratgeber";
}
