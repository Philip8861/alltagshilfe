"use client";

import { useActionState, useEffect, useId, useState, useTransition } from "react";
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
import {
  addAdminDirectReferralAction,
  listAdminDirectReferralsAction,
  type AdminReferralChild,
} from "@/lib/actions/partner-admin-referral";

const initial: AdminWorkflowState = { ok: false, message: "" };

type Props = {
  open: boolean;
  onClose: () => void;
  profile: PartnerProfile;
  email: string;
  /** Optional: PartnerCode des werbenden Partners (read-only Anzeige). */
  sponsorPartnerCode?: string | null;
};

export function PartnerEditModal({ open, onClose, profile, email, sponsorPartnerCode }: Props) {
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
            <label className="text-xs font-bold uppercase text-[#0F4F68]/80">
              Angeworben von (Notiz)
            </label>
            <input
              name="recruited_by"
              defaultValue={rec}
              disabled={pending}
              className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-[#0F4F68]/80">
              Geworben durch Partner-Code
            </label>
            <input
              type="text"
              readOnly
              disabled
              value={sponsorPartnerCode ? sponsorPartnerCode : "—"}
              className="mt-1 w-full cursor-not-allowed rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-mono text-sm uppercase text-neutral-700"
              aria-readonly
            />
            <p className="mt-1 text-xs text-neutral-500">
              Werbe-Beziehung ist fest gespeichert und kann hier nicht geändert werden.
            </p>
          </div>

          <AdminReferralChildrenBlock
            sponsorPartnerId={profile.id}
            sponsorPartnerCode={profile.partner_referral_code ?? null}
          />
          <div className="border-t border-neutral-100 pt-4">
            <p className="text-xs font-bold uppercase text-[#0F4F68]/80">Bankverbindung (Auszahlung)</p>
            <div className="mt-3 grid gap-3">
              <div>
                <label className="text-xs font-semibold text-neutral-600">IBAN</label>
                <input
                  name="iban"
                  type="text"
                  defaultValue={profile.iban ?? ""}
                  disabled={pending}
                  spellCheck={false}
                  className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 font-mono text-sm"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-600">BIC</label>
                <input
                  name="bic"
                  type="text"
                  defaultValue={profile.bic ?? ""}
                  disabled={pending}
                  spellCheck={false}
                  className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 font-mono text-sm"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-600">Kontoinhaber</label>
                <input
                  name="account_holder"
                  type="text"
                  defaultValue={profile.account_holder ?? ""}
                  disabled={pending}
                  className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                  autoComplete="name"
                />
              </div>
            </div>
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

function AdminReferralChildrenBlock({
  sponsorPartnerId,
  sponsorPartnerCode,
}: {
  sponsorPartnerId: string;
  sponsorPartnerCode: string | null;
}) {
  const [items, setItems] = useState<AdminReferralChild[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState<{ tone: "ok" | "err"; msg: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const reload = () => {
    setLoading(true);
    setLoadError(null);
    listAdminDirectReferralsAction(sponsorPartnerId)
      .then((r) => {
        if (r.ok) setItems(r.items);
        else {
          setItems([]);
          setLoadError(r.message);
        }
      })
      .catch((e) => {
        setItems([]);
        setLoadError(e instanceof Error ? e.message : "Unbekannter Fehler.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sponsorPartnerId]);

  const onAdd = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setFeedback({ tone: "err", msg: "Bitte einen Partner-Code eingeben." });
      return;
    }
    setFeedback(null);
    startTransition(async () => {
      const res = await addAdminDirectReferralAction(sponsorPartnerId, trimmed);
      if (res.ok) {
        setFeedback({ tone: "ok", msg: `Werbling ${res.partnerCode} hinzugefügt.` });
        setCode("");
        reload();
      } else {
        setFeedback({ tone: "err", msg: res.message });
      }
    });
  };

  return (
    <fieldset className="rounded-lg border border-[#0F4F68]/15 bg-[#F8FAFB] p-3">
      <legend className="px-1 text-xs font-bold uppercase text-[#0F4F68]/80">
        Geworbene Partner
      </legend>

      <p className="text-xs text-neutral-700">
        Tragen Sie hier Partner ein, die durch{" "}
        <span className="font-mono font-semibold text-[#0F4F68]">
          {sponsorPartnerCode ?? "—"}
        </span>{" "}
        geworben wurden. Die Beziehung ist anschließend nicht mehr änderbar.
        {sponsorPartnerCode ? null : (
          <>
            {" "}
            <span className="font-semibold text-amber-900">
              Hinweis: Dieser Partner hat noch keinen Partner-Code — bitte zuerst speichern.
            </span>
          </>
        )}
      </p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Partner-Code des Werblings (z. B. AA1234)"
          spellCheck={false}
          autoComplete="off"
          disabled={pending || !sponsorPartnerCode}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 font-mono text-sm uppercase outline-none ring-[#0F4F68] focus:ring-2 disabled:opacity-60"
        />
        <button
          type="button"
          onClick={onAdd}
          disabled={pending || !sponsorPartnerCode || !code.trim()}
          className="min-h-10 shrink-0 rounded-lg bg-[#0F4F68] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c3d52] disabled:opacity-60"
        >
          {pending ? "Hinzufügen…" : "Werbling hinzufügen"}
        </button>
      </div>

      {feedback ? (
        <p
          className={`mt-2 rounded-md px-3 py-2 text-xs ${
            feedback.tone === "ok"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border border-amber-200 bg-amber-50 text-amber-950"
          }`}
        >
          {feedback.msg}
        </p>
      ) : null}

      <div className="mt-3">
        <p className="text-[0.65rem] font-bold uppercase tracking-wide text-[#0F4F68]/80">
          Bisher direkt geworben
        </p>
        {loading ? (
          <p className="mt-1 text-xs text-neutral-500">Lade…</p>
        ) : loadError ? (
          <p className="mt-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs text-amber-950">
            {loadError}
          </p>
        ) : items && items.length > 0 ? (
          <ul className="mt-1 divide-y divide-neutral-200 rounded-md border border-neutral-200 bg-white">
            {items.map((it) => (
              <li
                key={it.partnerId}
                className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
              >
                <span className="font-mono font-semibold uppercase text-[#0F4F68]">
                  {it.partnerCode ?? "—"}
                </span>
                <span className="min-w-0 truncate text-xs text-neutral-700">
                  {it.displayName ?? "—"}
                </span>
                <span className="shrink-0 text-[0.7rem] text-neutral-500">
                  {it.referredAt ? formatDateDe(it.referredAt) : ""}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 rounded-md border border-dashed border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-600">
            Noch keine geworbenen Partner.
          </p>
        )}
      </div>
    </fieldset>
  );
}

function formatDateDe(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "";
  }
}
