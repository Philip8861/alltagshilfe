import type { Metadata } from "next";
import { PartnerAccountDisabledScreen } from "@/components/partner/PartnerAccountDisabledScreen";
import { PartnerPortalShell } from "@/components/partner/PartnerPortalShell";
import { isPartnerAccountDisabled, requirePartnerLogin } from "@/lib/partner/auth";
import { normalizePortalPreferences, parsePortalPreferences } from "@/lib/partner/portal-preferences";

export const metadata: Metadata = {
  title: "Partnerportal",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default async function PartnerPortalLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requirePartnerLogin();

  if (isPartnerAccountDisabled(profile)) {
    return <PartnerAccountDisabledScreen />;
  }

  const hasChangedPassword = Boolean(profile.password_changed_at?.trim());
  const portalPrefs = normalizePortalPreferences(parsePortalPreferences(profile.portal_preferences));
  const suppressPrompt =
    profile.password_change_prompt_suppress === true || portalPrefs.password_prompt_suppressed === true;
  const initialPasswordChangePrompt = !hasChangedPassword && !suppressPrompt;
  const tutorialAutoShow = portalPrefs.tutorial_hidden !== true;

  return (
    <PartnerPortalShell
      initialPasswordChangePrompt={initialPasswordChangePrompt}
      tutorialAutoShow={tutorialAutoShow}
    >
      {children}
    </PartnerPortalShell>
  );
}
