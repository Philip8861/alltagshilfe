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

type RatgeberBeratungCtxValue = {
  open: (opts?: RatgeberBeratungOpenOptions) => void;
  standortContactProofsBySlug: Record<string, string>;
};

const RatgeberBeratungCtx = createContext<RatgeberBeratungCtxValue | null>(null);

export function useRatgeberBeratung() {
  return useContext(RatgeberBeratungCtx);
}

const STEP_MOTIVATION: Record<number, string> = {
  1: "In vier Schritten zum passenden Ansprechpartner.",
  2: "Damit wir den richtigen Standort für Sie anzeigen können.",
  3: "Neu: Pflegeshop und Inkontinenz, vielleicht auch für Sie interessant.",
  4: "Ihr Ansprechpartner und unser Kontaktformular.",
};

const TOTAL_STEPS = 4;

export function RatgeberBeratungProvider({
  children,
  standortContactProofsBySlug = {},
}: {
  children: ReactNode;
  /** Serverseitig erzeugte Proofs für Standort-Slugs (Ratgeber-Kontakt mit PLZ-Zuordnung). */
  standortContactProofsBySlug?: Record<string, string>;
}) {
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
      setError("Bitte geben Sie eine gültige 5-stellige PLZ ein, oder überspringen Sie den Schritt.");
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
    <RatgeberBeratungCtx.Provider value={{ open: openDialog, standortContactProofsBySlug }}>
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
                  Persönliche Beratung: {STEP_MOTIVATION[step]}
                </h2>

                {step === 1 ? (
                  <div className="mt-6 animate-fade-in-up">
                    <h3 className="text-lg font-bold text-[#0F4F68] sm:text-xl">
                      Zu welcher Leistung wünschen Sie Beratung?
                    </h3>
                    <p className="mt-2 text-neutral-700">Mehrfachauswahl ist möglich.</p>
                    <ul className="mt-4 grid list-none gap-2 sm:grid-cols-2">
                      {HILFEFINDER_SERVICE_OPTIONEN.map((opt) => (
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
                        Ohne PLZ geht es weiter: zuerst ein kurzer Hinweis zu Shop und Inkontinenz, dann zu Ihrem
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
                      Das bieten wir Ihnen zusätzlich, kompakt erklärt
                    </h3>
                    <p className="text-[1.02rem] leading-relaxed text-neutral-700">
                      Seit kurzem können Sie bei uns nicht nur Beratung und klassische Leistungen anfragen: In unserem
                      Pflegeshop finden Sie ausgewählte, hochwertige Artikel rund um Pflege und Alltag zu Hause.
                    </p>
                    <p className="text-[1.02rem] leading-relaxed text-neutral-700">
                      Zusätzlich ist eine Inkontinenzversorgung über uns möglich: In vielen Fällen können Sie die
                      Abrechnung über ein Rezept nutzen, wir erklären Ihnen gern, wie der Ablauf funktioniert und welche
                      Voraussetzungen dazugehören.
                    </p>
                    <p className="text-[1.02rem] leading-relaxed text-neutral-700">
                      Für die Pflegebox (kostenfreie Pflegehilfsmittel im Rahmen Pflegekasse) steht Ihnen zudem ein
                      Online-Konfigurator zur Verfügung: Damit stellen Sie Ihre Auswahl schnell und verständlich zusammen
                      und kommen ohne Umwege an die passenden Artikel.
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
                        Für diese PLZ ist kein separates Büro hinterlegt. Wir beraten Sie gerne zu Ihren Fragen. Unten
                        erreichen Sie unser Team in Bad Grönenbach.
                      </p>
                    ) : !standort && plzNorm.length < 5 ? (
                      <p className="rounded-xl border border-[#0F4F68]/15 bg-[#f8fcfd] px-4 py-3 text-sm text-neutral-700">
                        Wir beraten Sie gerne zu Ihren Fragen. Sie haben keine PLZ angegeben. Hier finden Sie unsere
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
                        Schreiben Sie uns. Wir melden uns zeitnah. Ihre Angaben aus dem Ratgeber sind bereits als
                        Vorschlag in der Nachricht eingetragen.
                      </p>
                      <div className="mt-5">
                        <ContactForm
                          key={formKey}
                          fieldIdPrefix="ratgeber-beratung-"
                          topicHidden
                          hiddenTopic={contactTopic}
                          initialMessage={initialMessage}
                          standortContactProof={standortContactProofsBySlug[finalerStandort.pageSlug]}
                          routingPlz={plzNorm.length === 5 ? plzNorm : undefined}
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

const SIDEBAR_AD_ROTATE_MS = 30_000;
const SIDEBAR_BERATUNG_EYEBROW_GLOW_MS = 950;

type SidebarTeaserIconId = "shop" | "box" | "beratung";

function SidebarTeaserIconMark({ id }: { id: SidebarTeaserIconId }) {
  const boxClass =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-[#F78F2E]/40 bg-gradient-to-br from-[#fff8f2] to-white shadow-[0_6px_16px_-8px_rgba(247,143,46,0.55)]";
  return (
    <span className={boxClass} aria-hidden>
      {id === "shop" ? (
        <svg className="h-6 w-6 text-[#0F4F68]" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 9H6L5 9z"
          />
        </svg>
      ) : id === "box" ? (
        <svg className="h-6 w-6 text-[#0F4F68]" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
          />
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"
          />
        </svg>
      ) : (
        <svg className="h-6 w-6 text-[#0F4F68]" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
          />
        </svg>
      )}
    </span>
  );
}

type SidebarTeaserSlide =
  | { kind: "link"; icon: SidebarTeaserIconId; headline: string; body: string; href: string; ctaLabel: string; dotLabel: string }
  | { kind: "beratung"; icon: SidebarTeaserIconId; headline: string; body: string; ctaLabel: string; dotLabel: string };

const sidebarLinkCtaClass =
  "mt-4 inline-flex min-h-[2.75rem] w-full items-center justify-center rounded-lg border border-[#F78F2E] bg-[#F78F2E] px-3 text-[0.9rem] font-semibold text-white transition-all duration-300 hover:bg-[#e8862a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2";

const sidebarBeratungButtonClass =
  "mt-4 inline-flex min-h-[2.75rem] w-full items-center justify-center rounded-lg border border-[#F78F2E] bg-[#F78F2E] px-3 text-[0.9rem] font-semibold text-white transition-all duration-300 hover:bg-[#e8862a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2";

/** Sticky-Sidebar-Kachel „Persönliche Beratung“ (Desktop): rotiert Shop, Pflegebox und Beratungs-Popup. */
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
  const [eyebrowGlow, setEyebrowGlow] = useState(false);
  const eyebrowGlowClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [adIndex, setAdIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  const slides = useMemo((): SidebarTeaserSlide[] => {
    return [
      {
        kind: "link",
        icon: "shop",
        headline: "Pflegeshop",
        body: "Ausgewählte Pflege- und Alltagshilfen für zu Hause: übersichtlich und direkt über unseren Partnershop.",
        href: "/pflegeshop",
        ctaLabel: "Zum Pflegeshop",
        dotLabel: "Pflegeshop",
      },
      {
        kind: "link",
        icon: "box",
        headline: "Kostenfreie Pflegehilfsmittelbox",
        body: "Pflegehilfsmittel über die Pflegekasse: Wunschliste online erstellen und bequem nach Hause liefern lassen.",
        href: "/pflegehilfsmittel/kostenfreie-pflegehilfsmittel",
        ctaLabel: "Zur Infoseite Pflegebox",
        dotLabel: "Pflegehilfsmittelbox",
      },
      {
        kind: "beratung",
        icon: "beratung",
        headline: title,
        body: supportLine,
        ctaLabel: buttonText,
        dotLabel: "Persönliche Beratung",
      },
    ];
  }, [title, supportLine, buttonText]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => setAdIndex((i) => (i + 1) % 3), SIDEBAR_AD_ROTATE_MS);
    return () => clearInterval(id);
  }, [reduceMotion]);

  useEffect(() => {
    if (adIndex !== 2) {
      setEyebrowGlow(false);
      return;
    }
    if (reduceMotion) {
      setEyebrowGlow(false);
      return;
    }
    if (eyebrowGlowClearRef.current) clearTimeout(eyebrowGlowClearRef.current);
    setEyebrowGlow(true);
    eyebrowGlowClearRef.current = setTimeout(() => {
      setEyebrowGlow(false);
      eyebrowGlowClearRef.current = null;
    }, SIDEBAR_BERATUNG_EYEBROW_GLOW_MS);
    return () => {
      if (eyebrowGlowClearRef.current) clearTimeout(eyebrowGlowClearRef.current);
    };
  }, [adIndex, reduceMotion]);

  const slide = slides[adIndex]!;

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-[#F78F2E]/30 bg-[linear-gradient(165deg,#fffdfb_0%,#ffffff_55%,#f8fcfd_100%)] px-4 py-4 shadow-[0_12px_36px_-14px_rgba(15,79,104,0.28)] ring-1 ring-[#0F4F68]/8 sm:px-5 sm:py-5">
      <div aria-hidden className="absolute inset-x-0 top-0 h-[4px] bg-gradient-to-r from-[#F78F2E] via-[#ffb366] to-[#0F4F68]/40" />
      <p
        className={cn(
          "text-[0.65rem] font-bold uppercase tracking-[0.12em] transition-all duration-300 ease-out",
          eyebrowGlow && adIndex === 2
            ? "scale-[1.03] text-[#F78F2E] drop-shadow-[0_0_14px_rgba(247,143,46,0.9)]"
            : "text-[#0F4F68]/65",
        )}
      >
        Persönliche Beratung
      </p>
      {articleSectionIds && articleSectionIds.length > 0 ? (
        <RatgeberArticleReadProgressBar
          sectionIds={articleSectionIds}
          compact
          className="mt-3 border-b border-neutral-200/80 pb-3"
        />
      ) : null}
      <div
        className="mt-3 min-h-[9.25rem] sm:min-h-[8.75rem]"
        role="region"
        aria-roledescription="Karussell"
        aria-label="Wechselnde Hinweise zu Angeboten und Beratung"
      >
        <div key={adIndex} className="animate-fade-in-up">
          <div className="flex gap-3">
            <SidebarTeaserIconMark id={slide.icon} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#0F4F68]">{slide.headline}</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{slide.body}</p>
            </div>
          </div>
          {slide.kind === "link" ? (
            <Link href={slide.href} className={cn(sidebarLinkCtaClass, "mt-3")}>
              {slide.ctaLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => ctx?.open({ preselectedServices, contextNote })}
              className={cn(sidebarBeratungButtonClass, "mt-3")}
            >
              {slide.ctaLabel}
            </button>
          )}
        </div>
      </div>
      <nav className="mt-3 flex justify-center gap-2" aria-label="Hinweis auswählen">
        {slides.map((s, i) => (
          <button
            key={i}
            type="button"
            aria-label={s.dotLabel}
            aria-current={i === adIndex ? "true" : undefined}
            onClick={() => setAdIndex(i)}
            className={cn(
              "h-2.5 w-2.5 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2",
              i === adIndex ? "bg-[#F78F2E]" : "bg-neutral-300 hover:bg-neutral-400",
            )}
          />
        ))}
      </nav>
    </div>
  );
}
