/**
 * Persönlicher Ansprechpartner für Partner (Support im Partnerportal).
 * Der Name darf im Frontend erscheinen; die Zieladresse wird nur serverseitig aufgelöst.
 */
export const PARTNER_SUPPORT_CONTACT_NAME = "Franz Dirscherl";

export const PARTNER_SUPPORT_TOPICS = [
  { value: "portal", label: "Frage zum Partnerportal" },
  { value: "provision", label: "Provision oder Auszahlung" },
  { value: "vorgang", label: "Ein Tipp oder Vorgang" },
  { value: "technik", label: "Technisches Problem" },
  { value: "sonstiges", label: "Sonstiges" },
] as const;

export type PartnerSupportTopic = (typeof PARTNER_SUPPORT_TOPICS)[number]["value"];

export function partnerSupportTopicLabel(value: string): string {
  return PARTNER_SUPPORT_TOPICS.find((t) => t.value === value)?.label ?? value;
}
