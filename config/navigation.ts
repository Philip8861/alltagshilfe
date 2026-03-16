/**
 * Hauptnavigation – zentrale Pfade.
 * Einträge mit `children` werden als Dropdown dargestellt.
 */
export type NavLink = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

export const navLinks: NavLink[] = [
  { href: "/leistungen", label: "Unsere Leistungen" },
  { href: "/standorte", label: "Standorte" },
  {
    href: "/ueber-uns",
    label: "Unternehmen",
    children: [
      { href: "/ueber-uns", label: "Über uns" },
      { href: "/kooperation", label: "Kooperation" },
      { href: "/neuigkeiten", label: "Neuigkeiten" },
    ],
  },
  { href: "/karriere", label: "Karriere" },
  {
    href: "/pflegeberatung",
    label: "Pflegeberatung",
    children: [
      { href: "/pflegeberatung#private-pflegeberatung", label: "Private Pflegeberatung" },
      { href: "/pflegeberatung#betriebliche-pflegeberatung", label: "Betriebliche Pflegeberatung" },
      { href: "/ratgeber", label: "Ratgeber" },
    ],
  },
  { href: "/pflegebox", label: "Pflegebox" },
];
