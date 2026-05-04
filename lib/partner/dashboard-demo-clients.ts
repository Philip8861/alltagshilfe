import { features } from "@/config/features";

/** Beispieldaten für die Partner-Übersicht (MVP-Darstellung). */
export type PartnerDemoClientRow = {
  firstName: string;
  lastName: string;
  status: string;
  service: string;
};

const PARTNER_DEMO_CLIENTS_ALL: PartnerDemoClientRow[] = [
  { firstName: "Helga", lastName: "Brenner", status: "Aktiv", service: "Haushaltshilfe & Alltagsbegleitung" },
  { firstName: "Werner", lastName: "Schmidt", status: "In Betreuung", service: "Pflegeberatung nach §37.3" },
  { firstName: "Ingrid", lastName: "Hoffmann", status: "Aktiv", service: "Kostenfreie Pflegehilfsmittel" },
  { firstName: "Gerhard", lastName: "Klein", status: "Ruhend", service: "Inkontinenzversorgung" },
  { firstName: "Ursula", lastName: "Mayer", status: "Aktiv", service: "Essen auf Rädern" },
  { firstName: "Horst", lastName: "Lang", status: "Neuaufnahme", service: "Haushaltshilfe & Alltagsbegleitung" },
  { firstName: "Renate", lastName: "Fischer", status: "Aktiv", service: "Betriebliche Pflegeberatung" },
  { firstName: "Dieter", lastName: "Wolf", status: "Aktiv", service: "Pflegeberatung nach §37.3" },
  { firstName: "Elke", lastName: "Krüger", status: "Warteliste", service: "Haushaltshilfe & Alltagsbegleitung" },
  { firstName: "Manfred", lastName: "Sommer", status: "Aktiv", service: "Kostenfreie Pflegehilfsmittel" },
];

export const PARTNER_DEMO_CLIENTS: PartnerDemoClientRow[] = features.essenAufRaederVisible
  ? PARTNER_DEMO_CLIENTS_ALL
  : PARTNER_DEMO_CLIENTS_ALL.filter((r) => r.service !== "Essen auf Rädern");
