/** Zuordnung Tipp → Provisions-Statusliste (nur Anzeige; kein DB-Feld nötig). */

export type PartnerTipProvisionBucket = "monatlich" | "einmal";

const MONATLICH_SLUG = "betriebliche_pflegeberatung";

export function provisionBucketForServiceSlug(serviceSlug: string): PartnerTipProvisionBucket {
  return serviceSlug === MONATLICH_SLUG ? "monatlich" : "einmal";
}

/** Anker-IDs auf dem Dashboard (ohne #) */
export const PROVISION_STATUS_LIST_ANCHOR: Record<PartnerTipProvisionBucket, string> = {
  monatlich: "partner-statusliste-monatlich",
  einmal: "partner-statusliste-einmal",
};

/** Vollständiger Listenname für Dankes-Text nach Tipp-Abgabe */
export const PROVISION_STATUS_LIST_FULL_NAME: Record<PartnerTipProvisionBucket, string> = {
  monatlich: "Statusliste Eigene Abschlussprovision",
  einmal: "Statusliste Einmalprovision",
};
