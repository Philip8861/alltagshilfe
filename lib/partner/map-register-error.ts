import type { AuthError } from "@supabase/supabase-js";

/**
 * Nutzerfreundliche Meldungen; vermeidet rohe englische API-Texte, wo möglich.
 */
export function mapSupabaseRegisterError(error: AuthError): string {
  const msg = (error.message ?? "").toLowerCase();
  const code = (error.code ?? "").toLowerCase();

  if (
    code === "user_already_exists" ||
    msg.includes("already registered") ||
    msg.includes("already been registered") ||
    msg.includes("user already exists")
  ) {
    return "Diese E-Mail ist bereits registriert. Bitte nutzen Sie die Anmeldung.";
  }

  if (
    msg.includes("signups not allowed") ||
    msg.includes("signup is disabled") ||
    msg.includes("sign up is disabled")
  ) {
    return "Selbstregistrierung ist für dieses Projekt deaktiviert. Bitte wenden Sie sich an Alltagshilfe-Süd oder aktivieren Sie in Supabase Authentication → Providers → E-Mail die Registrierung.";
  }

  if (msg.includes("password") && (msg.includes("weak") || msg.includes("short") || msg.includes("least"))) {
    return "Das Passwort erfüllt nicht die Anforderungen des Servers. Bitte ein längeres oder stärkeres Passwort wählen.";
  }

  if (msg.includes("invalid email") || (msg.includes("email") && msg.includes("invalid"))) {
    return "Ungültige E-Mail-Adresse.";
  }

  if (msg.includes("rate limit") || msg.includes("too many requests") || msg.includes("too many")) {
    return "Zu viele Anfragen. Bitte später erneut versuchen.";
  }

  if (
    msg.includes("redirect") &&
    (msg.includes("not allowed") || msg.includes("invalid") || msg.includes("whitelist"))
  ) {
    return "Die Weiterleitungs-URL ist in Supabase nicht freigegeben. Unter Authentication → URL Configuration bei „Redirect URLs“ die Adresse https://Ihre-Domain/auth/callback (und ggf. Vercel-URLs) eintragen.";
  }

  if (msg.includes("database") || msg.includes("trigger") || msg.includes("violates") || msg.includes("relation")) {
    return "Datenbankfehler bei der Anlage des Kontos. Bitte prüfen, ob die Migration 001_partner_portal.sql vollständig ausgeführt wurde (Tabelle partner_profiles und Trigger).";
  }

  return "Registrierung fehlgeschlagen. Bitte Eingaben prüfen – oder anmelden, falls Sie bereits ein Konto haben.";
}
