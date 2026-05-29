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
import { assignUniquePartnerReferralCode } from "@/lib/partner/generate-partner-referral-code";
import { setPartnerReferralByCode } from "@/lib/partner/referral";
import { savePartnerCommissionRates } from "@/lib/partner/partner-commission-rates";
import {
  logPartnerPortalAuditEvent,
  PARTNER_PORTAL_AUDIT_ADMIN_LABEL,
} from "@/lib/partner/partner-portal-audit-log";
import {
  sendPartnerRegistrationWelcomeMail,
  sendPartnerRegistrationWelcomePreviewMail,
} from "@/lib/email/partner-registration-welcome";

function formatPartnerProfileWriteError(err: { code?: string; message?: string }): string {
  const code = String(err.code ?? "");
  const msg = String(err.message ?? "").toLowerCase();
  if (code === "42703" || (msg.includes("column") && msg.includes("does not exist"))) {
    return (
      "Datenbank-Spalten fehlen. Bitte in Supabase die Migrationen 004, 006 und 007 für partner_profiles ausführen."
    );
  }
  if (code === "23514" || msg.includes("violates check constraint")) {
    return "Profil konnte nicht gespeichert werden (Prüfregel in der Datenbank). Eingaben prüfen oder Supabase-Logs einsehen.";
  }
  if (code === "23505" && (msg.includes("partner_referral_code") || msg.includes("referral"))) {
    return "Partner-Referenzcode ist bereits vergeben. Bitte erneut versuchen (es wird ein neuer Code erzeugt).";
  }
  if (code === "23503" || msg.includes("foreign key")) {
    return "Profil konnte nicht verknüpft werden (Auth-Nutzer fehlt oder falsches Projekt). Supabase-URL und Service-Role-Key prüfen.";
  }
  return (
    "Das Partnerprofil konnte nicht gespeichert werden. Supabase SQL-Logs prüfen; Migration 009 (service_role-Rechte) ausführen, falls nötig."
  );
}

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
  | { ok: true; message: string; generatedPassword: string; referralCode: string; confirmationEmailSent: boolean }
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
    referral_partner_code: formData.get("referral_partner_code"),
    iban: formData.get("iban"),
    bic: formData.get("bic"),
    account_holder: formData.get("account_holder"),
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
        e.iban?.[0] ??
        e.bic?.[0] ??
        e.account_holder?.[0] ??
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
  let referralCode: string;
  try {
    referralCode = await assignUniquePartnerReferralCode(svc, parsed.data.first_name, parsed.data.last_name);
  } catch {
    return { ok: false, message: "Partner-Code konnte nicht vergeben werden. Bitte erneut versuchen." };
  }

  const { data, error } = await svc.auth.admin.createUser({
    email: authEmail,
    password: initialPassword,
    email_confirm: true,
    user_metadata: {
      salutation: parsed.data.salutation,
      first_name: parsed.data.first_name,
      last_name: parsed.data.last_name,
      display_name: displayName,
      organization_name: parsed.data.organization_name || undefined,
      phone: parsed.data.phone,
      recruited_by: parsed.data.recruited_by || undefined,
      responsibility_areas: parsed.data.responsibility_areas,
      partner_referral_code: referralCode,
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
    partner_referral_code: referralCode,
    first_name: parsed.data.first_name,
    last_name: parsed.data.last_name,
    display_name: displayName,
    organization_name: parsed.data.organization_name ?? null,
    recruited_by: parsed.data.recruited_by ?? null,
    phone: parsed.data.phone,
    responsibility_areas: parsed.data.responsibility_areas,
    iban: parsed.data.iban ?? null,
    bic: parsed.data.bic ?? null,
    account_holder: parsed.data.account_holder ?? null,
  };

  /**
   * Auth-Trigger legt oft schon (id, role) an → reines INSERT ergibt PK 23505.
   * UPSERT (onConflict: id) schreibt oder aktualisiert die Zeile zuverlässig.
   */
  const { error: profileUpsertErr } = await svc.from("partner_profiles").upsert(profileRow, {
    onConflict: "id",
  });

  if (profileUpsertErr) {
    console.error(
      "[createPartnerUser] partner_profiles upsert:",
      profileUpsertErr.code,
      profileUpsertErr.message,
      profileUpsertErr.details,
    );
    const { error: rollbackErr } = await svc.auth.admin.deleteUser(uid);
    if (rollbackErr) {
      console.error("[createPartnerUser] Auth-Rollback nach Profil-Fehler fehlgeschlagen:", rollbackErr.message);
    }
    return {
      ok: false,
      message: formatPartnerProfileWriteError(profileUpsertErr),
    };
  }

  const referralCodeRaw = parsed.data.referral_partner_code;
  if (referralCodeRaw) {
    const refRes = await setPartnerReferralByCode(svc, uid, referralCodeRaw);
    if (!refRes.ok) {
      const { error: rollbackErr } = await svc.auth.admin.deleteUser(uid);
      if (rollbackErr) {
        console.error(
          "[createPartnerUser] Auth-Rollback nach Referral-Fehler fehlgeschlagen:",
          rollbackErr.message,
        );
      }
      return { ok: false, message: refRes.message };
    }
  }

  const ratesResult = await savePartnerCommissionRates(svc, uid, formData, {
    actorKind: "admin",
    actorLabel: PARTNER_PORTAL_AUDIT_ADMIN_LABEL,
  });
  if (!ratesResult.ok) {
    const { error: rollbackErr } = await svc.auth.admin.deleteUser(uid);
    if (rollbackErr) {
      console.error("[createPartnerUser] Auth-Rollback nach Provisions-Fehler fehlgeschlagen:", rollbackErr.message);
    }
    return { ok: false, message: ratesResult.message };
  }

  await logPartnerPortalAuditEvent(svc, {
    event_kind: "partner_created",
    subject_partner_id: uid,
    actor_kind: "admin",
    actor_label: PARTNER_PORTAL_AUDIT_ADMIN_LABEL,
    summary: `Partnerkonto angelegt: ${parsed.data.first_name} ${parsed.data.last_name} (${authEmail}).`,
    detail_json: {
      email: authEmail,
      responsibility_areas: parsed.data.responsibility_areas,
    },
  });

  revalidatePath("/partner/admin");

  const mailSent = await sendPartnerRegistrationWelcomeMail({
    partnerEmail: authEmail,
    vorname: parsed.data.first_name,
    nachname: parsed.data.last_name,
    einmalpasswort: initialPassword,
  });

  if (!mailSent.ok) {
    console.error(
      "[createPartnerUser] Bestätigungs-E-Mail konnte nicht gesendet werden (SMTP_HOST/SMTP_USER/SMTP_PASS prüfen).",
    );
  }

  return {
    ok: true,
    generatedPassword: initialPassword,
    referralCode,
    confirmationEmailSent: mailSent.ok,
    message: mailSent.ok
      ? `Konto für ${authEmail} angelegt. Eine Bestätigung mit den Zugangsdaten wurde an diese Adresse per E-Mail gesendet. Das Passwort und den Partner-Code unten zusätzlich einmalig kopieren (z. B. für die Akte).`
      : `Konto für ${authEmail} angelegt. Hinweis: Die Bestätigungs-E-Mail konnte nicht versendet werden (SMTP prüfen). Passwort und Partner-Code dem Partner über eine sichere Verbindung mitteilen.`,
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

export type PartnerRegistrationTestEmailState =
  | { ok: true; message: string }
  | { ok: false; message: string };

/**
 * Versand einer **Design-Vorschau** der Partner-Registrierungs-Mail (Beispieldaten). Nur System-Admin-Session.
 */
export async function sendPartnerRegistrationTestEmailAction(
  _prev: PartnerRegistrationTestEmailState | null,
  formData: FormData,
): Promise<PartnerRegistrationTestEmailState> {
  if (!(await getSystemAdminSession())) {
    return { ok: false, message: "Nicht autorisiert." };
  }

  const raw = formData.get("test_email");
  const to =
    typeof raw === "string" && raw.includes("@")
      ? raw.trim().toLowerCase()
      : "philip.sonntag@web.de";

  const res = await sendPartnerRegistrationWelcomePreviewMail(to);
  if (!res.ok) {
    const msg =
      res.code === "smtp_not_configured"
        ? "SMTP nicht konfiguriert (SMTP_HOST, SMTP_USER, SMTP_PASS)."
        : res.code === "invalid_recipient"
          ? "Ungültige E-Mail-Adresse."
          : "Versand fehlgeschlagen.";
    return { ok: false, message: msg };
  }
  return {
    ok: true,
    message: `Vorschau-E-Mail wurde an ${to} gesendet (Betreff enthält „[Vorschau]“).`,
  };
}
