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
  },
  {
    anchor: '[data-tutorial="partner-provision-monatlich"]',
    title: "Monatliche Tippgeberprovision",
    body:
      "Diese Provision wird zu Beginn jedes neuen Monats ausgezahlt. Aktuell betrifft das nur die betriebliche Pflegeberatung. Der angezeigte Betrag wird zu Monatsbeginn nicht auf 0 zurückgesetzt, sondern bildet Ihre laufenden Monatsprovisionen ab.",
    missingAnchorHint:
      "Wechseln Sie zur Übersicht, um die Kachel „Monatliche Tippgeberprovision“ zu sehen.",
    bubbleAlignViewportCenterMd: true,
  },
  {
    anchor: '[data-tutorial="partner-provision-einmal"]',
    title: "Einmalprovision",
    body:
      "Die Einmalprovision wird zu Beginn des neuen Monats ausbezahlt und danach für die nächste Periode wieder auf 0 € gesetzt.",
    missingAnchorHint: "Wechseln Sie zur Übersicht, um die Kachel „Einmalprovision“ zu sehen.",
  },
  {
    anchor: '[data-tutorial="partner-statusliste-monatlich"]',
    title: "Statusliste Monatliche Tippgeberprovision",
    body:
      "Hier stehen eingereichte oder vermittelte Vorgänge mit dem aktuellen Status. Sobald ein Vertrag den Status „Vertragsabschluss erfolgreich“ hat, fließt die entsprechende monatliche Auszahlung in Ihre Provision ein.",
    missingAnchorHint:
      "Diese Liste kann unter Einstellungen → Statuslisten ausgeblendet sein. Dort oder auf der Übersicht können Sie sie wieder aktivieren.",
  },
  {
    anchor: '[data-tutorial="partner-statusliste-einmal"]',
    title: "Statusliste Einmalprovision",
    body:
      "Hier erscheinen u. a. Vorgänge zu Pflegehilfsmitteln, Pflegeberatungen sowie Hauswirtschaft & Betreuung. Wichtig: Eine Auszahlung erfolgt nur, wenn die Krankenkasse den Vorgang bewilligt hat bzw. ein Ersteinsatz beim neuen Klienten tatsächlich stattgefunden hat.",
    missingAnchorHint:
      "Diese Liste kann unter Einstellungen → Statuslisten ausgeblendet sein. Dort oder auf der Übersicht können Sie sie wieder aktivieren.",
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
