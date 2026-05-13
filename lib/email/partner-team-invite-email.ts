import { buildBrandedNotificationHtml } from "@/lib/email/branded-html";
import { siteConfig } from "@/config/site";

export function partnerTeamInviteSubject(teamName: string): string {
  return `Einladung zum Team „${teamName}“ – ${siteConfig.name}`;
}

export function buildPartnerTeamInviteEmailHtml(options: {
  inviterFormalLine: string;
  teamName: string;
  joinUrl: string;
}): string {
  const { inviterFormalLine, teamName, joinUrl } = options;
  return buildBrandedNotificationHtml({
    kindBadge: "Partnerportal",
    headline: "Einladung in ein Team (betriebliche Pflegeberatung)",
    rows: [{ label: "Team", value: teamName }],
    detailTitle: "Nachricht",
    detailText: `${inviterFormalLine} lädt Sie zum Team „${teamName}“ ein. Bitte melden Sie sich mit Ihrem Partnerkonto an und nehmen Sie die Einladung an.`,
    ctaHref: joinUrl,
    ctaLabel: "Jetzt beitreten",
    ctaButtonVariant: "accent",
  });
}
