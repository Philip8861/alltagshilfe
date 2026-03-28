import { z } from "zod";

export const partnerLoginSchema = z.object({
  email: z.string().trim().email("Bitte eine gültige E-Mail eingeben.").max(320),
  password: z.string().min(1, "Passwort erforderlich.").max(256),
});

export type PartnerLoginInput = z.infer<typeof partnerLoginSchema>;
