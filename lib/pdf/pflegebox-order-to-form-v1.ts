import type { PflegeboxOrderBody } from "@/lib/validations/pflegebox-order";
import type { FormV1FillInput } from "@/lib/pdf/fill-form-v1";
import type { KonfiguratorCartLine } from "@/lib/pdf/konfigurator-catalog";

/** Trennt „Musterstraße“ und „12 a“ soweit erkennbar (eine Zeile aus dem Wizard). */
export function splitStreetAndHausnummer(street: string): { anschriftStrasse: string; hausnummer: string } {
  const t = street.trim();
  const m = /^(.*)\s+(\d+[a-zA-ZäöüÄÖÜß\-\/]*)$/.exec(t);
  if (m?.[1]?.trim()) {
    return { anschriftStrasse: m[1].trim(), hausnummer: m[2] ?? "" };
  }
  return { anschriftStrasse: t, hausnummer: "" };
}

export function cartLinesToKonfiguratorLines(
  lines: PflegeboxOrderBody["cartLines"],
): KonfiguratorCartLine[] {
  return lines.map((l) => ({
    id: l.id,
    count: l.count,
    ...(l.ml != null ? { selectedMl: l.ml } : {}),
  }));
}

export function buildFormV1FillInputFromPflegeboxOrder(
  order: PflegeboxOrderBody,
  signaturePngBytes: Uint8Array,
): FormV1FillInput {
  const c = order.contact;
  const { anschriftStrasse, hausnummer } = splitStreetAndHausnummer(c.street);

  const kontakt = c.personalBeratungWunsch
    ? {
        telefonisch: c.beratungKanal === "telefon",
        videocall: c.beratungKanal === "video",
      }
    : undefined;

  return {
    vorname: c.firstName,
    nachname: c.lastName,
    geburtsdatumIso: c.birthDate,
    versichertennummer: c.versichertennummer,
    anschriftStrasse,
    hausnummer,
    plz: c.postalCode,
    ort: c.city,
    krankenkasse: c.krankenkasse,
    konfiguratorLines: cartLinesToKonfiguratorLines(order.cartLines),
    kontakt,
    kontaktMergedChecked: c.personalBeratungWunsch ? true : undefined,
    drawMaxMustermannSignature: false,
    signaturePngBytes,
  };
}

export function parseSignaturePngDataUrl(dataUrl: string): Uint8Array | null {
  const m = /^data:image\/png;base64,([\s\S]+)$/i.exec(dataUrl.trim());
  if (!m?.[1]) return null;
  try {
    const buf = Buffer.from(m[1].replace(/\s/g, ""), "base64");
    return buf.length > 0 ? new Uint8Array(buf) : null;
  } catch {
    return null;
  }
}
