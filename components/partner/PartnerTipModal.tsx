"use client";

import { useCallback, useState } from "react";
import {
  PARTNER_RESPONSIBILITY_LABELS,
  PARTNER_RESPONSIBILITY_SLUGS,
  type PartnerResponsibilitySlug,
} from "@/lib/partner/responsibility-areas";
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
  ansprechpartner: "",
  telefon: "",
  email: "",
  wohnort: "",
  notiz: "",
};

export function PartnerTipModal({ open, onClose, allowedSlugs }: Props) {
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
      ansprechpartner: standard.ansprechpartner,
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

  return (
    <div className="notranslate fixed inset-0 z-[220] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 z-0 bg-[#0F4F68]/20 backdrop-blur-[2px]"
        aria-label="Schließen"
        onClick={handleClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="partner-tip-title"
        className="relative z-10 flex max-h-[min(90vh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_25px_50px_-12px_rgba(15,79,104,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#0F4F68]/10 px-5 py-4">
          <h2 id="partner-tip-title" className="text-lg font-bold text-[#0F4F68]">
            Tipp geben
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-[#0F4F68]/70 hover:bg-[#0F4F68]/10"
            aria-label="Schließen"
          >
            ×
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5">
          {step === 1 ? (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-neutral-800">Um welche Leistung handelt es sich?</p>
              <ul className="grid gap-2">
                {choices.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => {
                        setSlug(s);
                        setStep(2);
                      }}
                      className="w-full rounded-xl border border-[#0F4F68]/15 bg-[#F2F9FA]/40 px-4 py-3 text-left text-sm font-semibold text-[#0F4F68] transition hover:border-[#0F4F68]/35 hover:bg-[#F2F9FA]"
                    >
                      {PARTNER_RESPONSIBILITY_LABELS[s]}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : slug ? (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm font-semibold text-[#0F4F68] underline underline-offset-2"
              >
                ← Zurück zur Leistung
              </button>
              <p className="text-xs text-neutral-500">
                Ausgewählt: <strong className="text-neutral-800">{PARTNER_RESPONSIBILITY_LABELS[slug]}</strong>
              </p>

              {slug === "betriebliche_pflegeberatung" ? (
                <div className="space-y-3">
                  <Field
                    label="Ansprechpartner"
                    value={betrieb.ansprechpartner}
                    onChange={(v) => setBetrieb((b) => ({ ...b, ansprechpartner: v }))}
                  />
                  <Field
                    label="Firmenposition"
                    value={betrieb.firmenposition}
                    onChange={(v) => setBetrieb((b) => ({ ...b, firmenposition: v }))}
                  />
                  <Field
                    label="E-Mail"
                    type="email"
                    value={betrieb.email}
                    onChange={(v) => setBetrieb((b) => ({ ...b, email: v }))}
                  />
                  <Field
                    label="Telefonnummer"
                    type="tel"
                    value={betrieb.telefon}
                    onChange={(v) => setBetrieb((b) => ({ ...b, telefon: v }))}
                  />
                  <Field
                    label="Firmenname"
                    value={betrieb.firmenname}
                    onChange={(v) => setBetrieb((b) => ({ ...b, firmenname: v }))}
                  />
                  <Field
                    label="Firmensitz"
                    value={betrieb.firmensitz}
                    onChange={(v) => setBetrieb((b) => ({ ...b, firmensitz: v }))}
                  />
                  <TextArea
                    label="Notizen"
                    value={betrieb.notizen}
                    onChange={(v) => setBetrieb((b) => ({ ...b, notizen: v }))}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <Field
                    label="Ansprechpartner"
                    value={standard.ansprechpartner}
                    onChange={(v) => setStandard((s) => ({ ...s, ansprechpartner: v }))}
                  />
                  <Field
                    label="Telefonnummer"
                    type="tel"
                    value={standard.telefon}
                    onChange={(v) => setStandard((s) => ({ ...s, telefon: v }))}
                  />
                  <Field
                    label="E-Mail"
                    type="email"
                    value={standard.email}
                    onChange={(v) => setStandard((s) => ({ ...s, email: v }))}
                  />
                  <Field
                    label="Wohnort"
                    value={standard.wohnort}
                    onChange={(v) => setStandard((s) => ({ ...s, wohnort: v }))}
                  />
                  <TextArea
                    label="Notiz"
                    value={standard.notiz}
                    onChange={(v) => setStandard((s) => ({ ...s, notiz: v }))}
                  />
                </div>
              )}

              {message ? (
                <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
                  {message}
                </p>
              ) : null}

              <button
                type="button"
                disabled={pending}
                onClick={() => void submit()}
                className="mt-2 w-full min-h-12 rounded-xl bg-[#0F4F68] py-3 text-sm font-semibold text-white hover:bg-[#0c3d52] disabled:opacity-60"
              >
                {pending ? "Wird gesendet…" : "Tipp absenden"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide text-[#0F4F68]/80">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide text-[#0F4F68]/80">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="mt-1 w-full resize-y rounded-xl border border-neutral-200 px-3 py-2.5 text-sm text-neutral-900 outline-none ring-[#0F4F68] focus:ring-2"
      />
    </div>
  );
}
