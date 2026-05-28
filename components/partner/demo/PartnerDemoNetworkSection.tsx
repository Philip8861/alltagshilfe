"use client";

import { useMemo } from "react";
import { PartnerDemoNetworkPremium } from "@/components/partner/demo/PartnerDemoNetworkPremium";
import { getPartnerDemoNetworkTree } from "@/lib/partner/partner-demo-muster-mann-data";

export function PartnerDemoNetworkSection() {
  const data = useMemo(() => getPartnerDemoNetworkTree(), []);

  return <PartnerDemoNetworkPremium data={data} />;
}
