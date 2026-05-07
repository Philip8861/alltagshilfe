import { z } from "zod";
import { CONTACT_SOURCE_VALUES } from "@/lib/contact-source";

const MAX_NAME_LENGTH = 100;
const MAX_PHONE_LENGTH = 50;
const MAX_MITARBEITER = 50;
const MAX_BEMERKUNG = 2000;
const MAX_FIRMENNAME = 200;

export const betrieblichAngebotAnfrageSchema = z.object({
  nachname: z
    .string()
    .min(1, "Bitte geben Sie Ihren Namen an.")
    .max(MAX_NAME_LENGTH, `Der Name darf maximal ${MAX_NAME_LENGTH} Zeichen haben.`),
  vorname: z
    .string()
    .min(1, "Bitte geben Sie Ihren Vornamen an.")
    .max(MAX_NAME_LENGTH, `Der Vorname darf maximal ${MAX_NAME_LENGTH} Zeichen haben.`),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse an."),
  firmenname: z.preprocess(
    (v) => {
      if (v === undefined || v === null) return undefined;
      const s = String(v).trim();
      return s === "" ? undefined : s;
    },
    z
      .string()
      .max(MAX_FIRMENNAME, `Der Firmenname darf maximal ${MAX_FIRMENNAME} Zeichen haben.`)
      .optional(),
  ),
  phone: z
    .string()
    .max(MAX_PHONE_LENGTH, `Die Telefonnummer darf maximal ${MAX_PHONE_LENGTH} Zeichen haben.`)
    .optional()
    .or(z.literal("")),
  mitarbeiteranzahl: z
    .string()
    .trim()
    .min(1, "Bitte geben Sie die ungefähre Mitarbeiteranzahl an.")
    .max(MAX_MITARBEITER, `Die Eingabe darf maximal ${MAX_MITARBEITER} Zeichen haben.`),
  bemerkung: z.preprocess(
    (v) => {
      if (v === undefined || v === null) return undefined;
      const s = String(v).trim();
      return s === "" ? undefined : s;
    },
    z.string().max(MAX_BEMERKUNG, `Die Bemerkung darf maximal ${MAX_BEMERKUNG} Zeichen haben.`).optional(),
  ),
  contactSource: z.enum(CONTACT_SOURCE_VALUES as unknown as [string, ...string[]], {
    errorMap: () => ({ message: "Bitte geben Sie an, wie Sie auf uns aufmerksam geworden sind." }),
  }),
  datenschutz: z.literal(true, {
    errorMap: () => ({ message: "Bitte stimmen Sie der Datenschutzerklärung zu." }),
  }),
  /** Honeypot – muss leer bleiben */
  website: z.string().max(0).optional(),
});

export type BetrieblichAngebotAnfrageData = z.infer<typeof betrieblichAngebotAnfrageSchema>;
