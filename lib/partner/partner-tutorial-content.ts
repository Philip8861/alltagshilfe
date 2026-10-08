import {
  PARTNER_EINMAL_PROVISION_SLUGS,
  partnerHasBetrieblicheProgram,
  partnerHasEinmalProvisionProgram,
  partnerHasWerbenetzwerkProgram,
} from "@/lib/partner/partner-program-capabilities";
import { PARTNER_RESPONSIBILITY_LABELS, type PartnerResponsibilitySlug } from "@/lib/partner/responsibility-areas";
import { PARTNER_DIRECT_REFERRAL_RATE_LABEL } from "@/lib/partner/referral-money";

export type PartnerTutorialStep = {
  anchor: string;
  title: string;
  body: string;
  /** Hinweis, wenn Anker fehlt (z. B. Liste ausgeblendet). */
  missingAnchorHint: string;
  /**
   * Ab md: Dialog horizontal zur Viewport-Mitte (schmale Kacheln in der 4er-Reihe,
   * sonst wirkt die Sprechblase „verschoben“).
   */
  bubbleAlignViewportCenterMd?: boolean;
};

function joinDe(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} und ${items[items.length - 1]}`;
}

/**
 * Rundgang passend zum freigeschalteten Partnerprogramm.
 * Nur betriebliche Pflegeberatung → keine Schritte zu Einmalprovision/Pflegebox; stattdessen Werbe-Netzwerk.
 */
export function buildPartnerTutorialSteps(responsibilityAreas: string[] | null | undefined): PartnerTutorialStep[] {
  const areas = responsibilityAreas ?? [];
  const hasBetriebliche = partnerHasBetrieblicheProgram(areas);
  const hasEinmal = partnerHasEinmalProvisionProgram(areas);
  const showNetwork = partnerHasWerbenetzwerkProgram(areas);
  const hasPflegehilfsmittel = areas.includes("pflegehilfsmittel");
  const onlyBetrieblich = hasBetriebliche && !hasEinmal;

  const einmalLabels = PARTNER_EINMAL_PROVISION_SLUGS.filter((s) => areas.includes(s)).map(
    (s) => PARTNER_RESPONSIBILITY_LABELS[s],
  );
  const allLabels = areas
    .filter((s): s is PartnerResponsibilitySlug => s in PARTNER_RESPONSIBILITY_LABELS)
    .map((s) => PARTNER_RESPONSIBILITY_LABELS[s]);

  const steps: PartnerTutorialStep[] = [];

  steps.push({
    anchor: '[data-tutorial="partner-code"]',
    title: "Ihr Partner-Code",
    body: hasPflegehilfsmittel
      ? "Das ist Ihr eindeutiger Code. Kundinnen und Kunden geben ihn z. B. bei der Bestellung von Pflegehilfsmitteln an. Sie finden ihn auch auf Infomaterial zum Ausdrucken wieder."
      : showNetwork
        ? "Das ist Ihr eindeutiger Code. Über ihn werden Ihre Vorgänge zugeordnet – und wenn Sie neue Partner empfehlen, hinterlegen wir diese über Ihren Code in Ihrem Werbe-Netzwerk."
        : "Das ist Ihr eindeutiger Code. Über ihn werden Ihre Vorgänge und Provisionen eindeutig Ihrem Konto zugeordnet.",
    missingAnchorHint: "Öffnen Sie die Übersicht — dort sehen Sie Ihren Partner-Code in der ersten Kachel.",
    bubbleAlignViewportCenterMd: true,
  });

  if (hasBetriebliche) {
    steps.push({
      anchor: '[data-tutorial="partner-provision-betrieblich"]',
      title: "Eigene Abschlussprovision & geworbene Partner",
      body:
        `In diesem Kasten sehen Sie Ihre Abschlussprovision aus der betrieblichen Pflegeberatung sowie die Provision durch direkt geworbene Partner (${PARTNER_DIRECT_REFERRAL_RATE_LABEL} auf deren Gesamtumsatz inkl. deren Netzwerk). Die Auszahlung erfolgt am 3. jedes Monats.`,
      missingAnchorHint: "Dieser Bereich erscheint, wenn bei Ihnen die betriebliche Pflegeberatung freigeschaltet ist.",
      bubbleAlignViewportCenterMd: true,
    });
  }

  if (hasEinmal) {
    steps.push({
      anchor: '[data-tutorial="partner-provision-einmal"]',
      title: "Einmalprovision",
      body: `Die Einmalprovision gilt für ${joinDe(einmalLabels)}. Auszahlung am 3. des Folgemonats, danach beginnt die nächste Periode.`,
      missingAnchorHint: "Dieser Kasten erscheint, wenn mindestens eine dieser Leistungen bei Ihnen freigeschaltet ist.",
    });
  }

  if (hasBetriebliche) {
    steps.push({
      anchor: '[data-tutorial="partner-statusliste-monatlich"]',
      title: "Statusliste Eigene Abschlussprovision",
      body:
        "Hier stehen Ihre gemeldeten Betriebe mit dem aktuellen Status. Bei „Vertragsabschluss erfolgreich“ fließt die monatliche Provision in Ihre Abschlussprovision ein; Rückmeldungen von uns erscheinen unter „Notiz“.",
      missingAnchorHint:
        "Diese Liste kann unter Einstellungen → Statuslisten ausgeblendet sein. Sie erscheint nur bei freigeschalteter betrieblicher Pflegeberatung.",
    });
  }

  if (hasEinmal) {
    steps.push({
      anchor: '[data-tutorial="partner-statusliste-einmal"]',
      title: "Statusliste Einmalprovision",
      body: `Hier erscheinen Vorgänge zu ${joinDe(einmalLabels)}. Eine Auszahlung erfolgt nur, wenn die Krankenkasse den Vorgang bewilligt hat bzw. ein Ersteinsatz beim neuen Klienten tatsächlich stattgefunden hat.`,
      missingAnchorHint:
        "Diese Liste kann unter Einstellungen → Statuslisten ausgeblendet sein. Sie erscheint nur bei freigeschalteten Einmal-Leistungen.",
    });
  }

  steps.push({
    anchor: '[data-tutorial="partner-statusliste-archiv"]',
    title: "Statusliste Archiv",
    body: "Hier sehen Sie frühere Vorgänge und Einträge, die Sie in „Mein Archiv“ abgelegt haben — getrennt von den aktiven Provisionslisten.",
    missingAnchorHint:
      "Das Archiv kann auf der Übersicht ausgeblendet sein; unter Einstellungen → Statuslisten bleibt es dennoch erreichbar.",
  });

  steps.push({
    anchor: '[data-tutorial="partner-tipp-geben"]',
    title: "Tipp geben",
    body: onlyBetrieblich
      ? "Hier melden Sie uns einen Betrieb für die betriebliche Pflegeberatung. Sie landen direkt im Formular – Ansprechpartner, Firmenname und eine Erreichbarkeit genügen, den Rest übernehmen wir."
      : allLabels.length === 1
        ? `Hier melden Sie uns einen neuen Tipp zu „${allLabels[0]}“. Sie landen direkt im passenden Formular.`
        : `Hier senden Sie einen Tipp zu Ihren freigeschalteten Leistungen (${joinDe(allLabels)}). Wählen Sie die Leistung und füllen Sie das Formular aus.`,
    missingAnchorHint: "Der Button „Tipp geben“ befindet sich oben auf der Übersicht.",
  });

  if (showNetwork) {
    steps.push({
      anchor: '[data-tutorial="partner-nav-netzwerk"]',
      title: "Werbe-Netzwerk",
      body:
        `Hier sehen Sie die von Ihnen geworbenen Partner als Baum. Von deren Abschlussprovision erhalten Sie zusätzlich ${PARTNER_DIRECT_REFERRAL_RATE_LABEL} Werbeprovision – ebenfalls monatlich ausgezahlt. Neue Partner werden über Ihren Partner-Code zugeordnet.`,
      missingAnchorHint: "Nutzen Sie das Personen-Symbol in der linken bzw. unteren Leiste.",
    });
  }

  steps.push({
    anchor: '[data-tutorial="partner-nav-einstellungen"]',
    title: "Einstellungen",
    body: "Hier passen Sie u. a. Passwort oder E-Mail an, blenden Statuslisten auf der Startseite ein oder aus und verwalten Ihre Verträge.",
    missingAnchorHint: "Nutzen Sie das Zahnrad-Symbol in der linken bzw. unteren Leiste.",
  });

  steps.push({
    anchor: '[data-tutorial="partner-nav-statistik"]',
    title: "Statistik",
    body: "Hier sehen Sie eine Übersicht zu Ihren Vorgängen und Kennzahlen und behalten alles im Überblick.",
    missingAnchorHint: "Nutzen Sie das Balken-Symbol in der linken bzw. unteren Leiste.",
  });

  return steps;
}

/** Vollständiger Rundgang (alle Programme) – z. B. für Vorschau/Demo. */
export const PARTNER_TUTORIAL_STEPS: PartnerTutorialStep[] = buildPartnerTutorialSteps([
  "betriebliche_pflegeberatung",
  "pflegehilfsmittel",
  "hauswirtschaft_betreuung",
  "pflegeberatung",
]);
