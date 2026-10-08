import { cache } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { loadPartnerProfileRow } from "@/lib/partner/load-partner-profile-row";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import type { PartnerProfile } from "@/lib/partner/types";

type VerifiedAuthUser = { id: string; email: string | undefined };

function isSessionMissingError(err: { name?: string; message?: string } | null | undefined): boolean {
  if (!err) return false;
  if (err.name === "AuthSessionMissingError") return true;
  return (err.message ?? "").toLowerCase().includes("session missing");
}

/**
 * Angemeldeten Nutzer kryptografisch verifiziert ermitteln.
 *
 * Bevorzugt `getClaims()`: prüft die JWT-Signatur lokal gegen den (global gecachten) JWKS des Projekts
 * (ES256) — keine Netzwerk-Rundreise zum Auth-Server pro Seitenaufruf. Abgelaufene Tokens werden dabei
 * wie gewohnt per Refresh-Token erneuert. Fällt auf `getUser()` zurück, falls keine lokale Prüfung möglich
 * ist (z. B. Legacy-HS256-Projekte).
 */
export async function getVerifiedAuthUser(supabase: SupabaseClient): Promise<VerifiedAuthUser | null> {
  try {
    const { data, error } = await supabase.auth.getClaims();
    if (!error && data?.claims?.sub) {
      const email = data.claims.email;
      return { id: String(data.claims.sub), email: typeof email === "string" ? email : undefined };
    }
    /** Keine Session (kein Cookie) — kein Fallback nötig. */
    if ((!error && !data) || isSessionMissingError(error)) return null;
    if (error) console.warn("[getVerifiedAuthUser] getClaims:", error.message);
  } catch (e) {
    console.warn("[getVerifiedAuthUser] getClaims unerwartet:", e);
  }

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();
  if (userErr) {
    if (!isSessionMissingError(userErr)) {
      console.error("[getVerifiedAuthUser] auth.getUser:", userErr.message);
    }
    return null;
  }
  if (!user) return null;
  return { id: user.id, email: user.email };
}

/** Migration 025: Admin kann Partnerkonto sperren ohne Löschen. */
export function isPartnerAccountDisabled(profile: PartnerProfile | null | undefined): boolean {
  const t = profile?.account_disabled_at;
  return typeof t === "string" && t.trim().length > 0;
}

/** Einheitliche Meldung für gesperrte Konten (Server Actions / API). */
export const PARTNER_ACCOUNT_DISABLED_MESSAGE =
  "Ihr Konto wurde deaktiviert. Bitte wenden Sie sich an den Support.";

type PartnerSession = {
  userId: string;
  email: string | undefined;
  profile: PartnerProfile | null;
};

/**
 * Pro Request nur einmal ausgeführt (React `cache`): Portal-Layout, Seite und ggf. Metadata teilen
 * sich eine Auth-Prüfung und einen Profil-Load statt jeweils eigener Supabase-Rundreisen.
 */
export const getPartnerSession = cache(async function getPartnerSession(): Promise<PartnerSession | null> {
  noStore();
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createSupabaseServerClient();
    const user = await getVerifiedAuthUser(supabase);
    if (!user) return null;

    const { profile: loaded, errorMessage } = await loadPartnerProfileRow(supabase, user.id);
    if (errorMessage) {
      console.error("[getPartnerSession] partner_profiles:", errorMessage);
    }

    let profile = loaded;

    /**
     * Fallback nur serverseitig: user.id stammt aus verifiziertem JWT (getUser), nicht aus Client-Input.
     */
    if (!profile?.id) {
      const svc = createSupabaseServiceRoleClient();
      if (svc) {
        const svcLoad = await loadPartnerProfileRow(svc, user.id);
        if (svcLoad.errorMessage) {
          console.error("[getPartnerSession] partner_profiles service fallback:", svcLoad.errorMessage);
        } else if (svcLoad.profile?.id) {
          profile = svcLoad.profile;
          console.warn(
            "[getPartnerSession] partner_profiles per Service-Role gelesen. RLS für authenticated prüfen (003_repair).",
          );
        }
      }
    }

    return {
      userId: user.id,
      email: user.email,
      profile,
    };
  } catch (e) {
    console.error("[getPartnerSession] unerwarteter Fehler:", e);
    return null;
  }
});

export async function requirePartnerLogin(): Promise<{
  userId: string;
  email: string | undefined;
  profile: PartnerProfile;
}> {
  const session = await getPartnerSession();
  if (!session) {
    redirect("/partner/login");
  }
  if (!session.profile) {
    redirect("/partner/login?reason=no_profile");
  }
  return {
    userId: session.userId,
    email: session.email,
    profile: session.profile,
  };
}
