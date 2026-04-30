/**
 * Vorlage für das Kontaktformular aus dem Ratgeber-Beratungs-Popup.
 */
export function buildRatgeberBeratungInitialMessage(params: {
  contextNote?: string;
  plz: string;
  serviceLabels: string[];
  usedFallbackStandort: boolean;
}): string {
  const plzLine = params.plz.length === 5 ? `PLZ: ${params.plz}` : "PLZ: nicht angegeben";
  const context = params.contextNote?.trim();

  return [
    "Anfrage über den Ratgeber (Persönliche Beratung)",
    context ? `Kontext: ${context}` : null,
    plzLine,
    params.usedFallbackStandort
      ? "Hinweis: Für die angegebene PLZ ist kein eigener Regionalstandort hinterlegt – unten sehen Sie die Zentrale Bad Grönenbach."
      : null,
    "",
    "Beratungswunsch zu folgenden Leistungen:",
    params.serviceLabels.length > 0
      ? params.serviceLabels.map((l) => `- ${l}`).join("\n")
      : "- (bitte im Dialog gewählt)",
    "",
    "Ich freue mich auf Ihre Kontaktaufnahme.",
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}
