import { z } from "zod";
import { CONTACT_SOURCE_VALUES } from "@/lib/contact-source";

const MAX_MESSAGE_LENGTH = 5000;
const MAX_NAME_LENGTH = 100;
const MAX_PHONE_LENGTH = 50;

export const CONTACT_TOPICS = [
  "Haushaltshilfe & Betreuung",
  "Assistenz im Alltag für Menschen mit Behinderung",
  "Private Pflegeberatung",
  "Betriebliche Pflegeberatung",
  "Kostenfreie Pflegehilfsmittel",
  "Karriere",
  "Kooperation",
] as const;

export const contactSchema = z.object({
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
    .max(MAX_PHONE_LENGTH, `Die Telefonnummer darf maximal ${MAX_PHONE_LENGTH} Zeichen haben.`)
    .optional()
    .or(z.literal("")),
  topic: z.enum(CONTACT_TOPICS, {
    errorMap: () => ({ message: "Bitte wählen Sie ein Thema." }),
  }),
  message: z
    .string()
    .min(1, "Bitte geben Sie eine Nachricht ein.")
    .max(MAX_MESSAGE_LENGTH, `Die Nachricht darf maximal ${MAX_MESSAGE_LENGTH} Zeichen haben.`),
  contactSource: z.enum(CONTACT_SOURCE_VALUES as unknown as [string, ...string[]], {
    errorMap: () => ({ message: "Bitte geben Sie an, wie Sie auf uns aufmerksam geworden sind." }),
  }),
  datenschutz: z.literal(true, {
    errorMap: () => ({ message: "Bitte stimmen Sie der Datenschutzerklärung zu." }),
  }),
  /** Honeypot – muss leer bleiben */
  website: z.string().max(0).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
