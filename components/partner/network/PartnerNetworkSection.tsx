"use client";

import { PartnerNetworkTree } from "@/components/partner/network/PartnerNetworkTree";
import type { PartnerNetworkTreeResult } from "@/lib/partner/network-tree";

type Props = {
  initialData: PartnerNetworkTreeResult;
};

export function PartnerNetworkSection({ initialData }: Props) {
  return <PartnerNetworkTree data={initialData} />;
}
