"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  adminDeletePartnerTeamAction,
  adminRemovePartnerTeamMemberAction,
  adminRenamePartnerTeamAction,
  adminRevokePartnerTeamInvitationAction,
} from "@/lib/actions/partner-teams-admin";
import type { AdminTeamOverview } from "@/lib/partner/admin-teams-overview";
import type { TeamProvisionVisibility } from "@/lib/partner/betrieblich-team-types";

const VIS_LABELS: Record<TeamProvisionVisibility, string> = {
  all: "Alle sehen alle Kennzahlen.",
  owner_sees_all: "Nur Gründer:in sieht alle.",
  self_only: "Nur eigene Kennzahlen.",
};

type Props = {
  teams: AdminTeamOverview[];
};

export function AdminTeamsPanel({ teams }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState<Record<string, string>>({});

  const run = (fn: () => Promise<{ ok: true } | { ok: false; message: string }>) => {
    setFeedback(null);
    startTransition(async () => {
      const r = await fn();
      if (!r.ok) {
        setFeedback(r.message);
        return;
      }
      router.refresh();
    });
  };

  if (teams.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50/80 px-4 py-8 text-center text-sm text-neutral-600">
        Noch keine Teamgruppen angelegt.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {feedback ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950" role="alert">
          {feedback}
        </p>
      ) : null}

      {teams.map((team) => (
        <div
          key={team.id}
          className="overflow-hidden rounded-2xl border border-sky-200/80 bg-gradient-to-br from-sky-50/50 via-white to-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-[#0F4F68]">{team.name}</h3>
              <p className="mt-1 text-xs text-neutral-600">
                ID: <span className="font-mono">{team.id}</span>
              </p>
              <p className="mt-2 text-xs text-neutral-700">
                <span className="font-semibold text-[#0F4F68]">Sichtbarkeit:</span> {VIS_LABELS[team.provision_visibility]}
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Angelegt: {new Date(team.created_at).toLocaleString("de-DE")} · Aktualisiert:{" "}
                {new Date(team.updated_at).toLocaleString("de-DE")}
              </p>
            </div>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                if (typeof window !== "undefined" && !window.confirm(`Team „${team.name}“ inkl. Mitglieder löschen?`)) return;
                run(() => adminDeletePartnerTeamAction(team.id));
              }}
              className="shrink-0 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-900 hover:bg-red-100 disabled:opacity-50"
            >
              Team löschen
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <label className="text-xs font-medium text-neutral-700" htmlFor={`admin-team-rename-${team.id}`}>
                Namen bearbeiten
              </label>
              <input
                id={`admin-team-rename-${team.id}`}
                value={renameDraft[team.id] ?? team.name}
                onChange={(e) => setRenameDraft((d) => ({ ...d, [team.id]: e.target.value }))}
                disabled={pending}
                maxLength={100}
                className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm disabled:opacity-60"
              />
            </div>
            <button
              type="button"
              disabled={pending || (renameDraft[team.id] ?? team.name).trim() === team.name}
              onClick={() =>
                run(() => adminRenamePartnerTeamAction(team.id, renameDraft[team.id] ?? team.name))
              }
              className="shrink-0 rounded-xl bg-[#0F4F68] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0c3d52] disabled:opacity-50"
            >
              Speichern
            </button>
          </div>

          <div className="mt-5">
            <h4 className="text-sm font-semibold text-neutral-900">Mitglieder ({team.members.length})</h4>
            <div className="mt-2 overflow-x-auto rounded-xl border border-neutral-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#F2F9FA] text-[0.65rem] font-bold uppercase text-[#0F4F68]">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">E-Mail</th>
                    <th className="px-3 py-2">Code</th>
                    <th className="px-3 py-2">Rolle</th>
                    <th className="px-3 py-2 whitespace-nowrap">Aktion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {team.members.map((m) => (
                    <tr key={m.partner_id} className="bg-white">
                      <td className="px-3 py-2.5 font-medium text-neutral-900">{m.display_name}</td>
                      <td className="max-w-[10rem] break-all px-3 py-2.5 text-neutral-700">{m.email}</td>
                      <td className="px-3 py-2.5 font-mono text-xs text-neutral-700">
                        {m.partner_referral_code ?? "—"}
                      </td>
                      <td className="px-3 py-2.5 text-neutral-700">
                        {m.role === "owner" ? "Gründer:in" : "Mitglied"}
                      </td>
                      <td className="px-3 py-2.5">
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => {
                            if (
                              typeof window !== "undefined" &&
                              !window.confirm(`${m.display_name} aus diesem Team entfernen?`)
                            ) {
                              return;
                            }
                            run(() => adminRemovePartnerTeamMemberAction(team.id, m.partner_id));
                          }}
                          className="rounded-lg border border-neutral-300 bg-white px-2 py-1 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 disabled:opacity-50"
                        >
                          Entfernen
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {team.pending_invites.length > 0 ? (
            <div className="mt-5">
              <h4 className="text-sm font-semibold text-neutral-900">
                Offene Einladungen ({team.pending_invites.length})
              </h4>
              <ul className="mt-2 space-y-2">
                {team.pending_invites.map((inv) => (
                  <li
                    key={inv.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-100 bg-amber-50/60 px-3 py-2 text-sm"
                  >
                    <span className="text-neutral-800">
                      {inv.email} · bis {new Date(inv.expires_at).toLocaleString("de-DE")}
                    </span>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => {
                        if (typeof window !== "undefined" && !window.confirm("Einladung widerrufen?")) return;
                        run(() => adminRevokePartnerTeamInvitationAction(inv.id));
                      }}
                      className="rounded-lg border border-amber-300 bg-white px-2 py-1 text-xs font-semibold text-amber-950 hover:bg-amber-100 disabled:opacity-50"
                    >
                      Widerrufen
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
