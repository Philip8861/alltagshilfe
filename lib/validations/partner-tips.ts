import { z } from "zod";

const betriebPayloadSchema = z
  .object({
    ansprechpartner: z.string().trim().min(1, "Ansprechpartner erforderlich.").max(120),
    firmenposition: z.string().trim().max(120).optional(),
    email: z.preprocess(
      (val) => {
        if (val === undefined || val === null) return undefined;
        const s = String(val).trim();
        return s.length === 0 ? undefined : s;
      },
      z.string().email("Gültige E-Mail.").max(320).optional(),
    ),
    telefon: z.preprocess(
      (val) => {
        if (val === undefined || val === null) return undefined;
        const s = String(val).trim();
        return s.length === 0 ? undefined : s;
      },
      z.string().min(5, "Telefonnummer zu kurz.").max(40).optional(),
    ),
    firmenname: z.string().trim().min(1, "Firmenname erforderlich.").max(200),
    firmensitz: z.string().trim().max(200).optional(),
    notizen: z.string().trim().max(2000).optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.email && !val.telefon) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "Bitte mindestens E-Mail oder Telefonnummer angeben.",
      });
    }
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
