"use client";

import { INKO_PRIMARY_BUTTON_CLASS, InkoPrimaryBeratungButton } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/inko-rezept-cta-primitives";
import { RatgeberBeratungCtaButton } from "@/components/ratgeber/RatgeberBeratungDialog";
import type { HilfefinderServiceKey } from "@/config/hilfefinder-services";
import type { InkoRezeptCtaEventName } from "@/lib/ratgeber/inko-rezept-cta-tracking";
import { cn } from "@/lib/utils";

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

const IMAGE_CTA_BUTTON_CLASS = `${INKO_PRIMARY_BUTTON_CLASS} max-w-full px-3 sm:max-w-[21rem] sm:px-6`;

const IMAGE_CTA_LABEL = (
  <span className="inline-flex max-w-full items-center justify-center gap-2 sm:gap-2.5">
    <PhoneIcon className="h-4 w-4 shrink-0 opacity-95 sm:h-5 sm:w-5" />
    <span className="min-w-0 text-left text-[0.875rem] leading-snug sm:text-base">Jetzt kostenlos beraten lassen</span>
  </span>
);

/** CTA unter Ratgeber-Artikelbildern */
export function RatgeberArticleImageBeratungCta({
  contextNote,
  preselectedServices,
  className,
  inkoChoice,
}: {
  contextNote?: string;
  preselectedServices?: HilfefinderServiceKey[];
  className?: string;
  /** Inkontinenz-Ratgeber: öffnet 3-Wege-Auswahl statt Beratungsdialog */
  inkoChoice?: {
    dataCta: string;
    clickEvent: InkoRezeptCtaEventName;
  };
}) {
  return (
    <div className={cn("mt-4 flex w-full flex-col items-stretch px-0 sm:mt-3 sm:items-center", className)}>
      {inkoChoice ? (
        <InkoPrimaryBeratungButton
          dataCta={inkoChoice.dataCta}
          clickEvent={inkoChoice.clickEvent}
          className={IMAGE_CTA_BUTTON_CLASS}
        >
          {IMAGE_CTA_LABEL}
        </InkoPrimaryBeratungButton>
      ) : (
        <RatgeberBeratungCtaButton
          className={IMAGE_CTA_BUTTON_CLASS}
          contextNote={contextNote}
          preselectedServices={preselectedServices ?? ["pflegegrad_beantrag_widerspruch"]}
        >
          {IMAGE_CTA_LABEL}
        </RatgeberBeratungCtaButton>
      )}
    </div>
  );
}
