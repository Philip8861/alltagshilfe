import { createHmac, timingSafeEqual } from "crypto";
import { findStandortByPageSlug, standorteByPlz } from "@/config/standorte";

const PREFIX = "v1";
const BUCKET_MS = 30 * 60 * 1000;
const MAX_BUCKET_DRIFT = 2;

function getSecret(): string | null {
  const env = process.env.STANDORT_CONTACT_FORM_SECRET?.trim();
  if (env) return env;
  if (process.env.NODE_ENV !== "production") {
    return "__dev_standort_contact_hmac_v1__";
  }
  console.warn(
    "[standort-contact] STANDORT_CONTACT_FORM_SECRET fehlt – Standort-Mail-CC für Kontaktformulare ist deaktiviert.",
  );
  return null;
}

/**
 * Kurzlebiger Nachweis, dass das Formular von einer Standortseite (oder einem
 * serverseitig versorgten UI) stammt – verhindert willkürliches CC über /kontakt.
 */
export function createStandortContactProof(pageSlug: string): string {
  const secret = getSecret();
  if (!secret) return "";
  if (!findStandortByPageSlug(pageSlug)) return "";
  const bucket = Math.floor(Date.now() / BUCKET_MS);
  const payload = `${PREFIX}:${pageSlug}:${bucket}`;
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(`${payload}.${sig}`, "utf8").toString("base64url");
}

export function verifyStandortContactProof(token: string | null | undefined): string | null {
  if (!token || token.length < 12) return null;
  const secret = getSecret();
  if (!secret) return null;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const dot = decoded.lastIndexOf(".");
    if (dot <= 0) return null;
    const payload = decoded.slice(0, dot);
    const sig = decoded.slice(dot + 1);
    const expected = createHmac("sha256", secret).update(payload).digest("hex");
    if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return null;
    }
    const parts = payload.split(":");
    if (parts.length !== 3 || parts[0] !== PREFIX) return null;
    const slug = parts[1];
    const bucket = Number(parts[2]);
    if (!Number.isFinite(bucket) || !findStandortByPageSlug(slug)) return null;
    const nowB = Math.floor(Date.now() / BUCKET_MS);
    if (Math.abs(nowB - bucket) > MAX_BUCKET_DRIFT) return null;
    return slug;
  } catch {
    return null;
  }
}

export function buildStandortContactProofsByPageSlug(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const s of standorteByPlz) {
    const proof = createStandortContactProof(s.pageSlug);
    if (proof) out[s.pageSlug] = proof;
  }
  return out;
}
