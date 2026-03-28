"use server";

import { headers } from "next/headers";
import { rateLimitPartnerLogin } from "@/lib/rate-limit";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

async function clientIp(): Promise<string> {
  try {
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) {
      return forwarded.split(",")[0]?.trim() ?? "unknown";
    }
    return h.get("x-real-ip")?.trim() ?? "unknown";
  } catch {
    return "unknown";
  }
}

/** Wird vor dem Browser-Login aufgerufen (Rate-Limit nur serverseitig). */
export async function checkPartnerLoginRateLimitAction(): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Der Partnerbereich ist hier noch nicht eingerichtet." };
  }
  const ip = await clientIp();
  const limited = rateLimitPartnerLogin(ip);
  if (!limited.success) {
    return { ok: false, message: "Zu viele Versuche. Bitte später erneut versuchen." };
  }
  return { ok: true };
}

export type EnsurePartnerProfileResult =
  | { ok: true; created: boolean }
  | { ok: false; message: string };

/**
 * Legt partner_profiles für die aktuelle Session nach, falls der DB-Trigger fehlt oder versagt hat.
 * Nur für die eingeloggte User-ID (Service Role), keine Client-Parameter.
 */
export async function ensurePartnerProfileForSessionAction(): Promise<EnsurePartnerProfileResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Supabase ist nicht konfiguriert." };
  }

  const supabase = await createSupabaseServerClient();
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
      return { ok: true, created: false };
    }
    return { ok: false, message: "Profil konnte nicht angelegt werden. Bitte später erneut versuchen." };
  }

  return { ok: true, created: true };
}
