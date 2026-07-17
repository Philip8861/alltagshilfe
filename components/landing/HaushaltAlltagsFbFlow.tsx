"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  HILFEFINDER_SERVICE_ERGEBNIS,
  HILFEFINDER_SERVICE_OPTIONEN,
  type HilfefinderServiceKey,
} from "@/config/hilfefinder-services";
import {
  HilfefinderSelectMark,
  HilfefinderServiceOptionButton,
  HilfefinderStepFlatIcon,
  hilfefinderOptionButtonClass,
} from "@/components/hilfefinder/HilfefinderServiceMarkups";
import { type Standort } from "@/config/standorte";
import { resolveStandortForPlz, type StandortPlzMatch } from "@/lib/resolve-standort-plz";
import { submitHilfefinder } from "@/lib/actions/hilfefinder";
import { CONTACT_SOURCE_OPTIONS } from "@/lib/contact-source";
import {
  trackFinderStarted,
  trackFinderStepCompleted,
  trackFinderSuccess,
} from "@/lib/analytics/gtm-data-layer";
import { GtmMailtoLink, GtmPhoneLink } from "@/components/analytics/GtmContactIntentLink";
import { cn } from "@/lib/utils";

const FINDER_ID = "fb_landing_haushalt_alltags" as const;
const FEATURED_SERVICE_KEY: HilfefinderServiceKey = "haushalt";

type ServiceKey = HilfefinderServiceKey;
type KontaktArt = "rueckruf" | "selbst";

const SCHRITT_MOTIVATION: Record<number, string> = {
  1: "Los geht's – Ihre Postleitzahl",
  2: "Was für Hilfe benötigen Sie?",
  3: "Gute Nachricht!",
  4: "Wie möchten Sie den Kontakt?",
  5: "Vielen Dank!",
};

const FEATURED_SERVICES = HILFEFINDER_SERVICE_OPTIONEN.filter((o) => o.key === FEATURED_SERVICE_KEY);
const OTHER_SERVICES = HILFEFINDER_SERVICE_OPTIONEN.filter((o) => o.key !== FEATURED_SERVICE_KEY);

type FlowCtx = {
  startFlow: () => void;
};

const HaushaltAlltagsFbFlowCtx = createContext<FlowCtx | null>(null);

function useHaushaltAlltagsFbFlow() {
  const ctx = useContext(HaushaltAlltagsFbFlowCtx);
  if (!ctx) {
    throw new Error("HaushaltAlltagsFbFlow components must be used within HaushaltAlltagsFbFlowProvider");
  }
  return ctx;
}

export function HaushaltAlltagsFbStartButton({
  className = "",
  children,
  variant = "primary",
}: {
  className?: string;
  children?: ReactNode;
  variant?: "primary" | "secondary";
}) {
  const { startFlow } = useHaushaltAlltagsFbFlow();

  const baseClass =
    variant === "primary"
      ? "flex w-full transform items-center justify-center gap-2 rounded-xl bg-[#F78F2E] px-6 py-3 text-lg font-bold text-white shadow-lg transition hover:scale-[1.02] hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 motion-reduce:transform-none sm:w-auto lg:w-auto lg:px-[clamp(1.15rem,0.85rem+1.1vw,1.65rem)] lg:py-[clamp(0.6rem,0.45rem+0.45vw,0.9rem)] lg:text-[clamp(1rem,0.82rem+0.55vw,1.15rem)]"
      : "inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#F78F2E] px-8 py-3.5 text-base font-bold text-white shadow-md transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 sm:text-lg";

  return (
    <button type="button" onClick={startFlow} className={cn(baseClass, className)}>
      {children ?? "In 30 Sekunden zur passenden Hilfe"}
    </button>
  );
}

export function HaushaltAlltagsFbFlowProvider({ children }: { children: ReactNode }) {
  const [wizardActive, setWizardActive] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [step, setStep] = useState(1);
  const [leistungen, setLeistungen] = useState<ServiceKey[]>([]);
  const [plz, setPlz] = useState("");
  const [kontaktArt, setKontaktArt] = useState<KontaktArt | "">("");
  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [telefon, setTelefon] = useState("");
  const [besteZeit, setBesteZeit] = useState("");
  const [email, setEmail] = useState("");
  const [nachricht, setNachricht] = useState("");
  const [contactSource, setContactSource] = useState("social_media");
  const [datenschutz, setDatenschutz] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const finderStartedRef = useRef(false);

  const plzNorm = plz.replace(/\D/g, "").slice(0, 5);
  const { standort: finalerStandort, match: standortMatch } = useMemo(
    () => resolveStandortForPlz(plzNorm),
    [plzNorm],
  );

  const toggleLeistung = (key: ServiceKey) => {
    setLeistungen((prev) => (prev.includes(key) ? prev.filter((v) => v !== key) : [...prev, key]));
  };

  const resetFlow = useCallback(() => {
    setStep(1);
    setLeistungen([]);
    setPlz("");
    setKontaktArt("");
    setVorname("");
    setNachname("");
    setTelefon("");
    setBesteZeit("");
    setEmail("");
    setNachricht("");
    setContactSource("social_media");
    setDatenschutz(false);
    setError("");
    setSubmitting(false);
  }, []);

  const closeFlow = useCallback(() => {
    setWizardActive(false);
    resetFlow();
  }, [resetFlow]);

  const startFlow = useCallback(() => {
    setWizardActive(true);
    setStep(1);
    setError("");
    if (!finderStartedRef.current) {
      finderStartedRef.current = true;
      trackFinderStarted({
        finder: FINDER_ID,
        source_component: "fb_landing_haushalt_alltags_start",
      });
    }
  }, []);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!wizardActive) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [wizardActive]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("ahs-konfigurator-open-state", {
        detail: { open: wizardActive },
      }),
    );
  }, [wizardActive]);

  useEffect(() => {
    const onScroll = () => {
      if (wizardActive) {
        setShowStickyCta(false);
        return;
      }
      setShowStickyCta(window.scrollY > 420);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [wizardActive]);

  const ausgewaehlteLeistungen = useMemo(
    () => HILFEFINDER_SERVICE_OPTIONEN.filter((s) => leistungen.includes(s.key)),
    [leistungen],
  );

  const leistungenFuerErgebnis = useMemo(() => {
    const hasKoerperpflege = ausgewaehlteLeistungen.some((l) => l.key === "koerperpflege");
    const hasMedizinisch = ausgewaehlteLeistungen.some((l) => l.key === "medizinisch");
    const rest = ausgewaehlteLeistungen.filter((l) => l.key !== "koerperpflege" && l.key !== "medizinisch");
    if (hasKoerperpflege && hasMedizinisch) {
      return [
        ...rest,
        {
          key: "koerperpflege" as ServiceKey,
          label: "Körperliche Pflege und Medizinische Versorgung",
          verfuegbarkeit: "partner" as const,
        },
      ];
    }
    return ausgewaehlteLeistungen;
  }, [ausgewaehlteLeistungen]);

  const trackStep = (completedStep: number) => {
    trackFinderStepCompleted({
      finder: FINDER_ID,
      source_component: `fb_landing_haushalt_alltags_step_${completedStep}_advance`,
      step_completed: completedStep,
      service: leistungen.length > 0 ? leistungen.join(",") : undefined,
      plz: plzNorm.length === 5 ? plzNorm : undefined,
    });
  };

  const weiter = () => {
    setError("");
    if (step === 2 && leistungen.length === 0) {
      setError("Bitte wählen Sie mindestens eine Hilfsleistung aus.");
      return;
    }
    if (step === 4 && !kontaktArt) {
      setError("Bitte wählen Sie eine Kontaktart aus.");
      return;
    }
    trackStep(step);
    setStep((s) => Math.min(5, s + 1));
  };

  const zurueck = () => {
    setError("");
    setStep((s) => Math.max(1, s - 1));
  };

  const absenden = async () => {
    setError("");
    if (submitting) return;
    if (!kontaktArt) {
      setError("Bitte wählen Sie eine Kontaktart aus.");
      return;
    }
    if (!vorname.trim() || !nachname.trim() || !telefon.trim() || !email.trim()) {
      setError("Bitte füllen Sie Vorname, Nachname, Telefonnummer und E-Mail aus.");
      return;
    }
    if (!contactSource) {
      setError("Bitte geben Sie an, wie Sie auf uns aufmerksam geworden sind.");
      return;
    }
    if (!datenschutz) {
      setError(
        "Bitte bestätigen Sie, dass Sie die Datenschutzerklärung gelesen haben und der Verarbeitung Ihrer Daten zustimmen.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitHilfefinder({
        vorname,
        nachname,
        email,
        telefon,
        besteZeit,
        nachricht,
        plz: plzNorm,
        leistungen: ausgewaehlteLeistungen.map((l) => l.label),
        kontaktArt,
        contactSource,
        datenschutz,
      });
      if (!result.success) {
        setError(result.error ?? "Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.");
        return;
      }
      trackFinderSuccess({
        finder: FINDER_ID,
        source_component: "fb_landing_haushalt_alltags_submit",
        service: ausgewaehlteLeistungen.map((l) => l.key).join(","),
        plz: plzNorm.length === 5 ? plzNorm : undefined,
      });
      setStep(5);
    } catch (e) {
      console.error("[fb_landing_haushalt_alltags] submit error", e);
      setError("Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.");
    } finally {
      setSubmitting(false);
    }
  };

  const displayStep = Math.min(step, 4);

  return (
    <HaushaltAlltagsFbFlowCtx.Provider value={{ startFlow }}>
      {children}
      {wizardActive && portalReady
        ? createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#0F4F68]/45 p-3 backdrop-blur-[2px] sm:p-6">
              <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto animate-fade-in-up rounded-2xl border border-[#0F4F68]/15 bg-white p-5 shadow-2xl sm:p-7">
                <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <p className="justify-self-start text-sm font-bold uppercase tracking-wide text-[#0F4F68]/80">
                    Schritt {displayStep} von 4
                  </p>
                  <p className="text-center text-xl font-extrabold text-[#0F4F68] sm:text-2xl">
                    {SCHRITT_MOTIVATION[step]}
                  </p>
                  <button
                    type="button"
                    onClick={closeFlow}
                    className="justify-self-end inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#0F4F68]/25 text-2xl font-extrabold leading-none text-[#0F4F68] hover:bg-[#F2F9FA]"
                    aria-label="Hilfe-Finder schließen"
                  >
                    ×
                  </button>
                </div>
                <HaushaltAlltagsFbWizardBody
                  step={step}
                  setStep={setStep}
                  leistungen={leistungen}
                  toggleLeistung={toggleLeistung}
                  plz={plz}
                  setPlz={setPlz}
                  plzNorm={plzNorm}
                  kontaktArt={kontaktArt}
                  setKontaktArt={setKontaktArt}
                  vorname={vorname}
                  setVorname={setVorname}
                  nachname={nachname}
                  setNachname={setNachname}
                  telefon={telefon}
                  setTelefon={setTelefon}
                  besteZeit={besteZeit}
                  setBesteZeit={setBesteZeit}
                  email={email}
                  setEmail={setEmail}
                  nachricht={nachricht}
                  setNachricht={setNachricht}
                  contactSource={contactSource}
                  setContactSource={setContactSource}
                  datenschutz={datenschutz}
                  setDatenschutz={setDatenschutz}
                  error={error}
                  submitting={submitting}
                  finalerStandort={finalerStandort}
                  standortMatch={standortMatch}
                  leistungenFuerErgebnis={leistungenFuerErgebnis}
                  weiter={weiter}
                  zurueck={zurueck}
                  absenden={absenden}
                  onClose={closeFlow}
                />
              </div>
            </div>,
            document.body,
          )
        : null}
      {showStickyCta && !wizardActive ? (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#0F4F68]/10 bg-white/95 p-3 shadow-[0_-4px_24px_rgba(15,79,104,0.12)] backdrop-blur-sm sm:hidden">
          <HaushaltAlltagsFbStartButton className="w-full min-h-[48px] text-base" />
        </div>
      ) : null}
    </HaushaltAlltagsFbFlowCtx.Provider>
  );
}

type HaushaltAlltagsFbWizardBodyProps = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  leistungen: ServiceKey[];
  toggleLeistung: (key: ServiceKey) => void;
  plz: string;
  setPlz: React.Dispatch<React.SetStateAction<string>>;
  plzNorm: string;
  kontaktArt: KontaktArt | "";
  setKontaktArt: React.Dispatch<React.SetStateAction<KontaktArt | "">>;
  vorname: string;
  setVorname: React.Dispatch<React.SetStateAction<string>>;
  nachname: string;
  setNachname: React.Dispatch<React.SetStateAction<string>>;
  telefon: string;
  setTelefon: React.Dispatch<React.SetStateAction<string>>;
  besteZeit: string;
  setBesteZeit: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  nachricht: string;
  setNachricht: React.Dispatch<React.SetStateAction<string>>;
  contactSource: string;
  setContactSource: React.Dispatch<React.SetStateAction<string>>;
  datenschutz: boolean;
  setDatenschutz: React.Dispatch<React.SetStateAction<boolean>>;
  error: string;
  submitting: boolean;
  finalerStandort: Standort;
  standortMatch: StandortPlzMatch;
  leistungenFuerErgebnis: typeof HILFEFINDER_SERVICE_OPTIONEN;
  weiter: () => void;
  zurueck: () => void;
  absenden: () => Promise<void>;
  onClose: () => void;
};

function HaushaltAlltagsFbWizardBody({
  step,
  setStep,
  leistungen,
  toggleLeistung,
  plz,
  setPlz,
  plzNorm,
  kontaktArt,
  setKontaktArt,
  vorname,
  setVorname,
  nachname,
  setNachname,
  telefon,
  setTelefon,
  besteZeit,
  setBesteZeit,
  email,
  setEmail,
  nachricht,
  setNachricht,
  contactSource,
  setContactSource,
  datenschutz,
  setDatenschutz,
  error,
  submitting,
  finalerStandort,
  standortMatch,
  leistungenFuerErgebnis,
  weiter,
  zurueck,
  absenden,
  onClose,
}: HaushaltAlltagsFbWizardBodyProps) {
  return (
    <>
      {step === 1 ? (
        <div className="mt-6 animate-fade-in-up space-y-4">
                  <h3 className="text-lg font-bold text-[#0F4F68] sm:text-xl">
                    Erhalten Sie sofort Ihren richtigen Ansprechpartner
                  </h3>
                  <p className="text-sm text-neutral-600 sm:text-base">
                    Geben Sie Ihre Postleitzahl ein – wir ordnen Sie dem passenden Standort zu. Die PLZ ist freiwillig;
                    jede Eingabe wird angenommen und mit Ihrer Anfrage weitergeleitet.
                  </p>
                  <label htmlFor="fb-wizard-plz" className="block text-sm font-medium text-[#0F4F68]">
                    Postleitzahl
                  </label>
                  <input
                    id="fb-wizard-plz"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    maxLength={5}
                    value={plz}
                    onChange={(e) => setPlz(e.target.value.replace(/\D/g, "").slice(0, 5))}
                    className="w-full max-w-xs rounded-xl border border-[#0F4F68]/20 px-4 py-3.5 text-lg outline-none transition focus:border-[#0F4F68]/45 focus:ring-2 focus:ring-[#0F4F68]/15"
                    placeholder="z. B. 87700"
                  />
                  {plzNorm.length > 0 && plzNorm.length < 5 ? (
                    <p className="text-sm text-neutral-600">
                      Sie können auch mit unvollständiger PLZ fortfahren – wir leiten Ihre Anfrage trotzdem weiter.
                    </p>
                  ) : null}
                </div>
              ) : null}

              {step === 2 ? (
                <div className="mt-6 animate-fade-in-up">
                  <h3 className="text-lg font-bold text-[#0F4F68] sm:text-xl">
                    Was für Hilfsleistungen benötigen Sie aktuell?
                  </h3>
                  <p className="mt-2 text-neutral-700">Mehrfachauswahl ist möglich.</p>

                  <ul className="mt-4 grid list-none gap-3">
                    {FEATURED_SERVICES.map((opt) => (
                      <li key={opt.key}>
                        <div className="relative rounded-2xl border-2 border-[#F78F2E]/55 bg-gradient-to-br from-[#fff8f2] via-[#fef3e8] to-[#fff8f2] p-1 shadow-[0_8px_24px_rgba(247,143,46,0.15)]">
                          <span className="absolute -top-2.5 left-4 z-10 inline-flex rounded-full bg-[#F78F2E] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                            Empfohlen
                          </span>
                          <HilfefinderServiceOptionButton
                            opt={opt}
                            active={leistungen.includes(opt.key)}
                            onToggle={() => toggleLeistung(opt.key)}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>

                  <p className="my-5 text-center text-sm font-semibold uppercase tracking-wide text-[#0F4F68]/60">
                    Weitere Leistungen
                  </p>

                  <ul className="grid list-none gap-2 sm:grid-cols-2">
                    {OTHER_SERVICES.map((opt) => (
                      <li key={opt.key} className="flex min-h-0 h-full">
                        <HilfefinderServiceOptionButton
                          opt={opt}
                          active={leistungen.includes(opt.key)}
                          onToggle={() => toggleLeistung(opt.key)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="mt-6 animate-fade-in-up space-y-4">
                  <p className="text-neutral-700">Wir haben für folgende Dienstleistungen freie Kapazitäten:</p>
                  <ul className="space-y-2">
                    {leistungenFuerErgebnis
                      .filter((l) => l.verfuegbarkeit === "direkt")
                      .concat(leistungenFuerErgebnis.filter((l) => l.verfuegbarkeit === "partner"))
                      .map((l, i) => (
                        <li
                          key={l.key}
                          className="flex items-start gap-2.5 rounded-xl border border-[#0F4F68]/12 bg-[#f8fcfd] px-3 py-2.5 opacity-0 animate-fade-in-up"
                          style={{ animationDelay: `${0.08 * (i + 1)}s` }}
                        >
                          <span
                            className={cn(
                              "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white",
                              l.verfuegbarkeit === "direkt" ? "bg-emerald-600" : "bg-[#F78F2E]",
                            )}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden
                            >
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-[#0F4F68] sm:text-base">{l.label}</p>
                            <p
                              className={cn(
                                "text-xs sm:text-sm",
                                l.verfuegbarkeit === "direkt" ? "text-emerald-700" : "text-[#c86d1f]",
                              )}
                            >
                              {l.verfuegbarkeit === "direkt"
                                ? "Verfügbar direkt über uns"
                                : "Verfügbar über unsere Kooperationspartner"}
                            </p>
                          </div>
                        </li>
                      ))}
                  </ul>
                  {leistungen
                    .map((key) => HILFEFINDER_SERVICE_ERGEBNIS[key])
                    .filter(Boolean)
                    .map((ergebnis, i) => (
                      <div
                        key={`ergebnis-${i}`}
                        className="rounded-2xl border border-[#0F4F68]/12 bg-white px-4 py-4 text-left sm:px-5"
                      >
                        <p className="text-sm leading-relaxed text-neutral-700 sm:text-base">{ergebnis!.text}</p>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => setStep(4)}
                            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#F78F2E] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#e67e22]"
                          >
                            {ergebnis!.ctaLabel}
                          </button>
                          {ergebnis!.mehrHref ? (
                            <Link
                              href={ergebnis!.mehrHref}
                              className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#0F4F68]/30 px-5 py-2.5 text-sm font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]"
                            >
                              Mehr erfahren
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    ))}
                </div>
              ) : null}

              {step === 4 ? (
                <div className="mt-6 animate-fade-in-up">
                  <h3 className="text-lg font-bold text-[#0F4F68] sm:text-xl">Wie möchten Sie den Kontakt?</h3>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => {
                        setKontaktArt("rueckruf");
                        setDatenschutz(false);
                      }}
                      className={cn(
                        hilfefinderOptionButtonClass,
                        "transition-all duration-300",
                        kontaktArt === "rueckruf" &&
                          "border-[#F78F2E]/65 bg-[#fff8f2] shadow-[0_6px_16px_rgba(247,143,46,0.14)]",
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <HilfefinderSelectMark active={kontaktArt === "rueckruf"} />
                        <HilfefinderStepFlatIcon kind="kontakt" />
                        <span>Ich wünsche einen Anruf</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setKontaktArt("selbst");
                        setDatenschutz(false);
                      }}
                      className={cn(
                        hilfefinderOptionButtonClass,
                        "transition-all duration-300",
                        kontaktArt === "selbst" &&
                          "border-[#F78F2E]/65 bg-[#fff8f2] shadow-[0_6px_16px_rgba(247,143,46,0.14)]",
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <HilfefinderSelectMark active={kontaktArt === "selbst"} />
                        <HilfefinderStepFlatIcon kind="kontakt" />
                        <span>Ich möchte Sie kontaktieren</span>
                      </span>
                    </button>
                  </div>

                  {kontaktArt === "rueckruf" ? (
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <input
                        required
                        value={vorname}
                        onChange={(e) => setVorname(e.target.value)}
                        placeholder="Vorname *"
                        className="rounded-xl border border-[#0F4F68]/20 px-4 py-3 text-base"
                        autoComplete="given-name"
                      />
                      <input
                        required
                        value={nachname}
                        onChange={(e) => setNachname(e.target.value)}
                        placeholder="Nachname *"
                        className="rounded-xl border border-[#0F4F68]/20 px-4 py-3 text-base"
                        autoComplete="family-name"
                      />
                      <input
                        required
                        value={telefon}
                        onChange={(e) => setTelefon(e.target.value)}
                        placeholder="Telefonnummer *"
                        className="rounded-xl border border-[#0F4F68]/20 px-4 py-3 text-base sm:col-span-2"
                        autoComplete="tel"
                        inputMode="tel"
                      />
                      <input
                        value={besteZeit}
                        onChange={(e) => setBesteZeit(e.target.value)}
                        placeholder="Passender Tag/Uhrzeit"
                        className="rounded-xl border border-[#0F4F68]/20 px-4 py-3 text-base sm:col-span-2"
                      />
                      <input
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="E-Mail *"
                        type="email"
                        className="rounded-xl border border-[#0F4F68]/20 px-4 py-3 text-base sm:col-span-2"
                        autoComplete="email"
                      />
                      <textarea
                        value={nachricht}
                        onChange={(e) => setNachricht(e.target.value)}
                        placeholder="Ihre Nachricht an uns (optional)"
                        className="min-h-[92px] rounded-xl border border-[#0F4F68]/20 px-4 py-3 text-base sm:col-span-2"
                      />
                    </div>
                  ) : null}

                  {kontaktArt === "selbst" ? (
                    <div className="mt-4 rounded-xl border border-[#0F4F68]/15 bg-[#f8fcfd] p-4 text-sm text-neutral-700">
                      <p className="font-semibold text-[#0F4F68]">Ihr Ansprechpartner für Ihre PLZ</p>
                      {standortMatch === "nearest" && plzNorm.length === 5 ? (
                        <p className="mt-1 text-xs text-neutral-600 sm:text-sm">
                          Nächster Standort zu Ihrer Postleitzahl – Ihre Anfrage geht an dieses Team.
                        </p>
                      ) : null}
                      <div className="mt-2 space-y-1">
                        <p className="font-medium text-[#0F4F68]">{finalerStandort.name}</p>
                        <p>{finalerStandort.address}</p>
                        <p>
                          Telefon:{" "}
                          <GtmPhoneLink
                            className="font-bold text-[#0F4F68] underline"
                            href={finalerStandort.phoneHref}
                            sourceComponent="fb_landing_haushalt_alltags_result_tel"
                            plz={plzNorm.length === 5 ? plzNorm : undefined}
                            service={leistungen.length > 0 ? leistungen.join(",") : undefined}
                          >
                            {finalerStandort.phone}
                          </GtmPhoneLink>
                        </p>
                        <p>
                          E-Mail:{" "}
                          <GtmMailtoLink
                            className="text-[#0F4F68] underline"
                            href={`mailto:${finalerStandort.email}`}
                            sourceComponent="fb_landing_haushalt_alltags_result_email"
                            plz={plzNorm.length === 5 ? plzNorm : undefined}
                            service={leistungen.length > 0 ? leistungen.join(",") : undefined}
                          >
                            {finalerStandort.email}
                          </GtmMailtoLink>
                        </p>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <input
                          required
                          value={vorname}
                          onChange={(e) => setVorname(e.target.value)}
                          placeholder="Vorname *"
                          className="rounded-xl border border-[#0F4F68]/20 px-4 py-3 text-base"
                          autoComplete="given-name"
                        />
                        <input
                          required
                          value={nachname}
                          onChange={(e) => setNachname(e.target.value)}
                          placeholder="Nachname *"
                          className="rounded-xl border border-[#0F4F68]/20 px-4 py-3 text-base"
                          autoComplete="family-name"
                        />
                        <input
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="E-Mail *"
                          type="email"
                          className="rounded-xl border border-[#0F4F68]/20 px-4 py-3 text-base sm:col-span-2"
                          autoComplete="email"
                        />
                        <input
                          required
                          value={telefon}
                          onChange={(e) => setTelefon(e.target.value)}
                          placeholder="Telefonnummer *"
                          className="rounded-xl border border-[#0F4F68]/20 px-4 py-3 text-base sm:col-span-2"
                          autoComplete="tel"
                          inputMode="tel"
                        />
                        <textarea
                          value={nachricht}
                          onChange={(e) => setNachricht(e.target.value)}
                          placeholder="Ihre Nachricht *"
                          className="min-h-[96px] rounded-xl border border-[#0F4F68]/20 px-4 py-3 text-base sm:col-span-2"
                        />
                      </div>
                    </div>
                  ) : null}

                  {kontaktArt === "rueckruf" || kontaktArt === "selbst" ? (
                    <>
                      <div className="mt-5">
                        <label htmlFor="fb-wizard-contact-source" className="block text-sm font-semibold text-[#0F4F68]">
                          Wie sind Sie auf uns aufmerksam geworden? *
                        </label>
                        <select
                          id="fb-wizard-contact-source"
                          name="contactSource"
                          required
                          value={contactSource}
                          onChange={(e) => setContactSource(e.target.value)}
                          className="mt-1 block w-full rounded-xl border border-[#0F4F68]/20 px-4 py-3 text-base outline-none transition focus:border-[#0F4F68]/45"
                        >
                          <option value="" disabled>
                            Bitte wählen …
                          </option>
                          {CONTACT_SOURCE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-5 rounded-xl border border-[#0F4F68]/12 bg-[#fafbfc] p-4 sm:p-5">
                        <label className="flex cursor-pointer items-start gap-3 text-sm text-neutral-700 sm:text-base">
                          <input
                            type="checkbox"
                            checked={datenschutz}
                            onChange={(e) => setDatenschutz(e.target.checked)}
                            className="mt-1 h-4 w-4 shrink-0 rounded border-neutral-300 text-[#0F4F68] focus:ring-[#0F4F68]"
                            aria-required="true"
                          />
                          <span>
                            Ich habe die{" "}
                            <Link
                              href="/datenschutz"
                              className="font-semibold text-[#0F4F68] underline underline-offset-2 hover:no-underline"
                            >
                              Datenschutzerklärung
                            </Link>{" "}
                            gelesen und stimme der Verarbeitung meiner Daten zum Zweck der Kontaktaufnahme zu. *
                          </span>
                        </label>
                      </div>
                    </>
                  ) : null}
                </div>
              ) : null}

              {step === 5 ? (
                <div className="mt-6 animate-fade-in-up space-y-5 text-center">
                  <div className="rounded-2xl bg-[#F2F9FA] p-6 sm:p-8">
                    <h3 className="text-2xl font-extrabold text-[#0F4F68] sm:text-3xl">
                      Vielen Dank! Ihre Anfrage ist bei uns eingegangen.
                    </h3>
                    <p className="mt-2 text-base text-neutral-700 sm:text-lg">Wir melden uns in Kürze bei Ihnen zurück.</p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#0F4F68]/30 px-5 py-2.5 font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]"
                  >
                    Schließen
                  </button>
                </div>
              ) : null}

      {error ? (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {step < 5 ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={zurueck}
              className="inline-flex min-h-[50px] flex-1 items-center justify-center rounded-xl border border-[#0F4F68]/30 px-6 py-2.5 text-[1.03rem] font-semibold text-[#0F4F68] hover:bg-[#F2F9FA] sm:flex-none"
            >
              Zurück
            </button>
          ) : null}

          {step < 4 ? (
            <button
              type="button"
              onClick={weiter}
              className="inline-flex min-h-[50px] flex-1 items-center justify-center rounded-xl bg-[#F78F2E] px-6 py-2.5 text-[1.03rem] font-semibold text-white hover:bg-[#e67e22] sm:flex-none"
            >
              Weiter
            </button>
          ) : null}

          {step === 4 ? (
            <button
              type="button"
              onClick={absenden}
              disabled={submitting}
              className="inline-flex min-h-[50px] flex-1 items-center justify-center rounded-xl bg-[#F78F2E] px-6 py-2.5 text-[1.03rem] font-semibold text-white hover:bg-[#e67e22] disabled:cursor-not-allowed disabled:opacity-70 sm:flex-none"
            >
              {submitting ? "Wird gesendet …" : "Anfrage senden"}
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
