"use server";

import { revalidatePath } from "next/cache";
import { getSystemAdminSession } from "@/lib/partner/system-admin-session";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import { setPartnerReferralByCode } from "@/lib/partner/referral";
import { normalizePartnerCodeInput } from "@/lib/partner/referral-money";

/**
 * Admin-Aktionen für die Werbe-Beziehung in der Partnerliste.
 *
 * Sicherheit: jede Aktion verlangt eine aktive System-Admin-Session.
 * Geld-Logik: niemals Werbe-Beziehung wechseln (DB-Trigger 026 enforced); nur Erst-Setzung.
 */

export type AdminReferralChild = {
  partnerId: string;
  partnerCode: string | null;
  displayName: string | null;
  referredAt: string | null;
};

export type ListAdminDirectReferralsResult =
  | { ok: true; items: AdminReferralChild[] }
  | { ok: false; message: string };

export type AddAdminDirectReferralResult =
  | { ok: true; partnerId: string; partnerCode: string }
  | { ok: false; message: string };

const PARTNER_ID_RE = /^[0-9a-fA-F-]{36}$/;

/**
 * Liefert direkte geworbene Partner eines Sponsors (für Admin-Modal).
 * Antwort enthält PartnerCode + Anzeigename + ID — Admin darf das sehen.
 */
export async function listAdminDirectReferralsAction(
  sponsorPartnerId: string,
): Promise<ListAdminDirectReferralsResult> {
  if (!(await getSystemAdminSession())) {
    return { ok: false, message: "Nicht autorisiert." };
  }
  if (!sponsorPartnerId || !PARTNER_ID_RE.test(sponsorPartnerId)) {
    return { ok: false, message: "Ungültige Partner-ID." };
  }

  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY fehlt." };

  const { data, error } = await svc
    .from("partner_profiles")
    .select("id, partner_referral_code, display_name, first_name, last_name, referred_at")
    .eq("referred_by_partner_id", sponsorPartnerId)
    .order("referred_at", { ascending: false });

  if (error) {
    const m = (error.message ?? "").toLowerCase();
    if (m.includes("referred_by_partner_id") || m.includes("referred_at")) {
      return {
        ok: false,
        message: "Datenbank-Spalten fehlen — Migration 026 in Supabase ausführen.",
      };
    }
    return { ok: false, message: error.message || "Fehler beim Laden." };
  }

  const items: AdminReferralChild[] = (data ?? []).map((row) => {
    const r = row as {
      id: string;
      partner_referral_code: string | null;
      display_name: string | null;
      first_name: string | null;
      last_name: string | null;
      referred_at: string | null;
    };
    const composedName = [r.first_name, r.last_name].filter(Boolean).join(" ").trim();
    return {
      partnerId: r.id,
      partnerCode: r.partner_referral_code,
      displayName: r.display_name?.trim() || composedName || null,
      referredAt: r.referred_at,
    };
  });

  return { ok: true, items };
}

/**
 * Trägt einen bestehenden Partner als geworbenen Partner von `sponsorPartnerId` ein
 * (Lookup über PartnerCode des geworbenen Partners).
 *
 * Server-Logik:
 *   - PartnerCode → partnerId für den geworbenen Partner
 *   - sponsor's eigener PartnerCode laden
 *   - setPartnerReferralByCode(svc, referralPartnerId, sponsorCode)
 *   - DB-Trigger blockt Wechsel/Self/direkten Zyklus zusätzlich
 */
export async function addAdminDirectReferralAction(
  sponsorPartnerId: string,
  referralPartnerCodeRaw: unknown,
): Promise<AddAdminDirectReferralResult> {
  if (!(await getSystemAdminSession())) {
    return { ok: false, message: "Nicht autorisiert." };
  }
  if (!sponsorPartnerId || !PARTNER_ID_RE.test(sponsorPartnerId)) {
    return { ok: false, message: "Ungültige Partner-ID." };
  }

  const code = normalizePartnerCodeInput(referralPartnerCodeRaw);
  if (!code) {
    return { ok: false, message: "Bitte einen gültigen Partner-Code angeben." };
  }

  const svc = createSupabaseServiceRoleClient();
  if (!svc) return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY fehlt." };

  const { data: sponsorRow, error: sponsorErr } = await svc
    .from("partner_profiles")
    .select("id, partner_referral_code, account_disabled_at")
    .eq("id", sponsorPartnerId)
    .maybeSingle();

  if (sponsorErr || !sponsorRow) {
    return { ok: false, message: "Sponsor-Profil nicht gefunden." };
  }

  const sponsor = sponsorRow as {
    id: string;
    partner_referral_code: string | null;
    account_disabled_at: string | null;
  };

  if (!sponsor.partner_referral_code) {
    return {
      ok: false,
      message: "Sponsor hat keinen Partner-Code — bitte vorher generieren lassen.",
    };
  }

  if (sponsor.account_disabled_at) {
    return {
      ok: false,
      message: "Sponsor ist deaktiviert; Werbe-Beziehung nicht möglich.",
    };
  }

  /** Lookup geworbener Partner: muss existieren, darf nicht der Sponsor selbst sein. */
  const { data: refRow, error: refErr } = await svc
    .from("partner_profiles")
    .select("id, partner_referral_code, referred_by_partner_id")
    .eq("partner_referral_code", code)
    .maybeSingle();

  if (refErr) return { ok: false, message: refErr.message || "Datenbank-Fehler." };
  if (!refRow) return { ok: false, message: "Partner-Code unbekannt." };

  const referral = refRow as {
    id: string;
    partner_referral_code: string | null;
    referred_by_partner_id: string | null;
  };

  if (referral.id === sponsor.id) {
    return { ok: false, message: "Eigener Partner-Code ist nicht zulässig." };
  }
  if (referral.referred_by_partner_id) {
    return {
      ok: false,
      message: "Dieser Partner hat bereits einen werbenden Partner — eine Änderung ist nicht möglich.",
    };
  }

  const res = await setPartnerReferralByCode(svc, referral.id, sponsor.partner_referral_code);
  if (!res.ok) {
    return { ok: false, message: res.message };
  }

  revalidatePath("/partner/admin");
  return {
    ok: true,
    partnerId: referral.id,
    partnerCode: code,
  };
}
