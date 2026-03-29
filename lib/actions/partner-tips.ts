"use server";

import { revalidatePath } from "next/cache";
import { getPartnerSession } from "@/lib/partner/auth";
import { partnerTipSubmissionSchema } from "@/lib/validations/partner-tips";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

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
    const row = {
      /** Gleiche ID wie in partner_profiles und wie beim Dashboard-Select (.eq partner_id, profile.id). */
      partner_id: session.profile.id,
      service_slug: parsed.data.service_slug,
      payload: parsed.data.payload as Record<string, unknown>,
      admin_status: "in_bearbeitung" as const,
    };

    const svc = createSupabaseServiceRoleClient();
    let insertError: { message: string; code?: string; details?: string } | null = null;

    if (svc) {
      const svcRes = await svc.from("partner_tip_submissions").insert(row);
      insertError = svcRes.error;
      if (insertError) {
        console.warn("[submitPartnerTipAction] Service-Role-Insert fehlgeschlagen, versuche User-Client.", insertError.message);
      }
    }

    if (insertError !== null || !svc) {
      const supabase = await createSupabaseServerClient();
      const userRes = await supabase.from("partner_tip_submissions").insert(row);
      insertError = userRes.error;
    }

    if (insertError) {
      console.error("[submitPartnerTipAction]", insertError.message, insertError.code, insertError.details);
      return { ok: false, message: "Speichern fehlgeschlagen. Bitte Seite neu laden oder Support informieren." };
    }
    revalidatePath("/partner/dashboard");
    revalidatePath("/partner/statistik");
    revalidatePath("/partner/admin");
    return { ok: true };
  } catch {
    return { ok: false, message: "Unerwarteter Fehler." };
  }
}
