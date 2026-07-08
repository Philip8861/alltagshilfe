"use client";

import { InkoPrimaryBeratungButton } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/inko-rezept-cta-primitives";
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

const IMAGE_CTA_BUTTON_CLASS =
  "ratgeber-cta-pulse inline-flex min-h-[3rem] w-full max-w-[18rem] items-center justify-center gap-2.5 rounded-lg bg-[#F78F2E] px-5 text-base font-bold tracking-tight text-white shadow-[0_3px_12px_-4px_rgba(180,90,10,0.32)] [text-shadow:0_1px_1px_rgba(0,0,0,0.14)] transition-[background-color] hover:bg-[#e8862a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2 sm:max-w-[21rem]";

const IMAGE_CTA_LABEL = (
  <>
    <PhoneIcon className="h-5 w-5 shrink-0 opacity-95" />
    <span>Jetzt kostenlos beraten lassen</span>
  </>
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
    <div className={cn("mt-4 flex w-full flex-col items-center sm:mt-3", className)}>
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
