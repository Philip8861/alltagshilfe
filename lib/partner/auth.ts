import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
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

  const { data: profile } = await supabase
    .from("partner_profiles")
    .select("id, display_name, organization_name, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  return {
    userId: user.id,
    email: user.email,
    profile: profile as PartnerProfile | null,
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
