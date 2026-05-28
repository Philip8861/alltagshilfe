"use client";

import { useMemo } from "react";
import { PartnerNetworkTree } from "@/components/partner/network/PartnerNetworkTree";
import { getPartnerDemoNetworkTree } from "@/lib/partner/partner-demo-muster-mann-data";

export function PartnerDemoNetworkSection() {
  const data = useMemo(() => getPartnerDemoNetworkTree(), []);

  return <PartnerNetworkTree data={data} />;
}
