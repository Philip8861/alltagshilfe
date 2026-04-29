import type { BlogCategoryDef, BlogCategorySlug } from "@/lib/blog/types";

export const BLOG_CATEGORIES: BlogCategoryDef[] = [
  {
    slug: "pflegegrad-leistungen",
    title: "Pflegegrad & Pflegeleistungen",
    shortIntro:
      "Antragstellung, Begutachtung, Pflegegeld und Leistungen der Pflegeversicherung – verständlich erklärt für Angehörige.",
    seoTitle: "Pflegegrad & Pflegeleistungen: Ratgeber für Angehörige",
    metaDescription:
      "Alle wichtigen Informationen zu Pflegegrad, Pflegegeld, MD-/MDK-Begutachtung, Leistungen und Antragstellung.",
  },
  {
    slug: "haushaltshilfe-entlastungsbetrag",
    title: "Haushaltshilfe & Entlastungsbetrag",
    shortIntro:
      "Entlastung im Alltag, anerkannte Angebote und Abrechnung mit der Pflegekasse.",
    seoTitle: "Haushaltshilfe & Entlastungsbetrag: Ratgeber",
    metaDescription:
      "Entlastungsbetrag, Haushaltshilfe mit Pflegegrad und haushaltsnahe Dienstleistungen – Überblick und Tipps.",
  },
  {
    slug: "pflegehilfsmittel-42-euro",
    title: "Pflegehilfsmittel 42 Euro",
    shortIntro:
      "Versorgung mit Verbrauchshilfen, Pflegebox und Hinweise zur Antragstellung.",
    seoTitle: "Pflegehilfsmittel & 42‑Euro-Pauschale",
    metaDescription:
      "Pflegehilfsmittel zum Verbrauch, monatlicher Freibetrag und typische Produktgruppen im Überblick.",
  },
  {
    slug: "inkontinenzversorgung",
    title: "Inkontinenzversorgung",
    shortIntro:
      "Material, Hautschutz und Abrechnung – sachlich und ohne Tabus.",
    seoTitle: "Inkontinenzversorgung: Ratgeber",
    metaDescription:
      "Windeln, Einlagen, Bettschutz und Hinweise zur Versorgung bei Inkontinenz im Pflegealltag.",
  },
  {
    slug: "pflegeberatung",
    title: "Pflegeberatung",
    shortIntro:
      "Beratungseinsätze, Pflichtberatung und private Beratungsangebote im Kontext Pflege.",

    seoTitle: "Pflegeberatung: Übersicht für Familien",
    metaDescription:
      "Pflegeberatung nach Pflichtvorgaben, §37.3 und Hilfe zur Entscheidungsfindung – gut vorbereitet in die Gespräche.",
  },
  {
    slug: "pflegende-angehoerige",
    title: "Pflegende Angehörige",
    shortIntro:
      "Rollen klären, Grenzen erkennen, Entlastungsangebote nutzen.",
    seoTitle: "Pflegende Angehörige: Entlastung & Rechte",
    metaDescription:
      "Pflegezeit, Überforderung, Verhinderungs- und Kurzzeitpflege – zusammenhängende Informationen für Familien.",
  },
  {
    slug: "pflegealltag-zu-hause",
    title: "Pflegealltag zu Hause",
    shortIntro:
      "Orientierung zur sicheren Gestaltung des Alltags, Mobilität, Medikamente und häuslicher Pflege.",

    seoTitle: "Pflegealltag zu Hause: Ratgeber",
    metaDescription:
      "Demenz, Mobilisation, Hausnotruf und Alltagssicherheit – praxisnah erklärt.",
  },
  {
    slug: "downloads-checklisten",
    title: "Downloads & Checklisten",
    shortIntro:
      "Nachschlagbare Checklisten zu Antrag, Begutachtung und Versorgungsbausteinen.",

    seoTitle: "Downloads & Checklisten Pflege",
    metaDescription:
      "Strukturierte Hilfen zum Ausdrucken und Abhaken auf dem Weg durch Anträge und Gespräche.",
  },
  {
    slug: "regionale-hilfe",
    title: "Regionale Hilfe vor Ort",
    shortIntro:
      "Wo wir aktiv sind und wie Sie Ihre nächsten Schritte finden.",
    seoTitle: "Regionale Hilfe vor Ort – Alltagshilfe-Süd",
    metaDescription:
      "Über Standorte und Einzugsgebiete – keine Massen‑PLZ-Seiten, dafür zentrale Orientierung.",
  },
];

export function getCategoryBySlug(slug: string): BlogCategoryDef | undefined {
  return BLOG_CATEGORIES.find((c) => c.slug === slug);
}

export function getCategorySlugList(): BlogCategorySlug[] {
  return BLOG_CATEGORIES.map((c) => c.slug);
}
