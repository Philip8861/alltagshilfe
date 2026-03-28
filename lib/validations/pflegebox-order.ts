import { z } from "zod";

const cartLineSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().trim().min(1).max(200),
  price: z.number().finite().nonnegative().max(1000),
  selectedSize: z.string().max(20).nullable(),
  material: z.string().max(40).nullable(),
  pieces: z.string().max(80).nullable(),
  quantity: z.string().max(80).nullable(),
  ml: z.number().finite().nonnegative().max(1_000_000).nullable(),
  bettschutzeinlage: z.boolean(),
  count: z.number().int().positive().max(50),
});

export const pflegeboxOrderBodySchema = z.object({
  cartLines: z.array(cartLineSchema).min(1).max(80),
  totalBudgetUsed: z.number().finite().nonnegative().max(1000),
  partnerRef: z.string().max(200).optional(),
  contact: z.object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z.string().trim().email().max(320),
    phone: z.string().trim().max(40).optional(),
    plz: z.string().trim().max(12).optional(),
  }),
  /** Honeypot — muss fehlen oder leer sein */
  website: z.string().max(0).optional(),
  privacyAccepted: z.preprocess(
    (val) => val === true || val === "true" || val === 1 || val === "1",
    z.literal(true),
  ),
});

export type PflegeboxOrderBody = z.infer<typeof pflegeboxOrderBodySchema>;
