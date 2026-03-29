import { Suspense } from "react";
import { PartnerAdminShell } from "@/components/partner/admin/PartnerAdminShell";

function AdminShellFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-[#FAFBFC]">
      <p className="text-sm text-neutral-600">Admin wird geladen…</p>
    </div>
  );
}

export default function PartnerAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<AdminShellFallback />}>
      <PartnerAdminShell>{children}</PartnerAdminShell>
    </Suspense>
  );
}
