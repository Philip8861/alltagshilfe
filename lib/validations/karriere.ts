import { z } from "zod";
import { KARRIERE_CONTACT_SOURCE_VALUES } from "@/lib/contact-source";

const MAX_NAME_LENGTH = 100;
const MAX_PHONE_LENGTH = 50;
const MAX_ORT_LENGTH = 100;
const MAX_ANMERKUNG_LENGTH = 4000;

export const KARRIERE_STELLENANGEBOTE = [
  "Alltagshelfer",
  "Bürofachkraft",
  "Initiativbewerbung",
  "Pflegeberater",
  "Standortleitung",
] as const;

export const karriereSchema = z.object({
  vorname: z
    .string()
    .min(1, "Bitte geben Sie Ihren Vornamen an.")
    .max(MAX_NAME_LENGTH, `Der Vorname darf maximal ${MAX_NAME_LENGTH} Zeichen haben.`),
  nachname: z
    .string()
    .min(1, "Bitte geben Sie Ihren Nachnamen an.")
    .max(MAX_NAME_LENGTH, `Der Nachname darf maximal ${MAX_NAME_LENGTH} Zeichen haben.`),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse an."),
  phone: z
    .string()
    .min(1, "Bitte geben Sie Ihre Telefonnummer an.")
    .max(MAX_PHONE_LENGTH, `Die Telefonnummer darf maximal ${MAX_PHONE_LENGTH} Zeichen haben.`),
  /** Nur Ziffern, genau 5 (übliche deutsche PLZ). */
  plz: z
    .string()
    .transform((s) => s.replace(/\D/g, "").slice(0, 5))
    .refine((s) => s.length === 5, { message: "Bitte geben Sie eine gültige PLZ ein (5 Ziffern)." }),
  ort: z
    .string()
    .trim()
    .min(1, "Bitte geben Sie Ihren Wohnort an.")
    .max(MAX_ORT_LENGTH, `Der Ort darf maximal ${MAX_ORT_LENGTH} Zeichen haben.`),
  stellenangebot: z.enum(KARRIERE_STELLENANGEBOTE, {
    errorMap: () => ({ message: "Bitte wählen Sie ein Stellenangebot." }),
  }),
  agbs: z.literal(true, {
    errorMap: () => ({ message: "Bitte akzeptieren Sie die AGB." }),
  }),
  contactSource: z.enum(KARRIERE_CONTACT_SOURCE_VALUES as unknown as [string, ...string[]], {
    errorMap: () => ({ message: "Bitte geben Sie an, wie Sie auf uns aufmerksam geworden sind." }),
  }),
  /** Optional: Kurzcheck / freie Hinweise (nur beruflich relevante Angaben). */
  anmerkung: z
    .string()
    .max(MAX_ANMERKUNG_LENGTH, `Die Zusatzangaben dürfen maximal ${MAX_ANMERKUNG_LENGTH} Zeichen haben.`)
    .optional()
    .transform((s) => (s && s.trim().length > 0 ? s.trim() : undefined)),
  /** Honeypot */
  website: z.string().max(0).optional(),
});

export type KarriereFormData = z.infer<typeof karriereSchema>;
