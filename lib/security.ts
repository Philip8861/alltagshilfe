/**
 * Sicherheitsrelevante Hilfsfunktionen.
 * Client-IP für Rate-Limiting (ohne Vertrauen in Proxy-Header für Auth).
 */
import { headers } from "next/headers";

const FALLBACK_ID = "unknown";

/**
 * Liest die Client-IP aus Request-Headern (z. B. hinter Proxy/Vercel).
 * Nur für Rate-Limiting/Logging; nicht für vertrauenswürdige Auth nutzen.
 */
export async function getClientIp(): Promise<string> {
  try {
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) {
      const first = forwarded.split(",")[0]?.trim();
      if (first) return first;
    }
    const real = h.get("x-real-ip");
    if (real) return real.trim();
  } catch {
    // headers() nur in Request-Kontext verfügbar
  }
  return FALLBACK_ID;
}
