import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import { isValidContactSource, isValidKarriereContactSource } from "@/lib/contact-source";
import { analyticsDayBerlin } from "@/lib/site-analytics/berlin-day";

export type ContactSourceKind =
  | "contact"
  | "hilfefinder"
  /** @deprecated Früher alle Karriere-Einreichungen; weiterhin in Auswertungen mitzählen. */
  | "karriere"
  | "karriere-form"
  | "karriere-wizard"
  | "betrieblich-angebot"
  | "pflegebox";

function isValidSourceForKind(source: string, kind: ContactSourceKind): boolean {
  if (kind === "karriere" || kind === "karriere-form" || kind === "karriere-wizard") {
    return isValidKarriereContactSource(source);
  }
  if (kind === "pflegebox") {
    return isValidContactSource(source);
  }
  return isValidContactSource(source);
}

/**
 * Inkrementiert den Aggregat-Zähler für (Tag, Quelle, Formular-Typ).
 * Speichert ausschließlich anonyme Aggregate; kein Personenbezug.
 * Best-effort: Fehler werden geloggt, aber nicht weitergereicht – so blockiert ein
 * Tracking-Ausfall nie eine Kontaktanfrage.
 */
export async function recordContactSource(
  source: string | undefined,
  kind: ContactSourceKind,
): Promise<void> {
  if (!source || !isValidSourceForKind(source, kind)) return;
  const svc = createSupabaseServiceRoleClient();
  if (!svc) return;
  try {
    const day = analyticsDayBerlin();
    /* eslint-disable @typescript-eslint/no-explicit-any -- RPC nicht im generierten DB-Typ */
    const res = await (svc as any).rpc("increment_contact_source", {
      p_day: day,
      p_source: source,
      p_kind: kind,
    });
    if (res?.error) {
      console.warn("[contact-source] RPC fehlgeschlagen:", res.error.message);
    }
  } catch (e) {
    console.warn(
      "[contact-source] Tracking fehlgeschlagen:",
      e instanceof Error ? e.message : String(e),
    );
  }
}
