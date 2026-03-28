import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import { logPartnerSyncProfile, userIdSuffix } from "@/lib/partner/sync-profile-runtime-log";

export type EnsurePartnerProfileResult =
  | { ok: true; created: boolean }
  | { ok: false; message: string };

/**
 * RLS / Schema (siehe supabase/migrations/001_partner_portal.sql):
 * - partner_profiles.id ist PK und FK → auth.users(id) ON DELETE CASCADE (id muss exakt auth.users.id sein).
 * - RLS: partner_profiles_select für role authenticated — using (id = auth.uid() OR Admin-Zweig).
 * - partner_profiles_update_own für eigene Zeile.
 * - Kein INSERT für authenticated; Schreiben für Partner erfolgt per Service Role (umgeht RLS).
 * Reparatur-Policies: 003_repair_partner_profiles_rls.sql
 */

/**
 * Prüft Lesbarkeit der Profilzeile. Zuerst mit Session-Client (RLS).
 * Falls leer/fehlerhaft: Bestätigung per Service-Role nur für dieselbe userId (JWT-sub), damit Sync/Dashboard nicht hängen bleiben, wenn RLS falsch konfiguriert ist.
 */
async function assertPartnerProfileReadableByUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  let lastUserError: string | null = null;
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
    if (error?.message) lastUserError = error.message;
  }

  const svc = createSupabaseServiceRoleClient();
  if (svc) {
    const { data: svcRow } = await svc.from("partner_profiles").select("id").eq("id", userId).maybeSingle();
    if (svcRow?.id) {
      console.warn(
        "[partner_profiles] authenticated-Select liefert keine Zeile; Service-Role bestätigt id. RLS/Policies prüfen: supabase/migrations/003_repair_partner_profiles_rls.sql",
      );
      return { ok: true };
    }
  }

  if (lastUserError) {
    return {
      ok: false,
      message: `Profilzeile ist mit Ihrer Anmeldung nicht lesbar (RLS/API): ${lastUserError}. In Supabase: Tabelle partner_profiles für die API sichtbar, Policies wie in Migration 001_partner_portal.sql prüfen.`,
    };
  }
  return {
    ok: false,
    message:
      "Kein Eintrag in partner_profiles für Ihre Nutzer-ID (oder Service-Role kann ihn nicht lesen). " +
      "UUID unter Authentication → Users mit Table Editor abgleichen; ggf. INSERT mit on conflict do nothing.",
  };
}

/**
 * Kernlogik mit einem bereits gebauten Browser-Session-Client (Anon-Key + User-Cookies).
 *
 * - Session: nur für auth.getUser() und RLS-gebundene SELECTs (dieselbe JWT-Identität wie im App-Flow).
 * - Schreiben: separater Supabase-Client mit SUPABASE_SERVICE_ROLE_KEY (keine Cookies, kein User-JWT),
 *   idempotent per Upsert mit PostgREST Prefer: resolution=ignore-duplicates (entspricht ON CONFLICT DO NOTHING).
 */
export async function ensurePartnerProfileWithUserClient(
  supabase: SupabaseClient,
): Promise<EnsurePartnerProfileResult> {
  const onVercel = process.env.VERCEL === "1";
  const serviceRoleKeyPresent = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());

  logPartnerSyncProfile({ event: "sync_start", vercelRedeployHint: onVercel && !serviceRoleKeyPresent });

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  logPartnerSyncProfile({
    event: "sync_auth",
    authUserReadOk: Boolean(user && !userErr),
    userIdSuffix: userIdSuffix(user?.id),
    authErrorMessage: userErr?.message ?? null,
  });

  if (userErr || !user) {
    return { ok: false, message: "Nicht angemeldet." };
  }

  const { data: existingUserRow, error: userSelectErr } = await supabase
    .from("partner_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  const userSelectHasRow = Boolean(existingUserRow?.id);

  logPartnerSyncProfile({
    event: "sync_user_select",
    userIdSuffix: userIdSuffix(user.id),
    userSelectHasRow,
    userSelectErrorMessage: userSelectErr?.message ?? null,
  });

  if (existingUserRow?.id) {
    revalidatePath("/partner/login");
    revalidatePath("/partner/dashboard");
    logPartnerSyncProfile({
      event: "sync_done",
      userIdSuffix: userIdSuffix(user.id),
      resultOk: true,
      created: false,
    });
    return { ok: true, created: false };
  }

  /** Separater Admin-Client — nicht der Cookie-/Session-Client. */
  const svc = createSupabaseServiceRoleClient();

  logPartnerSyncProfile({
    event: "sync_service_client",
    userIdSuffix: userIdSuffix(user.id),
    serviceRoleKeyPresent,
    vercelRedeployHint: onVercel && !serviceRoleKeyPresent,
  });

  if (!svc) {
    const msg =
      "SUPABASE_SERVICE_ROLE_KEY fehlt — Profil kann serverseitig nicht nachgetragen werden. " +
      (onVercel
        ? "Auf Vercel: Variable unter Production setzen und ein neues Deployment auslösen (Redeploy), sonst sieht der Laufzeit-Container den Key nicht."
        : "");
    return { ok: false, message: msg.trim() };
  }

  const { data: svcPreRow, error: svcPreErr } = await svc
    .from("partner_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (svcPreErr?.message) {
    logPartnerSyncProfile({
      event: "sync_svc_preselect",
      userIdSuffix: userIdSuffix(user.id),
      serviceVerifyHasRow: false,
      serviceVerifyErrorMessage: svcPreErr.message,
    });
    return {
      ok: false,
      message: `Service-Role konnte partner_profiles nicht lesen: ${svcPreErr.message}. Key und Projekt-Zugehörigkeit prüfen.`,
    };
  }

  let upsertErr: { code?: string; message?: string; details?: string; hint?: string } | null = null;

  if (svcPreRow?.id) {
    logPartnerSyncProfile({
      event: "sync_upsert",
      userIdSuffix: userIdSuffix(user.id),
      upsertSkippedRowExists: true,
      upsertErrorCode: null,
      upsertErrorMessage: null,
    });
  } else {
    const meta = user.user_metadata as Record<string, unknown> | null | undefined;
    const displayName = typeof meta?.display_name === "string" ? meta.display_name.trim() : undefined;
    const orgName = typeof meta?.organization_name === "string" ? meta.organization_name.trim() : undefined;
    const rawSalutation = meta?.salutation;
    const salutation =
      rawSalutation === "herr" || rawSalutation === "frau" ? rawSalutation : undefined;
    const firstName = typeof meta?.first_name === "string" ? meta.first_name.trim() : undefined;
    const lastName = typeof meta?.last_name === "string" ? meta.last_name.trim() : undefined;
    const phone = typeof meta?.phone === "string" ? meta.phone.trim() : undefined;
    const recruitedBy = typeof meta?.recruited_by === "string" ? meta.recruited_by.trim() : undefined;
    const rawAreas = meta?.responsibility_areas;
    const responsibilityAreas = Array.isArray(rawAreas)
      ? rawAreas.filter((a): a is string => typeof a === "string")
      : undefined;

    const payload: {
      id: string;
      role: "partner";
      display_name?: string;
      organization_name?: string;
      salutation?: "herr" | "frau";
      first_name?: string;
      last_name?: string;
      phone?: string;
      recruited_by?: string;
      responsibility_areas?: string[];
    } = { id: user.id, role: "partner" };
    if (displayName) payload.display_name = displayName;
    if (salutation) payload.salutation = salutation;
    if (orgName) payload.organization_name = orgName;
    if (firstName) payload.first_name = firstName;
    if (lastName) payload.last_name = lastName;
    if (phone) payload.phone = phone;
    if (recruitedBy) payload.recruited_by = recruitedBy;
    if (responsibilityAreas?.length) payload.responsibility_areas = responsibilityAreas;

    /**
     * Idempotent wie:
     * insert into public.partner_profiles (id, role, …) values (…) on conflict (id) do nothing;
     */
    const { error: uErr } = await svc.from("partner_profiles").upsert(payload, {
      onConflict: "id",
      ignoreDuplicates: true,
    });
    upsertErr = uErr;

    logPartnerSyncProfile({
      event: "sync_upsert",
      userIdSuffix: userIdSuffix(user.id),
      upsertSkippedRowExists: false,
      upsertErrorCode: upsertErr?.code ?? null,
      upsertErrorMessage: upsertErr?.message ?? null,
      upsertErrorDetails: upsertErr?.details ?? null,
      upsertErrorHint: upsertErr?.hint ?? null,
    });

    if (upsertErr) {
      const hint = upsertErr.code ? ` (Code ${upsertErr.code})` : "";
      return {
        ok: false,
        message: `Profil-Upsert fehlgeschlagen${hint}: ${upsertErr.message}. Tabelle partner_profiles, FK zu auth.users und SUPABASE_SERVICE_ROLE_KEY (Projekt muss zu NEXT_PUBLIC_SUPABASE_URL passen) prüfen.`,
      };
    }
  }

  const { data: verifySvc, error: verifyErr } = await svc
    .from("partner_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  logPartnerSyncProfile({
    event: "sync_service_verify",
    userIdSuffix: userIdSuffix(user.id),
    serviceVerifyHasRow: Boolean(verifySvc?.id),
    serviceVerifyErrorMessage: verifyErr?.message ?? null,
  });

  if (!verifySvc?.id) {
    return {
      ok: false,
      message: "Eintrag in partner_profiles wurde nach Upsert nicht gefunden (Service Role). Bitte Supabase-Logs prüfen.",
    };
  }

  const readable = await assertPartnerProfileReadableByUser(supabase, user.id);

  logPartnerSyncProfile({
    event: "sync_user_readable",
    userIdSuffix: userIdSuffix(user.id),
    userReadableOk: readable.ok,
  });

  if (!readable.ok) {
    return { ok: false, message: readable.message };
  }

  revalidatePath("/partner/login");
  revalidatePath("/partner/dashboard");

  const created = !svcPreRow?.id;

  logPartnerSyncProfile({
    event: "sync_done",
    userIdSuffix: userIdSuffix(user.id),
    resultOk: true,
    created,
  });

  return { ok: true, created };
}

export async function ensurePartnerProfileForCurrentSession(): Promise<EnsurePartnerProfileResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: "Supabase ist nicht konfiguriert." };
  }

  const supabase = await createSupabaseServerClient();
  return ensurePartnerProfileWithUserClient(supabase);
}
