"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
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
  if (n === null) return "—";
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(n);
}

function fmtAbschlüsse(n: number | null): string {
  if (n === null) return "—";
  return String(n);
}

const VIS_LABELS: Record<TeamProvisionVisibility, string> = {
  all: "Alle Mitglieder sehen alle Provisionen und Abschlüsse im Team.",
  owner_sees_all: "Mitglieder sehen nur die eigenen Zahlen; die Gründer:in sieht alle.",
  self_only: "Jede Person sieht nur die eigenen Zahlen (kein gegenseitiger Vergleich).",
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

  const run = (fn: () => Promise<{ ok: true } | { ok: false; message: string }>) => {
    setFeedback(null);
    startTransition(async () => {
      const r = await fn();
      if (r.ok) {
        router.refresh();
        return;
      }
      setFeedback(r.message);
    });
  };

  return (
    <div className="mx-auto w-full max-w-[min(100%,52rem)] space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-[#0F4F68] sm:text-3xl">Teams — betriebliche Pflegeberatung</h1>
        <p className="text-sm text-neutral-700 sm:text-base">
          Gründen Sie ein Team, laden Sie Kolleg:innen per <strong>Partner-Code</strong> ein, und steuern Sie, wer
          Team-Provisionen und Abschlüsse einsehen darf. Es gilt nur für die betriebliche Pflegeberatung.
        </p>
        <div className="rounded-xl border border-[#0F4F68]/12 bg-[#F2F9FA]/80 px-4 py-3 text-sm text-neutral-800">
          <p>
            <strong>Regeln:</strong> Sie können in maximal {PARTNER_TEAM_MAX_MEMBERSHIPS} Teams sein. Zwei Partner
            dürfen nicht in <em>zwei verschiedenen</em> Teams gemeinsam sein — für eine neue Team-Kombination brauchen
            Sie andere Partner:innen.
          </p>
          <p className="mt-2 text-neutral-700">
            Aktuell sind Sie in <strong>{myMembershipCount}</strong> Team{myMembershipCount === 1 ? "" : "s"}.
          </p>
        </div>
      </header>

      {feedback ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950" role="alert">
          {feedback}
        </p>
      ) : null}

      <section className="rounded-2xl border border-[#0F4F68]/12 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-[#0F4F68]">Neues Team gründen</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Sie werden automatisch Gründer:in. Anschließend können Sie per Partner-Code einladen.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <label htmlFor="new-team-name" className="block text-sm font-medium text-neutral-800">
              Teamname
            </label>
            <input
              id="new-team-name"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              maxLength={100}
              disabled={pending || myMembershipCount >= PARTNER_TEAM_MAX_MEMBERSHIPS}
              placeholder="z. B. Region Süd"
              className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
            />
          </div>
          <button
            type="button"
            disabled={pending || myMembershipCount >= PARTNER_TEAM_MAX_MEMBERSHIPS}
            onClick={() => run(() => createBetrieblichTeamAction(newTeamName))}
            className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-xl bg-[#0F4F68] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#0c3d52] disabled:opacity-50"
          >
            Team anlegen
          </button>
        </div>
        {myMembershipCount >= PARTNER_TEAM_MAX_MEMBERSHIPS ? (
          <p className="mt-3 text-sm text-amber-900">Sie haben die Höchstzahl von drei Teams erreicht.</p>
        ) : null}
      </section>

      {initialTeams.length === 0 ? (
        <p className="text-sm text-neutral-600">Sie sind noch in keinem Team.</p>
      ) : (
        <div className="space-y-8">
          {initialTeams.map((team) => (
            <TeamCard key={team.id} team={team} viewerPartnerId={viewerPartnerId} pending={pending} run={run} />
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
}: {
  team: BetrieblichTeamSummary;
  viewerPartnerId: string;
  pending: boolean;
  run: (fn: () => Promise<{ ok: true } | { ok: false; message: string }>) => void;
}) {
  const [rename, setRename] = useState(team.name);
  const [inviteCode, setInviteCode] = useState("");
  const isOwner = team.my_role === "owner";

  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_8px_30px_-14px_rgba(15,79,104,0.18)]">
      <header className="border-b border-[#0F4F68]/10 bg-gradient-to-r from-[#F2F9FA] to-white px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-wider text-[#0F4F68]/80">Team</p>
            <h3 className="text-xl font-semibold text-[#0F4F68]">{team.name}</h3>
          </div>
          <span
            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
              isOwner ? "bg-[#0F4F68]/10 text-[#0F4F68]" : "bg-neutral-100 text-neutral-700"
            }`}
          >
            {isOwner ? "Gründer:in" : "Mitglied"}
          </span>
        </div>
        {team.pending_invites_count > 0 ? (
          <p className="mt-2 text-sm text-neutral-600">
            {team.pending_invites_count} ausstehende Einladung{team.pending_invites_count === 1 ? "" : "en"}
          </p>
        ) : null}
      </header>

      <div className="space-y-6 px-5 py-5 sm:px-6">
        {isOwner ? (
          <>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900">Teamname ändern</h4>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  value={rename}
                  onChange={(e) => setRename(e.target.value)}
                  disabled={pending}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm disabled:opacity-60"
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
                  className="rounded-lg bg-[#0F4F68]/90 px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c3d52] disabled:opacity-50"
                >
                  Speichern
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-neutral-900">Sichtbarkeit der Team-Zahlen</h4>
              <p className="mt-1 text-xs text-neutral-600">Monatsprovisionen und erfolgreiche Abschlüsse (nur betrieblich).</p>
              <select
                className="mt-2 w-full max-w-xl rounded-lg border border-neutral-200 px-3 py-2 text-sm"
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
          <h4 className="text-sm font-semibold text-neutral-900">Mitglied per Partner-Code einladen</h4>
          <p className="mt-1 text-xs text-neutral-600">
            Der eingeladene Partner erhält eine E-Mail mit dem Button „Jetzt beitreten“. Nur mit freigeschalteter
            betrieblicher Pflegeberatung.
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <input
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              disabled={pending}
              placeholder="Partner-Code"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm uppercase disabled:opacity-60"
            />
            <button
              type="button"
              disabled={pending || !inviteCode.trim()}
              onClick={() =>
                run(async () => {
                  const r = await inviteBetrieblichTeamByCodeAction(team.id, inviteCode);
                  if (r.ok) setInviteCode("");
                  return r;
                })
              }
              className="rounded-lg border border-[#F78F2E] bg-[#F78F2E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e07f25] disabled:opacity-50"
            >
              Einladung senden
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-neutral-900">Mitglieder &amp; Kennzahlen</h4>
          <div className="mt-2 overflow-x-auto rounded-lg border border-neutral-200">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[#F2F9FA] text-[0.65rem] font-bold uppercase text-[#0F4F68]">
                <tr>
                  <th className="px-3 py-2">Person</th>
                  <th className="px-3 py-2">Code</th>
                  <th className="px-3 py-2">Rolle</th>
                  <th className="px-3 py-2 text-right">Monatsprovision (betrieblich)</th>
                  <th className="px-3 py-2 text-right">Abschlüsse</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {team.member_stats.map((row) => (
                  <tr key={row.partner_id} className="bg-white">
                    <td className="px-3 py-2.5 font-medium text-neutral-900">
                      {row.label}
                      {row.partner_id === viewerPartnerId ? (
                        <span className="ml-2 text-xs font-normal text-neutral-500">(Sie)</span>
                      ) : null}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-xs text-neutral-700">{row.code ?? "—"}</td>
                    <td className="px-3 py-2.5 text-neutral-700">
                      {team.members.find((m) => m.partner_id === row.partner_id)?.role === "owner" ? "Gründer:in" : "Mitglied"}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{fmtEur(row.monatlich_eur)}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">{fmtAbschlüsse(row.abschluesse)}</td>
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
                if (typeof window !== "undefined" && !window.confirm("Team wirklich auflösen? Alle Mitglieder verlieren die Zuordnung.")) {
                  return;
                }
                run(() => dissolveBetrieblichTeamAction(team.id));
              }}
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-900 hover:bg-red-100 disabled:opacity-50"
            >
              Team auflösen
            </button>
          ) : null}
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              const msg = isOwner
                ? "Sie sind die einzige Person im Team — das Team wird damit aufgelöst. Fortfahren?"
                : "Team wirklich verlassen?";
              if (typeof window !== "undefined" && !window.confirm(msg)) return;
              run(() => leaveBetrieblichTeamAction(team.id));
            }}
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 disabled:opacity-50"
          >
            {isOwner && team.members.length === 1 ? "Team schließen" : "Team verlassen"}
          </button>
        </div>
      </div>
    </article>
  );
}
