/**
 * Standorte nach PLZ – aus Standortlisten.pdf.
 * PLZ-Suche (Standort suchen, Kontakt-Popup) und findStandortByPlz nutzen diese Daten.
 */
import standortePlzData from "./standorte-plz-generated.json";

type StandortePlzJson = {
  Allgäu: string[];
  Wangen: string[];
  Augsburg: string[];
  "Engen/Konstanz": string[];
  plzToOrt?: Record<string, string>;
};

const data = standortePlzData as StandortePlzJson;
const plzToOrt: Record<string, string> = data.plzToOrt ?? {};

export interface Standort {
  name: string;
  address: string;
  phone: string;
  phoneHref: string;
  email: string;
  hours: string;
  plzList: string[];
}

const HOURS =
  "Mo–Do: 08:30 – 12:00 und 13:00 – 16:00 Uhr · Freitag: 08:30 – 12:00 Uhr";

/** Leistungen auf Standort-Unterseiten und Teaser-Karte (einheitlich). */
export const STANDORT_LEISTUNGEN = [
  "Haushaltshilfe",
  "Pflegeberatung nach §37.3 SGB XI",
  "Kostenfreie Pflegehilfsmittel",
] as const;

/** Slug des auf der Standorte-Seite hervorgehobenen Beispiel-Standorts (A–Z-Ausbau folgt). */
export const STANDORT_TEASER_SLUG = "87700-memmingen" as const;

export const standorteByPlz: Standort[] = [
  {
    name: "Standort Allgäu",
    address: "Hinter den Gärten 10, 87730 Bad Grönenbach",
    phone: "08334 / 9893330",
    phoneHref: "tel:+4983349893330",
    email: "Info@alltagshilfe-sued.de",
    hours: HOURS,
    plzList: data["Allgäu"] ?? [],
  },
  {
    name: "Wangen (Bodenseeregion)",
    address: "Karlstraße 3, 88239 Wangen im Allgäu",
    phone: "07522 / 9151686",
    phoneHref: "tel:+4975229151686",
    email: "wangen@alltagshilfe-sued.de",
    hours: HOURS,
    plzList: data["Wangen"] ?? [],
  },
  {
    name: "Standort Augsburg",
    address: "Ulmer Straße 160, 86156 Augsburg",
    phone: "0821 / 48046200",
    phoneHref: "tel:+4982148046200",
    email: "augsburg@alltagshilfe-sued.de",
    hours: HOURS,
    plzList: data["Augsburg"] ?? [],
  },
  {
    name: "Standort Engen/Konstanz",
    address: "Robert-Bosch-Straße 1, 78234 Engen",
    phone: "08334 / 9893330",
    phoneHref: "tel:+4983349893330",
    email: "engen@alltagshilfe-sued.de",
    hours: HOURS,
    plzList: data["Engen/Konstanz"] ?? [],
  },
];

/** Sucht Standort anhand PLZ (nur erste 5 Ziffern). */
export function findStandortByPlz(plz: string): Standort | undefined {
  const normalized = plz.replace(/\D/g, "").slice(0, 5);
  if (normalized.length < 5) return undefined;
  return standorteByPlz.find((s) => s.plzList.includes(normalized));
}

/** Ortsname zur PLZ (aus Standortlisten.pdf); für Anzeige „PLZ Ort“. */
export function getOrtByPlz(plz: string): string | undefined {
  const normalized = plz.replace(/\D/g, "").slice(0, 5);
  return plzToOrt[normalized];
}

/** Slug für Standort-Unterseite: z. B. "87700-memmingen" (PLZ + Ort normalisiert). */
export function ortToSlugSegment(ort: string): string {
  return ort
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");
}

/** Liefert PLZ, Ort und Standort für eine Slug-URL (z. B. "87700-memmingen"); null wenn ungültig. */
export function getStandortBySlug(slug: string): {
  plz: string;
  ort: string;
  standort: Standort;
} | null {
  const part = slug.trim().toLowerCase().split("-");
  const plz = part[0]?.replace(/\D/g, "").slice(0, 5);
  if (!plz || plz.length !== 5) return null;
  const ort = getOrtByPlz(plz);
  const standort = findStandortByPlz(plz);
  if (!ort || !standort) return null;
  return { plz, ort, standort };
}

/** Alle gültigen Standort-Slugs für SSG (PLZ + Ort A–Z); für generateStaticParams. */
export function getAllStandortSlugs(): { slug: string }[] {
  const out: { slug: string }[] = [];
  for (const [plz, ort] of Object.entries(plzToOrt)) {
    if (plz.length !== 5 || !findStandortByPlz(plz)) continue;
    out.push({ slug: `${plz}-${ortToSlugSegment(ort)}` });
  }
  out.sort((a, b) => a.slug.localeCompare(b.slug));
  return out;
}
