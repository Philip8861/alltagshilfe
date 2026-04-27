"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setPartnerTutorialHiddenAction } from "@/lib/actions/partner-tutorial";
import { PARTNER_TUTORIAL_OPEN_EVENT } from "@/lib/partner/tutorial-session";

type Props = {
  tutorialHidden: boolean;
};

export function PartnerTutorialSettingsCard({ tutorialHidden }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const openTutorial = () => {
    setMessage(null);
    window.dispatchEvent(new CustomEvent(PARTNER_TUTORIAL_OPEN_EVENT));
  };

  const showAgainOnLogin = () => {
    setMessage(null);
    startTransition(async () => {
      const r = await setPartnerTutorialHiddenAction(false);
      if (!r.ok) {
        setMessage(r.message);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="partner-dash-animate rounded-2xl border border-[#0F4F68]/15 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-bold text-[#0F4F68] sm:text-lg">Partner-Rundgang</h2>
      <p className="mt-2 text-sm text-neutral-600">
        Kurze geführte Erklärung zu Partner-Code, Provisionen, Statuslisten, Tipp geben, Einstellungen und Statistik.
        {tutorialHidden
          ? " Der automatische Start nach dem Login ist ausgeblendet — Sie können den Rundgang hier jederzeit starten."
          : " Nach dem Login erscheint der Rundgang automatisch, bis Sie ihn dauerhaft ausblenden."}
      </p>
      {message ? (
        <p className="mt-3 text-sm font-medium text-red-700" role="alert">
          {message}
        </p>
      ) : null}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={openTutorial}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0c3d52]"
        >
          Rundgang starten
        </button>
        {tutorialHidden ? (
          <button
            type="button"
            disabled={pending}
            onClick={showAgainOnLogin}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#0F4F68]/25 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F4F68] hover:bg-[#0F4F68]/5 disabled:opacity-60"
          >
            {pending ? "Speichern…" : "Beim Login wieder automatisch anzeigen"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
