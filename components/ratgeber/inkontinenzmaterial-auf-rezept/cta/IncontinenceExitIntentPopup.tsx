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

function shouldTriggerExitIntent(e: MouseEvent): boolean {
  if (e.clientY > 20) return false;
  const related = e.relatedTarget as Node | null;
  return related === null || !document.documentElement.contains(related);
}

/** Exit-Intent: Maus verlässt Seite nach oben (Desktop) */
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

    const showExit = () => {
      if (hasSessionFlag(INKO_REZEPT_CTA_STORAGE_KEYS.exitShownSession)) return;
      setSessionFlag(INKO_REZEPT_CTA_STORAGE_KEYS.exitShownSession);
      setVisible(true);
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) showExit();
    };

    const onMouseOut = (e: MouseEvent) => {
      if (shouldTriggerExitIntent(e)) showExit();
    };

    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseout", onMouseOut);
    return () => {
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [enabled, isDesktop, ctaClicked, dismissed]);

  useEffect(() => {
    if (visible && !viewLogged) {
      setViewLogged(true);
      trackInkoRezeptCtaEvent("inko_cta_exit_view", CTA_ID);
    }
  }, [visible, viewLogged]);

  const handleSoftClose = () => {
    setVisible(false);
    trackInkoRezeptCtaEvent("inko_cta_dismiss", `${CTA_ID}-soft`);
  };

  const handlePermanentDismiss = () => {
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
      onClose={handleSoftClose}
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
          className="w-full"
          onAfterClick={() => setVisible(false)}
          onAfterChoice={onCtaClick}
        >
          Anspruch kostenlos prüfen lassen
        </InkoPrimaryBeratungButton>
        <InkoDismissLink dataCta={`${CTA_ID}-no`} onDismiss={handlePermanentDismiss} className="text-center">
          Nein, danke
        </InkoDismissLink>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-neutral-600">
        Diskret beraten · Testpaket auf Wunsch · Rezeptabrechnung möglich
      </p>
    </InkoFloatingPromoShell>
  );
}
