/**
 * Hauptnavigation – zentrale Pfade.
 * Einträge mit `children` werden als Dropdown dargestellt.
 */
export type NavLink = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

/** Reihenfolge wie zuvor in der Leistungsübersicht; drei Einträge verweisen auf ausgearbeitete Unterseiten. */
const UNSERE_LEISTUNGEN_CHILDREN: { href: string; label: string }[] = [
  { href: "/leistungen/haushaltshilfe", label: "Haushaltshilfe" },
  { href: "/leistungen/alltagsbegleitung-betreuung", label: "Alltagsbegleitung und Betreuung" },
  { href: "/pflegeberatung/private-pflegeberatung", label: "Pflegeberatungseinsätze nach §37.3 SGB XI" },
  { href: "/pflegehilfsmittel/kostenfreie-pflegehilfsmittel", label: "Kostenfreie Pflegehilfsmittelbox im Wert von 42€" },
  { href: "/leistungen/essen-auf-raeder", label: "Essen auf Räder" },
  { href: "/leistungen/einkaufsservice", label: "Einkaufsservice" },
  { href: "/leistungen/hilfe-nach-operation", label: "Hilfe nach Operation, Unfall oder Schwangerschaft" },
  { href: "/pflegeberatung#betriebliche-pflegeberatung", label: "Betriebliche Pflegeberatung" },
];

export const navLinks: NavLink[] = [
  { href: "/#unsere-leistungen", label: "Unsere Leistungen", children: UNSERE_LEISTUNGEN_CHILDREN },
  { href: "/standorte", label: "Standorte" },
  {
    href: "/ueber-uns",
    label: "Unternehmen",
    children: [
      { href: "/ueber-uns", label: "Über uns" },
      { href: "/kooperation", label: "Kooperation" },
    ],
  },
  { href: "/karriere", label: "Karriere" },
  {
    href: "/pflegeberatung",
    label: "Pflegeberatung",
    children: [
      { href: "/pflegeberatung/private-pflegeberatung", label: "Private Pflegeberatung" },
      { href: "/pflegeberatung#betriebliche-pflegeberatung", label: "Betriebliche Pflegeberatung" },
      { href: "/ratgeber", label: "Ratgeber" },
    ],
  },
  {
    href: "/pflegehilfsmittel/kostenfreie-pflegehilfsmittel",
    label: "Pflegehilfsmittel",
    children: [
      { href: "/pflegehilfsmittel/kostenfreie-pflegehilfsmittel", label: "Kostenfreie Pflegehilfsmittel" },
      { href: "/pflegeshop", label: "Pflegeshop" },
      { href: "/inkontinenzversorgung", label: "Inkontinenzversorgung" },
    ],
  },
];
