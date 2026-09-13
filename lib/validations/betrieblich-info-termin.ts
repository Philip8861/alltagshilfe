import { z } from "zod";
import { BETRIEBLICH_INFO_COMPANY_SIZES, isBookableSlot } from "@/lib/betrieblich-info-termin/slots";

const SIZE_VALUES = BETRIEBLICH_INFO_COMPANY_SIZES.map((s) => s.value) as [string, ...string[]];

export const betrieblichInfoTerminSchema = z
  .object({
    slotDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Bitte wählen Sie ein Datum."),
    slotTime: z
      .string()
      .regex(/^\d{2}:\d{2}$/, "Bitte wählen Sie eine Uhrzeit."),
    fullName: z
      .string()
      .trim()
      .min(3, "Bitte geben Sie Vor- und Nachname an.")
      .max(120, "Der Name darf maximal 120 Zeichen haben.")
      .refine((s) => s.split(/\s+/).filter(Boolean).length >= 2, "Bitte Vor- und Nachname angeben."),
    email: z.string().trim().email("Bitte geben Sie eine gültige E-Mail-Adresse an.").max(200),
    companyName: z
      .string()
      .trim()
      .min(2, "Bitte geben Sie den Firmennamen an.")
      .max(200, "Der Firmenname darf maximal 200 Zeichen haben."),
    companySize: z.enum(SIZE_VALUES, {
      errorMap: () => ({ message: "Bitte wählen Sie die Firmengröße." }),
    }),
    datenschutz: z.literal(true, {
      errorMap: () => ({ message: "Bitte stimmen Sie der Datenschutzerklärung zu." }),
    }),
    website: z.string().max(0).optional(),
  })
  .superRefine((data, ctx) => {
    if (!isBookableSlot(data.slotDate, data.slotTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Dieser Termin ist nicht buchbar. Bitte wählen Sie einen Werktag ab dem nächsten Arbeitstag, 09:00–16:30.",
        path: ["slotDate"],
      });
    }
  });

export type BetrieblichInfoTerminData = z.infer<typeof betrieblichInfoTerminSchema>;
