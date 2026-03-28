import type { Metadata } from "next";
import { PartnerPortalShell } from "@/components/partner/PartnerPortalShell";
import { partnerPortalWelcomeLine } from "@/lib/partner/partner-portal-greeting";
import { requirePartnerLogin } from "@/lib/partner/auth";

export const metadata: Metadata = {
  title: "Partnerportal",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default async function PartnerPortalLayout({ children }: { children: React.ReactNode }) {
  const { profile, email } = await requirePartnerLogin();
  const welcomeLine = partnerPortalWelcomeLine(profile, email);
  return <PartnerPortalShell welcomeLine={welcomeLine}>{children}</PartnerPortalShell>;
}
