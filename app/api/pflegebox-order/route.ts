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

function buildTipNotiz(
  lines: PflegeboxOrderBody["cartLines"],
  totalBudgetUsed: number,
  contact: PflegeboxOrderBody["contact"],
): string {
  const budget = totalBudgetUsed.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });
  const head = `Pflegebox-Konfigurator · genutztes Budget ${budget}`;
  const body = lines.map((l) => `${l.count}× ${l.name}`).join("\n");
  const kk = contact.krankenkasse;
  const pg = contact.pflegegrad;
  const ber = contact.personalBeratungWunsch
    ? `Beratung: ja (${contact.beratungKanal ?? "—"})`
    : `Beratung: nein — ${(contact.keinBeratungGrund ?? "").slice(0, 500)}`;
  const tail = [
    `KK: ${kk}`,
    `Pflegegrad: ${pg}`,
    `Beihilfe: ${contact.beihilfeberechtigt ? "ja" : "nein"}`,
    ber,
    contact.orderNote ? `Anmerkung: ${contact.orderNote}` : null,
  ]
    .filter(Boolean)
    .join("\n");
  return `${head}\n${body}\n---\n${tail}`;
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

  const partnerRefRaw = (parsed.data.partnerRef ?? "").trim();
  const partnerId = await resolvePartnerProfileId(service, partnerRefRaw);
  if (partnerRefRaw.length > 0 && !partnerId) {
    return NextResponse.json({ ok: false, error: "invalid_partner_code" }, { status: 400 });
  }

  const externalRef = `PB-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

  const c = parsed.data.contact;
  const summary_json = {
    version: 3,
    cartLines: parsed.data.cartLines,
    totalBudgetUsed: parsed.data.totalBudgetUsed,
    partnerRefRaw: partnerRefRaw || null,
    contact: {
      salutation: c.salutation,
      firstName: c.firstName,
      lastName: c.lastName,
      street: c.street,
      postalCode: c.postalCode,
      city: c.city,
      birthDate: c.birthDate,
      versichertennummer: c.versichertennummer,
      krankenkasse: c.krankenkasse,
      pflegegrad: c.pflegegrad,
      beihilfeberechtigt: c.beihilfeberechtigt,
      personalBeratungWunsch: c.personalBeratungWunsch,
      keinBeratungGrund: c.keinBeratungGrund ?? null,
      beratungKanal: c.beratungKanal ?? null,
      orderNote: c.orderNote ?? null,
      email: c.email?.trim() || null,
      phone: c.phone?.trim() || null,
    },
    signatureDataUrl: parsed.data.signatureDataUrl,
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
    const notiz = buildTipNotiz(parsed.data.cartLines, parsed.data.totalBudgetUsed, parsed.data.contact);
    const tipPayload: Record<string, unknown> = {
      vorname: parsed.data.contact.firstName,
      nachname: parsed.data.contact.lastName,
      telefon: parsed.data.contact.phone?.trim() || "",
      email: parsed.data.contact.email?.trim() || "",
      wohnort: `${parsed.data.contact.postalCode} ${parsed.data.contact.city}`.trim(),
      strasse: parsed.data.contact.street,
      geburtsdatum: parsed.data.contact.birthDate,
      versichertennummer: parsed.data.contact.versichertennummer,
      krankenkasse: parsed.data.contact.krankenkasse,
      pflegegrad: parsed.data.contact.pflegegrad,
      beihilfeberechtigt: parsed.data.contact.beihilfeberechtigt,
      personal_beratung: parsed.data.contact.personalBeratungWunsch,
      beratung_kanal: parsed.data.contact.beratungKanal ?? null,
      kein_beratung_grund: parsed.data.contact.keinBeratungGrund ?? null,
      bestell_anmerkung: parsed.data.contact.orderNote ?? null,
      notiz,
      pflegebox_order_id: orderId,
      external_reference: externalRef,
      partner_referral_raw: partnerRefRaw || null,
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
