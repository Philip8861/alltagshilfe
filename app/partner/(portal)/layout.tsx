import type { Metadata } from "next";
import { PartnerPortalShell } from "@/components/partner/PartnerPortalShell";
import { requirePartnerLogin } from "@/lib/partner/auth";

export const metadata: Metadata = {
  title: "Partnerportal",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default async function PartnerPortalLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requirePartnerLogin();
  const hasChangedPassword = Boolean(profile.password_changed_at?.trim());
  const suppressPrompt = profile.password_change_prompt_suppress === true;
  const initialPasswordChangePrompt = !hasChangedPassword && !suppressPrompt;

  return (
    <PartnerPortalShell initialPasswordChangePrompt={initialPasswordChangePrompt}>{children}</PartnerPortalShell>
  );
}
