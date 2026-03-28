"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { rateLimitSystemAdminLogin } from "@/lib/rate-limit";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import {
  verifyAdminPasswordConstantTime,
  setSystemAdminSessionCookie,
  clearSystemAdminSessionCookie,
  isSystemAdminConfigured,
  getSystemAdminSession,
} from "@/lib/partner/system-admin-session";
import { createPartnerUserSchema, deletePartnerUserIdSchema } from "@/lib/validations/system-admin";
import { generatePartnerInitialPassword } from "@/lib/partner/generate-partner-password";

async function clientIp(): Promise<string> {
  try {
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
    return h.get("x-real-ip")?.trim() ?? "unknown";
  } catch {
    return "unknown";
  }
}

export type SystemAdminLoginState = { ok: true } | { ok: false; message: string };

export async function systemAdminLoginAction(
  _prev: SystemAdminLoginState | null,
  formData: FormData,
): Promise<SystemAdminLoginState> {
  if (!isSystemAdminConfigured()) {
    return { ok: false, message: "Verwaltung ist nicht konfiguriert (Umgebungsvariablen prüfen)." };
  }
  const ip = await clientIp();
  if (!rateLimitSystemAdminLogin(ip).success) {
    return { ok: false, message: "Zu viele Versuche. Bitte später erneut versuchen." };
  }

  const user = String(formData.get("user") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const expectedUser = (process.env.PARTNER_SYSTEM_ADMIN_USER ?? "").trim();
  const expectedPass = (process.env.PARTNER_SYSTEM_ADMIN_PASSWORD ?? "").trim();

  if (user !== expectedUser || !verifyAdminPasswordConstantTime(password, expectedPass)) {
    return { ok: false, message: "Anmeldung fehlgeschlagen." };
  }

  try {
    await setSystemAdminSessionCookie();
  } catch {
    return { ok: false, message: "Sitzung konnte nicht gesetzt werden (SECRET prüfen)." };
  }
  redirect("/partner/admin");
}

export async function systemAdminLogoutAction(): Promise<void> {
  await clearSystemAdminSessionCookie();
  redirect("/partner/admin-login");
}

export type CreatePartnerUserState =
  | { ok: true; message: string; generatedPassword: string }
  | { ok: false; message: string };

export async function createPartnerUserAction(
  _prev: CreatePartnerUserState | null,
  formData: FormData,
): Promise<CreatePartnerUserState> {
  if (!(await getSystemAdminSession())) {
    return { ok: false, message: "Nicht autorisiert." };
  }

  const org = String(formData.get("organization_name") ?? "").trim();
  const recruited = String(formData.get("recruited_by") ?? "").trim();
  const parsed = createPartnerUserSchema.safeParse({
    email: formData.get("email"),
    salutation: formData.get("salutation"),
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    phone: formData.get("phone"),
    organization_name: org || undefined,
    recruited_by: recruited || undefined,
    responsibility_areas: formData.getAll("responsibility_areas").map(String),
    role: formData.get("role") ?? "partner",
  });

  if (!parsed.success) {
    const e = parsed.error.flatten().fieldErrors;
    return {
      ok: false,
      message:
        e.email?.[0] ??
        e.salutation?.[0] ??
        e.first_name?.[0] ??
        e.last_name?.[0] ??
        e.phone?.[0] ??
        e.responsibility_areas?.[0] ??
        e.role?.[0] ??
        "Eingaben prüfen.",
    };
  }

  const authEmail = parsed.data.email.trim().toLowerCase();
  const displayName = `${parsed.data.first_name} ${parsed.data.last_name}`.trim();

  const svc = createSupabaseServiceRoleClient();
  if (!svc) {
    return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY fehlt – Nutzer können nur in Supabase angelegt werden." };
  }

  const initialPassword = generatePartnerInitialPassword();

  const { data, error } = await svc.auth.admin.createUser({
    email: authEmail,
    password: initialPassword,
    email_confirm: true,
    user_metadata: {
      first_name: parsed.data.first_name,
      last_name: parsed.data.last_name,
      display_name: displayName,
      organization_name: parsed.data.organization_name || undefined,
      phone: parsed.data.phone,
      recruited_by: parsed.data.recruited_by || undefined,
      responsibility_areas: parsed.data.responsibility_areas,
    },
  });

  if (error || !data.user) {
    const msg = error?.message?.toLowerCase() ?? "";
    if (msg.includes("already") || msg.includes("registered")) {
      return { ok: false, message: "Diese E-Mail ist bereits registriert." };
    }
    return { ok: false, message: "Nutzer konnte nicht angelegt werden. Bitte Supabase-Logs prüfen." };
  }

  const uid = data.user.id;
  const role = parsed.data.role === "admin" ? "admin" : "partner";

  const profileRow = {
    id: uid,
    role,
    salutation: parsed.data.salutation,
    first_name: parsed.data.first_name,
    last_name: parsed.data.last_name,
    display_name: displayName,
    organization_name: parsed.data.organization_name ?? null,
    recruited_by: parsed.data.recruited_by ?? null,
    phone: parsed.data.phone,
    responsibility_areas: parsed.data.responsibility_areas,
  };

  const { error: profileInsErr } = await svc.from("partner_profiles").insert(profileRow);
  if (
    profileInsErr &&
    profileInsErr.code !== "23505" &&
    !String(profileInsErr.message ?? "").toLowerCase().includes("duplicate")
  ) {
    return {
      ok: false,
      message:
        "Nutzer wurde in Auth angelegt, partner_profiles konnte nicht geschrieben werden. Migrationen 004_partner_profiles_admin_fields.sql, 006_partner_salutation.sql und RLS prüfen.",
    };
  }

  const fullUpdate = {
    salutation: parsed.data.salutation,
    first_name: parsed.data.first_name,
    last_name: parsed.data.last_name,
    display_name: displayName,
    organization_name: parsed.data.organization_name ?? null,
    recruited_by: parsed.data.recruited_by ?? null,
    phone: parsed.data.phone,
    responsibility_areas: parsed.data.responsibility_areas,
    role,
  };

  await svc.from("partner_profiles").update(fullUpdate).eq("id", uid);

  revalidatePath("/partner/admin");

  return {
    ok: true,
    generatedPassword: initialPassword,
    message:
      `Konto für ${authEmail} angelegt. Das generierte Passwort unten einmalig kopieren und dem Partner sicher übermitteln (nicht per unverschlüsselter E-Mail).`,
  };
}

export type DeletePartnerUserState =
  | { ok: true; message: string }
  | { ok: false; message: string };

export async function deletePartnerUserAction(
  _prev: DeletePartnerUserState | null,
  formData: FormData,
): Promise<DeletePartnerUserState> {
  if (!(await getSystemAdminSession())) {
    return { ok: false, message: "Nicht autorisiert." };
  }

  const parsed = deletePartnerUserIdSchema.safeParse({
    user_id: formData.get("user_id"),
  });
  if (!parsed.success) {
    const err = parsed.error.flatten().fieldErrors.user_id?.[0];
    return { ok: false, message: err ?? "Ungültige Nutzer-ID." };
  }

  const svc = createSupabaseServiceRoleClient();
  if (!svc) {
    return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY fehlt." };
  }

  const { error } = await svc.auth.admin.deleteUser(parsed.data.user_id);
  if (error) {
    return { ok: false, message: error.message || "Löschen in Supabase fehlgeschlagen." };
  }

  revalidatePath("/partner/admin");

  return { ok: true, message: "Das Partner-Konto wurde gelöscht (Auth und Profil per Kaskade)." };
}
