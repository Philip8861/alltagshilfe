import type { Metadata } from "next";
import { PartnerDemoNetworkSection } from "@/components/partner/demo/PartnerDemoNetworkSection";

export const metadata: Metadata = {
  title: "Partnernetzwerk (Demo)",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function PartnerDemoTeamPage() {
  return (
    <div className="space-y-6">
      <PartnerDemoNetworkSection />
    </div>
  );
}
