/**
 * Hauptnavigation – zentrale Pfade.
 * Einträge mit `children` werden als Dropdown dargestellt.
 */
import leistungenData from "@/content/leistungen.json";

export type NavLink = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

const leistungenNav = (leistungenData as { slug: string; title: string }[]).map((item) => ({
  href: `/leistungen/${item.slug}`,
  label: item.title,
}));

export const navLinks: NavLink[] = [
  { href: "/leistungen", label: "Unsere Leistungen", children: leistungenNav },
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
      { href: "/pflegeberatung#private-pflegeberatung", label: "Private Pflegeberatung" },
      { href: "/pflegeberatung#betriebliche-pflegeberatung", label: "Betriebliche Pflegeberatung" },
      { href: "/ratgeber", label: "Ratgeber" },
    ],
  },
  {
    href: "/pflegehilfsmittel/kostenfreie-pflegehilfsmittel",
    label: "Pflegehilfsmittel",
    children: [
      { href: "/pflegeshop", label: "Pflegeshop" },
      { href: "/inkontinenzversorgung", label: "Inkontinenzversorgung" },
    ],
  },
];
