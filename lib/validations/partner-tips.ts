import { z } from "zod";

const betriebPayloadSchema = z.object({
  ansprechpartner: z.string().trim().min(1, "Ansprechpartner erforderlich.").max(120),
  firmenposition: z.string().trim().min(1, "Firmenposition erforderlich.").max(120),
  email: z.string().trim().email("Gültige E-Mail.").max(320),
  telefon: z.string().trim().min(5, "Telefonnummer erforderlich.").max(40),
  firmenname: z.string().trim().min(1, "Firmenname erforderlich.").max(200),
  firmensitz: z.string().trim().min(1, "Firmensitz erforderlich.").max(200),
  notizen: z.string().trim().max(2000).optional(),
});

const standardPayloadSchema = z.object({
  vorname: z.string().trim().min(1, "Vorname erforderlich.").max(80),
  nachname: z.string().trim().min(1, "Nachname erforderlich.").max(80),
  telefon: z.string().trim().min(5, "Telefonnummer erforderlich.").max(40),
  email: z.string().trim().email("Gültige E-Mail.").max(320),
  wohnort: z.string().trim().min(1, "Wohnort erforderlich.").max(200),
  notiz: z.string().trim().max(2000).optional(),
});

export const partnerTipSubmissionSchema = z.discriminatedUnion("service_slug", [
  z.object({
    service_slug: z.literal("betriebliche_pflegeberatung"),
    payload: betriebPayloadSchema,
  }),
  z.object({
    service_slug: z.literal("hauswirtschaft_betreuung"),
    payload: standardPayloadSchema,
  }),
  z.object({
    service_slug: z.literal("pflegehilfsmittel"),
    payload: standardPayloadSchema,
  }),
  z.object({
    service_slug: z.literal("pflegeberatung"),
    payload: standardPayloadSchema,
  }),
]);

export type PartnerTipSubmissionInput = z.infer<typeof partnerTipSubmissionSchema>;
