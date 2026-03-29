import { z } from "zod";

const columnSchema = z.object({
  vorname: z.boolean(),
  nachname: z.boolean(),
  firma: z.boolean(),
  datum: z.boolean(),
  status: z.boolean(),
  betrag: z.boolean(),
  notiz: z.boolean(),
  archivButton: z.boolean(),
  typ: z.boolean(),
});

export const partnerPortalPreferencesSchema = z.object({
  showListMonatlich: z.boolean(),
  showListEinmal: z.boolean(),
  showArchivOnDashboard: z.boolean(),
  columns: columnSchema,
});

export type PartnerPortalPreferencesInput = z.infer<typeof partnerPortalPreferencesSchema>;
