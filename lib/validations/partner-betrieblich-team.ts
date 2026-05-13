import { z } from "zod";

export const teamNameSchema = z
  .string()
  .trim()
  .min(2, "Bitte mindestens 2 Zeichen.")
  .max(100, "Maximal 100 Zeichen.");

export const teamProvisionVisibilitySchema = z.enum(["all", "owner_sees_all", "self_only"]);
export type TeamProvisionVisibilityInput = z.infer<typeof teamProvisionVisibilitySchema>;

export const partnerReferralCodeInputSchema = z
  .string()
  .trim()
  .min(1, "Bitte einen Partner-Code eingeben.")
  .max(40, "Code zu lang.");

export const teamTokenSchema = z
  .string()
  .trim()
  .regex(/^[a-f0-9]{64}$/i, "Ungültige Einladung.");
