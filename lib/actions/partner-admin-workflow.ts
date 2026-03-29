"use server";

import { revalidatePath } from "next/cache";
import { getSystemAdminSession } from "@/lib/partner/system-admin-session";
import { isSupabaseMissingColumnError } from "@/lib/partner/supabase-schema-errors";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import { normalizePartnerTipAdminStatus } from "@/lib/partner/partner-tip-admin";
import {
  einmalProvisionForSlug,
  normalizePaidAmountEur,
  parsePayoutAmountGerman,
} from "@/lib/partner/partner-tip-payout";
import {
  BETRIEBLICHE_PFLEGEBERATUNG_SLUG,
  isBetrieblichMitMonatsprovisionRow,
} from "@/lib/partner/partner-tip-betrieblich-queue";
import {
  archivePartnerTipSchema,
  deletePartnerTipSchema,
  formerActiveCompanyTipSchema,
  updatePartnerProfileAdminSchema,
  updatePartnerTipStatusSchema,
} from "@/lib/validations/partner-admin";

export type AdminWorkflowState = { ok: true; message?: string } | { ok: false; message: string };

export async function updatePartnerTipStatusAction(
  _prev: AdminWorkflowState | null,
  formData: FormData,
): Promise<AdminWorkflowState> {
  if (!(await getSystemAdminSession())) {
    return { ok: false, message: "Nicht autorisiert." };
  }

  const noteRaw = formData.get("admin_visible_note");
  const payoutRaw = formData.get("payout_amount_eur");
  const parsed = updatePartnerTipStatusSchema.safeParse({
    tip_id: formData.get("tip_id"),
    admin_status: formData.get("admin_status"),
    admin_visible_note: typeof noteRaw === "string" ? noteRaw : "",
    payout_amount_eur: typeof payoutRaw === "string" ? payoutRaw : "",
  });
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message;
    return { ok: false, message: msg || "Ungültige Eingabe." };
  }

  const svc = createSupabaseServiceRoleClient();
  if (!svc) {
    return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY fehlt." };
  }

  const tipId = parsed.data.tip_id;
  const newStatus = parsed.data.admin_status;

  const { data: cur, error: fetchErr } = await svc
    .from("partner_tip_submissions")
    .select("admin_status, paid_amount_eur, service_slug")
    .eq("id", tipId)
    .maybeSingle();

  if (fetchErr || !cur) {
    return { ok: false, message: "Tipp nicht gefunden." };
  }

  const slug = String(cur.service_slug);
  const prevStatus = normalizePartnerTipAdminStatus(cur.admin_status);
  const prevPaid = normalizePaidAmountEur(cur.paid_amount_eur);
  const isBetrieblich = slug === BETRIEBLICHE_PFLEGEBERATUNG_SLUG;

  if (isBetrieblich && newStatus === "bezahlt") {
    return {
      ok: false,
      message:
        "Bei betrieblicher Pflegeberatung ist „Bezahlt“ nicht vorgesehen. Bitte „Vertragsabschluss erfolgreich“ wählen und die monatliche Provision eintragen.",
    };
  }

  if (isBetrieblich && newStatus === "abgelehnt") {
    const grund = (parsed.data.admin_visible_note ?? "").trim();
    if (grund.length < 3) {
      return {
        ok: false,
        message: "Bitte einen Ablehnungsgrund angeben (mind. 3 Zeichen, wird dem Partner als Notiz angezeigt).",
      };
    }
  }

  let paidUpdate: number | null | undefined = undefined;

  if (!isBetrieblich && newStatus === "bezahlt") {
    const fixed = einmalProvisionForSlug(slug);
    if (fixed == null) {
      return { ok: false, message: "Für diese Leistung ist keine Einmalprovision hinterlegt." };
    }
    paidUpdate = fixed;
  }

  if (isBetrieblich && newStatus === "erledigt") {
    const entered = parsePayoutAmountGerman(parsed.data.payout_amount_eur ?? "");
    const hadProvision =
      prevPaid != null &&
      prevPaid > 0 &&
      (prevStatus === "erledigt" || prevStatus === "bezahlt");
    if (!hadProvision && entered == null) {
      return {
        ok: false,
        message: "Bitte die monatliche Provision in EUR eintragen (z. B. 128,50).",
      };
    }
    const amount = entered ?? prevPaid;
    if (amount == null || amount <= 0) {
      return { ok: false, message: "Monatliche Provision muss größer als 0 sein." };
    }
    paidUpdate = amount;
  }

  if (isBetrieblich && newStatus !== "erledigt" && newStatus !== "bezahlt") {
    paidUpdate = null;
  }

  const payloadFull: Record<string, unknown> = {
    admin_status: newStatus,
    admin_visible_note: parsed.data.admin_visible_note,
  };
  if (paidUpdate !== undefined) {
    payloadFull.paid_amount_eur = paidUpdate;
  }
  if (isBetrieblich && newStatus !== "erledigt" && newStatus !== "bezahlt") {
    payloadFull.former_active_company_at = null;
  }

  let { error } = await svc.from("partner_tip_submissions").update(payloadFull).eq("id", tipId);

  if (error && isSupabaseMissingColumnError(error)) {
    const retryPayload: Record<string, unknown> = { ...payloadFull };
    delete retryPayload.paid_amount_eur;
    delete retryPayload.former_active_company_at;
    const retry = await svc.from("partner_tip_submissions").update(retryPayload).eq("id", tipId);
    error = retry.error;
    if (!error) {
      return {
        ok: true,
        message:
          "Gespeichert. Betrag nicht in der DB: Migration 010 (paid_amount_eur) in Supabase ausführen.",
      };
    }
  }

  if (error) {
    const code = String(error.code ?? "");
    if (code === "23514") {
      return {
        ok: false,
        message:
          "Dieser Status ist in der Datenbank noch nicht erlaubt. Bitte Migration 009 (erweiterte Status inkl. Bezahlt) in Supabase ausführen.",
      };
    }
    return {
      ok: false,
      message:
        error.message?.includes("check constraint") || error.message?.toLowerCase().includes("violates check")
          ? "Status von der Datenbank abgelehnt – Migration 009 prüfen."
          : "Speichern fehlgeschlagen. Spalten admin_visible_note / admin_status / paid_amount_eur und Migrationen prüfen.",
    };
  }

  revalidatePath("/partner/admin");
  revalidatePath("/partner/dashboard");
  revalidatePath("/partner/statistik");
  return { ok: true, message: "Gespeichert." };
}

export async function deletePartnerTipAction(
  _prev: AdminWorkflowState | null,
  formData: FormData,
): Promise<AdminWorkflowState> {
  if (!(await getSystemAdminSession())) {
    return { ok: false, message: "Nicht autorisiert." };
  }

  const parsed = deletePartnerTipSchema.safeParse({ tip_id: formData.get("tip_id") });
  if (!parsed.success) {
    return { ok: false, message: "Ungültige Eingabe." };
  }

  const svc = createSupabaseServiceRoleClient();
  if (!svc) {
    return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY fehlt." };
  }

  const { error } = await svc.from("partner_tip_submissions").delete().eq("id", parsed.data.tip_id);

  if (error) {
    return { ok: false, message: "Löschen fehlgeschlagen." };
  }

  revalidatePath("/partner/admin");
  revalidatePath("/partner/dashboard");
  revalidatePath("/partner/statistik");
  return { ok: true, message: "Gelöscht." };
}

export async function archivePartnerTipAction(
  _prev: AdminWorkflowState | null,
  formData: FormData,
): Promise<AdminWorkflowState> {
  if (!(await getSystemAdminSession())) {
    return { ok: false, message: "Nicht autorisiert." };
  }

  const parsed = archivePartnerTipSchema.safeParse({
    tip_id: formData.get("tip_id"),
    archived: formData.get("archived"),
  });
  if (!parsed.success) {
    return { ok: false, message: "Ungültige Eingabe." };
  }

  const svc = createSupabaseServiceRoleClient();
  if (!svc) {
    return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY fehlt." };
  }

  const archivedAt = parsed.data.archived === "true" ? new Date().toISOString() : null;
  const { error } = await svc
    .from("partner_tip_submissions")
    .update({ archived_at: archivedAt })
    .eq("id", parsed.data.tip_id);

  if (error) {
    return { ok: false, message: "Archiv-Status konnte nicht gespeichert werden." };
  }

  revalidatePath("/partner/admin");
  revalidatePath("/partner/dashboard");
  revalidatePath("/partner/statistik");
  return { ok: true, message: archivedAt ? "In Archiv verschoben." : "Wieder in aktive Aufträge." };
}

export async function updatePartnerProfileAdminAction(
  _prev: AdminWorkflowState | null,
  formData: FormData,
): Promise<AdminWorkflowState> {
  if (!(await getSystemAdminSession())) {
    return { ok: false, message: "Nicht autorisiert." };
  }

  const parsed = updatePartnerProfileAdminSchema.safeParse({
    user_id: formData.get("user_id"),
    salutation: formData.get("salutation"),
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    phone: formData.get("phone"),
    organization_name: formData.get("organization_name") || undefined,
    recruited_by: formData.get("recruited_by") || undefined,
    display_name: formData.get("display_name") || undefined,
    iban: formData.get("iban"),
    bic: formData.get("bic"),
    account_holder: formData.get("account_holder"),
    role: formData.get("role"),
    responsibility_areas: formData.getAll("responsibility_areas").map(String),
  });

  if (!parsed.success) {
    const e = parsed.error.flatten().fieldErrors;
    return {
      ok: false,
      message:
        e.first_name?.[0] ??
        e.last_name?.[0] ??
        e.phone?.[0] ??
        e.iban?.[0] ??
        e.bic?.[0] ??
        e.account_holder?.[0] ??
        e.salutation?.[0] ??
        e.role?.[0] ??
        "Eingaben prüfen.",
    };
  }

  const svc = createSupabaseServiceRoleClient();
  if (!svc) {
    return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY fehlt." };
  }

  const d = parsed.data;
  const displayName =
    (d.display_name?.trim() || `${d.first_name} ${d.last_name}`.trim()) || null;

  const { error } = await svc
    .from("partner_profiles")
    .update({
      salutation: d.salutation,
      first_name: d.first_name,
      last_name: d.last_name,
      phone: d.phone,
      organization_name: d.organization_name?.trim() || null,
      recruited_by: d.recruited_by?.trim() || null,
      display_name: displayName,
      role: d.role,
      responsibility_areas: d.responsibility_areas,
      iban: d.iban ?? null,
      bic: d.bic ?? null,
      account_holder: d.account_holder ?? null,
    })
    .eq("id", d.user_id);

  if (error) {
    return { ok: false, message: error.message || "Profil konnte nicht gespeichert werden." };
  }

  await svc.auth.admin.updateUserById(d.user_id, {
    user_metadata: {
      salutation: d.salutation,
      first_name: d.first_name,
      last_name: d.last_name,
      display_name: displayName ?? undefined,
      organization_name: d.organization_name?.trim() || undefined,
      phone: d.phone,
      recruited_by: d.recruited_by?.trim() || undefined,
      responsibility_areas: d.responsibility_areas,
    },
  });

  revalidatePath("/partner/admin");
  return { ok: true, message: "Partnerdaten gespeichert." };
}

export async function setFormerActiveCompanyAction(
  _prev: AdminWorkflowState | null,
  formData: FormData,
): Promise<AdminWorkflowState> {
  if (!(await getSystemAdminSession())) {
    return { ok: false, message: "Nicht autorisiert." };
  }

  const parsed = formerActiveCompanyTipSchema.safeParse({
    tip_id: formData.get("tip_id"),
    former: formData.get("former"),
  });
  if (!parsed.success) {
    return { ok: false, message: "Ungültige Eingabe." };
  }

  const svc = createSupabaseServiceRoleClient();
  if (!svc) {
    return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY fehlt." };
  }

  const { data: cur, error: fetchErr } = await svc
    .from("partner_tip_submissions")
    .select("service_slug, admin_status, paid_amount_eur")
    .eq("id", parsed.data.tip_id)
    .maybeSingle();

  if (fetchErr || !cur) {
    return { ok: false, message: "Tipp nicht gefunden." };
  }

  const slug = String(cur.service_slug);
  const st = normalizePartnerTipAdminStatus(cur.admin_status);
  const paid = normalizePaidAmountEur(cur.paid_amount_eur);
  if (
    !isBetrieblichMitMonatsprovisionRow({
      service_slug: slug,
      admin_status: st,
      paid_amount_eur: paid,
    })
  ) {
    return { ok: false, message: "Nur für betriebliche Pflegeberatung mit hinterlegter Monatsprovision." };
  }

  const at = parsed.data.former === "true" ? new Date().toISOString() : null;
  const { error } = await svc
    .from("partner_tip_submissions")
    .update({ former_active_company_at: at })
    .eq("id", parsed.data.tip_id);

  if (error) {
    const m = String(error.message ?? "").toLowerCase();
    if (m.includes("former_active_company_at") && m.includes("does not exist")) {
      return { ok: false, message: "Migration 012 (former_active_company_at) in Supabase ausführen." };
    }
    return { ok: false, message: error.message || "Speichern fehlgeschlagen." };
  }

  revalidatePath("/partner/admin");
  return {
    ok: true,
    message: at ? "Als ehemaliges Unternehmen geführt." : "Wieder unter aktiven Unternehmen.",
  };
}
