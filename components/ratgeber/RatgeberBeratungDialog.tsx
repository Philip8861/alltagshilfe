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
  HilfefinderServiceOptionButton,
} from "@/components/hilfefinder/HilfefinderServiceMarkups";
import { ContactForm } from "@/components/forms/ContactForm";
import {
  HILFEFINDER_FALLBACK_BAD_GROENENBACH,
  HILFEFINDER_SERVICE_OPTIONEN,
  type HilfefinderServiceKey,
} from "@/config/hilfefinder-services";
import { buildStandortPageHref, findStandortByPlz, getOrtByPlz, type Standort } from "@/config/standorte";
import { RatgeberArticleReadProgressBar } from "@/components/ratgeber/RatgeberArticleReadProgress";
import { buildRatgeberBeratungInitialMessage } from "@/lib/ratgeber/beratung-dialog-message";
import { contactTopicFromHilfefinderServices } from "@/lib/ratgeber/contact-topic-from-services";
import { cn } from "@/lib/utils";

export type RatgeberBeratungOpenOptions = {
  preselectedServices?: HilfefinderServiceKey[];
  contextNote?: string;
};

type RatgeberBeratungCtxValue = { open: (opts?: RatgeberBeratungOpenOptions) => void };

const RatgeberBeratungCtx = createContext<RatgeberBeratungCtxValue | null>(null);

export function useRatgeberBeratung() {
  return useContext(RatgeberBeratungCtx);
}

const STEP_MOTIVATION: Record<number, string> = {
  1: "In vier Schritten zum passenden Ansprechpartner.",
  2: "Damit wir den richtigen Standort für Sie anzeigen können.",
  3: "Neu: Pflegeshop und Inkontinenz – vielleicht auch für Sie interessant.",
  4: "Ihr Ansprechpartner und unser Kontaktformular.",
};

const TOTAL_STEPS = 4;

export function RatgeberBeratungProvider({ children }: { children: ReactNode }) {
  const [started, setStarted] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [step, setStep] = useState(1);
  const [leistungen, setLeistungen] = useState<HilfefinderServiceKey[]>([]);
  const [plz, setPlz] = useState("");
  const [contextNote, setContextNote] = useState<string | undefined>();
  const [error, setError] = useState("");

  const resetFlow = useCallback(() => {
    setStep(1);
    setLeistungen([]);
    setPlz("");
    setContextNote(undefined);
    setError("");
  }, []);

  const openDialog = useCallback((opts?: RatgeberBeratungOpenOptions) => {
    const pre = opts?.preselectedServices;
    setLeistungen(pre?.length ? [...pre] : []);
    setContextNote(opts?.contextNote);
    setPlz("");
    setStep(1);
    setError("");
    setStarted(true);
  }, []);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!started) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [started]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("ahs-konfigurator-open-state", {
        detail: { open: started },
      }),
    );
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setStarted(false);
        resetFlow();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, resetFlow]);

  const plzNorm = plz.replace(/\D/g, "").slice(0, 5);
  const standort: Standort | undefined = useMemo(
    () => (plzNorm.length === 5 ? findStandortByPlz(plzNorm) : undefined),
    [plzNorm],
  );
  const finalerStandort = standort ?? HILFEFINDER_FALLBACK_BAD_GROENENBACH;

  const ausgewaehlte = useMemo(
    () => HILFEFINDER_SERVICE_OPTIONEN.filter((o) => leistungen.includes(o.key)),
    [leistungen],
  );

  const toggleLeistung = (key: HilfefinderServiceKey) => {
    setLeistungen((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const weiter = () => {
    setError("");
    if (step === 1 && leistungen.length === 0) {
      setError("Bitte wählen Sie mindestens eine Leistung aus.");
      return;
    }
    if (step === 2 && plzNorm.length !== 5) {
      setError("Bitte geben Sie eine gültige 5-stellige PLZ ein – oder überspringen Sie den Schritt.");
      return;
    }
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  };

  const zurueck = () => {
    setError("");
    setStep((s) => Math.max(1, s - 1));
  };

  const plzUeberspringen = () => {
    setError("");
    setPlz("");
    setStep(3); // Pflegeshop-/Inkontinenz-Hinweis, danach Kontakt
  };

  const ortFromPlz = plzNorm.length === 5 ? getOrtByPlz(plzNorm) : "";
  const standortPageHref =
    plzNorm.length === 5 && ortFromPlz
      ? buildStandortPageHref(finalerStandort, { plz: plzNorm, ort: ortFromPlz })
      : `/standorte/${finalerStandort.pageSlug}`;

  const contactTopic = contactTopicFromHilfefinderServices(leistungen);
  const initialMessage = buildRatgeberBeratungInitialMessage({
    contextNote,
    plz: plzNorm,
    serviceLabels: ausgewaehlte.map((a) => a.label),
    usedFallbackStandort: !standort && step === 4,
  });

  const formKey = `${plzNorm}-${leistungen.join(",")}-s${step}`;

  return (
    <RatgeberBeratungCtx.Provider value={{ open: openDialog }}>
      {children}
      {started && portalReady
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#0F4F68]/45 p-3 backdrop-blur-[2px] sm:p-6"
              role="presentation"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                  setStarted(false);
                  resetFlow();
                }
              }}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="ratgeber-beratung-dialog-title"
                className="max-h-[92vh] w-full max-w-4xl overflow-y-auto animate-fade-in-up rounded-2xl border border-[#0F4F68]/15 bg-white p-5 shadow-2xl sm:p-7"
              >
                <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <p className="justify-self-start text-sm font-bold uppercase tracking-wide text-[#0F4F68]/80">
                    Schritt {step} von {TOTAL_STEPS}
                  </p>
                  <p className="text-center text-xl font-extrabold text-[#0F4F68] sm:text-2xl">
                    {STEP_MOTIVATION[step]}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStarted(false);
                      resetFlow();
                    }}
                    className="justify-self-end inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#0F4F68]/25 text-2xl font-extrabold leading-none text-[#0F4F68] hover:bg-[#F2F9FA]"
                    aria-label="Beratungsdialog schließen"
                  >
                    ×
                  </button>
                </div>

                <h2 id="ratgeber-beratung-dialog-title" className="sr-only">
                  Persönliche Beratung – {STEP_MOTIVATION[step]}
                </h2>

                {step === 1 ? (
                  <div className="mt-6 animate-fade-in-up">
                    <h3 className="text-lg font-bold text-[#0F4F68] sm:text-xl">
                      Zu welcher Leistung wünschen Sie Beratung?
                    </h3>
                    <p className="mt-2 text-neutral-700">Mehrfachauswahl ist möglich.</p>
                    <ul className="mt-4 grid list-none gap-2 sm:grid-cols-2">
                      {HILFEFINDER_SERVICE_OPTIONEN.map((opt) => (
                        <li key={opt.key}>
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

                {step === 2 ? (
                  <div className="mt-6 space-y-4 animate-fade-in-up">
                    <h3 className="text-lg font-bold text-[#0F4F68] sm:text-xl">
                      Ermitteln Sie Ihren regionalen Ansprechpartner
                    </h3>
                    <p className="text-neutral-700">
                      Geben Sie Ihre Postleitzahl ein. So können wir den zuständigen Standort und die Kontaktdaten
                      anzeigen.
                    </p>
                    <label htmlFor="ratgeber-beratung-plz" className="block text-sm font-medium text-[#0F4F68]">
                      PLZ
                    </label>
                    <input
                      id="ratgeber-beratung-plz"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      maxLength={5}
                      value={plz}
                      onChange={(e) => setPlz(e.target.value.replace(/\D/g, "").slice(0, 5))}
                      className="w-full max-w-xs rounded-xl border border-[#0F4F68]/20 px-4 py-3 text-base outline-none ring-0 transition focus:border-[#0F4F68]/45"
                      placeholder="z. B. 87700"
                    />
                    <div>
                      <button
                        type="button"
                        onClick={plzUeberspringen}
                        className="inline-flex min-h-[42px] items-center rounded-lg border border-[#0F4F68]/30 px-4 py-2 text-sm font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]"
                      >
                        Überspringen
                      </button>
                      <span className="ml-3 text-sm text-neutral-600">
                        Ohne PLZ geht es weiter – zuerst ein kurzer Hinweis zu Shop und Inkontinenz, dann zu Ihrem
                        Ansprechpartner.
                      </span>
                    </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="mt-6 animate-fade-in-up space-y-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-[#F78F2E] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white">
                        Jetzt neu
                      </span>
                      <span className="text-sm font-semibold text-[#0F4F68]">Pflegeshop und Inkontinenzversorgung</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0F4F68] sm:text-xl">
                      Das bieten wir Ihnen zusätzlich – kompakt erklärt
                    </h3>
                    <p className="text-[1.02rem] leading-relaxed text-neutral-700">
                      Seit kurzem können Sie bei uns nicht nur Beratung und klassische Leistungen anfragen: In unserem{" "}
                      <strong className="font-semibold text-neutral-900">Pflegeshop</strong> finden Sie ausgewählte,
                      hochwertige Artikel rund um Pflege und Alltag zu Hause – von hilfreichen Hilfsmitteln bis zu
                      Produkten, die den Pflegealltag erleichtern. Alles ist übersichtlich zusammengestellt, damit Sie
                      schnell Orientierung haben.
                    </p>
                    <p className="text-[1.02rem] leading-relaxed text-neutral-700">
                      Zusätzlich ist eine{" "}
                      <strong className="font-semibold text-neutral-900">Inkontinenzversorgung über uns</strong> möglich:{" "}
                      In vielen Fällen können Sie die Abrechnung über ein Rezept nutzen – wir erklären Ihnen gern, wie der
                      Ablauf funktioniert und welche Voraussetzungen dazugehören.
                    </p>
                    <p className="text-[1.02rem] leading-relaxed text-neutral-700">
                      Für die <strong className="font-semibold text-neutral-900">Pflegebox</strong> (kostenfreie
                      Pflegehilfsmittel im Rahmen der Kranken- und Pflegekasse) steht Ihnen zudem ein{" "}
                      <strong className="font-semibold text-neutral-900">Online-Konfigurator</strong> zur Verfügung: Damit
                      stellen Sie Ihre Auswahl schnell und verständlich zusammen und kommen ohne Umwege an die passenden
                      Artikel.
                    </p>
                    <div className="flex flex-col gap-3 rounded-xl border border-[#0F4F68]/12 bg-[#f8fcfd] p-4 sm:flex-row sm:flex-wrap sm:gap-4 sm:p-5">
                      <Link
                        href="/pflegeshop"
                        className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-[#0F4F68] px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-[#0c3d52] sm:flex-initial sm:px-5"
                      >
                        Zum Pflegeshop
                      </Link>
                      <Link
                        href="/inkontinenzversorgung"
                        className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl border-2 border-[#0F4F68] bg-white px-4 py-2.5 text-center text-sm font-semibold text-[#0F4F68] hover:bg-[#f2f9fa] sm:flex-initial sm:px-5"
                      >
                        Inkontinenzversorgung
                      </Link>
                      <Link
                        href="/pflegehilfsmittel/pflegebox-konfigurator"
                        className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-[#F78F2E]/60 bg-[#fff8f2] px-4 py-2.5 text-center text-sm font-semibold text-[#b35f18] hover:bg-[#fff0e6] sm:flex-initial sm:px-5"
                      >
                        Zum Pflegebox-Konfigurator
                      </Link>
                    </div>
                    <p className="text-sm text-neutral-600">
                      Wenn Sie möchten, klicken Sie sich die Angebote in Ruhe durch. Mit „Weiter“ geht es danach zu Ihrem
                      Ansprechpartner und dem Kontaktformular.
                    </p>
                  </div>
                ) : null}

                {step === 4 ? (
                  <div className="mt-6 animate-fade-in-up space-y-6">
                    {!standort && plzNorm.length === 5 ? (
                      <p className="rounded-xl border border-[#F78F2E]/35 bg-[#fff8f2] px-4 py-3 text-sm font-medium text-[#7a4d28]">
                        Für diese PLZ ist kein separates Büro hinterlegt. Wir beraten Sie gerne zu Ihren Fragen – unten
                        erreichen Sie unser Team in Bad Grönenbach.
                      </p>
                    ) : !standort && plzNorm.length < 5 ? (
                      <p className="rounded-xl border border-[#0F4F68]/15 bg-[#f8fcfd] px-4 py-3 text-sm text-neutral-700">
                        Wir beraten Sie gerne zu Ihren Fragen. Sie haben keine PLZ angegeben – hier finden Sie unsere
                        Zentrale in Bad Grönenbach.
                      </p>
                    ) : (
                      <p className="text-sm font-medium text-[#0F4F68]">
                        Hier ist Ihr passender Ansprechpartner für die eingegebene PLZ.
                      </p>
                    )}

                    <div className="rounded-xl border border-[#0F4F68]/15 bg-[#f8fcfd] p-4 sm:p-5">
                      <p className="text-lg font-bold text-[#0F4F68]">{finalerStandort.name}</p>
                      <p className="mt-2 text-neutral-800">{finalerStandort.address}</p>
                      <p className="mt-1 text-sm text-neutral-600">{finalerStandort.hours}</p>
                      <p className="mt-3">
                        Telefon:{" "}
                        <a className="font-bold text-[#0F4F68] underline" href={finalerStandort.phoneHref}>
                          {finalerStandort.phone}
                        </a>
                      </p>
                      <p>
                        E-Mail:{" "}
                        <a className="text-[#0F4F68] underline" href={`mailto:${finalerStandort.email}`}>
                          {finalerStandort.email}
                        </a>
                      </p>
                      <div className="mt-4">
                        <Link
                          href={standortPageHref}
                          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#0F4F68] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0c3d52]"
                        >
                          Zur Standortseite
                        </Link>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#0F4F68]">Kontaktformular</h3>
                      <p className="mt-1 text-sm text-neutral-600">
                        Schreiben Sie uns – wir melden uns zeitnah. Ihre Angaben aus dem Ratgeber sind bereits als
                        Vorschlag in der Nachricht eingetragen.
                      </p>
                      <div className="mt-5">
                        <ContactForm
                          key={formKey}
                          fieldIdPrefix="ratgeber-beratung-"
                          topicHidden
                          hiddenTopic={contactTopic}
                          initialMessage={initialMessage}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                {error ? (
                  <p className="mt-4 text-sm text-red-600" role="alert">
                    {error}
                  </p>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-3">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={zurueck}
                      className="inline-flex min-h-[50px] items-center justify-center rounded-xl border border-[#0F4F68]/30 px-6 py-2.5 text-[1.03rem] font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]"
                    >
                      Zurück
                    </button>
                  ) : null}
                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={weiter}
                      className="inline-flex min-h-[50px] items-center justify-center rounded-xl bg-[#F78F2E] px-6 py-2.5 text-[1.03rem] font-semibold text-white hover:bg-[#e67e22]"
                    >
                      Weiter
                    </button>
                  ) : null}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </RatgeberBeratungCtx.Provider>
  );
}

/** Primärer orange CTA wie in Ratgeber-Artikeln (öffnet das Beratungs-Popup). */
export function RatgeberBeratungCtaButton({
  children,
  className,
  variant = "primary",
  preselectedServices,
  contextNote,
  ...rest
}: Omit<React.ComponentProps<"button">, "type" | "onClick"> & {
  variant?: "primary" | "outline";
  preselectedServices?: HilfefinderServiceKey[];
  contextNote?: string;
}) {
  const ctx = useRatgeberBeratung();
  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-h-[2.875rem] items-center justify-center rounded-lg px-6 text-[0.95rem] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2",
        variant === "primary" && "bg-[#F78F2E] text-white hover:bg-[#e8862a]",
        variant === "outline" &&
          "border border-[#F78F2E] bg-transparent text-[#F78F2E] hover:bg-[#fffbf7]",
        className,
      )}
      onClick={() => ctx?.open({ preselectedServices, contextNote })}
      {...rest}
    >
      {children}
    </button>
  );
}

const SIDEBAR_ATTENTION_MS = 30_000;
const SIDEBAR_ATTENTION_DURATION_MS = 900;

/** Sticky-Sidebar-Kachel „Persönliche Beratung“ (Desktop). */
export function RatgeberSidebarBeratungTeaser({
  supportLine,
  title = "Persönliche Beratung",
  buttonText = "Jetzt kostenlos beraten lassen",
  preselectedServices,
  contextNote,
  articleSectionIds,
}: {
  supportLine: string;
  title?: string;
  buttonText?: string;
  preselectedServices?: HilfefinderServiceKey[];
  contextNote?: string;
  /** Anker-IDs der Kapitel (Reihenfolge wie Inhaltsverzeichnis) für den Lesefortschritt. */
  articleSectionIds?: readonly string[];
}) {
  const ctx = useRatgeberBeratung();
  const [attentionPulse, setAttentionPulse] = useState(false);
  const attentionClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const trigger = () => {
      if (attentionClearRef.current) clearTimeout(attentionClearRef.current);
      setAttentionPulse(true);
      attentionClearRef.current = setTimeout(() => {
        setAttentionPulse(false);
        attentionClearRef.current = null;
      }, SIDEBAR_ATTENTION_DURATION_MS);
    };

    const intervalId = window.setInterval(trigger, SIDEBAR_ATTENTION_MS);
    return () => {
      clearInterval(intervalId);
      if (attentionClearRef.current) clearTimeout(attentionClearRef.current);
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-200/95 bg-[linear-gradient(180deg,#fdfefe_0%,#ffffff_100%)] px-4 py-4 shadow-[0_2px_14px_-10px_rgba(15,79,104,0.1)] sm:px-5 sm:py-5">
      <div aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#F78F2E]/50 to-[#0F4F68]/25" />
      <p className="text-sm font-semibold text-[#0F4F68]">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">{supportLine}</p>
      <button
        type="button"
        onClick={() => ctx?.open({ preselectedServices, contextNote })}
        className={cn(
          "mt-4 inline-flex min-h-[2.75rem] w-full items-center justify-center rounded-lg border border-[#F78F2E] bg-[#F78F2E] px-3 text-[0.9rem] font-semibold text-white transition-all duration-300 hover:bg-[#e8862a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2",
          attentionPulse &&
            "scale-[1.02] shadow-[0_0_22px_rgba(247,143,46,0.75)] ring-2 ring-[#F78F2E]/90 ring-offset-2 ring-offset-white",
        )}
      >
        {buttonText}
      </button>
      {articleSectionIds && articleSectionIds.length > 0 ? (
        <RatgeberArticleReadProgressBar sectionIds={articleSectionIds} />
      ) : null}
    </div>
  );
}
