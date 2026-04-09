const KFG_HINT = `Den Konfigurator findest du auf unserer Website unter „Pflegehilfsmittel“ oder direkt unter dem Menüpunkt zur Pflegebox – dort stellst du deine Wunschbox zusammen.`;

/**
 * Regelbasierte Antworten für Pflegeboxi (kein generatives Modell).
 * Reihenfolge: spezifische Guardrails / Intents vor allgemeinen Treffern.
 */
export function buildPflegeboxiReply(text: string, opts?: { context: "landing" | "konfigurator" }): string {
  const lower = text.toLowerCase().trim();
  const onConfigurator = opts?.context === "konfigurator";
  const kfg = onConfigurator
    ? "Hier im Konfigurator siehst du live, wie viel von den 42 € du nutzt – füge Artikel hinzu, bis das Budget passt."
    : KFG_HINT;

  if (
    /\b(anwalt|klage|gericht|medikament|tabletten|diagnos|krankheit\s+habe|schmerz(en)?\b)/i.test(text)
  ) {
    return "Als digitaler Hinweisgeber darf ich keine rechtsverbindliche oder medizinische Beratung geben. Bei rechtlichen Fragen zur Pflegekasse empfehlen wir unsere Pflegeberatung vor Ort; bei gesundheitlichen Beschwerden wende dich bitte an deinen Arzt oder eine Pflegefachkraft.";
  }

  if (
    lower.includes("rezept") ||
    lower.includes("attest") ||
    lower.includes("verordnung") ||
    lower.includes("verschreib") ||
    lower.includes("hausarzt")
  ) {
    return "Gute Nachricht: Für die zum Verbrauch bestimmten Pflegehilfsmittel (PG 54) brauchst du kein Rezept und kein ärztliches Attest – der anerkannte Pflegegrad reicht. Wir übernehmen die Beantragung bei der Pflegekasse für dich.";
  }

  if (
    lower.includes("pflegeheim") ||
    lower.includes("vollstationär") ||
    lower.includes("vollstationaer") ||
    lower.includes("stationäres heim") ||
    lower.includes("stationäre pflege")
  ) {
    return "Die monatliche Pflegehilfsmittel-Pauschale (42 €) gilt für die häusliche Pflege. In einem vollstationären Pflegeheim stellt die Einrichtung die Verbrauchsmaterialien – unser Pflegebox-Angebot greift dort nicht.";
  }

  if (
    lower.includes("pflegedienst") ||
    lower.includes("ambulanter dienst") ||
    lower.includes("caritas") ||
    lower.includes("diakonie") ||
    lower.includes("samariter")
  ) {
    return "Du kannst die kostenfreie Pflegebox nutzen, wenn zusätzlich eine private Person (z. B. Angehörige) in der Pflege hilft. Der ambulante Pflegedienst muss seine eigenen Schutzhandschuhe und Desinfektion mitbringen – die Box ist für die private Pflege und die pflegebedürftige Person gedacht.";
  }

  if (
    lower.includes("telefon") ||
    lower.includes("hotline") ||
    lower.includes("anruf") ||
    lower.includes(" anrufen") ||
    lower.startsWith("anrufen") ||
    lower.includes("email") ||
    lower.includes("e-mail") ||
    lower.includes("kontakt") ||
    lower.includes("erreichen") ||
    lower.includes("öffnungszeit") ||
    lower.includes("sprechzeiten")
  ) {
    return "Du erreichst unser Team telefonisch unter 08334 / 98 93 330 oder 08376 / 97 69 317 (Mo–Do 8:30–16:00, Fr 8:30–12:00). Per E-Mail: info@alltagshilfe-sued.de – wir helfen auch beim Ausfüllen des Antrags.";
  }

  if (
    lower.includes("wechsel") ||
    lower.includes("apotheke") ||
    lower.includes("sanität") ||
    lower.includes("sanitaet") ||
    lower.includes("curabox") ||
    lower.includes("anderer anbieter") ||
    lower.includes("woanders")
  ) {
    return "Ein Wechsel zu uns ist unkompliziert: Du kündigst beim bisherigen Anbieter und stellst deine neue Box in unserem Konfigurator zusammen – der Anspruch bei der Pflegekasse bleibt bestehen. Wir kümmern uns um die Abrechnung.";
  }

  if (
    lower.includes("abgelehnt") ||
    lower.includes("ablehnung") ||
    lower.includes("zahlt nicht") ||
    lower.includes("risiko")
  ) {
    return "Wenn die Pflegekasse einmal nicht bewilligt, informieren wir dich sofort. Du bekommst keine unbezahlten Lieferungen von uns – es entstehen dir keine Kosten aus unserer Zusammenarbeit. In den meisten Fällen klären wir Rückfragen vorab mit der Kasse.";
  }

  if (
    lower.includes("pkv") ||
    lower.includes("privat versichert") ||
    lower.includes("private kranken") ||
    lower.includes("beihilfe")
  ) {
    return "Privat Versicherte haben grundsätzlich ebenfalls Anspruch auf Pflegehilfsmittel; oft musst du erst zahlen und rechnest die Kosten mit der privaten Pflege-Pflichtversicherung bzw. Beihilfe ab – genaue Modalitäten bitte bei deiner Kasse erfragen.";
  }

  if (
    lower.includes("ansparen") ||
    lower.includes("aufheben") ||
    lower.includes("auszahlen") ||
    lower.includes("übertrag") ||
    lower.includes("uebertrag") ||
    lower.includes("restbetrag") ||
    lower.includes("nächsten monat") ||
    lower.includes("naechsten monat")
  ) {
    return "Die 42 € für Verbrauchsmittel sind ein striktes Monatsbudget: Nicht Genutztes verfällt am Monatsende – Ansparen oder Auszahlen geht rechtlich nicht. Darum lohnt sich eine regelmäßige Box, damit du den Anspruch nutzt.";
  }

  if (
    lower.includes("kosten") ||
    lower.includes("gratis") ||
    lower.includes("umsonst") ||
    lower.includes("versand") ||
    lower.includes("porto") ||
    lower.includes("zuzahlung") ||
    lower.includes("rechnung") ||
    lower.includes("wirklich kostenlos")
  ) {
    return "Die Pflegebox ist für dich zuzahlungsfrei, soweit die Pflegekasse bis zu 42 € pro Monat übernimmt. Es gibt bei uns keine versteckten Gebühren für die Box; der Versand ist eingerechnet – du zahlst nichts dazu, wenn die Kasse bewilligt.";
  }

  if (
    lower.includes("entlastungs") ||
    lower.includes("131") ||
    lower.includes("haushaltshilfe") ||
    lower.includes("putzen") ||
    lower.includes("einkauf") ||
    lower.includes("überlast") ||
    lower.includes("ueberlast")
  ) {
    return "Neben der 42-€-Box für Verbrauchsmittel gibt es den Entlastungsbetrag (z. B. für haushaltsnahe Dienstleistungen) – der läuft anders als die monatliche PG-54-Pauschale. Dazu beraten wir dich gern persönlich oder über unsere Pflegeberatung.";
  }

  if (
    lower.includes("anspruch") ||
    lower.includes("voraussetzung") ||
    lower.includes("wer bekommt") ||
    lower.includes("steht mir") ||
    lower.includes("berechtigt") ||
    lower.includes("pflegestufe") ||
    /welche.*pflegegrad/i.test(text)
  ) {
    return "Damit die Kasse die Box mit bis zu 42 € übernimmt: anerkannter Pflegegrad (1–5 – die Höhe des Grades ändert nicht die 42 €), Pflege zu Hause/WG/Angehörige (nicht vollstationäres Heim) und mindestens eine private Pflegeperson zusätzlich zur rein professionellen Versorgung, falls ein Pflegedienst kommt. Wenn das passt, kannst du im Konfigurator starten.";
  }

  if (
    lower.includes("konfigurator") ||
    lower.includes("zusammenstell") ||
    lower.includes("bestellen") ||
    lower.includes("wunschbox") ||
    lower.includes("pflegebox-konfigurator")
  ) {
    return `${kfg} So gehst du vor: Produkte wählen, Mengen mit +/− setzen, Budget beachten (mind. einen Mindestwert im System), Daten eingeben – wir melden uns bei der Pflegekasse.`;
  }

  if (lower.includes("mindest") && (lower.includes("bestell") || lower.includes("wert"))) {
    return "Im Konfigurator gilt ein Mindestbestellwert, bevor du den Abschluss starten kannst – die Oberfläche zeigt dir, wann genug Artikel drin sind. Wähl gern mehrere kleine Positionen, bis die grüne Freigabe kommt.";
  }

  if (lower.includes("maske") || lower.includes("mundschutz") || lower.includes("ffp2")) {
    return "Wir führen medizinische Mundschutz-Packungen (z. B. 50 Stück) und FFP2-Masken (20 Stück, ohne Ausatemventil) im Sortiment – alles im Konfigurator auswählbar innerhalb deines 42-€-Budgets.";
  }

  if (
    lower.includes("desinfekt") ||
    lower.includes("fläche") ||
    lower.includes("flaeche") ||
    lower.includes("hygiene")
  ) {
    return "Zu Hände- und Flächendesinfektion sowie Tücher gibt es verschiedene Gebinde im Konfigurator – wähl die Größe, die zu deinem Alltag passt, und beobachte den Budgetbalken.";
  }

  if (lower.includes("bettschutz") || lower.includes("einlage") || lower.includes("unterlage")) {
    return "Bettschutzeinlagen gibt es bei uns als Einmal-Variante (Standardgröße, z. B. 60×90 cm) und als waschbare Mehrweg-Option – beides im Konfigurator.";
  }

  if (lower.includes("handschuh") || lower.includes("handschuhe")) {
    return "Einmalhandschuhe liefern wir in Packungen zu 100 Stück. Bitte unbedingt die Größe (S, M, L, XL) im Konfigurator wählen – ohne Größe lässt sich der Schritt oft nicht abschließen.";
  }

  if (lower.includes("budget") || lower.includes("42") || lower.includes("euro")) {
    return `Für die Verbrauchsmittel-Box stehen dir bis zu 42,00 € pro Monat von der Pflegekasse zu – mehr geht in dieser Pauschale nicht. ${kfg}`;
  }

  if (lower.includes("pflegegrad")) {
    return "Ab anerkanntem Pflegegrad 1 kannst du die Box beantragen; wichtig: Auch mit PG 1 hast du dasselbe maximale Budget von 42 € wie mit höherem Grad – es gibt keine Staffelung nach Pflegegrad.";
  }

  if (lower.includes("antrag") || lower.includes("beantrag") || lower.includes("formular")) {
    return "Du stellst die Box digital zusammen und trägst die Daten ein – wir reichen bei der Pflegekasse ein. Ein separates ärztliches Rezept brauchst du für diese Verbrauchsmittel nicht.";
  }

  if (lower.includes("pflegebox") || lower.includes("pflege box")) {
    return `Die Pflegebox enthält ausgewählte Verbrauchsmittel aus dem Hilfsmittelverzeichnis (PG 54), die die Pflegekasse bis 42 € monatlich übernehmen kann. ${kfg}`;
  }

  if (lower.includes("kostenlos") || lower.includes("kostenfrei")) {
    return "Wenn die Pflegekasse bewilligt, zahlst du für die Box keine Zuzahlung – bis zu 42 € sind abgedeckt. Details zu deinem individuellen Fall klärt die Kasse im Antrag.";
  }

  if (
    lower.match(/^(hallo|hi|hey|moin|servus|guten tag|guten morgen|guten abend)[\s!.?]*$/) ||
    lower.includes("was kannst") ||
    lower.includes("wie funktioniert") ||
    lower.includes("hilfe")
  ) {
    return "Ich bin Pflegeboxi und antworte nach festen Regeln (kein freier KI-Chat). Schreib Stichworte wie ‚Anspruch‘, ‚42 Euro‘, ‚Rezept‘, ‚Pflegeheim‘, ‚Konfigurator‘ oder nutz die Vorschläge unter dem Chat – dann bekommst du passende Kurzinfos. Für alles Persönliche: Telefon oder Kontaktformular auf der Website.";
  }

  return `Ich habe dazu keine feste Kurzantwort. Probier Stichworte wie: Anspruch, 42 Euro, Budget, Rezept, Pflegeheim, Pflegedienst, Konfigurator, Handschuhe, Kosten, Telefon – oder klick einen Vorschlag unten. ${onConfigurator ? "" : `Mehr Infos auch auf der Seite „Kostenfreie Pflegehilfsmittel“. ${KFG_HINT}`}`;
}
