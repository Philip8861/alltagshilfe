"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PartnerNetworkTree } from "@/components/partner/network/PartnerNetworkTree";
import type { PartnerNetworkTreeResult } from "@/lib/partner/network-tree";

type Props = {
  initialData: PartnerNetworkTreeResult;
  availablePeriods: { periodKey: string; label: string }[];
};

export function PartnerNetworkSection({ initialData, availablePeriods }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [pendingPeriod, setPendingPeriod] = useState<string | null>(null);

  const handleChange = (periodKey: string) => {
    if (!periodKey || periodKey === initialData.periodKey) return;
    setPendingPeriod(periodKey);
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("p", periodKey);
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
      router.refresh();
    });
  };

  return (
    <PartnerNetworkTree
      data={initialData}
      availablePeriods={availablePeriods}
      onChangePeriod={handleChange}
      pendingPeriod={pending ? pendingPeriod : null}
    />
  );
}
