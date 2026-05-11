import type { Standort } from "@/config/standorte";
import { features } from "@/config/features";

/**
 * Leistungsauswahl wie im Hilfe-Finder (Startseite) – eine Quelle für alle Flows mit gleichem Angebot.
 */
export type HilfefinderServiceKey =
  | "pflegegrad_beantrag_widerspruch"
  | "haushalt"
  | "pflegeberatung"
  | "pflegebox"
  | "koerperpflege"
  | "medizinisch"
  | "umbau"
  | "hausnotruf"
  | "hilfsmittel"
  | "essen";

const HILFEFINDER_SERVICE_OPTIONEN_ALL: {
  key: HilfefinderServiceKey;
  label: string;
  verfuegbarkeit: "direkt" | "partner";
}[] = [
  {
    key: "pflegegrad_beantrag_widerspruch",
    label: "Hilfe beim Beantragen oder Widerspruch des Pflegegrads",
    verfuegbarkeit: "direkt",
  },
  { key: "haushalt", label: "Alltagsbegleitung & Haushaltsreinigung", verfuegbarkeit: "direkt" },
  { key: "pflegeberatung", label: "Halb-, vierteljährliche Pflegeberatung nach §37.3", verfuegbarkeit: "direkt" },
  { key: "pflegebox", label: "Kostenlose Pflegebox (Einmalhandschuhe, Händedesinfektionsmittel usw.)", verfuegbarkeit: "direkt" },
  { key: "koerperpflege", label: "Körperliche Pflege", verfuegbarkeit: "partner" },
  { key: "medizinisch", label: "Medizinische Versorgung (Verbandswechsel, Medikamentengabe)", verfuegbarkeit: "partner" },
  { key: "umbau", label: "Umbaumaßnahmen im Haus (Barrierefreiheit)", verfuegbarkeit: "partner" },
  { key: "hausnotruf", label: "Hausnotruf", verfuegbarkeit: "partner" },
  { key: "hilfsmittel", label: "Pflegehilfsmittel (Rollator, Duschhocker usw.)", verfuegbarkeit: "direkt" },
  { key: "essen", label: "Essen auf Rädern", verfuegbarkeit: "direkt" },
];

export const HILFEFINDER_SERVICE_OPTIONEN = features.essenAufRaederVisible
  ? HILFEFINDER_SERVICE_OPTIONEN_ALL
  : HILFEFINDER_SERVICE_OPTIONEN_ALL.filter((o) => o.key !== "essen");

/** Fallback, wenn keine PLZ zugeordnet werden kann – Zentrale Bad Grönenbach. */
export const HILFEFINDER_FALLBACK_BAD_GROENENBACH: Standort = {
  name: "Standort Bad Grönenbach",
  pageSlug: "allgaeu",
  heroLocationGeneral: "im Allgäu und der Region",
  address: "Hinter den Gärten 10, 87730 Bad Grönenbach",
  phone: "08334 / 9893330",
  phoneHref: "tel:+4983349893330",
  whatsappPhoneHref: "tel:+4983769769317",
  email: "info@alltagshilfe-sued.de",
  hours: "Mo-Do 08:30-12:00 & 13:00-16:00, Fr 08:30-12:00",
  plzList: [],
  localIntro: [
    "Ihr Ergebnis wird von unserem Team in Bad Grönenbach koordiniert.",
    "Unter der angezeigten Rufnummer erreichen Sie dieses Büro direkt.",
  ],
  schemaAddress: {
    streetAddress: "Hinter den Gärten 10",
    postalCode: "87730",
    addressLocality: "Bad Grönenbach",
    addressCountry: "DE",
  },
};
