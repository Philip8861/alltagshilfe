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

export function buildPartnerAdminTipDeepLink(tipId: string): string {
  const base = siteConfig.baseUrl.replace(/\/$/, "");
  const id = tipId.trim();
  return `${base}/partner/admin?tipp=${encodeURIComponent(id)}`;
}

/**
 * Sendet interne Info-Mail an die zuständige Adresse. Best effort (Fehler werden nur geloggt).
 */
export async function notifyStaffOfNewPartnerTip(input: {
  serviceSlug: PartnerTipSubmissionInput["service_slug"];
  tipId: string;
  /** Eine Zeile Kurzinfo wie in der Adminliste. */
  payloadSummary: string;
  /** z. B. Partner-Name oder Empfehlungscode. */
  partnerHint?: string;
}): Promise<void> {
  const recipients = TIP_STAFF_RECIPIENTS[input.serviceSlug];
  if (!recipients?.length) {
    console.warn("[partner-tip-notify] Kein Empfänger für service_slug:", input.serviceSlug);
    return;
  }

  const tipId = input.tipId.trim();
  if (!tipId) return;

  const leistung =
    PARTNER_RESPONSIBILITY_LABELS[input.serviceSlug as PartnerResponsibilitySlug] ?? input.serviceSlug;
  const actionUrl = buildPartnerAdminTipDeepLink(tipId);
  const defaultStatus = PARTNER_TIP_STATUS_LABELS.in_bearbeitung;

  const rows: EmailDetailRow[] = [
    { label: "Dienstleistung", value: leistung },
    { label: "Kurzinfo", value: input.payloadSummary.trim() || "—" },
    { label: "Eintrags-ID", value: tipId },
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
  });

  const mailed = await sendInternalMail({
    kind: "contact",
    toOverride: [...recipients],
    subject,
    text,
    html,
  });
  if (!mailed.ok) {
    console.warn("[partner-tip-notify] E-Mail konnte nicht versendet werden (SMTP / Empfänger).");
  }
}

/** Nicht blockierend; Fehler nur in der Konsole. */
export function schedulePartnerTipStaffNotify(input: {
  serviceSlug: PartnerTipSubmissionInput["service_slug"];
  tipId: string;
  payload: Record<string, unknown>;
  partnerHint?: string;
}): void {
  void (async () => {
    try {
      await notifyStaffOfNewPartnerTip({
        serviceSlug: input.serviceSlug,
        tipId: input.tipId,
        payloadSummary: partnerTipPayloadSummary(input.payload, input.serviceSlug),
        partnerHint: input.partnerHint,
      });
    } catch (e) {
      console.warn("[partner-tip-notify] Unerwarteter Fehler:", e);
    }
  })();
}
