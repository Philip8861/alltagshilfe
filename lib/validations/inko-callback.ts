import { z } from "zod";

const MAX_NAME_LENGTH = 100;
const MAX_PHONE_LENGTH = 50;
const MAX_EMAIL_LENGTH = 254;

export const INKO_CALLBACK_TIME_SLOTS = [
  { value: "vormittag", label: "Vormittags (9–12 Uhr)" },
  { value: "mittag", label: "Mittags (12–14 Uhr)" },
  { value: "nachmittag", label: "Nachmittags (14–17 Uhr)" },
  { value: "abend", label: "Abends (17–19 Uhr)" },
  { value: "jederzeit", label: "Jederzeit erreichbar" },
] as const;

const timeSlotValues = INKO_CALLBACK_TIME_SLOTS.map((s) => s.value) as [string, ...string[]];

export const inkoCallbackSchema = z
  .object({
    vorname: z
      .string()
      .min(1, "Bitte geben Sie Ihren Vornamen an.")
      .max(MAX_NAME_LENGTH, `Der Vorname darf maximal ${MAX_NAME_LENGTH} Zeichen haben.`),
    nachname: z
      .string()
      .min(1, "Bitte geben Sie Ihren Nachnamen an.")
      .max(MAX_NAME_LENGTH, `Der Nachname darf maximal ${MAX_NAME_LENGTH} Zeichen haben.`),
    email: z
      .string()
      .max(MAX_EMAIL_LENGTH)
      .optional()
      .or(z.literal("")),
    phone: z
      .string()
      .max(MAX_PHONE_LENGTH, `Die Telefonnummer darf maximal ${MAX_PHONE_LENGTH} Zeichen haben.`)
      .optional()
      .or(z.literal("")),
    preferredTime: z.enum(timeSlotValues, {
      errorMap: () => ({ message: "Bitte wählen Sie eine Erreichbarkeit." }),
    }),
    sourceCta: z.string().max(120).optional().or(z.literal("")),
    datenschutz: z.literal(true, {
      errorMap: () => ({ message: "Bitte stimmen Sie der Datenschutzerklärung zu." }),
    }),
    website: z.string().max(0).optional(),
  })
  .superRefine((data, ctx) => {
    const email = data.email?.trim() ?? "";
    const phone = data.phone?.trim() ?? "";
    if (!email && !phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bitte geben Sie eine E-Mail-Adresse oder Telefonnummer an.",
        path: ["email"],
      });
    }
    if (email && !z.string().email().safeParse(email).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bitte geben Sie eine gültige E-Mail-Adresse an.",
        path: ["email"],
      });
    }
  });

export type InkoCallbackFormData = z.infer<typeof inkoCallbackSchema>;
