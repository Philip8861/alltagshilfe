import { redirect } from "next/navigation";
import { getPartnerSession } from "@/lib/partner/auth";

export default async function PartnerIndexPage() {
  const session = await getPartnerSession();
  if (session?.profile) {
    redirect("/partner/dashboard");
  }
  redirect("/partner/login");
}
