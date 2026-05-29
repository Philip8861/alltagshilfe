"use client";

import {
  PartnerNetworkPremium,
} from "@/components/partner/network/PartnerNetworkPremium";
import { PARTNER_DEMO_MAX_MUSTERMANN_AVATAR } from "@/lib/partner/partner-demo-avatars";
import {
  PARTNER_DEMO_MAX_MUSTERMANN_CODE,
  PARTNER_DEMO_MAX_MUSTERMANN_NAME,
} from "@/lib/partner/partner-demo-muster-mann-data";
import type { PartnerNetworkTreeResult } from "@/lib/partner/network-tree";

type Props = {
  data: PartnerNetworkTreeResult;
};

export function PartnerDemoNetworkPremium({ data }: Props) {
  return (
    <PartnerNetworkPremium
      data={data}
      viewer={{
        displayName: PARTNER_DEMO_MAX_MUSTERMANN_NAME,
        partnerCode: data.rootPartnerCode ?? PARTNER_DEMO_MAX_MUSTERMANN_CODE,
        avatarUrl: PARTNER_DEMO_MAX_MUSTERMANN_AVATAR,
        isActive: true,
      }}
      layoutKeyPrefix="demo"
      headingId="demo-network-heading"
      srHeading="Werbe-Netzwerk Demo"
    />
  );
}
