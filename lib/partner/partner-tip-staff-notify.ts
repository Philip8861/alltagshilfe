import { siteConfig } from "@/config/site";
import { buildBrandedNotificationHtml, type EmailDetailRow } from "@/lib/email/branded-html";
import { sendInternalMail } from "@/lib/email/internal-smtp";
import { PARTNER_TIP_STATUS_LABELS } from "@/lib/partner/partner-tip-admin";
import { partnerTipPayloadSummary } from "@/lib/partner/partner-tip-summary";
import { PARTNER_RESPONSIBILITY_LABELS, type PartnerResponsibilitySlug } from "@/lib/partner/responsibility-areas";
import type { PartnerTipSubmissionInput } from "@/lib/validations/partner-tips";

/** Feste Zuständigkeiten pro Leistung (Tipp / Pflegebox-Tipp). Keine Secrets im Frontend. */
const TIP_STAFF_RECIPIENTS: Record<PartnerTipSubmissionInput["service_slug"], readonly string[]> = {
  hauswirtschaft_betreuung: ["info@alltagshilfe-sued.de"],
  betriebliche_pflegeberatung: ["philip.sonntag@alltagshilfe-sued.de"],
  pflegehilfsmittel: ["valentin.maucher@alltagshilfe-sued.de"],
  pflegeberatung: ["valentin.maucher@alltagshilfe-sued.de"],
};

export type PartnerTipStaffServiceSlug = keyof typeof TIP_STAFF_RECIPIENTS;

export function isPartnerTipStaffMailSlug(s: string): s is PartnerTipStaffServiceSlug {
  return Object.prototype.hasOwnProperty.call(TIP_STAFF_RECIPIENTS, s);
}

export type PartnerTipStaffNotifyBase = {
  serviceSlug: PartnerTipStaffServiceSlug;
  tipId: string;
  payloadSummary: string;
  partnerHint?: string;
};

export function buildPartnerAdminTipDeepLink(tipId: string): string {
  const base = siteConfig.baseUrl.replace(/\/$/, "");
  const id = tipId.trim();
  return `${base}/partner/admin?tipp=${encodeURIComponent(id)}`;
}

/**
 * Sendet interne Info-Mail an die zuständige Adresse. Best effort (Fehler werden nur geloggt).
 * @returns ob SMTP-Versand erfolgreich war
 */
export async function notifyStaffOfNewPartnerTip(input: PartnerTipStaffNotifyBase): Promise<boolean> {
  const recipients = TIP_STAFF_RECIPIENTS[input.serviceSlug];
  if (!recipients?.length) {
    console.warn("[partner-tip-notify] Kein Empfänger für service_slug:", input.serviceSlug);
    return false;
  }

  const tipId = input.tipId.trim();
  if (!tipId) return false;

  const leistung =
    PARTNER_RESPONSIBILITY_LABELS[input.serviceSlug as PartnerResponsibilitySlug] ?? input.serviceSlug;
  const actionUrl = buildPartnerAdminTipDeepLink(tipId);
  const defaultStatus = PARTNER_TIP_STATUS_LABELS.in_bearbeitung;

  const rows: EmailDetailRow[] = [
    { label: "Dienstleistung", value: leistung },
    { label: "Kurzinfo", value: input.payloadSummary.trim() || "—" },
  ];
  if (input.partnerHint?.trim()) {
    rows.push({ label: "Partner / Vermittlung", value: input.partnerHint.trim() });
  }

  const statusChoice = [
    PARTNER_TIP_STATUS_LABELS.vertragsabschluss_erfolgreich,
    PARTNER_TIP_STATUS_LABELS.in_bearbeitung,
    PARTNER_TIP_STATUS_LABELS.abgelehnt,
  ].join(", ");

  const detailText = [
    "Es wurde ein neuer Tipp über das Partnerportal bzw. einen verknüpften Kanal (z. B. Pflegebox-Konfigurator) eingereicht.",
    `Aktueller Bearbeitungsstatus in der Verwaltung: ${defaultStatus}.`,
    "Bitte prüfen Sie den Vorgang und setzen Sie den Status für den Kooperationspartner entsprechend:",
    `Mögliche Stufen: ${statusChoice}.`,
    "Der Partner sieht den Status im eigenen Dashboard und wartet auf diese Aktualisierung.",
  ].join("\n");

  const subject = `Neuer Partner-Tipp · ${leistung}`;

  const text = [
    subject,
    "",
    ...rows.map((r) => `${r.label}: ${r.value}`),
    "",
    detailText,
    "",
    "Status bearbeiten:",
    actionUrl,
  ].join("\n");

  const html = buildBrandedNotificationHtml({
    kindBadge: "Partner-Tipp",
    headline: "Neuer Partner-Tipp",
    rows,
    detailTitle: "Was ist zu tun?",
    detailText,
    ctaHref: actionUrl,
    ctaLabel: "Status bearbeiten",
    ctaButtonVariant: "accent",
  });

  const mailed = await sendInternalMail({
    kind: "contact",
    toOverride: [...recipients],
    subject,
    text,
    html,
  });
  if (!mailed.ok) {
    console.warn(`[partner-tip-notify] E-Mail konnte nicht versendet werden: ${mailed.code}`);
  }
  return mailed.ok;
}

/**
 * Erinnerung: Tipp ist weiterhin „In Bearbeitung“ (Cron, alle 72 h).
 */
export async function notifyStaffOfInBearbeitungPartnerTipReminder(input: PartnerTipStaffNotifyBase): Promise<boolean> {
  const recipients = TIP_STAFF_RECIPIENTS[input.serviceSlug];
  if (!recipients?.length) {
    console.warn("[partner-tip-reminder] Kein Empfänger für service_slug:", input.serviceSlug);
    return false;
  }

  const tipId = input.tipId.trim();
  if (!tipId) return false;

  const leistung =
    PARTNER_RESPONSIBILITY_LABELS[input.serviceSlug as PartnerResponsibilitySlug] ?? input.serviceSlug;
  const actionUrl = buildPartnerAdminTipDeepLink(tipId);
  const statusLabel = PARTNER_TIP_STATUS_LABELS.in_bearbeitung;

  const rows: EmailDetailRow[] = [
    { label: "Dienstleistung", value: leistung },
    { label: "Kurzinfo", value: input.payloadSummary.trim() || "—" },
  ];
  if (input.partnerHint?.trim()) {
    rows.push({ label: "Partner / Vermittlung", value: input.partnerHint.trim() });
  }

  const detailText = [
    `Dieser Partner-Tipp steht seit mindestens drei Tagen weiterhin auf „${statusLabel}“.`,
    "Bitte prüfen Sie den Vorgang in der Partner-Administration und aktualisieren Sie den Status, sobald möglich – der Partner sieht ihn im eigenen Dashboard.",
  ].join("\n");

  const subject = `Erinnerung Partner-Tipp · ${leistung}`;

  const text = [
    subject,
    "",
    ...rows.map((r) => `${r.label}: ${r.value}`),
    "",
    detailText,
    "",
    "Status bearbeiten:",
    actionUrl,
  ].join("\n");

  const html = buildBrandedNotificationHtml({
    kindBadge: "Partner-Tipp",
    headline: "Erinnerung: Tipp noch in Bearbeitung",
    rows,
    detailTitle: "Handlungsbedarf",
    detailText,
    ctaHref: actionUrl,
    ctaLabel: "Status bearbeiten",
    ctaButtonVariant: "accent",
  });

  const mailed = await sendInternalMail({
    kind: "contact",
    toOverride: [...recipients],
    subject,
    text,
    html,
  });
  if (!mailed.ok) {
    console.warn(`[partner-tip-reminder] E-Mail konnte nicht versendet werden: ${mailed.code}`);
  }
  return mailed.ok;
}

/**
 * Wie {@link notifyStaffOfNewPartnerTip}, mit Payload-Zusammenfassung aus Rohdaten.
 * Immer awaited aufrufen (Route Handler / Server Action), nicht fire-and-forget — sonst bricht Serverless oft vor dem SMTP ab.
 */
export async function notifyStaffOfNewPartnerTipFromPayload(input: {
  serviceSlug: PartnerTipSubmissionInput["service_slug"];
  tipId: string;
  payload: Record<string, unknown>;
  partnerHint?: string;
}): Promise<void> {
  try {
    await notifyStaffOfNewPartnerTip({
      serviceSlug: input.serviceSlug,
      tipId: input.tipId,
      payloadSummary: partnerTipPayloadSummary(input.payload, input.serviceSlug),
      partnerHint: input.partnerHint,
    });
  } catch (e) {
    console.error("[partner-tip-notify] Unerwarteter Fehler:", e);
  }
}
