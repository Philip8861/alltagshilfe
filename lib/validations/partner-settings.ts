import { z } from "zod";

export const partnerPasswordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Aktuelles Passwort erforderlich.").max(256),
    newPassword: z
      .string()
      .min(6, "Neues Passwort: mindestens 6 Zeichen.")
      .max(256, "Passwort zu lang.")
      .regex(/[A-Za-zÄÖÜäöüß]/, "Mind. einen Buchstaben verwenden.")
      .regex(/[0-9]/, "Mind. eine Ziffer verwenden.")
      .regex(/[^A-Za-z0-9ÄÖÜäöüß]/, "Mind. ein Sonderzeichen verwenden."),
    confirmPassword: z.string().min(1, "Bestätigung erforderlich.").max(256),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Die neuen Passwörter stimmen nicht überein.",
    path: ["confirmPassword"],
  });

export type PartnerPasswordChangeInput = z.infer<typeof partnerPasswordChangeSchema>;
