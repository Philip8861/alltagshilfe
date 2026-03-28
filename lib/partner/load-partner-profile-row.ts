import type { SupabaseClient } from "@supabase/supabase-js";
import type { PartnerProfile } from "@/lib/partner/types";

/** Alle Spalten inkl. 004 + 006 (salutation). */
const SELECT_FULL =
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

/**
 * Liest partner_profiles für eine User-ID; bei fehlenden Spalten (ohne Migration 004) Fallback auf minimale SELECT-Liste.
 */
export async function loadPartnerProfileRow(
  client: SupabaseClient,
  userId: string,
): Promise<{ profile: PartnerProfile | null; errorMessage?: string }> {
  const full = await client.from("partner_profiles").select(SELECT_FULL).eq("id", userId).maybeSingle();

  if (!full.error) {
    return { profile: (full.data as PartnerProfile | null) ?? null };
  }

  if (isMissingColumnOrSchemaError(full.error)) {
    const mid = await client
      .from("partner_profiles")
      .select(SELECT_WITHOUT_SALUTATION)
      .eq("id", userId)
      .maybeSingle();
    if (!mid.error) {
      return { profile: (mid.data as PartnerProfile | null) ?? null };
    }
    if (isMissingColumnOrSchemaError(mid.error)) {
      const min = await client.from("partner_profiles").select(SELECT_MIN).eq("id", userId).maybeSingle();
      if (!min.error) {
        return { profile: (min.data as PartnerProfile | null) ?? null };
      }
      return { profile: null, errorMessage: min.error.message };
    }
    return { profile: null, errorMessage: mid.error.message };
  }

  return { profile: null, errorMessage: full.error.message };
}
