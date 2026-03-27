/**
 * Zentrale Ratgeber-Metadaten für Verzeichnis, Verwandte Beiträge und Aufrufzahlen.
 */
export type RatgeberBeitragMeta = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  views: number;
  tags: string[];
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
  },
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
    excerpt:
      "Leistungen, Voraussetzungen & Experten-Tipps – inklusive Vorbereitung auf die MDK-Begutachtung.",
    image: "/images/Ratgeber/ratgeber.webp",
    imageAlt: "Vorschaubild Pflegegrad 1 Leitfaden",
    views: 623,
    tags: ["Pflegegrad 1", "MDK", "Begutachtung", "Leistungen", "Entlastungsbetrag"],
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
  },
];

export function getVerwandteRatgeberBeitraege(currentSlug: string, limit = 4): RatgeberBeitragMeta[] {
  return RATGEBER_BEITRAEGE.filter((b) => b.slug !== currentSlug).slice(0, limit);
}
