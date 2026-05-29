import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { insertPartnerTipSubmission } from "@/lib/partner/insert-partner-tip-submission";
import { notifyStaffOfNewPartnerTipFromPayload } from "@/lib/partner/partner-tip-staff-notify";
import { isPartnerAccountDisabled, PARTNER_ACCOUNT_DISABLED_MESSAGE } from "@/lib/partner/auth";
import { partnerMaySubmitTipForServiceSlug } from "@/lib/partner/responsibility-areas";
import {
  logPartnerPortalAuditEvent,
  partnerAuditDisplayLabel,
  serviceLabelDe,
} from "@/lib/partner/partner-portal-audit-log";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PartnerProfile } from "@/lib/partner/types";
import { partnerTipSubmissionSchema } from "@/lib/validations/partner-tips";

/**
 * Tipp absenden über Route Handler: nutzt dieselben Cookies wie der Browser-Request
 * (zuverlässiger als manche Server-Action-Läufe mit Supabase-Session).
 */
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, message: "Supabase ist nicht konfiguriert." }, { status: 503 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Ungültige Anfrage." }, { status: 400 });
  }

  const parsed = partnerTipSubmissionSchema.safeParse(json);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, message: issue?.message || "Bitte alle Pflichtfelder ausfüllen." },
      { status: 400 },
    );
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ ok: false, message: "Nicht angemeldet." }, { status: 401 });
    }

    const { data: profile, error: profErr } = await supabase
      .from("partner_profiles")
      .select("id, responsibility_areas, account_disabled_at")
      .eq("id", user.id)
      .maybeSingle();

    if (profErr || !profile?.id) {
      return NextResponse.json({ ok: false, message: "Kein Partnerprofil." }, { status: 403 });
    }

    if (isPartnerAccountDisabled(profile as PartnerProfile)) {
      return NextResponse.json({ ok: false, message: PARTNER_ACCOUNT_DISABLED_MESSAGE }, { status: 403 });
    }

    if (!partnerMaySubmitTipForServiceSlug(profile.responsibility_areas, parsed.data.service_slug)) {
      return NextResponse.json(
        { ok: false, message: "Diese Tippabgabe ist für Ihr Konto nicht möglich." },
        { status: 403 },
      );
    }

    const result = await insertPartnerTipSubmission(profile.id, parsed.data);
    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 500 });
    }

    const { data: hintRow } = await supabase
      .from("partner_profiles")
      .select("display_name, organization_name, partner_referral_code")
      .eq("id", profile.id)
      .maybeSingle();
    const partnerHint = [hintRow?.organization_name, hintRow?.display_name, hintRow?.partner_referral_code]
      .map((s) => (typeof s === "string" ? s.trim() : ""))
      .filter(Boolean)
      .join(" · ");
    await notifyStaffOfNewPartnerTipFromPayload({
      serviceSlug: parsed.data.service_slug,
      tipId: result.tipId,
      payload: parsed.data.payload as Record<string, unknown>,
      partnerHint: partnerHint || undefined,
    });

    const auditSvc = createSupabaseServiceRoleClient();
    if (auditSvc) {
      const actorLabel = await partnerAuditDisplayLabel(auditSvc, profile.id, user.email);
      await logPartnerPortalAuditEvent(auditSvc, {
        event_kind: "tip_submitted",
        subject_partner_id: profile.id,
        actor_kind: "partner",
        actor_partner_id: profile.id,
        actor_label: actorLabel,
        tip_id: result.tipId,
        summary: `Neuer Tipp eingegangen: ${serviceLabelDe(parsed.data.service_slug)}.`,
        detail_json: { service_slug: parsed.data.service_slug },
      });
    }

    revalidatePath("/partner/dashboard");
    revalidatePath("/partner/statistik");
    revalidatePath("/partner/admin");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Unerwarteter Fehler." }, { status: 500 });
  }
}
