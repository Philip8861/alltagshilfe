import type { ReactNode } from "react";

import { RatgeberBeratungProvider } from "@/components/ratgeber/RatgeberBeratungDialog";
import { RatgeberRedaktionsHelfer } from "@/components/ratgeber/RatgeberRedaktionsHelfer";
import { getPartnerSession } from "@/lib/partner/auth";
import { getSystemAdminSession } from "@/lib/partner/system-admin-session";

import { buildStandortContactProofsByPageSlug } from "@/lib/standort-contact-proof";

export default async function RatgeberLayout({ children }: { children: ReactNode }) {
  const standortContactProofsBySlug = buildStandortContactProofsByPageSlug();
  const [systemAdminSession, partnerSession] = await Promise.all([getSystemAdminSession(), getPartnerSession()]);
  const supabaseAdminEditor =
    Boolean(partnerSession?.profile?.id) &&
    String(partnerSession?.profile?.role ?? "").trim().toLowerCase() === "admin";
  const initialShowEditor = systemAdminSession || supabaseAdminEditor;

  return (
    <RatgeberBeratungProvider standortContactProofsBySlug={standortContactProofsBySlug}>
      {children}
      <RatgeberRedaktionsHelfer initialShowEditor={initialShowEditor} />
    </RatgeberBeratungProvider>
  );
}
