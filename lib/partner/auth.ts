import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { loadPartnerProfileRow } from "@/lib/partner/load-partner-profile-row";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import type { PartnerProfile } from "@/lib/partner/types";

/** Migration 025: Admin kann Partnerkonto sperren ohne Löschen. */
export function isPartnerAccountDisabled(profile: PartnerProfile | null | undefined): boolean {
  const t = profile?.account_disabled_at;
  return typeof t === "string" && t.trim().length > 0;
}

/** Einheitliche Meldung für gesperrte Konten (Server Actions / API). */
export const PARTNER_ACCOUNT_DISABLED_MESSAGE =
  "Ihr Konto wurde deaktiviert. Bitte wenden Sie sich an den Support.";

export async function getPartnerSession(): Promise<{
  userId: string;
  email: string | undefined;
  profile: PartnerProfile | null;
} | null> {
  noStore();
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr) {
      console.error("[getPartnerSession] auth.getUser:", userErr.message);
      return null;
    }
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
            "[getPartnerSession] partner_profiles per Service-Role gelesen — RLS für authenticated prüfen (003_repair).",
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
}

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
