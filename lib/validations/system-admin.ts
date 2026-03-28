import { z } from "zod";

export const createPartnerUserSchema = z.object({
  email: z.string().trim().email("Bitte eine gültige E-Mail eingeben.").max(320),
  password: z.string().min(8, "Passwort mindestens 8 Zeichen.").max(72, "Passwort zu lang."),
  display_name: z.string().trim().max(120).optional(),
  organization_name: z.string().trim().max(200).optional(),
  role: z.enum(["partner", "admin"]),
});

export type CreatePartnerUserInput = z.infer<typeof createPartnerUserSchema>;
