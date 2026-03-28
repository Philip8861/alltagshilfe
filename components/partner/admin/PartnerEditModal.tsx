"use client";

import { useActionState, useEffect, useId } from "react";
import { useRouter } from "next/navigation";
import type { PartnerProfile } from "@/lib/partner/types";
import {
  PARTNER_RESPONSIBILITY_SLUGS,
  PARTNER_RESPONSIBILITY_LABELS,
} from "@/lib/partner/responsibility-areas";
import {
  updatePartnerProfileAdminAction,
  type AdminWorkflowState,
} from "@/lib/actions/partner-admin-workflow";

const initial: AdminWorkflowState = { ok: false, message: "" };

type Props = {
  open: boolean;
  onClose: () => void;
  profile: PartnerProfile;
  email: string;
};

export function PartnerEditModal({ open, onClose, profile, email }: Props) {
  const formId = useId();
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updatePartnerProfileAdminAction, initial);

  useEffect(() => {
    if (state.ok) {
      router.refresh();
      onClose();
    }
  }, [state.ok, onClose, router]);

  if (!open) return null;

  const org = profile.organization_name ?? "";
  const rec = profile.recruited_by ?? "";
  const disp = profile.display_name ?? "";
  const areas = new Set(profile.responsibility_areas ?? []);

  return (
    <div className="fixed inset-0 z-[240] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#0F4F68]/25 backdrop-blur-sm"
        aria-label="Schließen"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${formId}-title`}
        className="relative z-10 max-h-[min(90vh,800px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 id={`${formId}-title`} className="text-lg font-bold text-[#0F4F68]">
            Partner bearbeiten
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-2xl leading-none text-neutral-500 hover:bg-neutral-100"
            aria-label="Schließen"
          >
            ×
          </button>
        </div>
        <p className="mt-2 text-sm text-neutral-600">
          Login-E-Mail: <span className="font-mono font-medium text-neutral-900">{email}</span> (nur in Supabase
          Auth änderbar)
        </p>

        {!state.ok && state.message ? (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
            {state.message}
          </p>
        ) : null}
        {state.ok ? (
          <p className="mt-3 text-sm font-medium text-emerald-800">{state.message}</p>
        ) : null}

        <form action={formAction} className="mt-5 space-y-4">
          <input type="hidden" name="user_id" value={profile.id} />
          <fieldset className="space-y-2">
            <legend className="text-xs font-bold uppercase text-[#0F4F68]/80">Anrede</legend>
            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="salutation"
                  value="herr"
                  defaultChecked={profile.salutation === "herr"}
                  disabled={pending}
                  className="h-4 w-4"
                />
                Herr
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="salutation"
                  value="frau"
                  defaultChecked={profile.salutation === "frau"}
                  disabled={pending}
                  className="h-4 w-4"
                />
                Frau
              </label>
            </div>
          </fieldset>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase text-[#0F4F68]/80">Vorname</label>
              <input
                name="first_name"
                required
                defaultValue={profile.first_name ?? ""}
                disabled={pending}
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-[#0F4F68]/80">Nachname</label>
              <input
                name="last_name"
                required
                defaultValue={profile.last_name ?? ""}
                disabled={pending}
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-[#0F4F68]/80">Telefon</label>
            <input
              name="phone"
              type="tel"
              required
              defaultValue={profile.phone ?? ""}
              disabled={pending}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-[#0F4F68]/80">Anzeigename (optional)</label>
            <input
              name="display_name"
              defaultValue={disp}
              disabled={pending}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-[#0F4F68]/80">Firma</label>
            <input
              name="organization_name"
              defaultValue={org}
              disabled={pending}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-[#0F4F68]/80">Angeworben von</label>
            <input
              name="recruited_by"
              defaultValue={rec}
              disabled={pending}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <fieldset>
            <legend className="text-xs font-bold uppercase text-[#0F4F68]/80">Zuständigkeit</legend>
            <ul className="mt-2 max-h-40 space-y-2 overflow-y-auto">
              {PARTNER_RESPONSIBILITY_SLUGS.map((slug) => (
                <li key={slug}>
                  <label className="flex cursor-pointer items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="responsibility_areas"
                      value={slug}
                      defaultChecked={areas.has(slug)}
                      disabled={pending}
                      className="mt-0.5 h-4 w-4 rounded border-neutral-300"
                    />
                    <span>{PARTNER_RESPONSIBILITY_LABELS[slug]}</span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
          <fieldset>
            <legend className="text-xs font-bold uppercase text-[#0F4F68]/80">Rolle (Datenbank)</legend>
            <div className="mt-2 flex gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="partner"
                  defaultChecked={profile.role !== "admin"}
                  disabled={pending}
                  className="h-4 w-4"
                />
                Partner
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  defaultChecked={profile.role === "admin"}
                  disabled={pending}
                  className="h-4 w-4"
                />
                Admin
              </label>
            </div>
          </fieldset>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={pending}
              className="min-h-11 rounded-xl bg-[#0F4F68] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0c3d52] disabled:opacity-60"
            >
              {pending ? "Speichern…" : "Speichern"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 rounded-xl border border-neutral-300 px-5 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              Abbrechen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
