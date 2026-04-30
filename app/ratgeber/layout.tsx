import type { ReactNode } from "react";

import { RatgeberBeratungProvider } from "@/components/ratgeber/RatgeberBeratungDialog";

import { buildStandortContactProofsByPageSlug } from "@/lib/standort-contact-proof";

export default function RatgeberLayout({ children }: { children: ReactNode }) {
  const standortContactProofsBySlug = buildStandortContactProofsByPageSlug();
  return (
    <RatgeberBeratungProvider standortContactProofsBySlug={standortContactProofsBySlug}>
      {children}
    </RatgeberBeratungProvider>
  );
}
