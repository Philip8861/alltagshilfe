import type { SendInternalMailAttachment } from "@/lib/email/internal-smtp";

/** Erlaubte Endungen (Kleinbuchstaben, ohne Punkt). */
export const KARRIERE_ANHANG_EXT = new Set([
  "pdf",
  "doc",
  "docx",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "heic",
  "gif",
  "tif",
  "tiff",
  "txt",
  "rtf",
  "odt",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
]);

export const KARRIERE_MAX_ANHAENGE = 10;
export const KARRIERE_MAX_BYTES_PRO_DATEI = 8 * 1024 * 1024;
export const KARRIERE_MAX_BYTES_GESAMT = 24 * 1024 * 1024;

/** Für `<input type="file" accept="…" />` (Kurzcheck + Formular). */
export const KARRIERE_FILE_INPUT_ACCEPT =
  ".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.heic,.gif,.tif,.tiff,.txt,.rtf,.odt,.ppt,.pptx,.xls,.xlsx,image/*,application/pdf";

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
        error: `Dateityp nicht erlaubt: „${file.name}“. Erlaubt sind u. a. PDF, Word, gängige Bildformate.`,
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
