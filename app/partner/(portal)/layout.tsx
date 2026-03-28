import type { Metadata } from "next";
import { PartnerPortalShell } from "@/components/partner/PartnerPortalShell";
import { requirePartnerLogin } from "@/lib/partner/auth";

export const metadata: Metadata = {
  title: "Partnerportal",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default async function PartnerPortalLayout({ children }: { children: React.ReactNode }) {
  await requirePartnerLogin();
  return <PartnerPortalShell>{children}</PartnerPortalShell>;
}
