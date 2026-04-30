/**
 * Einheitliche Urheber- und Prüfzeile für Ratgeber-Artikel (Anzeige + strukturierte Daten).
 */
export const RATGEBER_BYLINE_REVIEWER_TEXT =
  "Fachlich geprüft von Luisa Gölder (zertifizierte Pflegeberaterin nach § 7a SGB XI)";

export const RATGEBER_BYLINE_AUTHOR_TEXT =
  "Autor: Alltagshilfe-Süd (Philip Sonntag, examinierter Gesundheits- und Krankenpfleger, Pflege-Autor)";

/** schema.org Person — Autor (Textbeitrag) */
export const RATGEBER_ARTICLE_JSONLD_AUTHOR = {
  "@type": "Person",
  name: "Philip Sonntag",
  jobTitle: "examinierter Gesundheits- und Krankenpfleger, Pflege-Autor",
  worksFor: { "@type": "Organization", name: "Alltagshilfe-Süd" },
} as const;

/** schema.org Person — fachliche Prüfung */
export const RATGEBER_ARTICLE_JSONLD_REVIEWER = {
  "@type": "Person",
  name: "Luisa Gölder",
  jobTitle: "zertifizierte Pflegeberaterin nach § 7a SGB XI",
} as const;
