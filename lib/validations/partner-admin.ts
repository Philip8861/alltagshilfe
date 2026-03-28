import { z } from "zod";

const responsibilitySlug = z.enum([
  "betriebliche_pflegeberatung",
  "pflegehilfsmittel",
  "hauswirtschaft_betreuung",
  "pflegeberatung",
]);

export const updatePartnerTipStatusSchema = z.object({
  tip_id: z.string().uuid(),
  admin_status: z.enum(["neu", "in_bearbeitung", "erledigt", "abgelehnt"]),
});

export const updatePartnerProfileAdminSchema = z.object({
  user_id: z.string().uuid(),
  salutation: z.enum(["herr", "frau"]),
  first_name: z.string().trim().min(1, "Vorname erforderlich.").max(80),
  last_name: z.string().trim().min(1, "Nachname erforderlich.").max(80),
  phone: z.string().trim().min(5, "Telefon erforderlich.").max(40),
  organization_name: z.string().trim().max(200).optional(),
  recruited_by: z.string().trim().max(200).optional(),
  display_name: z.string().trim().max(200).optional(),
  role: z.enum(["partner", "admin"]),
  responsibility_areas: z.array(responsibilitySlug).default([]),
});

export type UpdatePartnerProfileAdminInput = z.infer<typeof updatePartnerProfileAdminSchema>;
