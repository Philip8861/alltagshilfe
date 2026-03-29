"use server";

import { revalidatePath } from "next/cache";
import { getPartnerSession } from "@/lib/partner/auth";
import { insertPartnerTipSubmission } from "@/lib/partner/insert-partner-tip-submission";
import { partnerTipSubmissionSchema } from "@/lib/validations/partner-tips";

export type SubmitPartnerTipResult = { ok: true } | { ok: false; message: string };

export async function submitPartnerTipAction(raw: unknown): Promise<SubmitPartnerTipResult> {
  const session = await getPartnerSession();
  if (!session?.profile?.id) {
    return { ok: false, message: "Nicht angemeldet." };
  }

  const parsed = partnerTipSubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, message: issue?.message || "Bitte alle Pflichtfelder ausfüllen." };
  }

  try {
    const result = await insertPartnerTipSubmission(session.profile.id, parsed.data);
    if (!result.ok) return result;
    revalidatePath("/partner/dashboard");
    revalidatePath("/partner/statistik");
    revalidatePath("/partner/admin");
    return { ok: true };
  } catch {
    return { ok: false, message: "Unerwarteter Fehler." };
  }
}
