import { NextResponse } from "next/server";
import { getSystemAdminSession } from "@/lib/partner/system-admin-session";
import { buildPartnerPortalAuditPdf } from "@/lib/partner/partner-portal-audit-pdf";
import { fetchPartnerPortalAuditLog } from "@/lib/partner/partner-portal-audit-log";
import { currentBerlinPeriodKey } from "@/lib/partner/payout-period";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

export async function GET(request: Request) {
  if (!(await getSystemAdminSession())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const svc = createSupabaseServiceRoleClient();
  if (!svc) {
    return NextResponse.json({ error: "Service nicht verfügbar." }, { status: 503 });
  }

  const url = new URL(request.url);
  const period = url.searchParams.get("period")?.trim() || currentBerlinPeriodKey();
  if (!/^\d{4}-\d{2}$/.test(period)) {
    return NextResponse.json({ error: "Ungültiger Monat." }, { status: 400 });
  }

  const events = await fetchPartnerPortalAuditLog(svc, { periodKey: period, limit: 5000 });

  const partnerIds = [
    ...new Set(events.map((e) => e.subject_partner_id).filter((id): id is string => Boolean(id))),
  ];
  const subjectNames = new Map<string, string>();
  if (partnerIds.length > 0) {
    const { data: profiles } = await svc
      .from("partner_profiles")
      .select("id, first_name, last_name, partner_referral_code, display_name")
      .in("id", partnerIds);
    for (const p of profiles ?? []) {
      const name =
        [p.first_name, p.last_name].filter(Boolean).join(" ").trim() ||
        (typeof p.display_name === "string" ? p.display_name.trim() : "") ||
        String(p.id).slice(0, 8);
      const code = typeof p.partner_referral_code === "string" ? p.partner_referral_code.trim() : "";
      subjectNames.set(String(p.id), code ? `${name} (${code})` : name);
    }
  }

  const pdfBytes = await buildPartnerPortalAuditPdf(period, events, subjectNames);

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="partnerportal-verlauf-${period}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
