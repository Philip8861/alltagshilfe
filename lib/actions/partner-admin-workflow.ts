"use server";

import { revalidatePath } from "next/cache";
import { getSystemAdminSession } from "@/lib/partner/system-admin-session";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import {
  archivePartnerTipSchema,
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
  const parsed = updatePartnerTipStatusSchema.safeParse({
    tip_id: formData.get("tip_id"),
    admin_status: formData.get("admin_status"),
    admin_visible_note: typeof noteRaw === "string" ? noteRaw : "",
  });
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message;
    return { ok: false, message: msg || "Ungültige Eingabe." };
  }

  const svc = createSupabaseServiceRoleClient();
  if (!svc) {
    return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY fehlt." };
  }

  const { error } = await svc
    .from("partner_tip_submissions")
    .update({
      admin_status: parsed.data.admin_status,
      admin_visible_note: parsed.data.admin_visible_note,
    })
    .eq("id", parsed.data.tip_id);

  if (error) {
    return { ok: false, message: "Speichern fehlgeschlagen. Migration und Spalten prüfen." };
  }

  revalidatePath("/partner/admin");
  return { ok: true, message: "Gespeichert." };
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
