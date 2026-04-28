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
  /** Wenn true: Rundgang nicht mehr automatisch nach Login anzeigen (nur noch über Einstellungen). */
  tutorial_hidden: z.boolean().optional(),
  /** Passwort-Hinweis ausblenden (Fallback ohne Migration 014). */
  password_prompt_suppressed: z.boolean().optional(),
});

export type PartnerPortalPreferencesInput = z.infer<typeof partnerPortalPreferencesSchema>;
