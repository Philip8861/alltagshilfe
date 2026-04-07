import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { sendInternalMail } from "@/lib/email/internal-smtp";
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
    : "Beratung: nein";
  const beratungTelRow =
    contact.personalBeratungWunsch &&
    contact.beratungKanal === "telefon" &&
    contact.beratungTelefon?.trim()
      ? `Telefon für Beratung: ${contact.beratungTelefon.trim()}`
      : null;
  const kontaktRow = contact.email?.trim()
    ? `Kontakt: E-Mail ${contact.email.trim()}`
    : contact.phone?.trim()
      ? `Kontakt: Tel. ${contact.phone.trim()}`
      : null;
  const versRow = contact.privatversichert
    ? "Versicherung: Privatversichert"
    : `Versicherten-Nr.: ${contact.versichertennummer}`;
  const kkRow = contact.privatversichert ? null : `KK: ${kk}`;
  const beihilfeRow = contact.privatversichert
    ? `Beihilfe: ${contact.beihilfeberechtigt ? "ja" : "nein"}`
    : null;
  const tail = [
    versRow,
    kkRow,
    `Pflegegrad: ${pg}`,
    beihilfeRow,
    ber,
    beratungTelRow,
    kontaktRow,
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

  const contactNormalized = {
    ...parsed.data.contact,
    beihilfeberechtigt:
      parsed.data.contact.privatversichert && parsed.data.contact.beihilfeberechtigt,
  };

  const externalRef = `PB-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

  const c = contactNormalized;
  const summary_json = {
    version: 4,
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
      privatversichert: c.privatversichert,
      versichertennummer: c.versichertennummer,
      krankenkasse: c.krankenkasse,
      pflegegrad: c.pflegegrad,
      beihilfeberechtigt: c.beihilfeberechtigt,
      personalBeratungWunsch: c.personalBeratungWunsch,
      keinBeratungGrund: c.keinBeratungGrund ?? null,
      beratungKanal: c.beratungKanal ?? null,
      beratungTelefon: c.beratungTelefon?.trim() || null,
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
    const notiz = buildTipNotiz(parsed.data.cartLines, parsed.data.totalBudgetUsed, c);
    const tipPayload: Record<string, unknown> = {
      vorname: c.firstName,
      nachname: c.lastName,
      telefon: c.phone?.trim() || "",
      email: c.email?.trim() || "",
      wohnort: `${c.postalCode} ${c.city}`.trim(),
      strasse: c.street,
      geburtsdatum: c.birthDate,
      versichertennummer: c.versichertennummer,
      krankenkasse: c.krankenkasse,
      pflegegrad: c.pflegegrad,
      beihilfeberechtigt: c.beihilfeberechtigt,
      personal_beratung: c.personalBeratungWunsch,
      beratung_kanal: c.beratungKanal ?? null,
      kein_beratung_grund: c.keinBeratungGrund ?? null,
      bestell_anmerkung: c.orderNote ?? null,
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

  const mailBody = [
    "Neue Pflegebox-Bestellung (Konfigurator)",
    `Referenz: ${externalRef}`,
    orderId ? `Interne ID: ${orderId}` : null,
    "",
    buildTipNotiz(parsed.data.cartLines, parsed.data.totalBudgetUsed, c),
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const mailResult = await sendInternalMail({
    kind: "pflegebox",
    subject: `Pflegebox-Bestellung ${externalRef}`,
    text: mailBody,
    replyTo: c.email?.trim() || undefined,
  });
  if (!mailResult.ok && mailResult.code === "smtp_not_configured") {
    console.warn(
      "[pflegebox-order] SMTP oder NOTIFICATION_TO_PFLEGEBOX / NOTIFICATION_TO fehlt – keine E-Mail versendet",
    );
  }

  return NextResponse.json({ ok: true, id: orderId, reference: externalRef });
}
