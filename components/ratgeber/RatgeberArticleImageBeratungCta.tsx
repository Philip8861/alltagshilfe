"use client";

import { RatgeberBeratungCtaButton } from "@/components/ratgeber/RatgeberBeratungDialog";
import type { HilfefinderServiceKey } from "@/config/hilfefinder-services";
import { cn } from "@/lib/utils";

/** CTA unter Ratgeber-Artikelbildern (öffnet Beratungs-Popup). */
export function RatgeberArticleImageBeratungCta({
  contextNote,
  preselectedServices,
  className,
}: {
  contextNote?: string;
  preselectedServices?: HilfefinderServiceKey[];
  className?: string;
}) {
  return (
    <div className={cn("mt-4 flex w-full flex-col items-center sm:mt-3", className)}>
      <RatgeberBeratungCtaButton
        className="w-full max-w-[18rem] justify-center px-4 text-[0.9rem] sm:max-w-[21rem]"
        contextNote={contextNote}
        preselectedServices={preselectedServices ?? ["pflegegrad_beantrag_widerspruch"]}
      >
        Jetzt kostenlos beraten lassen
      </RatgeberBeratungCtaButton>
    </div>
  );
}
