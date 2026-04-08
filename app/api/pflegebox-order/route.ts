import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { buildBrandedNotificationHtml } from "@/lib/email/branded-html";
import { resolveRecipientsForKind, sendInternalMail } from "@/lib/email/internal-smtp";
import { fillFormV1Pdf } from "@/lib/pdf/fill-form-v1";
import {
  buildFormV1FillInputFromPflegeboxOrder,
  parseSignaturePngDataUrl,
} from "@/lib/pdf/pflegebox-order-to-form-v1";
import { resolveFormV1TemplatePath } from "@/lib/pdf/resolve-form-v1-template";
import { formatPflegeboxCartLineForMail } from "@/lib/pflegebox/cart-line-mail-text";
import { rateLimitPflegeboxOrder } from "@/lib/rate-limit";
import { pflegeboxOrderBodySchema, type PflegeboxOrderBody } from "@/lib/validations/pflegebox-order";
import { createSupabaseServiceRoleClient, resolvePartnerProfileId } from "@/lib/supabase/service";

/** Immer Empfänger für den ausgefüllten PDF-Anhang (zusätzlich zu NOTIFICATION_TO_PFLEGEBOX / NOTIFICATION_TO). */
const PFLEGEBOX_FORM_PDF_RECIPIENT = "info@alltagshilfe-sued.de";

function pflegeboxMailRecipients(): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of resolveRecipientsForKind("pflegebox")) {
    const k = r.trim().toLowerCase();
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(r.trim());
  }
  const fixed = PFLEGEBOX_FORM_PDF_RECIPIENT.trim();
  const fk = fixed.toLowerCase();
  if (fixed && !seen.has(fk)) {
    seen.add(fk);
    out.push(fixed);
  }
  return out;
}

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
  const body = lines.map((l) => formatPflegeboxCartLineForMail(l)).join("\n");
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

  const tipNotiz = buildTipNotiz(parsed.data.cartLines, parsed.data.totalBudgetUsed, c);

  let formPdfAttachment: { filename: string; content: Buffer; contentType: string } | undefined;
  try {
    const sigBytes = parseSignaturePngDataUrl(parsed.data.signatureDataUrl);
    if (sigBytes && sigBytes.length > 0) {
      const templatePath = resolveFormV1TemplatePath();
      const templateBytes = await readFile(templatePath);
      const fillInput = buildFormV1FillInputFromPflegeboxOrder(parsed.data, sigBytes);
      const filled = await fillFormV1Pdf(templateBytes, fillInput);
      formPdfAttachment = {
        filename: `Pflegebox-Formular-${externalRef}.pdf`,
        content: Buffer.from(filled),
        contentType: "application/pdf",
      };
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    console.error("[pflegebox-order] Formular-PDF konnte nicht erzeugt werden:", msg);
  }

  const pdfHinweis = formPdfAttachment
    ? "Ausgefülltes Formular-PDF: siehe Anhang."
    : "Hinweis: Das ausgefüllte Formular-PDF konnte nicht erzeugt werden (Vorlage fehlt oder technischer Fehler).";

  const mailBody = [
    "Neue Pflegebox-Bestellung (Konfigurator)",
    `Referenz: ${externalRef}`,
    orderId ? `Interne ID: ${orderId}` : null,
    "",
    pdfHinweis,
    "",
    tipNotiz,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const pflegeboxRows = [
    { label: "Referenz", value: externalRef },
    ...(orderId ? [{ label: "Interne ID", value: orderId }] : []),
  ];

  const mailHtml = buildBrandedNotificationHtml({
    kindBadge: "Pflegebox",
    headline: "Neue Pflegebox-Bestellung",
    rows: pflegeboxRows,
    detailTitle: "Konfiguration & Kundendaten",
    detailText: tipNotiz,
  });

  const mailResult = await sendInternalMail({
    kind: "pflegebox",
    toOverride: pflegeboxMailRecipients(),
    subject: `Pflegebox-Bestellung ${externalRef}`,
    text: mailBody,
    html: mailHtml,
    replyTo: c.email?.trim() || undefined,
    ...(formPdfAttachment
      ? {
          attachments: [
            {
              filename: formPdfAttachment.filename,
              content: formPdfAttachment.content,
              contentType: formPdfAttachment.contentType,
            },
          ],
        }
      : {}),
  });
  if (!mailResult.ok && mailResult.code === "smtp_not_configured") {
    console.warn(
      "[pflegebox-order] SMTP oder NOTIFICATION_TO_PFLEGEBOX / NOTIFICATION_TO fehlt – keine E-Mail versendet",
    );
  }

  return NextResponse.json({ ok: true, id: orderId, reference: externalRef });
}
