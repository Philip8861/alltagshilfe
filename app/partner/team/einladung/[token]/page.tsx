import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PartnerTeamInviteAcceptClient } from "@/components/partner/betrieblich/PartnerTeamInviteAcceptClient";
import { getBetrieblichTeamInvitePreviewAction } from "@/lib/actions/partner-betrieblich-team";
import { getPartnerSession } from "@/lib/partner/auth";
import { partnerHasBetrieblichPflegeberatung } from "@/lib/partner/betrieblich-team-types";

export const metadata: Metadata = {
  title: "Teameinladung",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ token: string }> };

export default async function PartnerTeamInvitePage({ params }: Props) {
  noStore();
  const { token } = await params;
  const preview = await getBetrieblichTeamInvitePreviewAction(token);
  const session = await getPartnerSession();

  if (!session?.userId) {
    const next = `/partner/team/einladung/${encodeURIComponent(token)}`;
    redirect(`/partner/login?next=${encodeURIComponent(next)}`);
  }

  const canAccept = session.profile ? partnerHasBetrieblichPflegeberatung(session.profile) : false;

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-10 sm:py-14">
      <div className="rounded-2xl border border-[#0F4F68]/12 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-semibold text-[#0F4F68] sm:text-2xl">Teameinladung</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Nur für die Zusammenarbeit bei der <strong>betrieblichen Pflegeberatung</strong> im Partnerportal.
        </p>

        {!preview.ok ? (
          <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950" role="alert">
            {preview.message}
          </p>
        ) : (
          <>
            <p className="mt-6 text-neutral-800">
              Einladung zum Team <span className="font-semibold text-[#0F4F68]">„{preview.teamName}“</span>
            </p>
            {!canAccept ? (
              <div className="mt-6 space-y-3">
                <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                  Für Ihr Konto ist die betriebliche Pflegeberatung nicht freigeschaltet. Bitte wenden Sie sich an die
                  Geschäftsstelle, wenn Sie teilnehmen möchten.
                </p>
                <Link href="/partner/dashboard" className="inline-block text-sm font-semibold text-[#0F4F68] underline">
                  Zur Übersicht
                </Link>
              </div>
            ) : (
              <PartnerTeamInviteAcceptClient token={token} teamName={preview.teamName} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
