import { z } from "zod";

export const partnerLoginSchema = z.object({
  email: z.string().trim().email("Bitte eine gültige E-Mail eingeben.").max(320),
  password: z.string().min(1, "Passwort erforderlich.").max(256),
});

export type PartnerLoginInput = z.infer<typeof partnerLoginSchema>;

export const partnerRegisterSchema = z
  .object({
    email: z.string().trim().email("Bitte eine gültige E-Mail eingeben.").max(320),
    password: z
      .string()
      .min(8, "Passwort mindestens 8 Zeichen.")
      .max(72, "Passwort darf höchstens 72 Zeichen haben."),
    passwordConfirm: z.string().min(1, "Bitte Passwort wiederholen."),
    display_name: z.union([z.string().max(120), z.undefined()]),
    organization_name: z.union([z.string().max(200), z.undefined()]),
    datenschutz: z
      .union([z.literal("on"), z.null(), z.undefined()])
      .refine((v) => v === "on", { message: "Bitte die Datenschutzerklärung akzeptieren." }),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: "Passwörter stimmen nicht überein.",
    path: ["passwordConfirm"],
  });

export type PartnerRegisterInput = z.infer<typeof partnerRegisterSchema>;
