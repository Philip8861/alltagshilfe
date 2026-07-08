"use client";

import { useEffect, useState } from "react";

import { InkoFloatingPromoShell } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/inko-floating-promo-shell";
import {
  INKO_PRIMARY_BUTTON_CLASS,
  InkoDismissLink,
  InkoPrimaryBeratungButton,
} from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/inko-rezept-cta-primitives";
import {
  INKO_REZEPT_CTA_STORAGE_KEYS,
  INKO_REZEPT_TIMED_POPUP_MS,
} from "@/lib/ratgeber/inko-rezept-cta-config";
import { hasSessionFlag, setSessionFlag } from "@/lib/ratgeber/inko-rezept-cta-storage";
import { trackInkoRezeptCtaEvent } from "@/lib/ratgeber/inko-rezept-cta-tracking";

const CTA_ID = "inko-rezept-popup-30s";

type Props = {
  enabled: boolean;
  ctaClicked: boolean;
  onCtaClick: () => void;
};

/** Popup nach 30 Sekunden Lesedauer */
export function IncontinenceTimedPopup({ enabled, ctaClicked, onCtaClick }: Props) {
  const [visible, setVisible] = useState(false);
  const [viewLogged, setViewLogged] = useState(false);

  useEffect(() => {
    if (!enabled || ctaClicked) return;
    if (hasSessionFlag(INKO_REZEPT_CTA_STORAGE_KEYS.popupShownSession)) return;

    const timer = window.setTimeout(() => {
      if (hasSessionFlag(INKO_REZEPT_CTA_STORAGE_KEYS.popupShownSession)) return;
      setSessionFlag(INKO_REZEPT_CTA_STORAGE_KEYS.popupShownSession);
      setVisible(true);
    }, INKO_REZEPT_TIMED_POPUP_MS);

    return () => window.clearTimeout(timer);
  }, [enabled, ctaClicked]);

  useEffect(() => {
    if (visible && !viewLogged) {
      setViewLogged(true);
      trackInkoRezeptCtaEvent("inko_cta_popup_30s_view", CTA_ID);
    }
  }, [visible, viewLogged]);

  const handleClose = () => {
    setVisible(false);
    trackInkoRezeptCtaEvent("inko_cta_dismiss", CTA_ID);
  };

  return (
    <InkoFloatingPromoShell
      id="inko-timed-popup"
      dataCta={CTA_ID}
      ariaLabel="Hinweis zur kostenlosen Inkontinenz-Beratung"
      visible={visible}
      onClose={handleClose}
      size="large"
    >
      <p className="pr-9 text-center text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#4a858e] sm:pr-10 sm:text-xs md:text-sm">
        Kurze Werbung muss sein :-)
      </p>
      <h3 className="mt-2.5 text-center text-lg font-bold leading-snug text-[#0F4F68] sm:mt-4 sm:text-xl md:mt-5 md:text-2xl md:leading-tight lg:text-[1.75rem]">
        Keine Lust, alles selbst herauszufinden?
      </h3>
      <p className="mt-2.5 text-center text-[0.9rem] font-medium leading-relaxed text-neutral-800 sm:mt-4 sm:text-base md:mt-5 md:text-lg">
        Unsere Experten beraten Sie kostenlos zum Thema Inkontinenzmaterial auf Rezept und prüfen gemeinsam mit Ihnen,
        welche Versorgung zu Ihrer Situation passt.
      </p>
      <p className="mt-2.5 text-center text-[0.8rem] font-medium leading-relaxed text-neutral-700 sm:mt-3 sm:text-[0.875rem] md:mt-4 md:text-sm">
        Rezeptabrechnung · Diskrete Lieferung · Testpaket auf Wunsch
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:mt-5 md:mt-7 md:gap-3">
        <InkoPrimaryBeratungButton
          dataCta={CTA_ID}
          clickEvent="inko_cta_popup_30s_click"
          className={`${INKO_PRIMARY_BUTTON_CLASS} text-base font-extrabold sm:text-[0.9375rem]`}
          onAfterClick={() => setVisible(false)}
          onAfterChoice={onCtaClick}
        />
        <InkoDismissLink
          dataCta={`${CTA_ID}-later`}
          onDismiss={handleClose}
          className="min-h-[2.75rem] text-center text-sm font-semibold text-neutral-700 sm:text-[0.9375rem]"
        >
          Weiter lesen
        </InkoDismissLink>
      </div>
    </InkoFloatingPromoShell>
  );
}
