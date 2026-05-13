import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PartnerTeamInviteAcceptClient } from "@/components/partner/betrieblich/PartnerTeamInviteAcceptClient";
import { PartnerInviteReauthClient } from "@/components/partner/betrieblich/PartnerInviteReauthClient";
import { getBetrieblichTeamInvitePreviewAction } from "@/lib/actions/partner-betrieblich-team";
import { getPartnerSession } from "@/lib/partner/auth";
import { partnerHasBetrieblichPflegeberatung } from "@/lib/partner/betrieblich-team-types";
import { uuidStringsEqual } from "@/lib/partner/uuid-strings-equal";

export const metadata: Metadata = {
  title: "Einladung Partnernetzwerk",
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

  const accountMismatch =
    preview.ok && session.userId ? !uuidStringsEqual(session.userId, preview.invitedPartnerId) : false;

  return (
    <div className="partner-dash-animate mx-auto w-full max-w-[min(100%,90rem)] px-4 py-8 sm:py-10">
      <header className="rounded-xl border border-[#0F4F68]/12 bg-[#F2F9FA] px-6 py-6 shadow-[0_10px_22px_rgba(15,79,104,0.14)] sm:px-8 sm:py-7">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#0F4F68]/75">Betriebliche Pflegeberatung</p>
        <h1 className="mt-1 text-2xl font-semibold leading-snug text-[#0F4F68] sm:text-3xl">Einladung ins Partnernetzwerk</h1>
        <div className="mt-2 h-1 w-full max-w-[10rem] overflow-hidden rounded-full bg-[#0F4F68]/15">
          <div
            className="h-full w-full origin-left scale-x-0 animate-partner-bar-fill rounded-full bg-gradient-to-r from-[#0F4F68] to-[#3DB8C9]"
            style={{ animationDelay: "0.15s" }}
            aria-hidden
          />
        </div>
        <p className="mt-4 max-w-2xl text-sm text-neutral-700 sm:text-base">
          Dieser Bereich gehört ausschließlich zur Zusammenarbeit beim Arbeitgeberangebot betriebliche Pflegeberatung.
        </p>
      </header>

      <section className="mt-6 rounded-2xl border border-[#0F4F68]/12 bg-white p-5 shadow-[0_12px_40px_-20px_rgba(15,79,104,0.2)] sm:p-8">
        {!preview.ok ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950" role="alert">
            {preview.message}
          </p>
        ) : (
          <>
            <p className="text-base text-neutral-800">
              <span className="font-medium text-[#0F4F68]">Teamgruppe:</span>{" "}
              <span className="font-semibold text-neutral-900">{preview.teamName}</span>
            </p>
            {accountMismatch ? (
              <PartnerInviteReauthClient token={token} />
            ) : !canAccept ? (
              <div className="mt-6 space-y-4">
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                  Für Ihr Konto ist die betriebliche Pflegeberatung nicht freigeschaltet. Bitte wenden Sie sich an die
                  Geschäftsstelle, wenn Sie teilnehmen möchten.
                </p>
                <Link
                  href="/partner/dashboard"
                  className="inline-flex text-sm font-semibold text-[#0F4F68] underline underline-offset-2 hover:text-[#0c3d52]"
                >
                  Zur Übersicht im Partnerportal
                </Link>
              </div>
            ) : (
              <PartnerTeamInviteAcceptClient token={token} teamName={preview.teamName} />
            )}
          </>
        )}
      </section>
    </div>
  );
}
