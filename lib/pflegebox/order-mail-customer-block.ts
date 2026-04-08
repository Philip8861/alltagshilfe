import type { PflegeboxOrderBody } from "@/lib/validations/pflegebox-order";

type Contact = PflegeboxOrderBody["contact"];

function salutationDe(s: Contact["salutation"]): string {
  if (s === "herr") return "Herr";
  if (s === "frau") return "Frau";
  return "Divers";
}

function birthIsoToDe(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return iso.trim();
  return `${m[3]}.${m[2]}.${m[1]}`;
}

function beratungKanalDe(k: NonNullable<Contact["beratungKanal"]>): string {
  if (k === "telefon") return "Telefonisch";
  if (k === "video") return "Videocall";
  return "In den Geschäftsräumen";
}

/**
 * Vollständige Kundendaten für Pflegebox-Benachrichtigungs-Mails (Klartext + HTML-Detail).
 */
export function buildPflegeboxCustomerDetailsMailText(c: Contact): string {
  const lines: string[] = ["Kundendaten (Formular)"];

  lines.push(`Anrede: ${salutationDe(c.salutation)}`);
  lines.push(`Vorname: ${c.firstName.trim()}`);
  lines.push(`Nachname: ${c.lastName.trim()}`);
  lines.push(`Straße, Hausnr.: ${c.street.trim()}`);
  lines.push(`PLZ: ${c.postalCode.trim()}`);
  lines.push(`Ort: ${c.city.trim()}`);
  lines.push(`Geburtsdatum: ${birthIsoToDe(c.birthDate)}`);
  lines.push(`Versicherung: ${c.privatversichert ? "Privatversichert" : "Gesetzlich versichert (GKV)"}`);

  if (!c.privatversichert) {
    lines.push(`Versichertennummer: ${c.versichertennummer.trim().toUpperCase()}`);
    lines.push(`Krankenkasse: ${c.krankenkasse.trim()}`);
  } else {
    lines.push("Versichertennummer: — (Privatversichert)");
    lines.push(`Krankenkasse: ${c.krankenkasse.trim() || "—"}`);
    lines.push(`Beihilfeberechtigt: ${c.beihilfeberechtigt ? "ja" : "nein"}`);
  }

  lines.push(`Pflegegrad: ${c.pflegegrad}`);

  lines.push(`Persönliche Beratung gewünscht: ${c.personalBeratungWunsch ? "ja" : "nein"}`);
  if (c.personalBeratungWunsch && c.beratungKanal) {
    lines.push(`Beratungsform: ${beratungKanalDe(c.beratungKanal)}`);
  }
  if (c.personalBeratungWunsch && c.beratungKanal === "telefon" && c.beratungTelefon?.trim()) {
    lines.push(`Telefon für Beratung: ${c.beratungTelefon.trim()}`);
  }
  if (!c.personalBeratungWunsch && c.keinBeratungGrund?.trim()) {
    lines.push(`Hinweis (keine Beratung): ${c.keinBeratungGrund.trim()}`);
  }

  const em = c.email?.trim();
  const ph = c.phone?.trim();
  if (em) lines.push(`Rückfragen E-Mail: ${em}`);
  if (ph) lines.push(`Rückfragen Telefon: ${ph}`);

  if (c.orderNote?.trim()) {
    lines.push(`Anmerkung zur Bestellung: ${c.orderNote.trim()}`);
  }

  return lines.join("\n");
}
