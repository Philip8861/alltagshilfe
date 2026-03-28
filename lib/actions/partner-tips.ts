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
    return { ok: false, message: "Bitte alle Pflichtfelder ausfüllen." };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("partner_tip_submissions").insert({
      partner_id: session.profile.id,
      service_slug: parsed.data.service_slug,
      payload: parsed.data.payload as Record<string, unknown>,
    });
    if (error) {
      return { ok: false, message: "Speichern fehlgeschlagen. Migration 007 und RLS prüfen." };
    }
    revalidatePath("/partner/dashboard");
    return { ok: true };
  } catch {
    return { ok: false, message: "Unerwarteter Fehler." };
  }
}
