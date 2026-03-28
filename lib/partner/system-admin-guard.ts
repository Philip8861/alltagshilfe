import { redirect } from "next/navigation";
import { getSystemAdminSession } from "@/lib/partner/system-admin-session";

export async function requireSystemAdmin(): Promise<void> {
  const ok = await getSystemAdminSession();
  if (!ok) {
    redirect("/partner/admin-login");
  }
}
