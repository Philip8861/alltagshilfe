"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import {
  acceptBetrieblichTeamInviteAction,
  type BetrieblichTeamActionResult,
} from "@/lib/actions/partner-betrieblich-team";

type Props = {
  token: string;
  teamName: string;
};

export function PartnerTeamInviteAcceptClient({ token, teamName }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const onAccept = () => {
    setMessage(null);
    startTransition(async () => {
      const res: BetrieblichTeamActionResult = await acceptBetrieblichTeamInviteAction(token);
      if (res.ok) {
        router.push("/partner/team");
        router.refresh();
        return;
      }
      setMessage(res.message);
    });
  };

  return (
    <div className="mt-6 space-y-6 border-t border-[#0F4F68]/10 pt-6">
      {message ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-950" role="alert">
          {message}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onAccept}
        disabled={pending}
        className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-gradient-to-b from-[#F78F2E] to-[#e07820] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:from-[#e07f25] hover:to-[#c96a1a] disabled:opacity-60"
      >
        {pending ? "Einen Moment bitte" : "Jetzt beitreten"}
      </button>
      <p className="text-center text-xs leading-relaxed text-neutral-600">
        Mit dem Beitritt zu der Gruppe {teamName} bestätigen Sie, die Teamregeln zur Kenntnis genommen zu haben:
        höchstens drei Teams pro Person und keine doppelte Zusammenarbeit derselben zwei Partner in zwei Gruppen.
      </p>
      <p className="text-center text-sm">
        <Link
          href="/partner/dashboard"
          className="font-medium text-[#0F4F68] underline underline-offset-2 hover:text-[#0c3d52]"
        >
          Später entscheiden
        </Link>
      </p>
    </div>
  );
}
