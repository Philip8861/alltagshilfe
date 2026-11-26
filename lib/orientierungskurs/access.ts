import { cache } from "react";
import { getPartnerSession, isPartnerAccountDisabled } from "@/lib/partner/auth";
import { getSystemAdminSession } from "@/lib/partner/system-admin-session";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import { COURSE_STAFF } from "./store";

export const hasCourseAccess = cache(async (profileId: string): Promise<boolean> => {
  const client = createSupabaseServiceRoleClient();
  if (!client) return false;
  const { data, error } = await client.from(COURSE_STAFF)
    .select("profile_id").eq("profile_id", profileId).maybeSingle();
  return !error && Boolean(data);
});

export async function getCourseOperator(): Promise<string | null> {
  if (await getSystemAdminSession()) return "system-admin";
  const session = await getPartnerSession();
  if (!session?.profile || isPartnerAccountDisabled(session.profile)) return null;
  return await hasCourseAccess(session.userId) ? session.userId : null;
}
