/**
 * Quelle „Wie sind Sie auf uns aufmerksam geworden?"
 * Stabile Slugs (`value`) werden in der DB gespeichert; das `label` ist die Anzeige
 * im Formular und in E-Mails. Wenn neue Optionen ergänzt werden, niemals den `value`
 * eines bestehenden Eintrags ändern (sonst stimmen historische Statistiken nicht mehr).
 *
 * Karriere (`KARRIERE_CONTACT_SOURCE_OPTIONS`): eigene Auswahl ohne Plakat/Flyer/
 * Pflegeberatung-Vermittlung; zusätzlich Indeed (eBay Kleinanzeigen auch im allgemeinen Kontakt).
 */
export const CONTACT_SOURCE_OPTIONS = [
  { value: "google", label: "Google" },
  { value: "freunde_bekannte", label: "Freunde & Bekannte" },
  { value: "social_media", label: "Social Media (Facebook, Instagram)" },
  { value: "plakat", label: "Plakatwerbung" },
  {
    value: "pflegeberatung_vermittlung",
    label: "Durch eine Pflegeberatung oder professionelle Vermittlung",
  },
  { value: "ebay_kleinanzeigen", label: "eBay Kleinanzeigen" },
  { value: "flyer_arztpraxis", label: "Flyer entdeckt (z. B. in einer Arztpraxis)" },
  { value: "flyer_briefkasten", label: "Flyer im Briefkasten" },
  { value: "email", label: "Per E-Mail" },
  { value: "sonstiges", label: "Sonstiges" },
] as const;

export const KARRIERE_CONTACT_SOURCE_OPTIONS = [
  { value: "google", label: "Google" },
  { value: "freunde_bekannte", label: "Freunde & Bekannte" },
  { value: "social_media", label: "Social Media (Facebook, Instagram)" },
  { value: "indeed", label: "Indeed" },
  { value: "ebay_kleinanzeigen", label: "eBay Kleinanzeigen" },
  { value: "email", label: "Per E-Mail" },
  { value: "sonstiges", label: "Sonstiges" },
] as const;

export type ContactSourceOption = (typeof CONTACT_SOURCE_OPTIONS)[number];
export type ContactSourceValue = ContactSourceOption["value"];

export type KarriereContactSourceOption = (typeof KARRIERE_CONTACT_SOURCE_OPTIONS)[number];
export type KarriereContactSourceValue = KarriereContactSourceOption["value"];

export const CONTACT_SOURCE_VALUES = CONTACT_SOURCE_OPTIONS.map((o) => o.value) as readonly ContactSourceValue[];

export const KARRIERE_CONTACT_SOURCE_VALUES = KARRIERE_CONTACT_SOURCE_OPTIONS.map(
  (o) => o.value,
) as readonly KarriereContactSourceValue[];

export function isValidContactSource(value: unknown): value is ContactSourceValue {
  return typeof value === "string" && (CONTACT_SOURCE_VALUES as readonly string[]).includes(value);
}

export function isValidKarriereContactSource(value: unknown): value is KarriereContactSourceValue {
  return typeof value === "string" && (KARRIERE_CONTACT_SOURCE_VALUES as readonly string[]).includes(value);
}

/** Anzeige-Label für eine Quelle (für E-Mails / Admin-Statistik). Fallback: der Slug selbst. */
export function getContactSourceLabel(value: string): string {
  const opt =
    CONTACT_SOURCE_OPTIONS.find((o) => o.value === value) ??
    KARRIERE_CONTACT_SOURCE_OPTIONS.find((o) => o.value === value);
  return opt?.label ?? value;
}
