"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PARTNER_RESPONSIBILITY_LABELS,
  PARTNER_RESPONSIBILITY_SLUGS,
  type PartnerResponsibilitySlug,
} from "@/lib/partner/responsibility-areas";
import {
  PROVISION_STATUS_LIST_ANCHOR,
  PROVISION_STATUS_LIST_FULL_NAME,
  provisionBucketForServiceSlug,
} from "@/lib/partner/partner-tip-provision-bucket";
import { serviceAccentClass, serviceBadgeClass } from "@/lib/partner/service-slug-styles";
import { submitPartnerTipAction } from "@/lib/actions/partner-tips";
import type { PartnerTipSubmissionInput } from "@/lib/validations/partner-tips";

type Props = {
  open: boolean;
  onClose: () => void;
  allowedSlugs: PartnerResponsibilitySlug[];
};

type FlowPhase = "service" | "pflegeProximity" | "pflegeNearHint" | "form" | "thanks";

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

function ChevronLeftIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
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

function CheckCircleIcon() {
  return (
    <svg className="h-14 w-14 text-emerald-600" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" className="stroke-emerald-600/25" strokeWidth="2" fill="rgb(236 253 245)" />
      <path
        d="M8 12.5l2.5 2.5L16 9"
        className="stroke-emerald-600"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ServiceChoiceIcon({ slug }: { slug: PartnerResponsibilitySlug }) {
  const common = "h-6 w-6 text-[#0F4F68]";
  switch (slug) {
    case "betriebliche_pflegeberatung":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M4 21V8l8-4 8 4v13" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 21v-6h6v6" strokeLinecap="round" />
        </svg>
      );
    case "pflegehilfsmittel":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" strokeLinejoin="round" />
          <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" strokeLinecap="round" />
        </svg>
      );
    case "hauswirtschaft_betreuung":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M3 10.5L12 3l9 7.5V21H3V10.5z" strokeLinejoin="round" />
          <path d="M9 21v-6h6v6" strokeLinecap="round" />
        </svg>
      );
    case "pflegeberatung":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path
            d="M12 21a8 8 0 008-8c0-5-8-11-8-11S4 8 4 13a8 8 0 008 8z"
            strokeLinejoin="round"
          />
          <path d="M12 13a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
        </svg>
      );
    default:
      return null;
  }
}

type WizardStep = { id: string; label: string };

function wizardStepState(phase: FlowPhase, slug: PartnerResponsibilitySlug | null): {
  steps: WizardStep[];
  activeIndex: number;
} {
  const isPflege = slug === "pflegehilfsmittel";
  const steps: WizardStep[] = isPflege
    ? [
        { id: "leistung", label: "Leistung" },
        { id: "rueckfrage", label: "Rückfrage" },
        { id: "angaben", label: "Angaben" },
        { id: "fertig", label: "Fertig" },
      ]
    : [
        { id: "leistung", label: "Leistung" },
        { id: "angaben", label: "Angaben" },
        { id: "fertig", label: "Fertig" },
      ];

  let activeIndex = 0;
  if (phase === "service") activeIndex = 0;
  else if (phase === "pflegeProximity" || phase === "pflegeNearHint") activeIndex = 1;
  else if (phase === "form") activeIndex = isPflege ? 2 : 1;
  else if (phase === "thanks") activeIndex = steps.length - 1;

  return { steps, activeIndex };
}

export function PartnerTipModal({ open, onClose, allowedSlugs }: Props) {
  const router = useRouter();
  const uid = useId();
  const choices =
    allowedSlugs.length > 0 ? allowedSlugs : [...PARTNER_RESPONSIBILITY_SLUGS];
  const [phase, setPhase] = useState<FlowPhase>("service");
  const [slug, setSlug] = useState<PartnerResponsibilitySlug | null>(null);
  const [betrieb, setBetrieb] = useState(emptyBetrieb);
  const [standard, setStandard] = useState(emptyStandard);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [thanksSlug, setThanksSlug] = useState<PartnerResponsibilitySlug | null>(null);

  const reset = useCallback(() => {
    setPhase("service");
    setSlug(null);
    setBetrieb(emptyBetrieb);
    setStandard(emptyStandard);
    setMessage(null);
    setPending(false);
    setThanksSlug(null);
  }, []);

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const goBack = useCallback(() => {
    setMessage(null);
    if (phase === "form") {
      if (slug === "pflegehilfsmittel") setPhase("pflegeProximity");
      else {
        setPhase("service");
        setSlug(null);
      }
      return;
    }
    if (phase === "pflegeNearHint") {
      setPhase("pflegeProximity");
      return;
    }
    if (phase === "pflegeProximity") {
      setPhase("service");
      setSlug(null);
    }
  }, [phase, slug]);

  const canGoBack = phase !== "service" && phase !== "thanks";

  const headerSubtitle = useMemo(() => {
    if (phase === "thanks") return "Ihr Tipp wurde übermittelt.";
    if (phase === "service") return "Wählen Sie zuerst die passende Leistung.";
    if (phase === "pflegeProximity") return "Damit wir Sie richtig beraten können.";
    if (phase === "pflegeNearHint") return "So geht es am schnellsten.";
    return "Bitte füllen Sie die Felder aus – wir kümmern uns um die Zuordnung.";
  }, [phase]);

  const { steps: wizardSteps, activeIndex: wizardActiveIndex } = useMemo(
    () => wizardStepState(phase, slug),
    [phase, slug],
  );

  const thanksListFullName = useMemo(() => {
    if (!thanksSlug) return PROVISION_STATUS_LIST_FULL_NAME.einmal;
    const bucket = provisionBucketForServiceSlug(thanksSlug);
    return PROVISION_STATUS_LIST_FULL_NAME[bucket];
  }, [thanksSlug]);

  const goToThanksStatusList = useCallback(() => {
    const anchor = thanksSlug
      ? PROVISION_STATUS_LIST_ANCHOR[provisionBucketForServiceSlug(thanksSlug)]
      : "partner-statuslisten";
    handleClose();
    router.push(`/partner/dashboard#${anchor}`);
  }, [thanksSlug, handleClose, router]);

  const selectService = (s: PartnerResponsibilitySlug) => {
    setSlug(s);
    setMessage(null);
    if (s === "pflegehilfsmittel") setPhase("pflegeProximity");
    else setPhase("form");
  };

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
      router.refresh();
      if (slug) setThanksSlug(slug);
      setPhase("thanks");
      return;
    }
    setMessage(res.message);
  };

  return (
    <div className="notranslate fixed inset-0 z-[220] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 z-0 bg-neutral-900/45 backdrop-blur-[3px]"
        aria-label="Dialog schließen"
        onClick={handleClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="partner-tip-title"
        className="relative z-10 flex max-h-[min(92dvh,820px)] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl border border-neutral-200/90 bg-white shadow-[0_-12px_48px_rgba(15,79,104,0.14),0_25px_50px_-12px_rgba(0,0,0,0.2)] sm:max-h-[min(88vh,820px)] sm:rounded-2xl sm:shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="h-1 w-full shrink-0 bg-gradient-to-r from-[#0F4F68] via-[#3DB8C9] to-[#0F4F68]/40"
          aria-hidden
        />

        <header className="shrink-0 border-b border-neutral-100 bg-white px-5 pb-4 pt-5 sm:px-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {canGoBack ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="mb-3 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-[#0F4F68] transition hover:bg-[#0F4F68]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
                >
                  <ChevronLeftIcon />
                  Zurück
                </button>
              ) : null}
              <h2 id="partner-tip-title" className="text-xl font-semibold tracking-tight text-[#0F4F68]">
                Tipp geben
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{headerSubtitle}</p>

              <nav
                className="mt-4 rounded-xl border border-[#0F4F68]/10 bg-[#f6fafc] px-2 py-3 sm:px-3"
                aria-label="Schritte"
              >
                <ol className="flex w-full list-none items-start justify-center p-0 sm:items-center">
                  {wizardSteps.map((s, i) => {
                    const done = i < wizardActiveIndex;
                    const current = i === wizardActiveIndex;
                    const lineDone = i > 0 && i - 1 < wizardActiveIndex;
                    return (
                      <li key={s.id} className="flex min-w-0 flex-1 items-start">
                        {i > 0 ? (
                          <div
                            className="mx-0.5 mt-[1.125rem] hidden min-h-px min-w-[0.25rem] flex-1 sm:mx-1 sm:block"
                            aria-hidden
                          >
                            <div
                              className={`h-px w-full rounded-full ${lineDone ? "bg-[#0F4F68]/45" : "bg-neutral-200"}`}
                            />
                          </div>
                        ) : null}
                        <div className="flex w-[4.25rem] shrink-0 flex-col items-center gap-1.5 sm:w-auto sm:min-w-[4.5rem] sm:flex-1">
                          <span
                            className={[
                              "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition",
                              done
                                ? "bg-[#0F4F68] text-white shadow-sm"
                                : current
                                  ? "bg-white text-[#0F4F68] ring-2 ring-[#0F4F68] ring-offset-2 ring-offset-[#f6fafc]"
                                  : "bg-white/80 text-neutral-400 ring-1 ring-neutral-200",
                            ].join(" ")}
                            aria-current={current ? "step" : undefined}
                          >
                            {done ? "✓" : i + 1}
                          </span>
                          <span
                            className={`text-center text-[0.65rem] font-semibold leading-tight sm:text-xs ${
                              current ? "text-[#0F4F68]" : "text-neutral-500"
                            }`}
                          >
                            {s.label}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800"
              aria-label="Schließen"
            >
              <CloseIcon />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          {phase === "service" ? (
            <div className="space-y-5 pl-0 sm:pl-1">
              <h3 className="text-lg font-semibold leading-snug text-neutral-900 sm:text-xl">
                Für welche Leistung möchten Sie uns einen Tipp geben?
              </h3>
              <p className="-mt-2 text-sm text-neutral-600">
                Tippen Sie auf eine Karte – anschließend erfassen wir die nötigen Angaben.
              </p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {choices.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => selectService(s)}
                      className="group flex h-full min-h-[5.5rem] w-full items-center gap-3 rounded-2xl border border-neutral-200/90 bg-white p-4 text-left shadow-sm transition hover:border-[#0F4F68]/35 hover:bg-[#f6fafc] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
                    >
                      <span
                        className={`h-12 w-1.5 shrink-0 self-stretch rounded-full ${serviceAccentClass(s)}`}
                        aria-hidden
                      />
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-50 text-[#0F4F68] ring-1 ring-neutral-100 transition group-hover:bg-white"
                        aria-hidden
                      >
                        <ServiceChoiceIcon slug={s} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold leading-snug text-neutral-900">
                            {PARTNER_RESPONSIBILITY_LABELS[s]}
                          </span>
                          <ChevronRightIcon />
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {phase === "pflegeProximity" && slug === "pflegehilfsmittel" ? (
            <div className="space-y-6 pl-0 sm:pl-1">
              <div className="rounded-2xl border border-[#0F4F68]/15 bg-[#f4f9fb] px-4 py-4 sm:px-5">
                <p className="text-base font-semibold text-[#0F4F68]">
                  Ist der Kunde oder die Kundin, um den bzw. die es geht, bei Ihnen vor Ort?
                </p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                  Gemeint ist: Sie sind gerade bei der Person oder diese ist unmittelbar in Ihrer Nähe (z. B. im selben
                  Haushalt).
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPhase("pflegeNearHint")}
                  className="min-h-12 rounded-xl border-2 border-[#0F4F68]/20 bg-white px-4 py-3.5 text-sm font-semibold text-[#0F4F68] transition hover:border-[#0F4F68]/40 hover:bg-[#f6fafc] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
                >
                  Ja, vor Ort
                </button>
                <button
                  type="button"
                  onClick={() => setPhase("form")}
                  className="min-h-12 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2"
                >
                  Nein, nicht vor Ort
                </button>
              </div>
            </div>
          ) : null}

          {phase === "pflegeNearHint" && slug === "pflegehilfsmittel" ? (
            <div className="space-y-5 pl-0 sm:pl-1">
              <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/80 px-4 py-4 sm:px-5">
                <p className="text-sm font-semibold text-emerald-950">Empfehlung</p>
                <p className="mt-2 text-sm leading-relaxed text-emerald-950/90">
                  Wenn die betreffende Person bei Ihnen ist, können Sie die{" "}
                  <strong className="font-semibold">
                    Pflegebox gemeinsam mit dem Kunden oder der Kundin direkt im Konfigurator
                  </strong>{" "}
                  abschließen. Die Box wird dann sofort korrekt zugeordnet – ohne Umweg über dieses Formular.
                </p>
              </div>
              <p className="text-sm text-neutral-600">
                Wenn das gerade nicht möglich ist, gehen Sie mit „Zurück“ einen Schritt zurück und wählen Sie „Nein,
                nicht vor Ort“, um uns den Tipp hier schriftlich zu melden.
              </p>
            </div>
          ) : null}

          {phase === "form" && slug ? (
            <div className="space-y-5 pl-0 sm:pl-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex max-w-full items-center rounded-lg border px-2.5 py-1 text-xs font-semibold ${serviceBadgeClass(slug)}`}
                >
                  {PARTNER_RESPONSIBILITY_LABELS[slug]}
                </span>
              </div>

              {slug === "pflegehilfsmittel" ? (
                <p className="text-sm leading-relaxed text-neutral-600">
                  Bitte tragen Sie die Daten der Person ein, für die Sie uns einen Tipp geben möchten (Name, Erreichbarkeit,
                  Wohnort). So können wir den Fall zuordnen und uns bei Ihnen melden.
                </p>
              ) : slug !== "betriebliche_pflegeberatung" ? (
                <p className="text-sm leading-relaxed text-neutral-600">
                  Mit den folgenden Angaben bearbeiten wir Ihren Tipp zuverlässig. Pflicht sind Vor- und Nachname,
                  Wohnort sowie{" "}
                  <strong className="font-medium text-neutral-800">mindestens eine Telefonnummer oder eine E-Mail</strong>
                  .
                </p>
              ) : (
                <p className="text-sm leading-relaxed text-neutral-600">
                  Erfassen Sie die Kontaktdaten zum Betrieb. Es muss{" "}
                  <strong className="font-medium text-neutral-800">mindestens eine Telefonnummer oder eine E-Mail</strong>{" "}
                  angegeben werden.
                </p>
              )}

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
                      autoComplete="tel"
                      value={standard.telefon}
                      onChange={(v) => setStandard((s) => ({ ...s, telefon: v }))}
                      hint="Eines von beiden: Telefon oder E-Mail."
                    />
                    <Field
                      id={`${uid}-st-mail`}
                      label="E-Mail"
                      type="email"
                      autoComplete="email"
                      value={standard.email}
                      onChange={(v) => setStandard((s) => ({ ...s, email: v }))}
                      hint="Eines von beiden: Telefon oder E-Mail."
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

          {phase === "thanks" ? (
            <div className="flex flex-col items-center px-2 py-6 text-center sm:px-6 sm:py-8">
              <CheckCircleIcon />
              <h3 className="mt-5 text-lg font-semibold text-neutral-900 sm:text-xl">Vielen Dank für Ihren Tipp</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-600">
                Wir haben Ihre Angaben sicher übermittelt. Unser Team bearbeitet den Fall in den nächsten Werktagen.
              </p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-700">
                <strong className="font-medium text-neutral-900">Wo Sie den Status finden:</strong> Auf dieser Seite
                weiter unten in der{" "}
                <span className="font-semibold text-[#0F4F68]">„{thanksListFullName}“</span>. Dort sehen Sie den
                aktuellen Bearbeitungsstand; sobald es von uns eine Rückmeldung gibt, erscheint sie dort bzw. unter
                „Notiz“.
              </p>
              <p className="mt-2 max-w-md text-xs leading-relaxed text-neutral-500">
                Mit dem Button unten springen Sie direkt zur passenden farbigen Statusliste auf dem Dashboard.
              </p>
            </div>
          ) : null}
        </div>

        {phase === "form" && slug ? (
          <div className="shrink-0 border-t border-neutral-100 bg-neutral-50/90 px-5 py-4 sm:px-6">
            {message ? (
              <p
                className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-950"
                role="alert"
              >
                {message}
              </p>
            ) : null}
            <button
              type="button"
              disabled={pending}
              onClick={() => void submit()}
              className="flex w-full min-h-12 items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0c3d52] disabled:opacity-50"
            >
              {pending ? "Wird gesendet…" : "Tipp absenden"}
            </button>
          </div>
        ) : null}

        {phase === "thanks" ? (
          <div className="shrink-0 space-y-3 border-t border-neutral-100 bg-neutral-50/90 px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={() => void goToThanksStatusList()}
              className="flex w-full min-h-12 items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0c3d52]"
            >
              Zur „{thanksListFullName}“
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex w-full min-h-12 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
            >
              Schließen
            </button>
          </div>
        ) : null}

        {phase === "pflegeNearHint" ? (
          <div className="shrink-0 border-t border-neutral-100 bg-neutral-50/90 px-5 py-4 sm:px-6">
            <p className="mb-3 text-center text-xs text-neutral-500">Zurück bringt Sie zur vorherigen Frage.</p>
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
        className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 hover:border-neutral-400 focus:border-[#0F4F68] focus:ring-1 focus:ring-[#0F4F68]"
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
        className="w-full resize-y rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 hover:border-neutral-400 focus:border-[#0F4F68] focus:ring-1 focus:ring-[#0F4F68]"
      />
    </div>
  );
}
