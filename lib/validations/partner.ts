import { z } from "zod";

/** Roh-Eingabe; technische E-Mail kommt aus resolvePartnerLoginToEmail(). */
export const partnerLoginSchema = z.object({
  login: z.string().trim().min(1, "Anmeldename oder E-Mail erforderlich.").max(320),
  password: z.string().min(1, "Passwort erforderlich.").max(256),
});

export type PartnerLoginInput = z.infer<typeof partnerLoginSchema>;

/** Nur Anmeldename/E-Mail (Passwort-Vergessen). */
export const partnerPasswordResetRequestSchema = z.object({
  login: z.string().trim().min(1, "Anmeldename oder E-Mail erforderlich.").max(320),
});
