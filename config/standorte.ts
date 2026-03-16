/**
 * Standorte nach PLZ – für PLZ-Finder im Kontaktbereich.
 * PLZ-Bereiche können Sie hier ergänzen.
 */
export interface Standort {
  name: string;
  address: string;
  phone: string;
  phoneHref: string;
  hours: string;
  plzList: string[];
}

export const standorteByPlz: Standort[] = [
  {
    name: "Memmingen & Umgebung",
    address: "Hauptstandort Memmingen",
    phone: "08334 / 9893330",
    phoneHref: "tel:+4983349893330",
    hours: "Mo–Do 08:30–16:00 Uhr, Fr 08:30–12:00 Uhr",
    plzList: ["87700", "87719", "87724", "87727", "87734", "87736", "87739", "87743", "87746", "87749", "87751", "87754", "87757", "87760", "87763", "87764", "87767", "87770", "87772", "87775", "87776", "87778", "87779", "87781", "87784", "87785", "87787", "87789"],
  },
  {
    name: "Mindelheim",
    address: "Standort Mindelheim",
    phone: "08334 / 9893330",
    phoneHref: "tel:+4983349893330",
    hours: "Mo–Do 08:30–16:00 Uhr, Fr 08:30–12:00 Uhr",
    plzList: ["87719", "87740", "87742", "87745", "87747", "87748", "87753", "87755", "87756", "87758", "87761", "87765", "87766", "87768", "87769", "87773", "87786"],
  },
  {
    name: "Kaufbeuren & Ostallgäu",
    address: "Standort Kaufbeuren",
    phone: "08334 / 9893330",
    phoneHref: "tel:+4983349893330",
    hours: "Mo–Do 08:30–16:00 Uhr, Fr 08:30–12:00 Uhr",
    plzList: ["87600", "87616", "87629", "87634", "87637", "87640", "87642", "87645", "87647", "87648", "87650", "87653", "87654", "87656", "87657", "87659", "87660", "87662", "87663", "87665", "87666", "87668", "87669", "87671", "87672", "87674", "87675", "87677", "87679", "87681", "87684", "87685", "87687", "87689", "87690", "87692", "87693", "87695", "87697", "87698"],
  },
];

/** Sucht Standort anhand PLZ (nur erste 5 Ziffern). */
export function findStandortByPlz(plz: string): Standort | undefined {
  const normalized = plz.replace(/\D/g, "").slice(0, 5);
  if (normalized.length < 5) return undefined;
  return standorteByPlz.find((s) => s.plzList.includes(normalized));
}
