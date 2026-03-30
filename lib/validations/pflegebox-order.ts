import { z } from "zod";

const cartLineSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1).max(200),
  price: z.number().finite().nonnegative().max(1000),
  selectedSize: z.string().max(20).nullable(),
  material: z.string().max(40).nullable(),
  pieces: z
    .preprocess((v) => (v == null || v === "" ? null : String(v)), z.string().max(80).nullable()),
  quantity: z
    .preprocess((v) => (v == null || v === "" ? null : String(v)), z.string().max(80).nullable()),
  ml: z.number().finite().nonnegative().max(1_000_000).nullable(),
  bettschutzeinlage: z.boolean(),
  count: z.number().int().positive().max(50),
});

const contactSchema = z
  .object({
    salutation: z.enum(["herr", "frau", "divers"]),
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    street: z.string().trim().min(1).max(120),
    postalCode: z.string().trim().min(1).max(12),
    city: z.string().trim().min(1).max(80),
    birthDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
    /** true = gesetzliche Kasse entfällt, keine Versichertennummer */
    privatversichert: z.preprocess(
      (val) => {
        if (val === undefined || val === null) return false;
        return val === true || val === "true" || val === 1 || val === "1";
      },
      z.boolean(),
    ),
    versichertennummer: z.string().trim().max(30),
    krankenkasse: z.string().trim().max(200),
    pflegegrad: z.number().int().min(1).max(5),
    beihilfeberechtigt: z.boolean(),
    /** true = persönliche Beratung gewünscht */
    personalBeratungWunsch: z.boolean(),
    /** optional, historisch / Kompatibilität */
    keinBeratungGrund: z.string().trim().max(2000).optional(),
    /** Pflicht wenn personalBeratungWunsch === true */
    beratungKanal: z.enum(["telefon", "video", "vor_ort"]).optional(),
    /** Pflicht wenn Beratung telefonisch */
    beratungTelefon: z.preprocess(
      (val) => {
        if (val === undefined || val === null) return undefined;
        const s = String(val).trim();
        return s.length === 0 ? undefined : s;
      },
      z.string().max(40).optional(),
    ),
    orderNote: z.string().trim().max(2000).optional(),
    email: z.preprocess(
      (val) => {
        if (val === undefined || val === null) return undefined;
        const s = String(val).trim();
        return s.length === 0 ? undefined : s;
      },
      z.string().email("Gültige E-Mail.").max(320).optional(),
    ),
    phone: z.preprocess(
      (val) => {
        if (val === undefined || val === null) return undefined;
        const s = String(val).trim();
        return s.length === 0 ? undefined : s;
      },
      z.string().max(40).optional(),
    ),
  })
  .superRefine((c, ctx) => {
    if (!c.privatversichert) {
      const v = c.versichertennummer.trim().toUpperCase();
      if (!/^[A-Z]\d{9}$/.test(v)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Versichertennummer: genau ein Buchstabe gefolgt von 9 Ziffern (z. B. A123456789).",
          path: ["versichertennummer"],
        });
      }
      if (!c.krankenkasse.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Bitte Krankenkasse angeben.",
          path: ["krankenkasse"],
        });
      }
    }
    if (!c.privatversichert && c.beihilfeberechtigt) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Beihilfeberechtigung ist nur bei Privatversicherung zulässig.",
        path: ["beihilfeberechtigt"],
      });
    }
    if (c.personalBeratungWunsch && !c.beratungKanal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bitte wählen Sie eine Beratungsart.",
        path: ["beratungKanal"],
      });
    }
    if (c.personalBeratungWunsch && c.beratungKanal === "telefon") {
      const t = (c.beratungTelefon ?? "").trim();
      const digits = t.replace(/\D/g, "");
      if (!t) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Bitte Telefonnummer für die telefonische Beratung angeben.",
          path: ["beratungTelefon"],
        });
      } else if (digits.length < 8 || t.length > 40) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Bitte eine gültige Telefonnummer für die Beratung angeben (mind. 8 Ziffern).",
          path: ["beratungTelefon"],
        });
      }
    }
    const em = (c.email ?? "").trim();
    const ph = (c.phone ?? "").trim();
    if (!em && !ph) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bitte geben Sie eine gültige E-Mail oder Telefonnummer als Kontaktmöglichkeit an.",
        path: ["email"],
      });
    }
    if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Bitte eine gültige E-Mail-Adresse angeben.",
        path: ["email"],
      });
    }
    if (ph) {
      const digits = ph.replace(/\D/g, "");
      if (digits.length < 8 || ph.length > 40) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Bitte eine gültige Telefonnummer angeben (mind. 8 Ziffern).",
          path: ["phone"],
        });
      }
    }
  });

export const pflegeboxOrderBodySchema = z.object({
  cartLines: z.array(cartLineSchema).min(1).max(80),
  totalBudgetUsed: z.number().finite().nonnegative().max(1000),
  partnerRef: z.string().max(200).optional(),
  contact: contactSchema,
  /** Honeypot — muss fehlen oder leer sein */
  website: z.string().max(0).optional(),
  agbAccepted: z.preprocess(
    (val) => val === true || val === "true" || val === 1 || val === "1",
    z.literal(true),
  ),
  privacyAccepted: z.preprocess(
    (val) => val === true || val === "true" || val === 1 || val === "1",
    z.literal(true),
  ),
  /** PNG data URL der Unterschrift */
  signatureDataUrl: z
    .string()
    .min(30)
    .max(2_500_000)
    .refine((s) => s.startsWith("data:image/"), "Ungültige Signatur."),
});

export type PflegeboxOrderBody = z.infer<typeof pflegeboxOrderBodySchema>;
