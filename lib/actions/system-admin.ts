"use server";

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
import { createPartnerUserSchema } from "@/lib/validations/system-admin";

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
    email: formData.get("email"),
    password: formData.get("password"),
    display_name: display || undefined,
    organization_name: org || undefined,
    role: formData.get("role") ?? "partner",
  });

  if (!parsed.success) {
    const e = parsed.error.flatten().fieldErrors;
    return {
      ok: false,
      message: e.email?.[0] ?? e.password?.[0] ?? e.role?.[0] ?? "Eingaben prüfen.",
    };
  }

  const svc = createSupabaseServiceRoleClient();
  if (!svc) {
    return { ok: false, message: "SUPABASE_SERVICE_ROLE_KEY fehlt – Nutzer können nur in Supabase angelegt werden." };
  }

  const { data, error } = await svc.auth.admin.createUser({
    email: parsed.data.email,
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
      return { ok: false, message: "Diese E-Mail ist bereits registriert." };
    }
    return { ok: false, message: "Nutzer konnte nicht angelegt werden. Bitte Supabase-Logs prüfen." };
  }

  const uid = data.user.id;
  const patch: { display_name?: string; organization_name?: string; role?: string } = {};
  if (parsed.data.display_name) patch.display_name = parsed.data.display_name;
  if (parsed.data.organization_name) patch.organization_name = parsed.data.organization_name;
  if (parsed.data.role === "admin") patch.role = "admin";

  if (Object.keys(patch).length > 0) {
    await svc.from("partner_profiles").update(patch).eq("id", uid);
  } else if (parsed.data.role === "admin") {
    await svc.from("partner_profiles").update({ role: "admin" }).eq("id", uid);
  }

  return {
    ok: true,
    message: `Partner-Konto angelegt: ${parsed.data.email}. Zugangsdaten dem Partner sicher mitteilen.`,
  };
}
