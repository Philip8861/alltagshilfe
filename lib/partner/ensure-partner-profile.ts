import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

export type EnsurePartnerProfileResult =
  | { ok: true; created: boolean }
  | { ok: false; message: string };

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
