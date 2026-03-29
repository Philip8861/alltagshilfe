"use server";

import { revalidatePath } from "next/cache";
import { getPartnerSession } from "@/lib/partner/auth";
import { partnerTipSubmissionSchema } from "@/lib/validations/partner-tips";
import { createSupabaseServerClient } from "@/lib/supabase/server";

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
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("partner_tip_submissions").insert({
      partner_id: session.profile.id,
      service_slug: parsed.data.service_slug,
      payload: parsed.data.payload as Record<string, unknown>,
      /** Neu eingereichte Tipps erscheinen bei Admin unter Aufträgen; Partner sieht „In Bearbeitung“. */
      admin_status: "in_bearbeitung",
    });
    if (error) {
      console.error("[submitPartnerTipAction]", error.message, error.code, error.details);
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
