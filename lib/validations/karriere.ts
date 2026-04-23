import { z } from "zod";

const MAX_NAME_LENGTH = 100;
const MAX_PHONE_LENGTH = 50;
const MAX_ANMERKUNG_LENGTH = 4000;

export const KARRIERE_STELLENANGEBOTE = [
  "Alltagshelfer",
  "Bürofachkraft",
  "Standortleitung",
  "Pflegeberater",
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
  stellenangebot: z.enum(KARRIERE_STELLENANGEBOTE, {
    errorMap: () => ({ message: "Bitte wählen Sie ein Stellenangebot." }),
  }),
  agbs: z.literal(true, {
    errorMap: () => ({ message: "Bitte akzeptieren Sie die AGB." }),
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
