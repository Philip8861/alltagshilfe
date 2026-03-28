import type { Metadata } from "next";
import { PartnerPortalShell } from "@/components/partner/PartnerPortalShell";
import { requirePartnerLogin } from "@/lib/partner/auth";
import { partnerPortalSidebarInitials } from "@/lib/partner/partner-portal-avatar-initials";

export const metadata: Metadata = {
  title: "Partnerportal",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default async function PartnerPortalLayout({ children }: { children: React.ReactNode }) {
  const { profile, email } = await requirePartnerLogin();
  const av = partnerPortalSidebarInitials(profile, email);
  return (
    <PartnerPortalShell avatarGreen={av.green} avatarBlue={av.blue}>
      {children}
    </PartnerPortalShell>
  );
}
