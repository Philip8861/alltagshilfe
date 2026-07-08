"use client";

import { useEffect, useState } from "react";

import { InkoFloatingPromoShell } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/inko-floating-promo-shell";
import {
  InkoDismissLink,
  InkoPhoneLink,
  InkoPrimaryBeratungButton,
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
  dismissed: boolean;
  onDismiss: () => void;
  onCtaClick: () => void;
};

/** Kleines Popup nach 30 Sekunden Lesedauer */
export function IncontinenceTimedPopup({ enabled, ctaClicked, dismissed, onDismiss, onCtaClick }: Props) {
  const [visible, setVisible] = useState(false);
  const [viewLogged, setViewLogged] = useState(false);

  useEffect(() => {
    if (!enabled || ctaClicked || dismissed) return;
    if (hasSessionFlag(INKO_REZEPT_CTA_STORAGE_KEYS.popupShownSession)) return;

    const timer = window.setTimeout(() => {
      if (hasSessionFlag(INKO_REZEPT_CTA_STORAGE_KEYS.popupShownSession)) return;
      setSessionFlag(INKO_REZEPT_CTA_STORAGE_KEYS.popupShownSession);
      setVisible(true);
    }, INKO_REZEPT_TIMED_POPUP_MS);

    return () => window.clearTimeout(timer);
  }, [enabled, ctaClicked, dismissed]);

  useEffect(() => {
    if (visible && !viewLogged) {
      setViewLogged(true);
      trackInkoRezeptCtaEvent("inko_cta_popup_30s_view", CTA_ID);
    }
  }, [visible, viewLogged]);

  const handleClose = () => {
    setVisible(false);
    onDismiss();
    trackInkoRezeptCtaEvent("inko_cta_dismiss", CTA_ID);
  };

  return (
    <InkoFloatingPromoShell
      id="inko-timed-popup"
      dataCta={CTA_ID}
      ariaLabel="Hinweis zur kostenlosen Inkontinenz-Beratung"
      visible={visible}
      onClose={handleClose}
    >
      <h3 className="pr-8 text-base font-semibold leading-snug text-[#0F4F68] sm:text-[1.05rem]">
        Keine Lust, alles selbst herauszufinden?
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-neutral-700">
        Unsere Inkontinenz-Experten beraten Sie kostenlos zum Thema Inkontinenzmaterial auf Rezept und prüfen gemeinsam mit
        Ihnen, welche Versorgung zu Ihrer Situation passt.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-neutral-600">
        Rezeptabrechnung möglich · Diskrete Lieferung · Kostenloses Testpaket auf Wunsch
      </p>
      <div className="mt-4 flex flex-col gap-2.5">
        <InkoPrimaryBeratungButton
          dataCta={CTA_ID}
          clickEvent="inko_cta_popup_30s_click"
          contextNote="Ratgeber Inko-Rezept: 30s-Popup"
          className="w-full"
          onAfterClick={() => {
            onCtaClick();
            setVisible(false);
          }}
        >
          Kostenlos beraten lassen
        </InkoPrimaryBeratungButton>
        <InkoDismissLink dataCta={`${CTA_ID}-later`} onDismiss={handleClose} className="text-center">
          Später lesen
        </InkoDismissLink>
      </div>
      <p className="mt-3 text-center text-xs text-neutral-500">
        Oder telefonisch:{" "}
        <InkoPhoneLink
          dataCta={`${CTA_ID}-phone`}
          clickEvent="inko_cta_popup_30s_click"
          sourceComponent="inko_rezept_popup_30s_phone"
          className="inline text-xs font-medium"
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
