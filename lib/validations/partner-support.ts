import { z } from "zod";
import { PARTNER_SUPPORT_TOPICS } from "@/lib/partner/partner-support-contact";

const topicValues = PARTNER_SUPPORT_TOPICS.map((t) => t.value) as [string, ...string[]];

/** Anliegen eines eingeloggten Partners an den persönlichen Ansprechpartner. */
export const partnerSupportRequestSchema = z.object({
  topic: z.enum(topicValues, { message: "Bitte ein Thema wählen." }),
  message: z
    .string()
    .trim()
    .min(10, "Bitte beschreiben Sie Ihr Anliegen etwas genauer (mindestens 10 Zeichen).")
    .max(3000, "Die Nachricht ist zu lang (maximal 3000 Zeichen)."),
  phone: z
    .string()
    .trim()
    .max(40, "Telefonnummer zu lang.")
    .regex(/^[0-9+()\/\s.-]*$/, "Bitte eine gültige Telefonnummer angeben.")
    .optional()
    .or(z.literal("")),
  /** Honeypot: muss leer bleiben. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type PartnerSupportRequestInput = z.infer<typeof partnerSupportRequestSchema>;
