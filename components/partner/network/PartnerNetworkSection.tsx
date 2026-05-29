"use client";

import {
  PartnerNetworkPremium,
  type PartnerNetworkViewer,
} from "@/components/partner/network/PartnerNetworkPremium";
import type { PartnerNetworkTreeResult } from "@/lib/partner/network-tree";

type Props = {
  initialData: PartnerNetworkTreeResult;
  viewer: PartnerNetworkViewer;
};

export function PartnerNetworkSection({ initialData, viewer }: Props) {
  return <PartnerNetworkPremium data={initialData} viewer={viewer} />;
}
