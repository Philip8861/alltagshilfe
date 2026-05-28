import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { PARTNER_NETWORK_MAX_DEPTH, normalizePartnerCodeInput } from "@/lib/partner/referral-money";

/**
 * Server-Logik für Werbe-Beziehung zwischen Partnern.
 *
 * Geld-relevant. Alle Schreiboperationen laufen über Service Role.
 * DB-Trigger `partner_profiles_referral_guard_trg` (Migration 026) erzwingt zusätzlich:
 *   - kein Self-Referral
 *   - referred_by_partner_id ist nach Setzen unveränderlich
 *   - direkter Zyklus (A↔B) blockiert
 *   - referred_at wird automatisch gesetzt
 *
 * Hier in der Server-Action zusätzlich:
 *   - Existenz-Check + aktiv + provisionsberechtigt + nicht eigener Code
 *   - tiefer Zyklus-Schutz (A->B->C->A) bis Tiefe 10
 */

export type SetPartnerReferralResult =
  | { ok: true; sponsorId: string; sponsorCode: string }
  | { ok: false; code: SetPartnerReferralErrorCode; message: string };

export type SetPartnerReferralErrorCode =
  | "code_invalid"
  | "code_unknown"
  | "sponsor_self"
  | "sponsor_inactive"
  | "sponsor_not_eligible"
  | "already_referred"
  | "cycle_detected"
  | "db_error";

type SponsorRow = {
  id: string;
  partner_referral_code: string | null;
  account_disabled_at: string | null;
  responsibility_areas: string[] | null;
};

const SPONSOR_SELECT =
  "id, partner_referral_code, account_disabled_at, responsibility_areas";

/**
 * Liest sponsor anhand des PartnerCodes (case-insensitive). Nur für Service Role gedacht.
 */
async function findSponsorByCode(
  svc: SupabaseClient,
  normalizedCode: string,
): Promise<SponsorRow | null> {
  const { data, error } = await svc
    .from("partner_profiles")
    .select(SPONSOR_SELECT)
    .eq("partner_referral_code", normalizedCode)
    .maybeSingle();
  if (error) return null;
  return (data as SponsorRow | null) ?? null;
}

/**
 * Prüft, ob `candidateAncestorId` im Downline-Baum von `partnerId` liegt –
 * iterativ über `referred_by_partner_id` (max. 10 Ebenen, Schutz vor Endlos-Loop).
 *
 * Setze candidateAncestorId NICHT, wenn diese Funktion `true` zurückgibt – sonst entsteht ein Zyklus.
 */
async function isPartnerInDownlineOf(
  svc: SupabaseClient,
  candidateAncestorId: string,
  partnerId: string,
  maxDepth: number = PARTNER_NETWORK_MAX_DEPTH,
): Promise<boolean> {
  let frontier: string[] = [partnerId];
  const visited = new Set<string>([partnerId]);
  for (let depth = 0; depth < maxDepth; depth++) {
    if (frontier.length === 0) return false;

    const { data, error } = await svc
      .from("partner_profiles")
      .select("id, referred_by_partner_id")
      .in("referred_by_partner_id", frontier);

    if (error) return false;

    const next: string[] = [];
    for (const row of (data ?? []) as { id: string; referred_by_partner_id: string | null }[]) {
      if (row.id === candidateAncestorId) return true;
      if (!visited.has(row.id)) {
        visited.add(row.id);
        next.push(row.id);
      }
    }
    frontier = next;
  }
  return false;
}

/**
 * Setzt den werbenden Partner für `partnerId` einmalig.
 *
 * Vorbedingungen:
 *  - Ein bestehender werber blockiert (`already_referred`).
 *  - codeRaw wird normalisiert; leer = Aufruf nicht erfolgen (vor Aufruf prüfen).
 *  - Sponsor muss existieren, nicht deaktiviert, mind. 1 responsibility_area haben (provisionsberechtigt).
 *  - Sponsor != partnerId (Self-Block).
 *  - Sponsor darf nicht in Downline von partnerId liegen (Zyklus).
 */
export async function setPartnerReferralByCode(
  svc: SupabaseClient,
  partnerId: string,
  codeRaw: unknown,
): Promise<SetPartnerReferralResult> {
  const code = normalizePartnerCodeInput(codeRaw);
  if (!code) {
    return {
      ok: false,
      code: "code_invalid",
      message: "Partner-Code muss aus Buchstaben und Ziffern bestehen.",
    };
  }

  const { data: selfRow, error: selfErr } = await svc
    .from("partner_profiles")
    .select("id, partner_referral_code, referred_by_partner_id")
    .eq("id", partnerId)
    .maybeSingle();

  if (selfErr || !selfRow) {
    return { ok: false, code: "db_error", message: "Profil nicht gefunden." };
  }

  const self = selfRow as {
    id: string;
    partner_referral_code: string | null;
    referred_by_partner_id: string | null;
  };

  if (self.referred_by_partner_id) {
    return {
      ok: false,
      code: "already_referred",
      message: "Es ist bereits ein werbender Partner hinterlegt — eine Änderung ist nicht möglich.",
    };
  }

  const ownCode = (self.partner_referral_code ?? "").trim().toUpperCase();
  if (ownCode && ownCode === code) {
    return {
      ok: false,
      code: "sponsor_self",
      message: "Eigener Partner-Code ist nicht zulässig.",
    };
  }

  const sponsor = await findSponsorByCode(svc, code);
  if (!sponsor || !sponsor.id) {
    return {
      ok: false,
      code: "code_unknown",
      message: "Partner-Code unbekannt.",
    };
  }

  if (sponsor.id === self.id) {
    return {
      ok: false,
      code: "sponsor_self",
      message: "Eigener Partner-Code ist nicht zulässig.",
    };
  }

  if (sponsor.account_disabled_at) {
    return {
      ok: false,
      code: "sponsor_inactive",
      message: "Der angegebene Partner ist nicht aktiv.",
    };
  }

  const eligible =
    Array.isArray(sponsor.responsibility_areas) && sponsor.responsibility_areas.length > 0;
  if (!eligible) {
    return {
      ok: false,
      code: "sponsor_not_eligible",
      message: "Der angegebene Partner ist nicht provisionsberechtigt.",
    };
  }

  const cycle = await isPartnerInDownlineOf(svc, sponsor.id, self.id);
  if (cycle) {
    return {
      ok: false,
      code: "cycle_detected",
      message: "Diese Werbe-Beziehung würde einen Zyklus erzeugen.",
    };
  }

  const nowIso = new Date().toISOString();
  const { error: upErr } = await svc
    .from("partner_profiles")
    .update({
      referred_by_partner_id: sponsor.id,
      referred_at: nowIso,
    })
    .eq("id", self.id)
    /** Doppelt-Zuweisungen race-sicher abwehren: nur updaten, wenn noch null. */
    .is("referred_by_partner_id", null);

  if (upErr) {
    const msg = (upErr.message ?? "").toLowerCase();
    if (msg.includes("partner_referral_already_set")) {
      return {
        ok: false,
        code: "already_referred",
        message: "Es ist bereits ein werbender Partner hinterlegt — eine Änderung ist nicht möglich.",
      };
    }
    if (msg.includes("partner_referral_self_forbidden")) {
      return {
        ok: false,
        code: "sponsor_self",
        message: "Eigener Partner-Code ist nicht zulässig.",
      };
    }
    if (msg.includes("partner_referral_direct_cycle")) {
      return {
        ok: false,
        code: "cycle_detected",
        message: "Diese Werbe-Beziehung würde einen Zyklus erzeugen.",
      };
    }
    if (msg.includes("does not exist") || msg.includes("could not find")) {
      return {
        ok: false,
        code: "db_error",
        message: "Datenbank-Spalten fehlen — Migration 026 in Supabase ausführen.",
      };
    }
    return {
      ok: false,
      code: "db_error",
      message: "Werbe-Beziehung konnte nicht gespeichert werden.",
    };
  }

  return {
    ok: true,
    sponsorId: sponsor.id,
    sponsorCode: code,
  };
}
