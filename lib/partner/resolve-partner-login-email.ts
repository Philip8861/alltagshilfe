import { z } from "zod";

/**
 * Technische Domain für Kurznamen-Logins (Supabase braucht eine E-Mail).
 * RFC 6761: .invalid ist reserviert und für synthetische Adressen üblich.
 */
export const DEFAULT_PARTNER_AUTH_EMAIL_DOMAIN = "partners.invalid";

/**
 * Domain für `kurzname` → `kurzname@domain`. Öffentlich, muss mit Login-Formular übereinstimmen.
 */
export function getPartnerAuthEmailDomain(): string {
  const raw = process.env.NEXT_PUBLIC_PARTNER_AUTH_EMAIL_DOMAIN?.trim().toLowerCase();
  if (!raw) return DEFAULT_PARTNER_AUTH_EMAIL_DOMAIN;
  if (/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i.test(raw)) {
    return raw.toLowerCase();
  }
  return DEFAULT_PARTNER_AUTH_EMAIL_DOMAIN;
}

export type ResolvePartnerLoginResult =
  | { ok: true; email: string }
  | { ok: false; message: string };

/**
 * Wenn die Eingabe ein @ enthält: als vollständige E-Mail validieren.
 * Sonst: als lokaler Teil von `name@getPartnerAuthEmailDomain()`.
 */
export function resolvePartnerLoginToEmail(loginInput: string): ResolvePartnerLoginResult {
  const trimmed = loginInput.trim();
  if (!trimmed) {
    return { ok: false, message: "Anmeldename oder E-Mail erforderlich." };
  }

  if (trimmed.includes("@")) {
    const r = z.string().email("Bitte eine gültige E-Mail eingeben.").max(320).safeParse(trimmed);
    if (!r.success) {
      const err = r.error.flatten().formErrors[0];
      return { ok: false, message: err ?? "Ungültige E-Mail." };
    }
    return { ok: true, email: trimmed.toLowerCase() };
  }

  const local = trimmed.toLowerCase();
  if (local.length > 64) {
    return { ok: false, message: "Anmeldename zu lang (max. 64 Zeichen)." };
  }
  const localOk = /^[a-z0-9]$|^[a-z0-9]([a-z0-9._-]*[a-z0-9])$/.test(local);
  if (!localOk) {
    return {
      ok: false,
      message: "Anmeldename: nur Kleinbuchstaben, Ziffern, . _ - (oder volle E-Mail mit @).",
    };
  }

  const domain = getPartnerAuthEmailDomain();
  return { ok: true, email: `${local}@${domain}` };
}
