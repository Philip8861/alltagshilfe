"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useKarriereApplyOptional } from "@/components/karriere/karriereApplyContext";
import { submitKarriere } from "@/lib/actions/karriere";
import {
  KARRIERE_BEWERBUNG_PREFILL_KEY,
  parseKarriereBewerbungPrefill,
  type KarriereBewerbungPrefill,
} from "@/lib/karriere-job-map";
import { KARRIERE_FILE_INPUT_ACCEPT, KARRIERE_MAX_ANHAENGE } from "@/lib/karriere-attachments";
import { KARRIERE_STELLENANGEBOTE } from "@/lib/validations/karriere";
import { cn } from "@/lib/utils";

export type KarriereFormProps = {
  /** Kein Datei-Upload: Anhänge nur im Bewerbungs-Kurzcheck (Popup). */
  hideFileAttachments?: boolean;
};

export function KarriereForm({ hideFileAttachments = false }: KarriereFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [prefill, setPrefill] = useState<KarriereBewerbungPrefill | null>(null);
  const [formBoot, setFormBoot] = useState(0);
  const isAgbError = Boolean(error?.includes("AGB"));
  const karriereCtx = useKarriereApplyOptional();
  const bewerbungsdateienRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KARRIERE_BEWERBUNG_PREFILL_KEY);
      if (!raw) return;
      sessionStorage.removeItem(KARRIERE_BEWERBUNG_PREFILL_KEY);
      const parsed = parseKarriereBewerbungPrefill(raw);
      if (!parsed) return;
      setPrefill(parsed);
      setFormBoot((n) => n + 1);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (hideFileAttachments) return;
    const list = karriereCtx?.pendingKarriereFiles;
    const input = bewerbungsdateienRef.current;
    if (!karriereCtx || !list?.length || !input) return;
    try {
      const dt = new DataTransfer();
      list.forEach((f) => dt.items.add(f));
      input.files = dt.files;
    } catch {
      /* ältere Browser / Zuweisung nicht möglich */
    }
    karriereCtx.clearPendingKarriereFiles();
  }, [hideFileAttachments, karriereCtx, karriereCtx?.pendingKarriereFiles?.length]);

  /** Siehe ContactForm: verhindert leeres Formular nach Validierungsfehler (React 19). */
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setError(null);
    setPending(true);
    try {
      const formData = new FormData(form);
      const result = await submitKarriere(formData);
      if (!result.success && result.error) {
        setError(result.error);
        if (result.error.includes("AGB")) {
          const el = document.getElementById("karriere-agbs");
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
          window.requestAnimationFrame(() => el?.focus());
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const looksLikePayload =
        /body (?:size|limit)|payload too large|413|maximum.*exceeded|1\s*mb/i.test(msg) ||
        msg.includes("Failed to parse body");
      if (looksLikePayload) {
        setError(
          "Die Datenmenge war zu groß (z. B. viele oder große Dateien). Erlaubt sind bis zu 24 MB insgesamt und 8 MB pro Datei – bitte Dateien verkleinern oder aufteilen und erneut senden.",
        );
      } else {
        setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      key={formBoot}
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="mt-6 w-full max-w-full space-y-4 border-t border-[#0F4F68]/15 pt-6 text-left"
      noValidate
      aria-label="Bewerbungsformular Karriere"
    >
      {prefill ? (
        <div
          role="status"
          className="rounded-lg border border-[#0F4F68]/20 bg-[#F2F9FA] px-4 py-3 text-sm text-[#0F4F68]"
        >
          Ihre Angaben aus dem Kurzcheck wurden übernommen. Bitte prüfen Sie die Felder, bestätigen Sie die AGB und
          senden Sie die Bewerbung ab.
        </div>
      ) : null}
      {error && !isAgbError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="karriere-nachname" className="block text-sm font-medium text-neutral-700">
            Nachname *
          </label>
          <input
            id="karriere-nachname"
            type="text"
            name="nachname"
            required
            autoComplete="family-name"
            disabled={pending}
            defaultValue={prefill?.nachname ?? ""}
            className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
            placeholder="Ihr Nachname"
          />
        </div>
        <div>
          <label htmlFor="karriere-vorname" className="block text-sm font-medium text-neutral-700">
            Vorname *
          </label>
          <input
            id="karriere-vorname"
            type="text"
            name="vorname"
            required
            autoComplete="given-name"
            disabled={pending}
            defaultValue={prefill?.vorname ?? ""}
            className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
            placeholder="Ihr Vorname"
          />
        </div>
      </div>

      <div>
        <label htmlFor="karriere-email" className="block text-sm font-medium text-neutral-700">
          E-Mail *
        </label>
        <input
          id="karriere-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          disabled={pending}
          defaultValue={prefill?.email ?? ""}
          className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
          placeholder="ihre@email.de"
        />
      </div>

      <div>
        <label htmlFor="karriere-phone" className="block text-sm font-medium text-neutral-700">
          Telefonnummer *
        </label>
        <input
          id="karriere-phone"
          type="tel"
          name="phone"
          required
          autoComplete="tel"
          disabled={pending}
          defaultValue={prefill?.phone ?? ""}
          className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
          placeholder="z. B. 08334 / 9893330"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="karriere-plz" className="block text-sm font-medium text-neutral-700">
            Postleitzahl (PLZ) *
          </label>
          <input
            id="karriere-plz"
            type="text"
            name="plz"
            required
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            pattern="[0-9]{5}"
            title="Fünf Ziffern, ohne Leerzeichen"
            disabled={pending}
            defaultValue={prefill?.plz ?? ""}
            className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
            placeholder="z. B. 88316"
          />
        </div>
        <div>
          <label htmlFor="karriere-ort" className="block text-sm font-medium text-neutral-700">
            Ort *
          </label>
          <input
            id="karriere-ort"
            type="text"
            name="ort"
            required
            autoComplete="address-level2"
            disabled={pending}
            defaultValue={prefill?.ort ?? ""}
            className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
            placeholder="z. B. Isny im Allgäu"
          />
        </div>
      </div>

      <div>
        <label htmlFor="karriere-stellenangebot" className="block text-sm font-medium text-neutral-700">
          Für welches Stellenangebot interessieren Sie sich? *
        </label>
        <select
          id="karriere-stellenangebot"
          name="stellenangebot"
          required
          disabled={pending}
          className="mt-1 block w-full rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-neutral-900 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
          defaultValue={prefill?.stellenangebot ?? ""}
          aria-required="true"
        >
          <option value="" disabled>
            Bitte wählen …
          </option>
          {KARRIERE_STELLENANGEBOTE.map((option) => (
            <option key={option} value={option}>
              {option} (m/w/d)
            </option>
          ))}
        </select>
      </div>

      {!hideFileAttachments ? (
        <div>
          <label htmlFor="karriere-bewerbungsdateien" className="block text-sm font-medium text-neutral-700">
            Dateien anhängen (optional)
          </label>
          <input
            ref={bewerbungsdateienRef}
            id="karriere-bewerbungsdateien"
            type="file"
            name="bewerbungsdateien"
            multiple
            accept={KARRIERE_FILE_INPUT_ACCEPT}
            disabled={pending}
            className="mt-1 block w-full max-w-full text-sm text-neutral-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#0F4F68] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#0c3d52] disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-neutral-500">
            PDF, Word, gängige Bilder u. a.; bis zu {KARRIERE_MAX_ANHAENGE} Dateien, je max. 8 MB, gesamt max. 24 MB.
          </p>
        </div>
      ) : null}

      <div>
        <label htmlFor="karriere-anmerkung" className="block text-sm font-medium text-neutral-700">
          Zusatzangaben (optional)
        </label>
        <textarea
          id="karriere-anmerkung"
          name="anmerkung"
          rows={5}
          maxLength={4000}
          disabled={pending}
          defaultValue={prefill?.anmerkung ?? ""}
          className="mt-1 block w-full resize-y rounded-lg border border-[#0F4F68]/25 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68] disabled:opacity-50"
          placeholder="z. B. Kurzcheck-Ergebnis, Verfügbarkeit, Anhänge-Hinweise …"
        />
        <p className="mt-1 text-xs text-neutral-500">Nur beruflich relevante Informationen; max. 4000 Zeichen.</p>
      </div>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="karriere-website">Website</label>
        <input
          id="karriere-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          placeholder="Website"
        />
      </div>

      <div
        className={cn(
          "rounded-xl p-4 transition-colors",
          isAgbError
            ? "border-2 border-red-500 bg-red-50 shadow-[0_0_0_1px_rgba(239,68,68,0.35)]"
            : "border-2 border-transparent",
        )}
      >
        {isAgbError && (
          <p
            id="karriere-agbs-error"
            role="alert"
            className="mb-3 text-sm font-semibold text-red-800"
          >
            {error}
          </p>
        )}
        <div className="flex items-start gap-3">
          <input
            id="karriere-agbs"
            type="checkbox"
            name="agbs"
            required
            disabled={pending}
            value="on"
            onChange={() => {
              setError((prev) => (prev?.includes("AGB") ? null : prev));
            }}
            className={cn(
              "mt-1 h-4 w-4 rounded text-[#0F4F68] focus:ring-[#0F4F68] disabled:opacity-50",
              isAgbError ? "border-2 border-red-500 ring-2 ring-red-200" : "border-neutral-300",
            )}
            aria-describedby={
              isAgbError ? "karriere-agbs-hint karriere-agbs-error" : "karriere-agbs-hint"
            }
            aria-invalid={isAgbError}
            aria-required="true"
          />
          <label htmlFor="karriere-agbs" className="text-sm text-neutral-700">
            <span id="karriere-agbs-hint">
              Ich habe die{" "}
              <Link
                href="/impressum"
                className="font-medium text-[#0F4F68] underline hover:no-underline"
              >
                AGB
              </Link>{" "}
              gelesen und akzeptiert. *
            </span>
          </label>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-[#0F4F68] px-6 py-3 font-medium text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 disabled:opacity-50"
        >
          {pending ? "Wird gesendet …" : "Anfrage senden"}
        </button>
      </div>
    </form>
  );
}
