import { z } from "zod";

const responsibilitySlug = z.enum([
  "betriebliche_pflegeberatung",
  "pflegehilfsmittel",
  "hauswirtschaft_betreuung",
  "pflegeberatung",
]);

export const createPartnerUserSchema = z.object({
  email: z.string().trim().email("Gültige E-Mail-Adresse erforderlich.").max(320),
  salutation: z.enum(["herr", "frau"], { message: "Anrede wählen (Herr oder Frau)." }),
  first_name: z.string().trim().min(1, "Vorname erforderlich.").max(80),
  last_name: z.string().trim().min(1, "Nachname erforderlich.").max(80),
  phone: z.string().trim().min(5, "Telefonnummer erforderlich.").max(40),
  organization_name: z.string().trim().max(200).optional(),
  recruited_by: z.string().trim().max(200).optional(),
  responsibility_areas: z.array(responsibilitySlug).default([]),
  role: z.enum(["partner", "admin"]),
});

export type CreatePartnerUserInput = z.infer<typeof createPartnerUserSchema>;

export const deletePartnerUserIdSchema = z.object({
  user_id: z.string().uuid("Ungültige Nutzer-ID."),
});
