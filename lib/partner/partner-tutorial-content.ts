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

export const PARTNER_TUTORIAL_STEPS: PartnerTutorialStep[] = [
  {
    anchor: '[data-tutorial="partner-code"]',
    title: "Ihr Partner-Code",
    body:
      "Das ist Ihr eindeutiger Code. Kundinnen und Kunden geben ihn z. B. bei der Bestellung von Pflegehilfsmitteln an. Sie finden ihn auch auf Infomaterial zum Ausdrucken wieder.",
    missingAnchorHint:
      "Öffnen Sie die Übersicht — dort sehen Sie Ihren Partner-Code in der ersten Kachel.",
    bubbleAlignViewportCenterMd: true,
  },
  {
    anchor: '[data-tutorial="partner-provision-betrieblich"]',
    title: "Eigene Abschlussprovision & geworbene Partner",
    body:
      "In diesem Kasten sehen Sie Ihre Abschlussprovision aus der betrieblichen Pflegeberatung sowie die Provision durch direkt geworbene Partner (5 %). Die Auszahlung erfolgt am 3. jedes Monats.",
    missingAnchorHint:
      "Dieser Bereich erscheint, wenn bei Ihnen die betriebliche Pflegeberatung freigeschaltet ist.",
    bubbleAlignViewportCenterMd: true,
  },
  {
    anchor: '[data-tutorial="partner-provision-einmal"]',
    title: "Einmalprovision",
    body:
      "Die Einmalprovision gilt für Pflegehilfsmittel, Hauswirtschaft & Betreuung sowie Pflegeberatung. Auszahlung am 3. des Folgemonats, danach beginnt die nächste Periode.",
    missingAnchorHint:
      "Dieser Kasten erscheint, wenn mindestens eine dieser Leistungen bei Ihnen freigeschaltet ist.",
  },
  {
    anchor: '[data-tutorial="partner-statusliste-monatlich"]',
    title: "Statusliste Eigene Abschlussprovision",
    body:
      "Hier stehen eingereichte Vorgänge zur betrieblichen Pflegeberatung mit dem aktuellen Status. Bei „Vertragsabschluss erfolgreich“ fließt die Provision in Ihre Abschlussprovision ein.",
    missingAnchorHint:
      "Diese Liste kann unter Einstellungen → Statuslisten ausgeblendet sein. Sie erscheint nur bei freigeschalteter betrieblicher Pflegeberatung.",
  },
  {
    anchor: '[data-tutorial="partner-statusliste-einmal"]',
    title: "Statusliste Einmalprovision",
    body:
      "Hier erscheinen Vorgänge zu Pflegehilfsmitteln, Pflegeberatungen sowie Hauswirtschaft & Betreuung. Eine Auszahlung erfolgt nur, wenn die Krankenkasse den Vorgang bewilligt hat bzw. ein Ersteinsatz beim neuen Klienten tatsächlich stattgefunden hat.",
    missingAnchorHint:
      "Diese Liste kann unter Einstellungen → Statuslisten ausgeblendet sein. Sie erscheint nur bei freigeschalteten Einmal-Leistungen.",
  },
  {
    anchor: '[data-tutorial="partner-statusliste-archiv"]',
    title: "Statusliste Archiv",
    body:
      "Hier sehen Sie frühere Vorgänge und Einträge, die Sie in „Mein Archiv“ abgelegt haben — getrennt von den aktiven Provisionslisten.",
    missingAnchorHint:
      "Das Archiv kann auf der Übersicht ausgeblendet sein; unter Einstellungen → Statuslisten bleibt es dennoch erreichbar.",
  },
  {
    anchor: '[data-tutorial="partner-tipp-geben"]',
    title: "Tipp geben",
    body:
      "Hier senden Sie einen Tipp zu den vier Partnerbereichen. Wählen Sie das passende Formular und füllen Sie es entsprechend aus.",
    missingAnchorHint: "Der Button „Tipp geben“ befindet sich oben auf der Übersicht.",
  },
  {
    anchor: '[data-tutorial="partner-nav-einstellungen"]',
    title: "Einstellungen",
    body:
      "Hier passen Sie u. a. Passwort oder E-Mail an, blenden Statuslisten auf der Startseite ein oder aus und verwalten Ihre Verträge.",
    missingAnchorHint: "Nutzen Sie das Zahnrad-Symbol in der linken bzw. unteren Leiste.",
  },
  {
    anchor: '[data-tutorial="partner-nav-statistik"]',
    title: "Statistik",
    body: "Hier sehen Sie eine Übersicht zu Aufträgen und Kennzahlen und behalten alles im Überblick.",
    missingAnchorHint: "Nutzen Sie das Balken-Symbol in der linken bzw. unteren Leiste.",
  },
];
