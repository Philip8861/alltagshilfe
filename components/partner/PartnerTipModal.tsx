"use client";

import { useCallback, useId, useState } from "react";
import {
  PARTNER_RESPONSIBILITY_LABELS,
  PARTNER_RESPONSIBILITY_SLUGS,
  type PartnerResponsibilitySlug,
} from "@/lib/partner/responsibility-areas";
import { serviceAccentClass, serviceBadgeClass } from "@/lib/partner/service-slug-styles";
import { submitPartnerTipAction } from "@/lib/actions/partner-tips";
import type { PartnerTipSubmissionInput } from "@/lib/validations/partner-tips";

type Props = {
  open: boolean;
  onClose: () => void;
  allowedSlugs: PartnerResponsibilitySlug[];
};

const emptyBetrieb = {
  ansprechpartner: "",
  firmenposition: "",
  email: "",
  telefon: "",
  firmenname: "",
  firmensitz: "",
  notizen: "",
};

const emptyStandard = {
  vorname: "",
  nachname: "",
  telefon: "",
  email: "",
  wohnort: "",
  notiz: "",
};

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-neutral-400 transition group-hover:text-[#0F4F68]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PartnerTipModal({ open, onClose, allowedSlugs }: Props) {
  const uid = useId();
  const choices =
    allowedSlugs.length > 0 ? allowedSlugs : [...PARTNER_RESPONSIBILITY_SLUGS];
  const [step, setStep] = useState<1 | 2>(1);
  const [slug, setSlug] = useState<PartnerResponsibilitySlug | null>(null);
  const [betrieb, setBetrieb] = useState(emptyBetrieb);
  const [standard, setStandard] = useState(emptyStandard);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const reset = useCallback(() => {
    setStep(1);
    setSlug(null);
    setBetrieb(emptyBetrieb);
    setStandard(emptyStandard);
    setMessage(null);
    setPending(false);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  if (!open) return null;

  const submit = async () => {
    if (!slug) return;
    setPending(true);
    setMessage(null);
    let body: PartnerTipSubmissionInput;
    const stdPayload = {
      vorname: standard.vorname,
      nachname: standard.nachname,
      telefon: standard.telefon,
      email: standard.email,
      wohnort: standard.wohnort,
      notiz: standard.notiz || undefined,
    };
    if (slug === "betriebliche_pflegeberatung") {
      body = {
        service_slug: "betriebliche_pflegeberatung",
        payload: {
          ansprechpartner: betrieb.ansprechpartner,
          firmenposition: betrieb.firmenposition,
          email: betrieb.email,
          telefon: betrieb.telefon,
          firmenname: betrieb.firmenname,
          firmensitz: betrieb.firmensitz,
          notizen: betrieb.notizen || undefined,
        },
      };
    } else if (slug === "hauswirtschaft_betreuung") {
      body = { service_slug: "hauswirtschaft_betreuung", payload: stdPayload };
    } else if (slug === "pflegehilfsmittel") {
      body = { service_slug: "pflegehilfsmittel", payload: stdPayload };
    } else {
      body = { service_slug: "pflegeberatung", payload: stdPayload };
    }
    const res = await submitPartnerTipAction(body);
    setPending(false);
    if (res.ok) {
      handleClose();
      return;
    }
    setMessage(res.message);
  };

  const progressPct = step === 1 ? 50 : 100;

  return (
    <div className="notranslate fixed inset-0 z-[220] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 z-0 bg-neutral-900/40 backdrop-blur-[2px]"
        aria-label="Dialog schließen"
        onClick={handleClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="partner-tip-title"
        className="relative z-10 flex max-h-[min(92dvh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-neutral-200 bg-white shadow-[0_-8px_40px_rgba(15,79,104,0.12),0_25px_50px_-12px_rgba(0,0,0,0.18)] sm:max-h-[min(88vh,720px)] sm:rounded-2xl sm:shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-[#0F4F68]" aria-hidden />

        <header className="shrink-0 border-b border-neutral-200 bg-white px-5 pb-4 pt-5 sm:px-6">
          <div className="flex items-start justify-between gap-3 pl-2">
            <div className="min-w-0">
              <h2 id="partner-tip-title" className="text-lg font-semibold tracking-tight text-[#0F4F68]">
                Tipp geben
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                {step === 1
                  ? "Wählen Sie die passende Leistung."
                  : "Erfassen Sie die Kontaktdaten – wir übernehmen die Zuordnung."}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
                <span className="font-medium text-[#0F4F68]">Schritt {step} von 2</span>
                <span className="text-neutral-300" aria-hidden>
                  ·
                </span>
                <span>{step === 1 ? "Leistung" : "Angaben"}</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} aria-label="Fortschritt">
                <div
                  className="h-full rounded-full bg-[#0F4F68] transition-[width] duration-300 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800"
              aria-label="Schließen"
            >
              <CloseIcon />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          {step === 1 ? (
            <div className="space-y-3 pl-2">
              <ul className="space-y-2">
                {choices.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => {
                        setSlug(s);
                        setStep(2);
                      }}
                      className="group flex w-full items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-3.5 text-left transition hover:border-[#0F4F68]/30 hover:bg-[#fafcfd] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
                    >
                      <span
                        className={`h-10 w-1 shrink-0 rounded-full ${serviceAccentClass(s)}`}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1 text-sm font-semibold text-neutral-900">
                        {PARTNER_RESPONSIBILITY_LABELS[s]}
                      </span>
                      <ChevronRightIcon />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : slug ? (
            <div className="space-y-5 pl-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setMessage(null);
                  }}
                  className="text-sm font-medium text-[#0F4F68] underline-offset-2 hover:underline"
                >
                  Andere Leistung wählen
                </button>
                <span className="text-neutral-300" aria-hidden>
                  ·
                </span>
                <span className={`inline-flex max-w-full items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${serviceBadgeClass(slug)}`}>
                  {PARTNER_RESPONSIBILITY_LABELS[slug]}
                </span>
              </div>

              {slug === "betriebliche_pflegeberatung" ? (
                <div className="space-y-4">
                  <Field
                    id={`${uid}-bp-ap`}
                    label="Ansprechpartner"
                    requiredMark
                    value={betrieb.ansprechpartner}
                    onChange={(v) => setBetrieb((b) => ({ ...b, ansprechpartner: v }))}
                  />
                  <Field
                    id={`${uid}-bp-pos`}
                    label="Firmenposition"
                    value={betrieb.firmenposition}
                    onChange={(v) => setBetrieb((b) => ({ ...b, firmenposition: v }))}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      id={`${uid}-bp-mail`}
                      label="E-Mail"
                      type="email"
                      autoComplete="email"
                      value={betrieb.email}
                      onChange={(v) => setBetrieb((b) => ({ ...b, email: v }))}
                      hint="Mindestens E-Mail oder Telefon."
                    />
                    <Field
                      id={`${uid}-bp-tel`}
                      label="Telefon"
                      type="tel"
                      autoComplete="tel"
                      value={betrieb.telefon}
                      onChange={(v) => setBetrieb((b) => ({ ...b, telefon: v }))}
                    />
                  </div>
                  <Field
                    id={`${uid}-bp-fn`}
                    label="Firmenname"
                    requiredMark
                    value={betrieb.firmenname}
                    onChange={(v) => setBetrieb((b) => ({ ...b, firmenname: v }))}
                  />
                  <Field
                    id={`${uid}-bp-sitz`}
                    label="Firmensitz"
                    value={betrieb.firmensitz}
                    onChange={(v) => setBetrieb((b) => ({ ...b, firmensitz: v }))}
                  />
                  <TextArea
                    id={`${uid}-bp-note`}
                    label="Notizen"
                    value={betrieb.notizen}
                    onChange={(v) => setBetrieb((b) => ({ ...b, notizen: v }))}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      id={`${uid}-st-vn`}
                      label="Vorname"
                      requiredMark
                      autoComplete="given-name"
                      value={standard.vorname}
                      onChange={(v) => setStandard((s) => ({ ...s, vorname: v }))}
                    />
                    <Field
                      id={`${uid}-st-nn`}
                      label="Nachname"
                      requiredMark
                      autoComplete="family-name"
                      value={standard.nachname}
                      onChange={(v) => setStandard((s) => ({ ...s, nachname: v }))}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      id={`${uid}-st-tel`}
                      label="Telefon"
                      type="tel"
                      requiredMark
                      autoComplete="tel"
                      value={standard.telefon}
                      onChange={(v) => setStandard((s) => ({ ...s, telefon: v }))}
                    />
                    <Field
                      id={`${uid}-st-mail`}
                      label="E-Mail"
                      type="email"
                      requiredMark
                      autoComplete="email"
                      value={standard.email}
                      onChange={(v) => setStandard((s) => ({ ...s, email: v }))}
                    />
                  </div>
                  <Field
                    id={`${uid}-st-ort`}
                    label="Wohnort"
                    requiredMark
                    value={standard.wohnort}
                    onChange={(v) => setStandard((s) => ({ ...s, wohnort: v }))}
                  />
                  <TextArea
                    id={`${uid}-st-note`}
                    label="Notiz"
                    value={standard.notiz}
                    onChange={(v) => setStandard((s) => ({ ...s, notiz: v }))}
                  />
                </div>
              )}
            </div>
          ) : null}
        </div>

        {step === 2 && slug ? (
          <div className="shrink-0 border-t border-neutral-200 bg-neutral-50 px-5 py-4 sm:px-6">
            {message ? (
              <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950" role="alert">
                {message}
              </p>
            ) : null}
            <button
              type="button"
              disabled={pending}
              onClick={() => void submit()}
              className="flex w-full min-h-12 items-center justify-center rounded-lg bg-[#0F4F68] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0c3d52] disabled:opacity-50"
            >
              {pending ? "Wird gesendet…" : "Tipp absenden"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  requiredMark,
  hint,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  requiredMark?: boolean;
  hint?: string;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-neutral-800">
        {label}
        {requiredMark ? <span className="text-red-600"> *</span> : null}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 hover:border-neutral-400 focus:border-[#0F4F68] focus:ring-1 focus:ring-[#0F4F68]"
      />
      {hint ? <p className="text-xs text-neutral-500">{hint}</p> : null}
    </div>
  );
}

function TextArea({
  id,
  label,
  value,
  onChange,
  requiredMark,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  requiredMark?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-neutral-800">
        {label}
        {requiredMark ? <span className="text-red-600"> *</span> : null}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full resize-y rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 hover:border-neutral-400 focus:border-[#0F4F68] focus:ring-1 focus:ring-[#0F4F68]"
      />
    </div>
  );
}
