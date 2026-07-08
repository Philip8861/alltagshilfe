"use client";

import { useEffect, useState } from "react";

import { InkoFloatingPromoShell } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/inko-floating-promo-shell";
import {
  InkoDismissLink,
  InkoPrimaryBeratungButton,
  InkoPhoneLink,
} from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/inko-rezept-cta-primitives";
import {
  INKO_REZEPT_CTA_PHONE_DISPLAY,
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

/** Popup nach 30 Sekunden Lesedauer – Desktop groß & gut lesbar */
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
      placement="center"
      size="large"
    >
      <p className="pr-8 text-center text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#5a959e] sm:text-xs md:text-sm">
        Kurze Werbung muss sein :-)
      </p>
      <h3 className="mt-3 text-center text-lg font-semibold leading-snug text-[#0F4F68] sm:mt-4 sm:text-xl md:mt-5 md:text-2xl md:leading-tight lg:text-[1.75rem]">
        Keine Lust, alles selbst herauszufinden?
      </h3>
      <p className="mt-3 text-center text-[0.9375rem] leading-relaxed text-neutral-700 sm:mt-4 sm:text-base md:mt-5 md:text-lg md:leading-relaxed">
        Unsere Experten beraten Sie kostenlos zum Thema Inkontinenzmaterial auf Rezept und prüfen gemeinsam mit Ihnen,
        welche Versorgung zu Ihrer Situation passt.
      </p>
      <p className="mt-3 text-center text-xs leading-relaxed text-neutral-600 sm:text-[0.8125rem] md:mt-4 md:text-sm md:leading-relaxed">
        Rezeptabrechnung möglich · Diskrete Lieferung · Kostenloses Testpaket auf Wunsch
      </p>
      <div className="mt-5 flex flex-col gap-2.5 md:mt-7 md:gap-3">
        <InkoPrimaryBeratungButton
          dataCta={CTA_ID}
          clickEvent="inko_cta_popup_30s_click"
          className="w-full md:min-h-[3.25rem] md:text-lg md:font-bold"
          onAfterClick={() => setVisible(false)}
          onAfterChoice={onCtaClick}
        >
          Kostenlos beraten lassen
        </InkoPrimaryBeratungButton>
        <InkoDismissLink dataCta={`${CTA_ID}-later`} onDismiss={handleClose} className="text-center md:text-[0.9375rem]">
          Später lesen
        </InkoDismissLink>
      </div>
      <p className="mt-3 text-center text-xs text-neutral-500 md:mt-4 md:text-sm">
        Oder telefonisch:{" "}
        <InkoPhoneLink
          dataCta={`${CTA_ID}-phone`}
          clickEvent="inko_cta_popup_30s_click"
          sourceComponent="inko_rezept_popup_30s_phone"
          className="inline text-xs font-medium md:text-sm"
          onAfterClick={() => {
            onCtaClick();
            setVisible(false);
          }}
        >
          {INKO_REZEPT_CTA_PHONE_DISPLAY}
        </InkoPhoneLink>
      </p>
    </InkoFloatingPromoShell>
  );
}
