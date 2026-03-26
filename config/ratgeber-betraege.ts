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
];

export function getVerwandteRatgeberBeitraege(currentSlug: string, limit = 4): RatgeberBeitragMeta[] {
  return RATGEBER_BEITRAEGE.filter((b) => b.slug !== currentSlug).slice(0, limit);
}
