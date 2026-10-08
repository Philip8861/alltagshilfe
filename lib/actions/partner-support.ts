"use server";

import { headers } from "next/headers";
import { siteConfig } from "@/config/site";
import { buildBrandedNotificationHtml, type EmailDetailRow } from "@/lib/email/branded-html";
import { parseNotificationEmailList, sendInternalMail } from "@/lib/email/internal-smtp";
import { getPartnerSession, isPartnerAccountDisabled, PARTNER_ACCOUNT_DISABLED_MESSAGE } from "@/lib/partner/auth";
import { PARTNER_SUPPORT_CONTACT_NAME, partnerSupportTopicLabel } from "@/lib/partner/partner-support-contact";
import { PARTNER_RESPONSIBILITY_LABELS, type PartnerResponsibilitySlug } from "@/lib/partner/responsibility-areas";
import { rateLimitWithConfig } from "@/lib/rate-limit";
import { partnerSupportRequestSchema, type PartnerSupportRequestInput } from "@/lib/validations/partner-support";

/** Zieladresse des Partner-Supports; per PARTNER_SUPPORT_EMAIL übersteuerbar (kommagetrennt). Nur serverseitig. */
const PARTNER_SUPPORT_INBOX = "franz.dirscherl@alltagshilfe-sued.de";

function resolvePartnerSupportRecipients(): string[] {
  const fromEnv = parseNotificationEmailList(process.env.PARTNER_SUPPORT_EMAIL);
  return fromEnv.length > 0 ? fromEnv : [PARTNER_SUPPORT_INBOX];
}

export type PartnerSupportRequestResult =
  | { ok: true }
  | { ok: false; message: string; field?: keyof PartnerSupportRequestInput };

function clean(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export async function sendPartnerSupportRequestAction(raw: unknown): Promise<PartnerSupportRequestResult> {
  const session = await getPartnerSession();
  if (!session?.profile?.id) {
    return { ok: false, message: "Nicht angemeldet. Bitte erneut einloggen." };
  }
  if (isPartnerAccountDisabled(session.profile)) {
    return { ok: false, message: PARTNER_ACCOUNT_DISABLED_MESSAGE };
  }

  const parsed = partnerSupportRequestSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = issue?.path?.[0];
    return {
      ok: false,
      message: issue?.message ?? "Bitte prüfen Sie Ihre Eingaben.",
      field: typeof field === "string" ? (field as keyof PartnerSupportRequestInput) : undefined,
    };
  }
  const input = parsed.data;

  /* Honeypot gefüllt: still verwerfen, keine Information nach außen. */
  if (input.website && input.website.length > 0) {
    return { ok: true };
  }

  try {
    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip")?.trim() ?? "unknown";
    const limited = rateLimitWithConfig(`partner-support:${session.profile.id}:${ip}`, 6, 60 * 60 * 1000);
    if (!limited.success) {
      return { ok: false, message: "Sie haben in kurzer Zeit mehrere Anliegen gesendet. Bitte versuchen Sie es später erneut." };
    }
  } catch {
    /* ignore */
  }

  const p = session.profile;
  const partnerName =
    [clean(p.first_name), clean(p.last_name)].filter(Boolean).join(" ") || clean(p.display_name) || "Partner";
  const partnerEmail = clean(session.email);
  const partnerCode = clean(p.partner_referral_code);
  const organization = clean(p.organization_name);
  const profilePhone = clean(p.phone);
  const callbackPhone = clean(input.phone);
  const areas = (p.responsibility_areas ?? [])
    .map((s) => PARTNER_RESPONSIBILITY_LABELS[s as PartnerResponsibilitySlug] ?? s)
    .filter(Boolean);
  const topic = partnerSupportTopicLabel(input.topic);

  const rows: EmailDetailRow[] = [
    { label: "Partner", value: [partnerName, partnerCode ? `Partner-Code ${partnerCode}` : ""].filter(Boolean).join(", ") },
    ...(organization ? [{ label: "Firma", value: organization }] : []),
    ...(partnerEmail ? [{ label: "E-Mail (Antwort)", value: partnerEmail }] : []),
    ...(callbackPhone || profilePhone
      ? [{ label: callbackPhone ? "Rückruf unter" : "Telefon (Profil)", value: callbackPhone || profilePhone }]
      : []),
    ...(areas.length ? [{ label: "Freigeschaltet", value: areas.join(", ") }] : []),
    { label: "Thema", value: topic },
  ];

  const base = siteConfig.baseUrl.replace(/\/$/, "");
  const adminUrl = `${base}/partner/admin?bereich=liste`;
  const headline = `${partnerName} hat ein Anliegen`;
  const subject = `Partner-Anliegen von ${partnerName}: ${topic}`;

  const text = [
    headline,
    "",
    ...rows.map((r) => `${r.label}: ${r.value}`),
    "",
    "Nachricht:",
    input.message,
    "",
    `Antwort einfach per Antworten-Funktion an ${partnerEmail || "den Partner"}.`,
    "",
    "Partner in der Verwaltung öffnen:",
    adminUrl,
  ].join("\n");

  const html = buildBrandedNotificationHtml({
    kindBadge: "Partner-Support",
    headline,
    rows,
    detailTitle: "Nachricht",
    detailText: input.message,
    ctaHref: adminUrl,
    ctaLabel: "Partner in der Verwaltung öffnen",
    ctaButtonVariant: "brand",
  });

  const mailed = await sendInternalMail({
    kind: "contact",
    toOverride: resolvePartnerSupportRecipients(),
    subject,
    text,
    html,
    ...(partnerEmail ? { replyTo: partnerEmail } : {}),
  });

  if (!mailed.ok) {
    const fallbackTeamEmail = process.env.PARTNER_REGISTRATION_MAIL_TEAM_EMAIL?.trim() || "info@alltagshilfe-sued.de";
    console.warn(`[partner-support] Anliegen von ${p.id} konnte nicht versendet werden: ${mailed.code}`);
    return {
      ok: false,
      message: `Ihr Anliegen konnte gerade nicht übermittelt werden. Bitte versuchen Sie es in Kürze erneut oder schreiben Sie an ${fallbackTeamEmail} (Stichwort: ${PARTNER_SUPPORT_CONTACT_NAME}).`,
    };
  }
  return { ok: true };
}
