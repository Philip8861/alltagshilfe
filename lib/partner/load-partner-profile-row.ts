import type { SupabaseClient } from "@supabase/supabase-js";
import type { PartnerProfile } from "@/lib/partner/types";

/** Alle Spalten inkl. Bankdaten + Portal-Präferenzen + Passwort-Hinweis (Migration 011 + 013 + 014). */
const SELECT_FULL_BANK_PREFS_SUPPRESS =
  "id, display_name, organization_name, role, created_at, updated_at, salutation, first_name, last_name, recruited_by, phone, responsibility_areas, password_changed_at, partner_referral_code, iban, bic, account_holder, portal_preferences, password_change_prompt_suppress";

/** Alle Spalten inkl. Bankdaten + Portal-Präferenzen (Migration 011 + 013). */
const SELECT_FULL_BANK_PREFS =
  "id, display_name, organization_name, role, created_at, updated_at, salutation, first_name, last_name, recruited_by, phone, responsibility_areas, password_changed_at, partner_referral_code, iban, bic, account_holder, portal_preferences";

/** Alle Spalten inkl. Bankdaten (Migration 011). */
const SELECT_FULL_BANK =
  "id, display_name, organization_name, role, created_at, updated_at, salutation, first_name, last_name, recruited_by, phone, responsibility_areas, password_changed_at, partner_referral_code, iban, bic, account_holder";

/** Alle Spalten inkl. 004 + 006 + 007 (partner_referral_code). */
const SELECT_FULL =
  "id, display_name, organization_name, role, created_at, updated_at, salutation, first_name, last_name, recruited_by, phone, responsibility_areas, password_changed_at, partner_referral_code";

/** Ohne partner_referral_code (Migration 007 fehlt noch). */
const SELECT_NO_REFERRAL =
  "id, display_name, organization_name, role, created_at, updated_at, salutation, first_name, last_name, recruited_by, phone, responsibility_areas, password_changed_at";

/** 004 ohne 006 (Spalte salutation fehlt noch). */
const SELECT_WITHOUT_SALUTATION =
  "id, display_name, organization_name, role, created_at, updated_at, first_name, last_name, recruited_by, phone, responsibility_areas, password_changed_at";

/** Nur 001_partner_portal.sql. */
const SELECT_MIN = "id, display_name, organization_name, role, created_at, updated_at";

function isMissingColumnOrSchemaError(err: { message?: string; code?: string } | null): boolean {
  if (!err) return false;
  const m = (err.message ?? "").toLowerCase();
  if (err.code === "42703") return true;
  if (m.includes("column") && (m.includes("does not exist") || m.includes("could not find"))) return true;
  if (m.includes("schema cache")) return true;
  return false;
}

async function trySelect(
  client: SupabaseClient,
  userId: string,
  columns: string,
): Promise<{ data: unknown; error: { message?: string; code?: string } | null }> {
  return client.from("partner_profiles").select(columns).eq("id", userId).maybeSingle();
}

/**
 * Liest partner_profiles für eine User-ID; bei fehlenden Spalten gestaffelte Fallback-Listen.
 */
export async function loadPartnerProfileRow(
  client: SupabaseClient,
  userId: string,
): Promise<{ profile: PartnerProfile | null; errorMessage?: string }> {
  const attempts = [
    SELECT_FULL_BANK_PREFS_SUPPRESS,
    SELECT_FULL_BANK_PREFS,
    SELECT_FULL_BANK,
    SELECT_FULL,
    SELECT_NO_REFERRAL,
    SELECT_WITHOUT_SALUTATION,
    SELECT_MIN,
  ];

  let lastError: string | undefined;
  for (const cols of attempts) {
    const { data, error } = await trySelect(client, userId, cols);
    if (!error) {
      return { profile: (data as PartnerProfile | null) ?? null };
    }
    lastError = error.message;
    if (!isMissingColumnOrSchemaError(error)) {
      return { profile: null, errorMessage: error.message };
    }
  }

  return { profile: null, errorMessage: lastError };
}
