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
import { resolvePartnerLoginToEmail } from "@/lib/partner/resolve-partner-login-email";

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
  | { ok: true; message: string }
  | { ok: false; message: string };

export async function createPartnerUserAction(
  _prev: CreatePartnerUserState | null,
  formData: FormData,
): Promise<CreatePartnerUserState> {
  if (!(await getSystemAdminSession())) {
    return { ok: false, message: "Nicht autorisiert." };
  }

  const display = String(formData.get("display_name") ?? "").trim();
  const org = String(formData.get("organization_name") ?? "").trim();
  const parsed = createPartnerUserSchema.safeParse({
    login: formData.get("login"),
    password: formData.get("password"),
    display_name: display || undefined,
    organization_name: org || undefined,
    role: formData.get("role") ?? "partner",
  });

  if (!parsed.success) {
    const e = parsed.error.flatten().fieldErrors;
    return {
      ok: false,
      message: e.login?.[0] ?? e.password?.[0] ?? e.role?.[0] ?? "Eingaben prüfen.",
    };
  }

  const resolved = resolvePartnerLoginToEmail(parsed.data.login);
  if (!resolved.ok) {
    return { ok: false, message: resolved.message };
  }
  const authEmail = resolved.email;

  const svc = createSupabaseServiceRoleClient();
  if (!svc) {
    return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY fehlt – Nutzer können nur in Supabase angelegt werden." };
  }

  const { data, error } = await svc.auth.admin.createUser({
    email: authEmail,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: {
      display_name: parsed.data.display_name || undefined,
      organization_name: parsed.data.organization_name || undefined,
    },
  });

  if (error || !data.user) {
    const msg = error?.message?.toLowerCase() ?? "";
    if (msg.includes("already") || msg.includes("registered")) {
      return { ok: false, message: "Dieser Anmeldename bzw. diese E-Mail ist bereits registriert." };
    }
    return { ok: false, message: "Nutzer konnte nicht angelegt werden. Bitte Supabase-Logs prüfen." };
  }

  const uid = data.user.id;

  const profileRow: {
    id: string;
    role: "partner" | "admin";
    display_name?: string;
    organization_name?: string;
  } = {
    id: uid,
    role: parsed.data.role === "admin" ? "admin" : "partner",
  };
  if (parsed.data.display_name) profileRow.display_name = parsed.data.display_name;
  if (parsed.data.organization_name) profileRow.organization_name = parsed.data.organization_name;

  const { error: profileInsErr } = await svc.from("partner_profiles").insert(profileRow);
  if (
    profileInsErr &&
    profileInsErr.code !== "23505" &&
    !String(profileInsErr.message ?? "").toLowerCase().includes("duplicate")
  ) {
    return {
      ok: false,
      message:
        "Nutzer wurde in Auth angelegt, partner_profiles konnte nicht geschrieben werden. Migration, RLS und SUPABASE_SERVICE_ROLE_KEY prüfen.",
    };
  }

  const patch: { display_name?: string; organization_name?: string; role?: string } = {};
  if (parsed.data.display_name) patch.display_name = parsed.data.display_name;
  if (parsed.data.organization_name) patch.organization_name = parsed.data.organization_name;
  if (parsed.data.role === "admin") patch.role = "admin";

  if (Object.keys(patch).length > 0) {
    await svc.from("partner_profiles").update(patch).eq("id", uid);
  } else if (parsed.data.role === "admin") {
    await svc.from("partner_profiles").update({ role: "admin" }).eq("id", uid);
  }

  revalidatePath("/partner/admin");

  return {
    ok: true,
    message: `Partner-Konto angelegt (${authEmail}). Zum Login: Kurzname oder volle E-Mail wie angelegt; Zugangsdaten sicher mitteilen.`,
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
