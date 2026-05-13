"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { PartnerExpandableStatSection } from "@/components/partner/PartnerExpandableStatSection";
import type { BetrieblichTeamSummary, TeamProvisionVisibility } from "@/lib/partner/betrieblich-team-types";
import { PARTNER_TEAM_MAX_MEMBERSHIPS } from "@/lib/partner/betrieblich-team-types";
import {
  createBetrieblichTeamAction,
  dissolveBetrieblichTeamAction,
  inviteBetrieblichTeamByCodeAction,
  leaveBetrieblichTeamAction,
  renameBetrieblichTeamAction,
  updateBetrieblichTeamProvisionVisibilityAction,
} from "@/lib/actions/partner-betrieblich-team";

function fmtEur(n: number | null): string {
  if (n === null) return "verdeckt";
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);
}

function fmtAbschlüsse(n: number | null): string {
  if (n === null) return "verdeckt";
  return String(n);
}

const VIS_LABELS: Record<TeamProvisionVisibility, string> = {
  all: "Alle im Team sehen die Provisionen und Abschlüsse aller Mitglieder.",
  owner_sees_all: "Mitglieder sehen nur die eigenen Kennzahlen, die Gründerin bzw. der Gründer sieht alle.",
  self_only: "Jede Person sieht nur die eigenen Kennzahlen, ohne Vergleich im Team.",
};

type Props = {
  initialTeams: BetrieblichTeamSummary[];
  viewerPartnerId: string;
};

export function BetrieblichTeamPageClient({ initialTeams, viewerPartnerId }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [newTeamName, setNewTeamName] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const myMembershipCount = useMemo(() => {
    return initialTeams.filter((t) => t.members.some((m) => m.partner_id === viewerPartnerId)).length;
  }, [initialTeams, viewerPartnerId]);

  const run = (
    fn: () => Promise<{ ok: true } | { ok: false; message: string }>,
    options?: { onSuccess?: () => void },
  ) => {
    setFeedback(null);
    startTransition(async () => {
      const r = await fn();
      if (r.ok) {
        options?.onSuccess?.();
        router.refresh();
        return;
      }
      setFeedback(r.message);
    });
  };

  const teamWord = myMembershipCount === 1 ? "Team" : "Teams";

  return (
    <div className="partner-dash-animate mx-auto w-full max-w-[min(100%,90rem)] space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-4 rounded-xl border border-[#0F4F68]/12 bg-[#F2F9FA] px-6 py-6 shadow-[0_10px_22px_rgba(15,79,104,0.2),0_4px_12px_rgba(15,79,104,0.12)] sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-7">
        <div className="min-w-0">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[#0F4F68]/75">
            Betriebliche Pflegeberatung
          </p>
          <h1 className="mt-1 text-2xl font-semibold leading-snug text-[#0F4F68] sm:text-3xl">Ihr Partnernetzwerk</h1>
          <div className="mt-2 h-1 w-full max-w-[10rem] overflow-hidden rounded-full bg-[#0F4F68]/15">
            <div
              className="h-full w-full origin-left scale-x-0 animate-partner-bar-fill rounded-full bg-gradient-to-r from-[#0F4F68] to-[#3DB8C9]"
              style={{ animationDelay: "0.15s" }}
              aria-hidden
            />
          </div>
          <p className="mt-4 max-w-2xl text-sm text-neutral-700 sm:text-base">
            Hier gründen Sie Arbeitsgruppen, laden Kolleginnen und Kollegen mit dem persönlichen Partnercode ein und
            steuern, wer welche Teamkennzahlen lesen darf. Alles bezieht sich ausschließlich auf das Arbeitgeberangebot{" "}
            <span className="font-medium text-[#0F4F68]">betriebliche Pflegeberatung</span>, nicht auf andere
            Kooperationsfelder.
          </p>
        </div>
      </header>

      <section className="rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50/90 via-white to-white p-5 shadow-[0_10px_28px_-14px_rgba(14,165,233,0.35)] sm:p-6">
        <h2 className="text-[0.65rem] font-bold uppercase tracking-wide text-[#0F4F68]/80">Kurz über die Spielregeln</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-800">
          Pro Person sind höchstens drei Team-Mitgliedschaften möglich. Dieselben zwei Partner dürfen nicht gleichzeitig in
          zwei verschiedenen Teams zusammenarbeiten. Für neue Kombinationen brauchen Sie andere Partnerinnen und Partner
          im Team.
        </p>
        <p className="mt-3 text-sm font-medium text-[#0F4F68]">
          Sie sind aktuell in {myMembershipCount} {teamWord} aktiv.
        </p>
      </section>

      {feedback ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950" role="alert">
          {feedback}
        </p>
      ) : null}

      <PartnerExpandableStatSection
        title="Neues Team anlegen"
        subtitle="Sie werden Gründerin bzw. Gründer und können danach Einladungen verschicken."
        defaultOpen={initialTeams.length === 0}
        badge={myMembershipCount >= PARTNER_TEAM_MAX_MEMBERSHIPS ? "Limit" : undefined}
      >
        <div className="border-t border-[#0F4F68]/10 px-4 py-5 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <label htmlFor="new-team-name" className="block text-sm font-medium text-neutral-800">
                Name der Gruppe
              </label>
              <input
                id="new-team-name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                maxLength={100}
                disabled={pending || myMembershipCount >= PARTNER_TEAM_MAX_MEMBERSHIPS}
                placeholder="zum Beispiel Region Süd oder Ihre Ortsgruppe"
                className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
              />
            </div>
            <button
              type="button"
              disabled={pending || myMembershipCount >= PARTNER_TEAM_MAX_MEMBERSHIPS}
              onClick={() => run(() => createBetrieblichTeamAction(newTeamName))}
              className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-xl bg-[#0F4F68] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#0c3d52] disabled:opacity-50"
            >
              Gruppe anlegen
            </button>
          </div>
          {myMembershipCount >= PARTNER_TEAM_MAX_MEMBERSHIPS ? (
            <p className="mt-4 text-sm text-amber-900">
              Sie haben die Höchstzahl von drei Teams erreicht. Zum Anlegen einer weiteren Gruppe müssen Sie zuerst ein
              anderes Team verlassen oder auflösen.
            </p>
          ) : null}
        </div>
      </PartnerExpandableStatSection>

      {initialTeams.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#0F4F68]/25 bg-[#FAFBFC] px-6 py-10 text-center">
          <p className="text-sm font-medium text-[#0F4F68]">Noch keine Teamgruppe</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-neutral-600">
            Legen Sie oben eine Gruppe an oder warten Sie auf eine E-Mail-Einladung. Danach erscheint Ihre Gruppe
            mit allen Einstellungen und Kennzahlen an dieser Stelle.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {initialTeams.map((team, idx) => (
            <TeamCard
              key={team.id}
              team={team}
              viewerPartnerId={viewerPartnerId}
              pending={pending}
              run={run}
              defaultOpen={idx === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TeamCard({
  team,
  viewerPartnerId,
  pending,
  run,
  defaultOpen,
}: {
  team: BetrieblichTeamSummary;
  viewerPartnerId: string;
  pending: boolean;
  run: (
    fn: () => Promise<{ ok: true } | { ok: false; message: string }>,
    options?: { onSuccess?: () => void },
  ) => void;
  defaultOpen: boolean;
}) {
  const [rename, setRename] = useState(team.name);
  const [inviteCode, setInviteCode] = useState("");
  const [inviteSentModalOpen, setInviteSentModalOpen] = useState(false);
  const isOwner = team.my_role === "owner";

  const subtitle = isOwner
    ? "Sie leiten diese Gruppe und verwalten Name, Sichtbarkeit und Einladungen."
    : "Sie sind eingeladenes Mitglied und können weitere Kolleginnen und Kollegen per Partnercode einladen.";

  const badgeText =
    team.pending_invites_count > 0
      ? `${team.pending_invites_count} offene Einladung${team.pending_invites_count === 1 ? "" : "en"}`
      : `${team.members.length} ${team.members.length === 1 ? "Person" : "Personen"}`;

  return (
    <PartnerExpandableStatSection
      title={team.name}
      subtitle={subtitle}
      badge={badgeText}
      defaultOpen={defaultOpen}
      className="border-sky-200/60 shadow-[0_8px_30px_-12px_rgba(14,165,233,0.25)]"
    >
      <div className="space-y-6 border-t border-[#0F4F68]/10 px-4 py-5 sm:px-5">
        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              isOwner ? "bg-[#0F4F68]/10 text-[#0F4F68]" : "bg-neutral-100 text-neutral-700"
            }`}
          >
            {isOwner ? "Gründerin oder Gründer" : "Mitglied"}
          </span>
        </div>

        {isOwner ? (
          <>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900">Namen der Gruppe ändern</h4>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  value={rename}
                  onChange={(e) => setRename(e.target.value)}
                  disabled={pending}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm disabled:opacity-60"
                  maxLength={100}
                />
                <button
                  type="button"
                  disabled={pending || rename.trim() === team.name}
                  onClick={() =>
                    run(async () => {
                      const r = await renameBetrieblichTeamAction(team.id, rename);
                      return r;
                    })
                  }
                  className="rounded-xl bg-[#0F4F68] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0c3d52] disabled:opacity-50"
                >
                  Speichern
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-neutral-900">Sichtbarkeit im Team</h4>
              <p className="mt-1 text-xs text-neutral-600">
                Monatliche Provisionen und erfolgreiche Vertragsabschlüsse bei betrieblicher Pflegeberatung.
              </p>
              <select
                className="mt-2 w-full max-w-xl rounded-xl border border-neutral-200 px-3 py-2.5 text-sm"
                disabled={pending}
                value={team.settings.provision_visibility}
                onChange={(e) => {
                  const v = e.target.value as TeamProvisionVisibility;
                  run(() => updateBetrieblichTeamProvisionVisibilityAction(team.id, v));
                }}
              >
                <option value="all">{VIS_LABELS.all}</option>
                <option value="owner_sees_all">{VIS_LABELS.owner_sees_all}</option>
                <option value="self_only">{VIS_LABELS.self_only}</option>
              </select>
            </div>
          </>
        ) : null}

        <div>
          <h4 className="text-sm font-semibold text-neutral-900">Kollegin oder Kollege einladen</h4>
          <p className="mt-1 text-xs text-neutral-600">
            Partnercode eingeben. Der andere Partner erhält eine E-Mail mit einem sicheren Link zur Beitrittserklärung.
            Voraussetzung ist die freigeschaltete betriebliche Pflegeberatung im jeweiligen Profil.
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              disabled={pending}
              placeholder="Partnercode aus dem Profil"
              className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm uppercase disabled:opacity-60"
            />
            <button
              type="button"
              disabled={pending || !inviteCode.trim()}
              onClick={() =>
                run(
                  async () => {
                    const r = await inviteBetrieblichTeamByCodeAction(team.id, inviteCode);
                    if (r.ok) setInviteCode("");
                    return r;
                  },
                  { onSuccess: () => setInviteSentModalOpen(true) },
                )
              }
              className="rounded-xl bg-gradient-to-b from-[#F78F2E] to-[#e07820] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-[#e07f25] hover:to-[#c96a1a] disabled:opacity-50"
            >
              Einladung senden
            </button>
          </div>
        </div>

        <InviteEmailSentModal open={inviteSentModalOpen} onClose={() => setInviteSentModalOpen(false)} />

        <div>
          <h4 className="text-sm font-semibold text-neutral-900">Mitglieder und Kennzahlen</h4>
          <div className="mt-2 overflow-x-auto rounded-xl border border-neutral-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#F2F9FA] text-[0.65rem] font-bold uppercase text-[#0F4F68]">
                <tr>
                  <th className="px-3 py-2.5">Person</th>
                  <th className="px-3 py-2.5">Partnercode</th>
                  <th className="px-3 py-2.5">Rolle</th>
                  <th className="px-3 py-2.5 text-right">Monatliche Provision</th>
                  <th className="px-3 py-2.5 text-right">Abschlüsse</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {team.member_stats.map((row) => (
                  <tr key={row.partner_id} className="bg-white">
                    <td className="px-3 py-3 font-medium text-neutral-900">
                      <span className="inline-flex flex-wrap items-center gap-2">
                        {row.label}
                        {row.partner_id === viewerPartnerId ? (
                          <span className="rounded-md bg-[#0F4F68]/8 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-[#0F4F68]">
                            Ihr Eintrag
                          </span>
                        ) : null}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-neutral-700">{row.code ?? "kein Code"}</td>
                    <td className="px-3 py-3 text-neutral-700">
                      {team.members.find((m) => m.partner_id === row.partner_id)?.role === "owner"
                        ? "Gründerin oder Gründer"
                        : "Mitglied"}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums text-neutral-800">{fmtEur(row.monatlich_eur)}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-neutral-800">{fmtAbschlüsse(row.abschluesse)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-neutral-100 pt-4">
          {isOwner ? (
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                if (
                  typeof window !== "undefined" &&
                  !window.confirm(
                    "Die Gruppe wirklich auflösen? Alle Mitglieder verlieren die Zugehörigkeit zu dieser Teamgruppe.",
                  )
                ) {
                  return;
                }
                run(() => dissolveBetrieblichTeamAction(team.id));
              }}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-900 hover:bg-red-100 disabled:opacity-50"
            >
              Gruppe auflösen
            </button>
          ) : null}
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              const msg = isOwner
                ? "Sie sind die einzige Person in dieser Gruppe. Wenn Sie fortfahren, wird die Gruppe geschlossen. Fortfahren?"
                : "Möchten Sie diese Teamgruppe wirklich verlassen?";
              if (typeof window !== "undefined" && !window.confirm(msg)) return;
              run(() => leaveBetrieblichTeamAction(team.id));
            }}
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 disabled:opacity-50"
          >
            {isOwner && team.members.length === 1 ? "Gruppe schließen" : "Gruppe verlassen"}
          </button>
        </div>
      </div>
    </PartnerExpandableStatSection>
  );
}

function InviteEmailSentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[220] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 z-0 bg-neutral-900/45 backdrop-blur-[3px]"
        aria-label="Dialog schließen"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-sent-title"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-t-2xl border border-neutral-200/90 bg-white shadow-[0_-12px_48px_rgba(15,79,104,0.14),0_25px_50px_-12px_rgba(0,0,0,0.2)] sm:rounded-2xl sm:shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="h-1 w-full shrink-0 bg-gradient-to-r from-[#0F4F68] via-[#3DB8C9] to-[#0F4F68]/40"
          aria-hidden
        />
        <div className="px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
          <h2 id="invite-sent-title" className="text-xl font-semibold tracking-tight text-[#0F4F68]">
            Vielen Dank!
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-700">
            Die Einladung wurde per E-Mail versendet.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 flex w-full min-h-12 items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0c3d52] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}
