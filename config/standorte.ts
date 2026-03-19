/**
 * Standorte nach PLZ – aus Standortlisten.pdf.
 * PLZ-Suche (Standort suchen, Kontakt-Popup) und findStandortByPlz nutzen diese Daten.
 */
import standortePlzData from "./standorte-plz-generated.json";
import standortePlzOverrides from "./standorte-plz-overrides.json";

type StandortePlzJson = {
  Allgäu: string[];
  Wangen: string[];
  Augsburg: string[];
  "Engen/Konstanz": string[];
  plzToOrt?: Record<string, string>;
};

const data = standortePlzData as StandortePlzJson;
const plzToOrt: Record<string, string> = data.plzToOrt ?? {};
const plzOverrides: Record<string, string> = standortePlzOverrides as Record<string, string>;

export interface Standort {
  name: string;
  address: string;
  phone: string;
  phoneHref: string;
  hours: string;
  plzList: string[];
}

const HOURS =
  "Mo–Do: 08:30 – 12:00 und 13:00 – 16:00 Uhr · Freitag: 08:30 – 12:00 Uhr";

export const standorteByPlz: Standort[] = [
  {
    name: "Standort Allgäu",
    address: "Hinter den Gärten 10, 87730 Bad Grönenbach",
    phone: "08334 / 9893330",
    phoneHref: "tel:+4983349893330",
    hours: HOURS,
    plzList: data["Allgäu"] ?? [],
  },
  {
    name: "Wangen (Bodenseeregion)",
    address: "Karlstraße 3, 88239 Wangen im Allgäu",
    phone: "07522 / 9151686",
    phoneHref: "tel:+4975229151686",
    hours: HOURS,
    plzList: data["Wangen"] ?? [],
  },
  {
    name: "Standort Augsburg",
    address: "Ulmer Straße 160, 86156 Augsburg",
    phone: "0821 / 48046200",
    phoneHref: "tel:+4982148046200",
    hours: HOURS,
    plzList: data["Augsburg"] ?? [],
  },
  {
    name: "Standort Engen/Konstanz",
    address: "Robert-Bosch-Straße 1, 78234 Engen",
    phone: "08334 / 9893330",
    phoneHref: "tel:+4983349893330",
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

/** Ortsname zur PLZ (aus Standortlisten.pdf + optionale Overrides); für Anzeige „PLZ Ort“. */
export function getOrtByPlz(plz: string): string | undefined {
  const normalized = plz.replace(/\D/g, "").slice(0, 5);
  if (plzOverrides[normalized]) return plzOverrides[normalized];
  return plzToOrt[normalized];
}
