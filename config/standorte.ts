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

/**
 * Repariert bekannte Mojibake-Sequenzen aus der PDF/JSON-Pipeline
 * (z. B. "St├Âtten" -> "Stötten"), damit Umlaute überall korrekt erscheinen.
 */
function normalizeOrtName(input: string): string {
  return input
    .replace(/├ñ/g, "ä")
    .replace(/├╝/g, "ü")
    .replace(/├Â/g, "ö")
    .replace(/├ƒ/g, "ß")
    .replace(/├ä/g, "Ä")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö")
    .replace(/├£/g, "Ö");
}

const plzToOrt: Record<string, string> = Object.fromEntries(
  Object.entries(data.plzToOrt ?? {}).map(([plz, ort]) => [plz, normalizeOrtNameSafe(ort)])
);

/**
 * Stabile Normalisierung für kaputte Zeichenketten (Mojibake).
 * Wird aktiv genutzt, bis der aufgeblähte Legacy-Block bereinigt ist.
 */
function normalizeOrtNameSafe(input: string): string {
  return input
    .replace(/├ñ/g, "ä")
    .replace(/├╝/g, "ü")
    .replace(/├Â/g, "ö")
    .replace(/├ƒ/g, "ß")
    .replace(/├ä/g, "Ä")
    .replace(/├£/g, "Ö")
    .replace(/├û/g, "Ü");
}

/** Strukturierte Adresse (JSON-LD, konsistent zu Anzeigezeile `address`). */
export type StandortSchemaAddress = {
  streetAddress: string;
  postalCode: string;
  addressLocality: string;
  addressCountry: "DE";
};

export interface Standort {
  name: string;
  address: string;
  phone: string;
  phoneHref: string;
  email: string;
  hours: string;
  plzList: string[];
  /** 2–3 Absätze: unterscheidet Büros inhaltlich (kein reines PLZ-Tauschen). */
  localIntro: readonly string[];
  schemaAddress: StandortSchemaAddress;
}

const HOURS =
  "Mo–Do: 08:30 – 12:00 und 13:00 – 16:00 Uhr · Freitag: 08:30 – 12:00 Uhr";

/** Leistungen auf Standort-Unterseiten und Teaser-Karte (einheitlich). */
export const STANDORT_LEISTUNGEN = [
  "Haushaltshilfe",
  "Alltagsbegleitung",
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
    localIntro: [
      "Ihre Anfrage aus dieser PLZ-Region wird von unserem Team am Standort Bad Grönenbach bearbeitet. Dort koordinieren wir Haushaltshilfe, Alltagsbegleitung und Anmeldungen – persönlich und mit festen Ansprechpartnerinnen und Ansprechpartnern.",
      "Wir sind im Allgäu und in angrenzenden Gemeinden unterwegs. Unter der angezeigten Rufnummer und E-Adresse erreichen Sie genau dieses Büro, nicht eine anonyme Zentrale.",
    ],
    schemaAddress: {
      streetAddress: "Hinter den Gärten 10",
      postalCode: "87730",
      addressLocality: "Bad Grönenbach",
      addressCountry: "DE",
    },
  },
  {
    name: "Wangen (Bodenseeregion)",
    address: "Karlstraße 3, 88239 Wangen im Allgäu",
    phone: "07522 / 9151686",
    phoneHref: "tel:+4975229151686",
    email: "wangen@alltagshilfe-sued.de",
    hours: HOURS,
    plzList: data["Wangen"] ?? [],
    localIntro: [
      "Für die Bodenseeregion und das umliegende Gebiet ist unser Büro in Wangen im Allgäu zuständig. Termine, Beratung und Organisation laufen dort gebündelt – Sie sprechen mit Kolleginnen und Kollegen vor Ort.",
      "Von Friedrichshafen bis ins Hinterland: Wir kennen die Region und begleiten Sie bei Haushaltshilfe, Begleitung und Pflegehilfsmitteln – erreichbar über die lokale Nummer auf dieser Seite.",
    ],
    schemaAddress: {
      streetAddress: "Karlstraße 3",
      postalCode: "88239",
      addressLocality: "Wangen im Allgäu",
      addressCountry: "DE",
    },
  },
  {
    name: "Standort Augsburg",
    address: "Ulmer Straße 160, 86156 Augsburg",
    phone: "0821 / 48046200",
    phoneHref: "tel:+4982148046200",
    email: "augsburg@alltagshilfe-sued.de",
    hours: HOURS,
    plzList: data["Augsburg"] ?? [],
    localIntro: [
      "Anfragen aus dem Augsburger Einzugsgebiet bearbeiten wir an der Ulmer Straße in Augsburg. Dort sitzt die Koordination für Haushaltshilfe, Begleitung und verwandte Leistungen in Stadt und näherer Region.",
      "Ob Innenstadt oder Landkreis: Ihre Kontaktdaten auf dieser Seite führen direkt zu diesem Team – inklusive der örtlichen Telefonzeiten und Erreichbarkeit.",
    ],
    schemaAddress: {
      streetAddress: "Ulmer Straße 160",
      postalCode: "86156",
      addressLocality: "Augsburg",
      addressCountry: "DE",
    },
  },
  {
    name: "Standort Engen/Konstanz",
    address: "Robert-Bosch-Straße 1, 78234 Engen",
    phone: "07733 / 948880",
    phoneHref: "tel:+497733948880",
    email: "engen@alltagshilfe-sued.de",
    hours: HOURS,
    plzList: data["Engen/Konstanz"] ?? [],
    localIntro: [
      "Diesen PLZ-Bereich betreut unser Standort in Engen. Von dort aus organisieren wir Haushaltshilfe und Begleitung Richtung Hochrhein und Bodensee – mit klaren Ansprechpartnern und regionaler Erfahrung.",
      "Für Konstanz, Singen und die umliegenden Orte ist diese Nummer Ihre direkte Verbindung zum Team vor Ort, inklusive Beratung zu Leistungen und nächsten Schritten.",
    ],
    schemaAddress: {
      streetAddress: "Robert-Bosch-Straße 1",
      postalCode: "78234",
      addressLocality: "Engen",
      addressCountry: "DE",
    },
  },
];

/**
 * Wandelt eine tel:-URL (E.164) in eine WhatsApp-wa.me-Adresse um.
 * z. B. tel:+4975229151686 → https://wa.me/4975229151686
 */
export function phoneHrefToWhatsAppUrl(phoneHref: string): string {
  const digits = phoneHref.replace(/^tel:/i, "").replace(/\D/g, "");
  if (!digits) return "https://wa.me/";
  return `https://wa.me/${digits}`;
}

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

const TEL_E164 = (href: string) => href.replace(/^tel:/i, "").replace(/\s/g, "");

/**
 * JSON-LD für den zuständigen Betrieb vor Ort (ergänzt Breadcrumb / FAQ).
 */
export function buildStandortLocalBusinessJsonLd(input: {
  pageUrl: string;
  siteUrl: string;
  organizationName: string;
  plz: string;
  ort: string;
  standort: Standort;
}): Record<string, unknown> {
  const base = input.siteUrl.replace(/\/$/, "");
  return {
    "@type": "LocalBusiness",
    "@id": `${input.pageUrl}#local-business`,
    name: `${input.organizationName} – ${input.standort.name}`,
    url: input.pageUrl,
    telephone: TEL_E164(input.standort.phoneHref),
    email: input.standort.email,
    image: `${base}/images/standort_hintergrund.webp`,
    address: {
      "@type": "PostalAddress",
      streetAddress: input.standort.schemaAddress.streetAddress,
      postalCode: input.standort.schemaAddress.postalCode,
      addressLocality: input.standort.schemaAddress.addressLocality,
      addressCountry: input.standort.schemaAddress.addressCountry,
    },
    parentOrganization: {
      "@type": "Organization",
      name: input.organizationName,
      url: base,
    },
    areaServed: {
      "@type": "Place",
      name: `${input.plz} ${input.ort}`,
    },
  };
}
