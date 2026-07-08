"use client";

import { useEffect, useState } from "react";

import { InkoFloatingPromoShell } from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/inko-floating-promo-shell";
import {
  InkoDismissLink,
  InkoPrimaryBeratungButton,
} from "@/components/ratgeber/inkontinenzmaterial-auf-rezept/cta/inko-rezept-cta-primitives";
import { INKO_REZEPT_CTA_STORAGE_KEYS } from "@/lib/ratgeber/inko-rezept-cta-config";
import { hasSessionFlag, setSessionFlag } from "@/lib/ratgeber/inko-rezept-cta-storage";
import { trackInkoRezeptCtaEvent } from "@/lib/ratgeber/inko-rezept-cta-tracking";

const CTA_ID = "inko-rezept-exit";

type Props = {
  enabled: boolean;
  ctaClicked: boolean;
  dismissed: boolean;
  onDismiss: () => void;
  onCtaClick: () => void;
};

/** Exit-Intent nur Desktop (Maus Richtung Browserleiste) */
export function IncontinenceExitIntentPopup({ enabled, ctaClicked, dismissed, onDismiss, onCtaClick }: Props) {
  const [visible, setVisible] = useState(false);
  const [viewLogged, setViewLogged] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const onChange = () => setIsDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled || !isDesktop || ctaClicked || dismissed) return;
    if (hasSessionFlag(INKO_REZEPT_CTA_STORAGE_KEYS.exitShownSession)) return;

    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY > 12) return;
      if (hasSessionFlag(INKO_REZEPT_CTA_STORAGE_KEYS.exitShownSession)) return;
      setSessionFlag(INKO_REZEPT_CTA_STORAGE_KEYS.exitShownSession);
      setVisible(true);
    };

    document.addEventListener("mouseout", onMouseOut);
    return () => document.removeEventListener("mouseout", onMouseOut);
  }, [enabled, isDesktop, ctaClicked, dismissed]);

  useEffect(() => {
    if (visible && !viewLogged) {
      setViewLogged(true);
      trackInkoRezeptCtaEvent("inko_cta_exit_view", CTA_ID);
    }
  }, [visible, viewLogged]);

  const handleClose = () => {
    setVisible(false);
    onDismiss();
    trackInkoRezeptCtaEvent("inko_cta_dismiss", CTA_ID);
  };

  return (
    <InkoFloatingPromoShell
      id="inko-exit-popup"
      dataCta={CTA_ID}
      ariaLabel="Hinweis: Anspruch auf Inkontinenzversorgung prüfen"
      visible={visible}
      onClose={handleClose}
      className="sm:max-w-[24rem]"
    >
      <h3 className="pr-8 text-base font-semibold leading-snug text-[#0F4F68] sm:text-[1.05rem]">
        Möchten Sie vorher kostenlos prüfen lassen, ob Sie Anspruch haben?
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-neutral-700">
        Unsere Experten helfen Ihnen dabei, die Inkontinenzversorgung auf Rezept zu verstehen und die passende Lösung zu
        finden. Die Beratung ist kostenlos und unverbindlich.
      </p>
      <div className="mt-4 flex flex-col gap-2.5">
        <InkoPrimaryBeratungButton
          dataCta={CTA_ID}
          clickEvent="inko_cta_exit_click"
          contextNote="Ratgeber Inko-Rezept: Exit-Intent"
          className="w-full"
          onAfterClick={() => {
            onCtaClick();
            setVisible(false);
          }}
        >
          Anspruch kostenlos prüfen lassen
        </InkoPrimaryBeratungButton>
        <InkoDismissLink dataCta={`${CTA_ID}-no`} onDismiss={handleClose} className="text-center">
          Nein, danke
        </InkoDismissLink>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-neutral-600">
        Diskret beraten · Testpaket auf Wunsch · Rezeptabrechnung möglich
      </p>
    </InkoFloatingPromoShell>
  );
}
