/**
 * Quelle „Wie sind Sie auf uns aufmerksam geworden?"
 * Stabile Slugs (`value`) werden in der DB gespeichert; das `label` ist die Anzeige
 * im Formular und in E-Mails. Wenn neue Optionen ergänzt werden, niemals den `value`
 * eines bestehenden Eintrags ändern (sonst stimmen historische Statistiken nicht mehr).
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
  { value: "flyer_arztpraxis", label: "Flyer entdeckt (z. B. in einer Arztpraxis)" },
  { value: "flyer_briefkasten", label: "Flyer im Briefkasten" },
  { value: "email", label: "Per E-Mail" },
  { value: "sonstiges", label: "Sonstiges" },
] as const;

export type ContactSourceOption = (typeof CONTACT_SOURCE_OPTIONS)[number];
export type ContactSourceValue = ContactSourceOption["value"];

export const CONTACT_SOURCE_VALUES = CONTACT_SOURCE_OPTIONS.map((o) => o.value) as readonly ContactSourceValue[];

export function isValidContactSource(value: unknown): value is ContactSourceValue {
  return typeof value === "string" && (CONTACT_SOURCE_VALUES as readonly string[]).includes(value);
}

/** Anzeige-Label für eine Quelle (für E-Mails / Admin-Statistik). Fallback: der Slug selbst. */
export function getContactSourceLabel(value: string): string {
  const opt = CONTACT_SOURCE_OPTIONS.find((o) => o.value === value);
  return opt?.label ?? value;
}
