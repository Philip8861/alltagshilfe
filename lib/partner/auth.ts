import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import type { PartnerProfile } from "@/lib/partner/types";

export async function getPartnerSession(): Promise<{
  userId: string;
  email: string | undefined;
  profile: PartnerProfile | null;
} | null> {
  noStore();
  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profileRow, error: profileErr } = await supabase
    .from("partner_profiles")
    .select(
      "id, display_name, organization_name, role, created_at, first_name, last_name, recruited_by, phone, responsibility_areas, password_changed_at",
    )
    .eq("id", user.id)
    .maybeSingle();

  if (profileErr) {
    console.error("[getPartnerSession] partner_profiles:", profileErr.message);
  }

  let profile = (profileRow as PartnerProfile | null) ?? null;

  /**
   * Fallback nur serverseitig: user.id stammt aus verifiziertem JWT (getUser), nicht aus Client-Input.
   * Hilft, wenn RLS für authenticated fälschlich blockiert — Policies sollten trotzdem repariert werden (003).
   */
  if (!profile?.id) {
    const svc = createSupabaseServiceRoleClient();
    if (svc) {
      const { data: svcRow, error: svcErr } = await svc
        .from("partner_profiles")
        .select(
          "id, display_name, organization_name, role, created_at, first_name, last_name, recruited_by, phone, responsibility_areas, password_changed_at",
        )
        .eq("id", user.id)
        .maybeSingle();
      if (svcErr) {
        console.error("[getPartnerSession] partner_profiles service fallback:", svcErr.message);
      } else if (svcRow?.id) {
        profile = svcRow as PartnerProfile;
        console.warn(
          "[getPartnerSession] partner_profiles per Service-Role gelesen — RLS für authenticated auf partner_profiles prüfen (supabase/migrations/003_repair_partner_profiles_rls.sql).",
        );
      }
    }
  }

  return {
    userId: user.id,
    email: user.email,
    profile,
  };
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
