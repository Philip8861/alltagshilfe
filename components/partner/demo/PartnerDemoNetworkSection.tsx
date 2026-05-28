"use client";

import { useMemo, useState } from "react";
import { PartnerNetworkTree } from "@/components/partner/network/PartnerNetworkTree";
import {
  getPartnerDemoNetworkPeriodOptions,
  getPartnerDemoNetworkTree,
} from "@/lib/partner/partner-demo-muster-mann-data";

export function PartnerDemoNetworkSection() {
  const periods = useMemo(() => getPartnerDemoNetworkPeriodOptions(), []);
  const [periodKey, setPeriodKey] = useState(periods[0]?.periodKey ?? "");
  const data = useMemo(() => getPartnerDemoNetworkTree(periodKey), [periodKey]);

  return (
    <PartnerNetworkTree
      data={data}
      availablePeriods={periods}
      onChangePeriod={setPeriodKey}
    />
  );
}
