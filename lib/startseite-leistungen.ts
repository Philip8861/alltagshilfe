/** Kacheln „Unsere Leistungen“ – gleiche Daten wie Startseite & Standort-Landings. */
export const STARTSEITE_LEISTUNGEN_KACHELN = [
  { title: "Haushaltshilfe", icon: "home" as const },
  { title: "Alltagsbegleitung und Betreuung", icon: "people" as const },
  { title: "Pflegeberatung nach §37.3 SGB XI", icon: "chat" as const },
  { title: "Kostenfreie Pflegehilfsmittel", icon: "box" as const },
  { title: "Inkontinenzversorgung", icon: "shield" as const },
  { title: "Pflegeshop", icon: "cart" as const },
  { title: "Betriebliche Pflegeberatung", icon: "briefcase" as const },
  { title: "Essen auf Räder (im Raum Kempten)", icon: "meal" as const },
] as const;

export type LeistungKachelIcon = (typeof STARTSEITE_LEISTUNGEN_KACHELN)[number]["icon"];

export const LEISTUNGS_LINKS_BY_ICON: Record<LeistungKachelIcon, string> = {
  home: "/leistungen/haushaltshilfe",
  people: "/leistungen/alltagsbegleitung-betreuung",
  chat: "/pflegeberatung/private-pflegeberatung",
  box: "/pflegehilfsmittel/kostenfreie-pflegehilfsmittel",
  shield: "/inkontinenzversorgung",
  cart: "/pflegeshop",
  briefcase: "/pflegeberatung#betriebliche-pflegeberatung",
  meal: "/leistungen/essen-auf-raeder",
};
