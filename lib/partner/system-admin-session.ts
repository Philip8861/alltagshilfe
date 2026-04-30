import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "partner_sys_admin";
const MAX_AGE_SEC = 8 * 60 * 60;

function sessionSecret(): string | null {
  const s = process.env.PARTNER_SYSTEM_ADMIN_SECRET?.trim();
  return s && s.length >= 24 ? s : null;
}

function signToken(exp: number, secret: string): string {
  const payload = JSON.stringify({ exp, v: 1, n: randomBytes(8).toString("hex") });
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(payload, "utf8").toString("base64url") + "." + sig;
}

function verifyToken(token: string, secret: string): boolean {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const payloadRaw = token.slice(0, dot);
  const sigHex = token.slice(dot + 1);
  let payload: string;
  try {
    payload = Buffer.from(payloadRaw, "base64url").toString("utf8");
  } catch {
    return false;
  }
  const expectedHex = createHmac("sha256", secret).update(payload).digest("hex");
  try {
    const a = Buffer.from(sigHex, "hex");
    const b = Buffer.from(expectedHex, "hex");
    if (a.length !== b.length) return false;
    if (!timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  try {
    const obj = JSON.parse(payload) as { exp: number; v: number };
    return obj.v === 1 && obj.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

/** Passwort-Vergleich ohne Längen-Leak über feste Hash-Länge. */
export function verifyAdminPasswordConstantTime(input: string, expected: string): boolean {
  const ha = createHmac("sha256", "partner-admin-pw").update(input, "utf8").digest();
  const hb = createHmac("sha256", "partner-admin-pw").update(expected, "utf8").digest();
  return timingSafeEqual(ha, hb);
}

export function isSystemAdminConfigured(): boolean {
  const u = process.env.PARTNER_SYSTEM_ADMIN_USER?.trim();
  const p = process.env.PARTNER_SYSTEM_ADMIN_PASSWORD?.trim();
  return Boolean(u && p && sessionSecret());
}

export async function getSystemAdminSession(): Promise<boolean> {
  const secret = sessionSecret();
  if (!secret) return false;
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyToken(token, secret);
}

export async function setSystemAdminSessionCookie(): Promise<void> {
  const secret = sessionSecret();
  if (!secret) throw new Error("PARTNER_SYSTEM_ADMIN_SECRET fehlt oder zu kurz (min. 24 Zeichen).");
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const token = signToken(exp, secret);
  const cookieStore = await cookies();
  /** Frühere `path: /partner`-Variante entfernen (sonst zwei Cookies gleichen Namens möglich). */
  cookieStore.set(COOKIE_NAME, "", { path: "/partner", maxAge: 0 });
  /** Site-weit nötig, damit z. B. `/api/partner/session` und `/ratgeber` die Sitzung sehen (Redaktions-Helfer). */
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

export async function clearSystemAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
  /** Alte Cookies mit früherem Path `/partner` entfernen. */
  cookieStore.set(COOKIE_NAME, "", { path: "/partner", maxAge: 0 });
}
