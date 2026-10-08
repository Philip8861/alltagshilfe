import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { insertPartnerTipSubmission } from "@/lib/partner/insert-partner-tip-submission";
import { notifyStaffOfNewPartnerTipFromPayload } from "@/lib/partner/partner-tip-staff-notify";
import {
  getVerifiedAuthUser,
  isPartnerAccountDisabled,
  PARTNER_ACCOUNT_DISABLED_MESSAGE,
} from "@/lib/partner/auth";
import { partnerMaySubmitTipForServiceSlug } from "@/lib/partner/responsibility-areas";
import { logPartnerPortalAuditEvent, serviceLabelDe } from "@/lib/partner/partner-portal-audit-log";
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
    const user = await getVerifiedAuthUser(supabase);

    if (!user) {
      return NextResponse.json({ ok: false, message: "Nicht angemeldet." }, { status: 401 });
    }

    /** Eine Profil-Abfrage für Berechtigung UND Benachrichtigungs-Daten (vorher zwei Rundreisen). */
    const { data: profile, error: profErr } = await supabase
      .from("partner_profiles")
      .select(
        "id, responsibility_areas, account_disabled_at, display_name, first_name, last_name, organization_name, partner_referral_code",
      )
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

    const partnerName =
      [profile.first_name, profile.last_name]
        .map((s) => (typeof s === "string" ? s.trim() : ""))
        .filter(Boolean)
        .join(" ") ||
      (typeof profile.display_name === "string" ? profile.display_name.trim() : "") ||
      user.email ||
      String(profile.id).slice(0, 8);
    const partnerCode =
      typeof profile.partner_referral_code === "string" ? profile.partner_referral_code.trim() : "";
    const actorLabel = partnerCode ? `${partnerName} (${partnerCode})` : partnerName;

    /** Mail an Mitarbeitende und Audit-Eintrag sind unabhängig — parallel statt nacheinander. */
    const auditSvc = createSupabaseServiceRoleClient();
    await Promise.all([
      notifyStaffOfNewPartnerTipFromPayload({
        serviceSlug: parsed.data.service_slug,
        tipId: result.tipId,
        payload: parsed.data.payload as Record<string, unknown>,
        partner: {
          name: partnerName,
          code: profile.partner_referral_code ?? null,
          organization: profile.organization_name ?? null,
          email: user.email ?? null,
        },
      }),
      auditSvc
        ? logPartnerPortalAuditEvent(auditSvc, {
            event_kind: "tip_submitted",
            subject_partner_id: profile.id,
            actor_kind: "partner",
            actor_partner_id: profile.id,
            actor_label: actorLabel,
            tip_id: result.tipId,
            summary: `Neuer Tipp eingegangen: ${serviceLabelDe(parsed.data.service_slug)}.`,
            detail_json: { service_slug: parsed.data.service_slug },
          })
        : Promise.resolve(),
    ]);

    revalidatePath("/partner/dashboard");
    revalidatePath("/partner/statistik");
    revalidatePath("/partner/admin");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Unerwarteter Fehler." }, { status: 500 });
  }
}
