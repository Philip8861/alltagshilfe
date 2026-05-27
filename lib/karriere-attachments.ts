import type { SendInternalMailAttachment } from "@/lib/email/internal-smtp";

/** Erlaubte Endungen (Kleinbuchstaben, ohne Punkt). */
export const KARRIERE_ANHANG_EXT = new Set(["pdf", "docx", "jpg", "jpeg", "png"]);

export const KARRIERE_ANHANG_FORMAT_LABEL = "PDF, DOCX, JPG, JPEG, PNG";

export const KARRIERE_MAX_ANHAENGE = 10;
export const KARRIERE_MAX_BYTES_PRO_DATEI = 8 * 1024 * 1024;
export const KARRIERE_MAX_BYTES_GESAMT = 24 * 1024 * 1024;

/** Für `<input type="file" accept="…" />` (Kurzcheck + Formular). */
export const KARRIERE_FILE_INPUT_ACCEPT =
  ".pdf,.docx,.jpg,.jpeg,.png,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png";

export function karriereAnhangDateiendung(name: string): string | null {
  const base = name.replace(/^.*[/\\]/, "").trim();
  const i = base.lastIndexOf(".");
  if (i < 0 || i === base.length - 1) return null;
  return base.slice(i + 1).toLowerCase();
}

export function istKarriereAnhangErlaubt(name: string): boolean {
  const ext = karriereAnhangDateiendung(name);
  return ext !== null && KARRIERE_ANHANG_EXT.has(ext);
}

/**
 * Gleiche Regeln wie `karriereAnhaengeAusFormData` (Client): sofortige Fehlermeldung bei nicht versendbaren Dateien.
 * @returns Fehlertext oder `null`, wenn die Liste versandfähig ist.
 */
export function validateKarriereAttachmentsList(files: readonly File[]): string | null {
  if (files.length === 0) return null;
  if (files.length > KARRIERE_MAX_ANHAENGE) {
    return `Es sind maximal ${KARRIERE_MAX_ANHAENGE} Dateien erlaubt.`;
  }
  let total = 0;
  for (const file of files) {
    if (file.size === 0) {
      return `Die Datei „${file.name}“ ist leer und kann nicht versendet werden. Bitte wählen Sie eine gültige Datei.`;
    }
    if (!istKarriereAnhangErlaubt(file.name)) {
      return `Dateityp nicht erlaubt: „${file.name}“. Erlaubt sind nur ${KARRIERE_ANHANG_FORMAT_LABEL}.`;
    }
    if (file.size > KARRIERE_MAX_BYTES_PRO_DATEI) {
      return `Die Datei „${file.name}“ ist zu groß (max. 8 MB pro Datei) und kann nicht versendet werden.`;
    }
    total += file.size;
    if (total > KARRIERE_MAX_BYTES_GESAMT) {
      return "Die Anhänge insgesamt sind zu groß (max. 24 MB) und können nicht versendet werden.";
    }
  }
  return null;
}

export function sanitizeKarriereDateiname(name: string): string {
  const base = name.replace(/^.*[/\\]/, "").replace(/[^\w.\- ()äöüÄÖÜß]+/g, "_").slice(0, 180);
  return base.length > 0 ? base : "anhang";
}

/** Server: Anhänge aus FormData lesen und validieren. */
export async function karriereAnhaengeAusFormData(
  formData: FormData,
  feldname = "bewerbungsdateien",
): Promise<{ ok: true; attachments: SendInternalMailAttachment[] } | { ok: false; error: string }> {
  const parts = formData.getAll(feldname);
  const files = parts.filter((p): p is File => typeof File !== "undefined" && p instanceof File && p.size > 0);
  if (files.length === 0) {
    return { ok: true, attachments: [] };
  }
  if (files.length > KARRIERE_MAX_ANHAENGE) {
    return { ok: false, error: `Es sind maximal ${KARRIERE_MAX_ANHAENGE} Dateien erlaubt.` };
  }
  let total = 0;
  const attachments: SendInternalMailAttachment[] = [];
  for (const file of files) {
    if (!istKarriereAnhangErlaubt(file.name)) {
      return {
        ok: false,
        error: `Dateityp nicht erlaubt: „${file.name}“. Erlaubt sind nur ${KARRIERE_ANHANG_FORMAT_LABEL}.`,
      };
    }
    if (file.size > KARRIERE_MAX_BYTES_PRO_DATEI) {
      return { ok: false, error: `Die Datei „${file.name}“ ist zu groß (max. 8 MB pro Datei).` };
    }
    total += file.size;
    if (total > KARRIERE_MAX_BYTES_GESAMT) {
      return { ok: false, error: "Die Anhänge insgesamt sind zu groß (max. 24 MB)." };
    }
    try {
      const buf = Buffer.from(await file.arrayBuffer());
      attachments.push({
        filename: sanitizeKarriereDateiname(file.name),
        content: buf,
        contentType: file.type?.trim() || undefined,
      });
    } catch {
      return { ok: false, error: "Eine Datei konnte nicht gelesen werden. Bitte versuchen Sie es erneut." };
    }
  }
  return { ok: true, attachments };
}
