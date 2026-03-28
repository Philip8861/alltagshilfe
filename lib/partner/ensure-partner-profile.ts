import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

export type EnsurePartnerProfileResult =
  | { ok: true; created: boolean }
  | { ok: false; message: string };

/**
 * Prüft, ob die aktuelle Session die eigene Zeile in partner_profiles per RLS lesen darf.
 * Ohne das könnte ein Insert (Service Role) „erfolgreich“ sein, das Dashboard aber leer bleiben.
 */
async function assertPartnerProfileReadableByUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt > 0) {
      await new Promise((r) => setTimeout(r, 200));
    }
    const { data, error } = await supabase
      .from("partner_profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
    if (data?.id) return { ok: true };
    if (error?.message) {
      return {
        ok: false,
        message: `Profilzeile ist mit Ihrer Anmeldung nicht lesbar (RLS/API): ${error.message}. In Supabase: Tabelle partner_profiles für die API sichtbar, Policies wie in Migration 001_partner_portal.sql prüfen.`,
      };
    }
  }
  return {
    ok: false,
    message:
      "Profilzeile existiert vermutlich, ist mit Ihrer Anmeldung aber nicht lesbar (Row Level Security). " +
      "Supabase → SQL: Policy „partner_profiles_select“ für authenticated und id = auth.uid() prüfen; ggf. Migration 001_partner_portal.sql erneut ausführen.",
  };
}

/**
 * Kernlogik mit einem bereits gebauten Browser-Session-Client (Anon-Key + User-Cookies).
 */
export async function ensurePartnerProfileWithUserClient(
  supabase: SupabaseClient,
): Promise<EnsurePartnerProfileResult> {
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr || !user) {
    return { ok: false, message: "Nicht angemeldet." };
  }

  const { data: existing } = await supabase
    .from("partner_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (existing?.id) {
    revalidatePath("/partner/login");
    revalidatePath("/partner/dashboard");
    return { ok: true, created: false };
  }

  const svc = createSupabaseServiceRoleClient();
  if (!svc) {
    return {
      ok: false,
      message: "SUPABASE_SERVICE_ROLE_KEY fehlt — Profil kann serverseitig nicht nachgetragen werden.",
    };
  }

  const meta = user.user_metadata as Record<string, unknown> | null | undefined;
  const displayName = typeof meta?.display_name === "string" ? meta.display_name.trim() : undefined;
  const orgName = typeof meta?.organization_name === "string" ? meta.organization_name.trim() : undefined;

  const row: {
    id: string;
    role: "partner";
    display_name?: string;
    organization_name?: string;
  } = { id: user.id, role: "partner" };
  if (displayName) row.display_name = displayName;
  if (orgName) row.organization_name = orgName;

  const { error } = await svc.from("partner_profiles").insert(row);
  if (error) {
    if (error.code === "23505" || String(error.message ?? "").toLowerCase().includes("duplicate")) {
      const readable = await assertPartnerProfileReadableByUser(supabase, user.id);
      if (!readable.ok) {
        return { ok: false, message: readable.message };
      }
      revalidatePath("/partner/login");
      revalidatePath("/partner/dashboard");
      return { ok: true, created: false };
    }
    const hint = error.code ? ` (Code ${error.code})` : "";
    return {
      ok: false,
      message: `Profil konnte nicht angelegt werden${hint}. Prüfen Sie SUPABASE_SERVICE_ROLE_KEY und die Tabelle partner_profiles in Supabase.`,
    };
  }

  const { data: verify } = await svc.from("partner_profiles").select("id").eq("id", user.id).maybeSingle();
  if (!verify?.id) {
    return {
      ok: false,
      message: "Eintrag in partner_profiles wurde nicht bestätigt. Bitte Supabase-Logs und Berechtigungen prüfen.",
    };
  }

  const readable = await assertPartnerProfileReadableByUser(supabase, user.id);
  if (!readable.ok) {
    return { ok: false, message: readable.message };
  }

  revalidatePath("/partner/login");
  revalidatePath("/partner/dashboard");

  return { ok: true, created: true };
}

/**
 * Wie ensurePartnerProfileWithUserClient, aber mit createSupabaseServerClient() (Server Actions, RSC).
 */
export async function ensurePartnerProfileForCurrentSession(): Promise<EnsurePartnerProfileResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Supabase ist nicht konfiguriert." };
  }

  const supabase = await createSupabaseServerClient();
  return ensurePartnerProfileWithUserClient(supabase);
}
