"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  acceptBetrieblichTeamInviteAction,
  type BetrieblichTeamActionResult,
} from "@/lib/actions/partner-betrieblich-team";
import Link from "next/link";

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
    <div className="mt-6 space-y-5">
      {message ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-950" role="alert">
          {message}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onAccept}
        disabled={pending}
        className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#F78F2E] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#e07f25] disabled:opacity-60"
      >
        {pending ? "Wird verarbeitet…" : "Jetzt beitreten"}
      </button>
      <p className="text-center text-xs text-neutral-500">
        Mit dem Beitritt zu „{teamName}“ bestätigen Sie, die Teamregeln (max. drei Teams; kein zweites gemeinsames Team
        mit demselben Partner) zur Kenntnis genommen zu haben.
      </p>
      <p className="text-center text-sm">
        <Link href="/partner/dashboard" className="font-medium text-[#0F4F68] underline">
          Später entscheiden
        </Link>
      </p>
    </div>
  );
}
