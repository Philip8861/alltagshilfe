import { features } from "@/config/features";

/** Kacheln „Unsere Leistungen“ – Quelle inkl. Essen auf Räder (`meal`) bei aktivem Flag. */
const STARTSEITE_LEISTUNGEN_KACHELN_ALL = [
  { title: "Haushaltshilfe", icon: "home" as const },
  { title: "Alltagsbegleitung und Betreuung", icon: "people" as const },
  { title: "Pflegeberatung nach §37.3 SGB XI", icon: "chat" as const },
  { title: "Kostenfreie Pflegehilfsmittel", icon: "box" as const },
  { title: "Pflegeshop & Inkontinenzversorgung", icon: "cart" as const },
  { title: "Betriebliche Pflegeberatung", icon: "briefcase" as const },
  { title: "Essen auf Räder (im Raum Kempten)", icon: "meal" as const },
] as const;

export const STARTSEITE_LEISTUNGEN_KACHELN = (
  features.essenAufRaederVisible
    ? STARTSEITE_LEISTUNGEN_KACHELN_ALL
    : STARTSEITE_LEISTUNGEN_KACHELN_ALL.filter((item) => item.icon !== "meal")
) as readonly (typeof STARTSEITE_LEISTUNGEN_KACHELN_ALL)[number][];

export type LeistungKachelIcon = (typeof STARTSEITE_LEISTUNGEN_KACHELN_ALL)[number]["icon"];

export const LEISTUNGS_LINKS_BY_ICON: Record<LeistungKachelIcon, string> = {
  home: "/leistungen/haushaltshilfe",
  people: "/leistungen/alltagsbegleitung-betreuung",
  chat: "/pflegeberatung/private-pflegeberatung",
  box: "/pflegehilfsmittel/kostenfreie-pflegehilfsmittel",
  cart: "/pflegeshop",
  briefcase: "/pflegeberatung#betriebliche-pflegeberatung",
  meal: "/leistungen/essen-auf-raeder",
};
