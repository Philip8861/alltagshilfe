import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { rateLimitPflegeboxOrder } from "@/lib/rate-limit";
import { pflegeboxOrderBodySchema, type PflegeboxOrderBody } from "@/lib/validations/pflegebox-order";
import { createSupabaseServiceRoleClient, resolvePartnerProfileId } from "@/lib/supabase/service";

async function clientIp(): Promise<string> {
  try {
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
    return h.get("x-real-ip")?.trim() ?? "unknown";
  } catch {
    return "unknown";
  }
}

function buildTipNotiz(lines: PflegeboxOrderBody["cartLines"], totalBudgetUsed: number): string {
  const budget = totalBudgetUsed.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });
  const head = `Pflegebox-Konfigurator · genutztes Budget ${budget}`;
  const body = lines.map((l) => `${l.count}× ${l.name}`).join("\n");
  return `${head}\n${body}`;
}

export async function POST(request: Request) {
  const ip = await clientIp();
  if (!rateLimitPflegeboxOrder(ip).success) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const service = createSupabaseServiceRoleClient();
  if (!service) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = pflegeboxOrderBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const partnerId = await resolvePartnerProfileId(service, parsed.data.partnerRef);

  const externalRef = `PB-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

  const summary_json = {
    version: 2,
    cartLines: parsed.data.cartLines,
    totalBudgetUsed: parsed.data.totalBudgetUsed,
    partnerRefRaw: (parsed.data.partnerRef ?? "").trim() || null,
    contact: {
      firstName: parsed.data.contact.firstName,
      lastName: parsed.data.contact.lastName,
      email: parsed.data.contact.email?.trim() || null,
      phone: parsed.data.contact.phone?.trim() || null,
      plz: parsed.data.contact.plz?.trim() || null,
    },
    submittedAt: new Date().toISOString(),
  };

  const { data, error } = await service
    .from("pflegebox_orders")
    .insert({
      partner_id: partnerId,
      external_reference: externalRef,
      status: "in_bearbeitung",
      summary_json,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: "save_failed" }, { status: 500 });
  }

  const orderId = data?.id as string | undefined;

  if (partnerId && orderId) {
    const notiz = buildTipNotiz(parsed.data.cartLines, parsed.data.totalBudgetUsed);
    const tipPayload: Record<string, unknown> = {
      vorname: parsed.data.contact.firstName,
      nachname: parsed.data.contact.lastName,
      telefon: parsed.data.contact.phone?.trim() || "",
      email: parsed.data.contact.email?.trim() || "",
      wohnort: parsed.data.contact.plz?.trim() || "",
      notiz,
      pflegebox_order_id: orderId,
      external_reference: externalRef,
      partner_referral_raw: (parsed.data.partnerRef ?? "").trim() || null,
    };
    const { error: tipErr } = await service.from("partner_tip_submissions").insert({
      partner_id: partnerId,
      service_slug: "pflegehilfsmittel",
      payload: tipPayload,
      admin_status: "in_bearbeitung",
    });
    if (tipErr) {
      console.error("[pflegebox-order] partner_tip_submissions insert failed", tipErr.message);
    }
  }

  return NextResponse.json({ ok: true, id: orderId, reference: externalRef });
}
