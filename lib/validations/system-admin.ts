import { z } from "zod";

const responsibilitySlug = z.enum([
  "betriebliche_pflegeberatung",
  "pflegehilfsmittel",
  "hauswirtschaft_betreuung",
  "pflegeberatung",
]);

const optionalIban = z
  .string()
  .max(48)
  .transform((s) => {
    const t = s.trim().replace(/\s+/g, "").toUpperCase();
    return t.length === 0 ? undefined : t;
  })
  .refine((t) => t === undefined || t.length <= 34, "IBAN maximal 34 Zeichen.")
  .refine((t) => t === undefined || /^[A-Z0-9]+$/.test(t), "IBAN nur Buchstaben und Ziffern (ohne Leerzeichen).");

const optionalBic = z
  .string()
  .max(20)
  .transform((s) => {
    const t = s.trim().replace(/\s+/g, "").toUpperCase();
    return t.length === 0 ? undefined : t;
  })
  .refine((t) => t === undefined || t.length <= 11, "BIC maximal 11 Zeichen.");

const optionalAccountHolder = z
  .string()
  .max(140)
  .transform((s) => {
    const t = s.trim();
    return t.length === 0 ? undefined : t;
  })
  .refine((t) => t === undefined || t.length <= 120, "Kontoinhaber maximal 120 Zeichen.");

export const createPartnerUserSchema = z.object({
  email: z.string().trim().email("Gültige E-Mail-Adresse erforderlich.").max(320),
  salutation: z.enum(["herr", "frau"], { message: "Anrede wählen (Herr oder Frau)." }),
  first_name: z.string().trim().min(1, "Vorname erforderlich.").max(80),
  last_name: z.string().trim().min(1, "Nachname erforderlich.").max(80),
  phone: z.string().trim().min(5, "Telefonnummer erforderlich.").max(40),
  organization_name: z.string().trim().max(200).optional(),
  recruited_by: z.string().trim().max(200).optional(),
  iban: z.preprocess((v) => (v == null ? "" : String(v)), optionalIban),
  bic: z.preprocess((v) => (v == null ? "" : String(v)), optionalBic),
  account_holder: z.preprocess((v) => (v == null ? "" : String(v)), optionalAccountHolder),
  responsibility_areas: z.array(responsibilitySlug).default([]),
  role: z.enum(["partner", "admin"]),
});

export type CreatePartnerUserInput = z.infer<typeof createPartnerUserSchema>;

export const deletePartnerUserIdSchema = z.object({
  user_id: z.string().uuid("Ungültige Nutzer-ID."),
});
