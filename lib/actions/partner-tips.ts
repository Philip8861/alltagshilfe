"use server";

import { revalidatePath } from "next/cache";
import { getPartnerSession, isPartnerAccountDisabled, PARTNER_ACCOUNT_DISABLED_MESSAGE } from "@/lib/partner/auth";
import { insertPartnerTipSubmission } from "@/lib/partner/insert-partner-tip-submission";
import { notifyStaffOfNewPartnerTipFromPayload } from "@/lib/partner/partner-tip-staff-notify";
import { partnerMaySubmitTipForServiceSlug } from "@/lib/partner/responsibility-areas";
import { partnerTipSubmissionSchema } from "@/lib/validations/partner-tips";

export type SubmitPartnerTipResult = { ok: true } | { ok: false; message: string };

export async function submitPartnerTipAction(raw: unknown): Promise<SubmitPartnerTipResult> {
  const session = await getPartnerSession();
  if (!session?.profile?.id) {
    return { ok: false, message: "Nicht angemeldet." };
  }

  if (isPartnerAccountDisabled(session.profile)) {
    return { ok: false, message: PARTNER_ACCOUNT_DISABLED_MESSAGE };
  }

  const parsed = partnerTipSubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, message: issue?.message || "Bitte alle Pflichtfelder ausfüllen." };
  }

  if (!partnerMaySubmitTipForServiceSlug(session.profile.responsibility_areas, parsed.data.service_slug)) {
    return { ok: false, message: "Diese Tippabgabe ist für Ihr Konto nicht möglich." };
  }

  try {
    const result = await insertPartnerTipSubmission(session.profile.id, parsed.data);
    if (!result.ok) return result;
    const p = session.profile;
    const partnerName =
      [p.first_name, p.last_name]
        .map((s) => (typeof s === "string" ? s.trim() : ""))
        .filter(Boolean)
        .join(" ") ||
      p.display_name?.trim() ||
      session.email ||
      "";
    await notifyStaffOfNewPartnerTipFromPayload({
      serviceSlug: parsed.data.service_slug,
      tipId: result.tipId,
      payload: parsed.data.payload as Record<string, unknown>,
      partner: {
        name: partnerName,
        code: p.partner_referral_code ?? null,
        organization: p.organization_name ?? null,
        email: session.email ?? null,
      },
    });
    revalidatePath("/partner/dashboard");
    revalidatePath("/partner/statistik");
    revalidatePath("/partner/admin");
    return { ok: true };
  } catch {
    return { ok: false, message: "Unerwarteter Fehler." };
  }
}
