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
  { href: "/karriere", label: "Karriere" },
  {
    href: "/pflegeberatung",
    label: "Pflegeberatung",
    children: [
      { href: "/pflegeberatung#private-pflegeberatung", label: "Private Pflegeberatung" },
      { href: "/pflegeberatung#betriebliche-pflegeberatung", label: "Betriebliche Pflegeberatung" },
    ],
  },
  { href: "/pflegebox", label: "Pflegebox" },
];
