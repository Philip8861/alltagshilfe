"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { getOrtByPlz } from "@/config/standorte";
import { submitKarriere } from "@/lib/actions/karriere";
import { jobTitleToStellenangebot } from "@/lib/karriere-job-map";
import {
  KARRIERE_FILE_INPUT_ACCEPT,
  KARRIERE_MAX_ANHAENGE,
  validateKarriereAttachmentsList,
} from "@/lib/karriere-attachments";
import { cn } from "@/lib/utils";

type BewerbungsWizardDialogProps = {
  jobTitle: string;
  /** Vom PLZ Vorabdialog; Kontaktschritt wird vorausgefüllt wenn bekannt. */
  initialPlz?: string;
  onDismiss: () => void;
};

/** Gleiche Stellen wie auf der Karriere-Seite (Anzeige-Titel). */
export const KARRIERE_WIZARD_OFFENE_STELLEN = [
  "Alltagshelfer*in (m/w/d)",
  "Pflegeberater*in (m/w/d)",
  "Buchhalter*in (m/w/d)",
  "Bürofachkraft (m/w/d)",
] as const;

type WizardAnswers = {
  eintritt: string;
  pensum: string;
  erfahrung: string;
  erfahrungDetail: string;
  mobilitaet: string;
  vorname: string;
  nachname: string;
  email: string;
  phone: string;
  plz: string;
  ort: string;
  erreichbarkeit: string;
};

const EINTRITT_OPTIONS = [
  { id: "sofort", label: "Ab sofort / sehr kurzfristig" },
  { id: "2-4w", label: "In 2–4 Wochen" },
  { id: "monat", label: "Ab nächstem Monat" },
  { id: "unbekannt", label: "Noch nicht bekannt" },
] as const;

const PENSUM_OPTIONS = [
  { id: "vollzeit", label: "Vollzeit" },
  { id: "h35-40", label: "35–40 Std./Woche" },
  { id: "h30-35", label: "30–35 Std./Woche" },
  { id: "h25-30", label: "25–30 Std./Woche" },
  { id: "h20-25", label: "20–25 Std./Woche" },
  { id: "h15-20", label: "15–20 Std./Woche" },
  { id: "h10-15", label: "10–15 Std./Woche" },
  { id: "minijob", label: "Minijob (unter 9 Stunden)" },
] as const;

const ERFAHRUNG_OPTIONS = [
  { id: "lang", label: "Ja, mehrjährige Erfahrung" },
  { id: "wenig", label: "Erste Erfahrung / Praktika" },
  { id: "quer", label: "Quereinstieg" },
] as const;

const MOBILITAET_OPTIONS = [
  { id: "ja", label: "Ja, Führerschein Klasse B und PKW sind vorhanden" },
  { id: "nein", label: "Nein, Führerschein oder PKW nicht vorhanden" },
] as const;

const ERREICHBAR_OPTIONS = [
  { id: "vm", label: "Vormittags (ca. 8–12 Uhr)" },
  { id: "nm", label: "Nachmittags (ca. 13–17 Uhr)" },
  { id: "abend", label: "Abends (nach 17 Uhr)" },
  { id: "email", label: "Am liebsten per E-Mail" },
  { id: "flex", label: "Tagsüber flexibel erreichbar" },
] as const;

const STEP_LABELS = [
  "Stelle",
  "Start",
  "Pensum",
  "Erfahrung",
  "Mobilität",
  "Kontakt",
  "Kontrolle",
  "Fertig",
] as const;

/** Spruch pro Schritt (ersetzt den festen Kurzcheck-Titel im Kopf). */
const WIZARD_STEP_INTROS: readonly string[] = [
  "Ok, fangen wir direkt an.",
  "Prima, als Nächstes Ihr möglicher Starttermin.",
  "Weiter geht es: Welches Pensum passt zu Ihnen?",
  "Jetzt sind Sie gefragt: Wie steht es mit Ihrer Erfahrung?",
  "Kurz und klar: Mobilität für den Einsatz vor Ort.",
  "So erreichen wir Sie: Kontaktdaten, PLZ, Ort und gute Erreichbarkeit.",
  "Gleich geschafft: Prüfen Sie alle Angaben vor dem Absenden.",
  "Vielen Dank für Ihre Bewerbung!",
];

const MOBILITAET_HINWEIS =
  "Für die Ausübung der Tätigkeit sind Führerschein Klasse B und ein PKW leider zwingend erforderlich. Ohne beides können wir eine Bewerbung in der Regel nicht weiterbearbeiten. Bitte wählen Sie „Ja“, wenn Sie die Voraussetzungen erfüllen, oder brechen Sie mit „Abbrechen“ ab.";

const INITIAL: WizardAnswers = {
  eintritt: "",
  pensum: "",
  erfahrung: "",
  erfahrungDetail: "",
  mobilitaet: "",
  vorname: "",
  nachname: "",
  email: "",
  phone: "",
  plz: "",
  ort: "",
  erreichbarkeit: "",
};

function buildInitialWizardAnswers(initialPlz?: string): WizardAnswers {
  if (!initialPlz || !/^\d{5}$/.test(initialPlz)) {
    return INITIAL;
  }
  const ort = getOrtByPlz(initialPlz)?.trim() ?? "";
  return { ...INITIAL, plz: initialPlz, ort };
}

function pensumLabel(id: string): string {
  return PENSUM_OPTIONS.find((o) => o.id === id)?.label ?? id;
}

function buildAnmerkung(
  primaryTitle: string,
  additionalTitles: string[],
  a: WizardAnswers,
  dateiNamen: string[],
): string {
  const lines = [
    "--- Schnellcheck Bewerbung ---",
    `Hauptinteresse (Stelle): ${primaryTitle}`,
    additionalTitles.length > 0 ? `Weitere Interessen: ${additionalTitles.join("; ")}` : "Weitere Interessen: –",
    `Frühester Start: ${EINTRITT_OPTIONS.find((o) => o.id === a.eintritt)?.label ?? a.eintritt}`,
    `Pensum: ${pensumLabel(a.pensum)}`,
    `Erfahrung: ${ERFAHRUNG_OPTIONS.find((o) => o.id === a.erfahrung)?.label ?? a.erfahrung}`,
    `Mobilität (B + PKW): ${MOBILITAET_OPTIONS.find((o) => o.id === a.mobilitaet)?.label ?? a.mobilitaet}`,
    `Erreichbarkeit: ${ERREICHBAR_OPTIONS.find((o) => o.id === a.erreichbarkeit)?.label ?? a.erreichbarkeit}`,
    `PLZ / Wohnort: ${a.plz} ${a.ort.trim()}`,
  ];
  if (a.erfahrungDetail.trim()) {
    lines.push(`Kurz zum Werdegang / Erfahrung: ${a.erfahrungDetail.trim()}`);
  }
  if (dateiNamen.length > 0) {
    lines.push(`Ausgewählte Anhänge (Kurzcheck): ${dateiNamen.join(", ")}`);
  }
  return lines.join("\n");
}

function ChipGroup({
  options,
  value,
  onChange,
  name,
}: {
  options: readonly { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  name: string;
}) {
  return (
    <div
      className={
        /* Mobil: kein eigenes max-h/scroll — vermeidet Nested-Scroll + Scroll-Anker („Minijob“ springt zurück). Ab sm: kompaktes Panel mit internem Scroll. */
        "mt-4 grid min-h-0 gap-2.5 pr-1 pb-1 max-sm:max-h-none max-sm:overflow-visible sm:max-h-[min(52dvh,28rem)] sm:overflow-y-auto sm:overflow-x-hidden sm:overscroll-contain sm:touch-pan-y sm:grid-cols-2"
      }
    >
      {options.map((opt) => {
        const selected = value === opt.id;
        return (
          <label
            key={opt.id}
            className={cn(
              "flex min-h-[48px] cursor-pointer items-center rounded-2xl border-2 px-4 py-3 text-sm font-medium transition-colors",
              selected
                ? "border-[#0F4F68] bg-[#F2F9FA] text-[#0F4F68] shadow-sm"
                : "border-[#0F4F68]/15 bg-white text-neutral-800 hover:border-[#0F4F68]/35",
            )}
          >
            <input
              type="radio"
              name={name}
              value={opt.id}
              checked={selected}
              onChange={() => onChange(opt.id)}
              className="sr-only"
            />
            <span className="text-pretty">{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}

export function BewerbungsWizardDialog({ jobTitle, initialPlz, onDismiss }: BewerbungsWizardDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const wizardContentScrollRef = useRef<HTMLDivElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const submitProgressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const titleId = useId();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>(() => buildInitialWizardAnswers(initialPlz));
  const [additionalJobTitles, setAdditionalJobTitles] = useState<string[]>([]);
  const [wizardFiles, setWizardFiles] = useState<File[]>([]);
  const [fileHint, setFileHint] = useState<string | null>(null);
  const [mobilitaetModalOpen, setMobilitaetModalOpen] = useState(false);
  const [wizardLegalConsent, setWizardLegalConsent] = useState(false);
  const [wizardSubmitError, setWizardSubmitError] = useState<string | null>(null);
  /** useTransition deckt async Server Actions nicht zuverlässig ab – eigener State für UI + Fortschritt. */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);

  const clearSubmitProgressTimer = useCallback(() => {
    if (submitProgressTimerRef.current !== null) {
      clearInterval(submitProgressTimerRef.current);
      submitProgressTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearSubmitProgressTimer();
  }, [clearSubmitProgressTimer]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (!el.open) {
      el.showModal();
    }
    const onClose = () => onDismiss();
    el.addEventListener("close", onClose);
    return () => el.removeEventListener("close", onClose);
  }, [onDismiss]);

  useEffect(() => {
    if (step !== 6) setWizardSubmitError(null);
  }, [step]);

  useEffect(() => {
    wizardContentScrollRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [step]);

  const maxStep = STEP_LABELS.length - 1;
  const isSuccessStep = step === maxStep;
  /** Ab „Stelle“: erster Abschnitt schon sichtbar (Schritt 0 → 1/n). */
  const progressFraction = useMemo(
    () => Math.min(step + 1, STEP_LABELS.length) / STEP_LABELS.length,
    [step],
  );

  const isInitiativWizard = useMemo(() => jobTitle.toLowerCase().includes("initiativ"), [jobTitle]);

  const toggleAdditionalJob = useCallback((title: string) => {
    setAdditionalJobTitles((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  }, []);

  const onWizardFilesChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFileHint(null);
    const picked = e.target.files;
    if (!picked?.length) return;
    const next: File[] = [...wizardFiles];
    for (const f of [...picked]) {
      const merged = [...next, f];
      const fehler = validateKarriereAttachmentsList(merged);
      if (fehler) {
        setFileHint(fehler);
        e.target.value = "";
        return;
      }
      next.push(f);
    }
    setWizardFiles(next);
    e.target.value = "";
  }, [wizardFiles]);

  const removeWizardFile = useCallback((index: number) => {
    setWizardFiles((prev) => prev.filter((_, i) => i !== index));
    setFileHint(null);
  }, []);

  const canNext = useMemo(() => {
    if (step === 0) return true;
    if (step === 1) return Boolean(answers.eintritt);
    if (step === 2) return Boolean(answers.pensum);
    if (step === 3) return Boolean(answers.erfahrung);
    if (step === 4) return Boolean(answers.mobilitaet);
    if (step === 5) {
      const plzDigits = answers.plz.replace(/\D/g, "");
      return (
        answers.vorname.trim().length > 0 &&
        answers.nachname.trim().length > 0 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email.trim()) &&
        answers.phone.trim().length > 3 &&
        plzDigits.length === 5 &&
        answers.ort.trim().length > 0 &&
        Boolean(answers.erreichbarkeit)
      );
    }
    return true;
  }, [step, answers]);

  const goNext = useCallback(() => {
    if (step === 4 && answers.mobilitaet === "nein" && !isInitiativWizard) {
      setMobilitaetModalOpen(true);
      return;
    }
    setStep((s) => Math.min(s + 1, maxStep));
  }, [maxStep, step, answers.mobilitaet, isInitiativWizard]);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const submitWizard = useCallback(async () => {
    setWizardSubmitError(null);
    if (!wizardLegalConsent) {
      setWizardSubmitError("Bitte bestätigen Sie die AGB und die Datenschutzerklärung.");
      return;
    }
    const anhangFehler = validateKarriereAttachmentsList(wizardFiles);
    if (anhangFehler) {
      setWizardSubmitError(anhangFehler);
      return;
    }
    const stellenangebot = jobTitleToStellenangebot(jobTitle);
    const dateiNamen = wizardFiles.map((f) => f.name);
    const anmerkung = buildAnmerkung(jobTitle, additionalJobTitles, answers, dateiNamen);
    const fd = new FormData();
    fd.append("vorname", answers.vorname.trim());
    fd.append("nachname", answers.nachname.trim());
    fd.append("email", answers.email.trim());
    fd.append("phone", answers.phone.trim());
    fd.append("plz", answers.plz.replace(/\D/g, "").slice(0, 5));
    fd.append("ort", answers.ort.trim());
    fd.append("stellenangebot", stellenangebot);
    fd.append("anmerkung", anmerkung);
    fd.append("website", "");
    fd.append("agbs", "on");
    fd.append("datenschutzBewerbung", "on");
    fd.append("karriereWizardQuelle", "kurzcheck");
    for (const f of wizardFiles) {
      fd.append("bewerbungsdateien", f);
    }

    clearSubmitProgressTimer();
    setIsSubmitting(true);
    setSubmitProgress(12);
    submitProgressTimerRef.current = setInterval(() => {
      setSubmitProgress((p) => (p >= 88 ? p : Math.min(88, p + 4 + Math.random() * 9)));
    }, 170);

    try {
      const res = await submitKarriere(fd);
      clearSubmitProgressTimer();
      if (res.success) {
        setSubmitProgress(100);
        await new Promise((r) => setTimeout(r, 420));
        setStep(maxStep);
      } else {
        setWizardSubmitError(res.error ?? "Senden fehlgeschlagen. Bitte versuchen Sie es erneut.");
      }
    } catch (e) {
      clearSubmitProgressTimer();
      const raw = e instanceof Error ? e.message : String(e);
      const looksLikePayload =
        /body (?:size|limit)|payload too large|413|maximum.*exceeded|1\s*mb/i.test(raw) ||
        raw.includes("Failed to parse body");
      setWizardSubmitError(
        looksLikePayload
          ? "Die Datenmenge war zu groß (z. B. große Anhänge). Erlaubt sind bis zu 24 MB insgesamt und 8 MB pro Datei – bitte Dateien verkleinern oder aufteilen und erneut senden."
          : e instanceof Error && e.message
            ? `Senden fehlgeschlagen: ${e.message}`
            : "Senden fehlgeschlagen. Bitte versuchen Sie es erneut.",
      );
    } finally {
      clearSubmitProgressTimer();
      setIsSubmitting(false);
      setSubmitProgress(0);
    }
  }, [
    additionalJobTitles,
    answers,
    clearSubmitProgressTimer,
    jobTitle,
    maxStep,
    wizardFiles,
    wizardLegalConsent,
  ]);

  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      dialogRef.current?.close();
    }
  };

  const andereStellen = useMemo(
    () => KARRIERE_WIZARD_OFFENE_STELLEN.filter((t) => t !== jobTitle),
    [jobTitle],
  );

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClick={handleDialogClick}
      className={cn(
        "fixed inset-0 z-[110] m-0 max-h-none w-full max-w-none border-0 bg-transparent p-3 sm:p-5 md:p-8",
        /* min-h-0 vermeiden – sonst kollabiert die Flex-Höhe und das Panel klebt am oberen Rand. */
        "open:flex open:min-h-dvh open:items-center open:justify-center",
        "[&::backdrop]:bg-[#0F4F68]/45 [&::backdrop]:backdrop-blur-[2px]",
      )}
    >
      <div
        className={cn(
          "relative flex min-w-0 max-h-[min(92dvh,calc(100dvh-1.5rem))] w-full max-w-[min(36rem,calc(100dvw-1.25rem))] flex-col self-center overflow-hidden rounded-3xl border-2 border-[#0F4F68]/15 bg-white shadow-[0_25px_80px_-12px_rgba(15,79,104,0.35)] sm:max-w-[min(40rem,calc(100dvw-2rem))]",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {!isSuccessStep ? (
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#0F4F68]/10 bg-gradient-to-r from-[#FFF7ED] via-[#F2F9FA] to-white px-4 py-4 sm:px-6 sm:py-5">
            <div className="min-w-0 pr-2">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#F78F2E] sm:text-xs">
                Bewerbung · Kurzcheck
              </p>
              <h2
                id={titleId}
                className="mt-1 text-balance text-lg font-bold leading-snug text-[#0F4F68] sm:text-xl sm:leading-snug"
              >
                {WIZARD_STEP_INTROS[step] ?? ""}
              </h2>
            </div>
            <button
              type="button"
              disabled={isSubmitting}
              className="shrink-0 rounded-xl border border-[#0F4F68]/10 bg-white/90 px-3 py-2 text-xs font-semibold text-[#0F4F68] shadow-sm transition hover:bg-[#F2F9FA] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45 sm:px-4 sm:text-sm"
              onClick={() => dialogRef.current?.close()}
            >
              Abbrechen
            </button>
          </div>
        ) : null}

        {!isSuccessStep ? (
        <div className="shrink-0 border-b border-[#0F4F68]/8 bg-[#f1f9fb]/90 px-3 py-3 sm:px-5">
          <div className="relative mx-auto flex w-full max-w-full items-center justify-between gap-0.5 sm:gap-1">
            {/* Linie von erstem bis letztem Schritt-Kreis (Mitte zu Mitte bei 8 gleichen Spalten ≈ 6.25 % Rand) */}
            <div
              className="pointer-events-none absolute left-[6.25%] right-[6.25%] top-1/2 z-0 h-0.5 -translate-y-1/2 overflow-hidden rounded-full bg-[#0F4F68]/25"
              aria-hidden
            >
              <div
                className="h-full rounded-full bg-[#0F4F68] transition-[width] duration-300 ease-out"
                style={{ width: `${progressFraction * 100}%` }}
              />
            </div>
            {STEP_LABELS.map((label, i) => {
              const active = i === step;
              const done = i < step;
              const canJumpBack = i < step && step < maxStep;
              const circleClass = cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition sm:h-9 sm:w-9 sm:text-sm",
                active
                  ? "border-[#0F4F68] bg-white text-[#0F4F68] shadow-sm"
                  : done
                    ? "border-[#0F4F68] bg-[#0F4F68] text-white shadow-sm hover:bg-[#0c3d52] hover:border-[#0c3d52]"
                    : "border-[#0F4F68]/30 bg-white text-[#0F4F68]/45",
                canJumpBack && "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2",
              );
              const stepControl = canJumpBack ? (
                <button
                  type="button"
                  className={circleClass}
                  aria-label={`Zu Schritt ${i + 1} (${label}) zurückspringen`}
                  onClick={() => setStep(i)}
                >
                  {done ? "✓" : i + 1}
                </button>
              ) : (
                <span className={circleClass} aria-current={active ? "step" : undefined}>
                  {done ? "✓" : i + 1}
                </span>
              );
              return (
                <div key={label} className="relative z-[1] flex min-w-0 flex-1 flex-col items-center gap-1">
                  {stepControl}
                  <span
                    className={cn(
                      "hidden max-w-[4.5rem] truncate text-center text-[10px] font-semibold leading-tight sm:block sm:max-w-none sm:text-[11px]",
                      active ? "text-[#0F4F68]" : "text-neutral-500",
                      canJumpBack && "cursor-pointer hover:text-[#0F4F68]/80",
                    )}
                    {...(canJumpBack
                      ? {
                          role: "button",
                          tabIndex: 0,
                          onClick: () => setStep(i),
                          onKeyDown: (e: KeyboardEvent) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setStep(i);
                            }
                          },
                        }
                      : {})}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mx-auto mt-3 h-2 w-full max-w-full overflow-hidden rounded-full bg-white shadow-inner sm:h-2.5">
            <div
              className="h-full rounded-full bg-[#0F4F68] transition-[width] duration-300 ease-out"
              style={{ width: `${progressFraction * 100}%` }}
            />
          </div>
        </div>
        ) : null}

        <div
          ref={wizardContentScrollRef}
          className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5"
        >
          {step === 0 && (
            <div>
              <p className="text-sm font-semibold text-[#0F4F68]">Ihre Stelle (Hauptbewerbung)</p>
              <p className="mt-2 rounded-2xl border-2 border-[#0F4F68]/20 bg-[#F2F9FA]/70 px-4 py-3 text-base font-bold text-[#0F4F68]">
                {jobTitle}
              </p>
              {andereStellen.length > 0 ? (
                <div className="mt-5">
                  <p className="text-sm font-semibold text-[#0F4F68]">Weitere offene Stellen (optional)</p>
                  <p className="mt-1 text-xs text-neutral-600 sm:text-sm">
                    Wenn Sie sich parallel auf eine weitere ausgeschriebene Stelle bewerben möchten, aktivieren Sie
                    diese hier.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {andereStellen.map((t) => {
                      const on = additionalJobTitles.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => toggleAdditionalJob(t)}
                          className={cn(
                            "min-h-[44px] rounded-xl border-2 px-3 py-2 text-left text-xs font-semibold transition sm:text-sm",
                            on
                              ? "border-[#F78F2E] bg-[#FFF7ED] text-[#0F4F68] shadow-sm"
                              : "border-[#0F4F68]/15 bg-white text-neutral-800 hover:border-[#0F4F68]/30",
                          )}
                          aria-pressed={on}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="text-sm font-semibold text-[#0F4F68]">Wann könnten Sie starten?</p>
              <ChipGroup
                name="eintritt"
                options={EINTRITT_OPTIONS}
                value={answers.eintritt}
                onChange={(id) => setAnswers((p) => ({ ...p, eintritt: id }))}
              />
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-sm font-semibold text-[#0F4F68]">Gewünschtes Pensum</p>
              <ChipGroup
                name="pensum"
                options={PENSUM_OPTIONS}
                value={answers.pensum}
                onChange={(id) => setAnswers((p) => ({ ...p, pensum: id }))}
              />
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="text-sm font-semibold text-[#0F4F68]">Erfahrung im Bereich</p>
              <p className="mt-1 text-xs text-neutral-600 sm:text-sm">
                Ein Quereinstieg ist bei uns jederzeit willkommen.
              </p>
              <ChipGroup
                name="erfahrung"
                options={ERFAHRUNG_OPTIONS}
                value={answers.erfahrung}
                onChange={(id) => setAnswers((p) => ({ ...p, erfahrung: id }))}
              />
              <label className="mt-5 block text-sm font-medium text-neutral-700" htmlFor="wizard-erf-detail">
                Optional: ein Satz zu Ihrem Werdegang oder vorherige Erfahrung
              </label>
              <textarea
                id="wizard-erf-detail"
                value={answers.erfahrungDetail}
                onChange={(e) => setAnswers((p) => ({ ...p, erfahrungDetail: e.target.value }))}
                rows={2}
                maxLength={500}
                className="mt-1.5 w-full resize-y rounded-xl border border-[#0F4F68]/25 px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68]"
                placeholder="z. B. bisherige Tätigkeit in der Betreuung …"
              />
              <p className="mt-1 text-xs text-neutral-500">{answers.erfahrungDetail.length}/500</p>

              {/* Ausgewählte Dateien direkt unter dem Werdegang-Feld (nicht nur in der Upload-Kachel). */}
              {wizardFiles.length > 0 ? (
                <ul
                  className="mt-3 space-y-1.5 text-xs text-neutral-800 sm:text-sm"
                  aria-label="Ausgewählte Anhänge"
                >
                  {wizardFiles.map((f, i) => (
                    <li
                      key={`${f.name}-${i}`}
                      className="flex items-center justify-between gap-2 rounded-lg border border-[#0F4F68]/12 bg-[#F2F9FA]/60 px-2.5 py-2 shadow-sm"
                    >
                      <span className="min-w-0 truncate font-medium">{f.name}</span>
                      <button
                        type="button"
                        className="shrink-0 rounded-lg border border-[#0F4F68]/20 bg-white px-2.5 py-1 text-xs font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]"
                        onClick={() => removeWizardFile(i)}
                      >
                        Entfernen
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              {fileHint ? (
                <p className="mt-2 text-xs font-medium text-red-700 sm:text-sm" role="alert">
                  {fileHint}
                </p>
              ) : null}

              <div className="mt-4 rounded-xl border border-[#0F4F68]/12 bg-gradient-to-b from-[#F2F9FA]/80 to-white/90 p-3 sm:p-3.5">
                <p className="text-center text-xs font-semibold text-[#0F4F68] sm:text-sm">
                  Lebenslauf und Zeugnisse (optional)
                </p>
                <p className="mt-1 text-center text-[11px] leading-snug text-neutral-600 sm:text-xs">
                  PDF, Word, Bilder · max. {KARRIERE_MAX_ANHAENGE} Dateien, je 8 MB, gesamt 24 MB.
                </p>
                <input
                  ref={uploadInputRef}
                  id="wizard-karriere-files"
                  type="file"
                  multiple
                  accept={KARRIERE_FILE_INPUT_ACCEPT}
                  className="sr-only"
                  onChange={onWizardFilesChange}
                />
                <div className="mt-2.5 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => uploadInputRef.current?.click()}
                    className={cn(
                      "group flex w-full max-w-xs flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#0F4F68]/35 bg-white/80 px-4 py-4 text-center shadow-sm transition sm:max-w-sm sm:py-5",
                      "hover:border-[#F78F2E] hover:bg-[#FFF7ED]/60 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4F68] focus-visible:ring-offset-2",
                    )}
                  >
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F4F68]/10 text-[#0F4F68] transition group-hover:bg-[#F78F2E]/15 group-hover:text-[#c96a1a] sm:h-10 sm:w-10"
                      aria-hidden
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m18.375 12.656-8.155 8.155a4.5 4.5 0 1 1-6.364-6.364l8.155-8.155a3 3 0 1 1 4.243 4.243L8.212 16.95a1.5 1.5 0 0 1-2.122-2.122l7.07-7.071"
                        />
                      </svg>
                    </span>
                    <span className="mt-2 text-sm font-bold text-[#0F4F68] sm:text-base">Dateien auswählen</span>
                    <span className="mt-0.5 max-w-[14rem] text-[11px] font-medium text-neutral-500 sm:text-xs">
                      Tippen zum Auswählen
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <p className="text-sm font-semibold text-[#0F4F68]">Mobilität</p>
              {isInitiativWizard ? (
                <p className="mt-1 text-xs text-neutral-600 sm:text-sm">
                  Wenn Ihre Initiativbewerbung Einsätze oder Fahrten im Außendienst betrifft, geben Sie bitte an, ob Sie{" "}
                  <strong>Führerschein Klasse B</strong> und einen <strong>PKW</strong> zur Verfügung haben. Sonst
                  können Sie den Schritt nach Ihrer Situation beantworten; es folgt keine automatische Ablehnung.
                </p>
              ) : (
                <p className="mt-1 text-xs text-neutral-600 sm:text-sm">
                  Bitte geben Sie an, ob Sie <strong>Führerschein Klasse B</strong> und einen <strong>PKW</strong> zur
                  Verfügung haben (beides zusammen).
                </p>
              )}
              <ChipGroup
                name="mobilitaet"
                options={MOBILITAET_OPTIONS}
                value={answers.mobilitaet}
                onChange={(id) => setAnswers((p) => ({ ...p, mobilitaet: id }))}
              />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm font-semibold text-[#0F4F68]">Kontakt für Rückfragen</p>
                <p className="text-xs text-neutral-600 sm:text-sm">
                  Diese Daten nutzen wir nur zur Bearbeitung Ihrer Bewerbung (siehe Datenschutzerklärung).
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700" htmlFor="w-vorname">
                      Vorname *
                    </label>
                    <input
                      id="w-vorname"
                      autoComplete="given-name"
                      value={answers.vorname}
                      onChange={(e) => setAnswers((p) => ({ ...p, vorname: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-[#0F4F68]/25 px-3 py-2.5 text-sm focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700" htmlFor="w-nachname">
                      Nachname *
                    </label>
                    <input
                      id="w-nachname"
                      autoComplete="family-name"
                      value={answers.nachname}
                      onChange={(e) => setAnswers((p) => ({ ...p, nachname: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-[#0F4F68]/25 px-3 py-2.5 text-sm focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700" htmlFor="w-email">
                    E-Mail *
                  </label>
                  <input
                    id="w-email"
                    type="email"
                    autoComplete="email"
                    value={answers.email}
                    onChange={(e) => setAnswers((p) => ({ ...p, email: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-[#0F4F68]/25 px-3 py-2.5 text-sm focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700" htmlFor="w-phone">
                    Telefon *
                  </label>
                  <input
                    id="w-phone"
                    type="tel"
                    autoComplete="tel"
                    value={answers.phone}
                    onChange={(e) => setAnswers((p) => ({ ...p, phone: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-[#0F4F68]/25 px-3 py-2.5 text-sm focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68]"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700" htmlFor="w-plz">
                      PLZ *
                    </label>
                    <input
                      id="w-plz"
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      maxLength={5}
                      value={answers.plz}
                      onChange={(e) =>
                        setAnswers((p) => ({ ...p, plz: e.target.value.replace(/\D/g, "").slice(0, 5) }))
                      }
                      className="mt-1 w-full rounded-xl border border-[#0F4F68]/25 px-3 py-2.5 text-sm focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68]"
                      placeholder="88316"
                      title="Fünf Ziffern"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700" htmlFor="w-ort">
                      Ort *
                    </label>
                    <input
                      id="w-ort"
                      type="text"
                      autoComplete="address-level2"
                      value={answers.ort}
                      onChange={(e) => setAnswers((p) => ({ ...p, ort: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-[#0F4F68]/25 px-3 py-2.5 text-sm focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68]"
                      placeholder="z. B. Isny im Allgäu"
                    />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0F4F68]">Wann erreichen wir Sie am besten?</p>
                <p className="mt-1 text-xs text-neutral-600 sm:text-sm">
                  Damit wir Sie für Rückfragen zur Bewerbung möglichst gut erreichen.
                </p>
                <ChipGroup
                  name="erreichbarkeit"
                  options={ERREICHBAR_OPTIONS}
                  value={answers.erreichbarkeit}
                  onChange={(id) => setAnswers((p) => ({ ...p, erreichbarkeit: id }))}
                />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-semibold text-[#0F4F68]">Kontrolle</p>
                <p className="mt-1 text-xs text-neutral-600 sm:text-sm">
                  Bitte prüfen Sie Ihre Angaben. Mit dem Absenden übermitteln Sie Ihre Bewerbung direkt an uns.
                </p>
                <ul className="mt-3 space-y-2 rounded-2xl border border-[#0F4F68]/10 bg-[#F2F9FA]/50 p-4 text-sm text-neutral-800">
                  <li>
                    <span className="font-semibold text-[#0F4F68]">Hauptstelle:</span> {jobTitle}
                  </li>
                  {additionalJobTitles.length > 0 ? (
                    <li>
                      <span className="font-semibold text-[#0F4F68]">Weitere Stellen:</span>{" "}
                      {additionalJobTitles.join("; ")}
                    </li>
                  ) : null}
                  <li>
                    <span className="font-semibold text-[#0F4F68]">Start:</span>{" "}
                    {EINTRITT_OPTIONS.find((o) => o.id === answers.eintritt)?.label}
                  </li>
                  <li>
                    <span className="font-semibold text-[#0F4F68]">Pensum:</span> {pensumLabel(answers.pensum)}
                  </li>
                  <li>
                    <span className="font-semibold text-[#0F4F68]">Erfahrung:</span>{" "}
                    {ERFAHRUNG_OPTIONS.find((o) => o.id === answers.erfahrung)?.label}
                  </li>
                  <li>
                    <span className="font-semibold text-[#0F4F68]">Mobilität:</span>{" "}
                    {MOBILITAET_OPTIONS.find((o) => o.id === answers.mobilitaet)?.label}
                  </li>
                  <li>
                    <span className="font-semibold text-[#0F4F68]">Erreichbarkeit:</span>{" "}
                    {ERREICHBAR_OPTIONS.find((o) => o.id === answers.erreichbarkeit)?.label}
                  </li>
                  <li>
                    <span className="font-semibold text-[#0F4F68]">Kontakt:</span> {answers.vorname} {answers.nachname},{" "}
                    {answers.email}, {answers.phone}
                  </li>
                  <li>
                    <span className="font-semibold text-[#0F4F68]">PLZ / Ort:</span>{" "}
                    {answers.plz.replace(/\D/g, "").slice(0, 5)} {answers.ort.trim()}
                  </li>
                  {wizardFiles.length > 0 ? (
                    <li>
                      <span className="font-semibold text-[#0F4F68]">Anhänge:</span>{" "}
                      {wizardFiles.map((f) => f.name).join(", ")}
                    </li>
                  ) : null}
                </ul>
              </div>

              <div className="rounded-2xl border border-[#0F4F68]/12 bg-white/90 p-4">
                <label className="flex cursor-pointer gap-3 text-sm text-neutral-800">
                  <input
                    type="checkbox"
                    checked={wizardLegalConsent}
                    onChange={(e) => {
                      setWizardLegalConsent(e.target.checked);
                      setWizardSubmitError(null);
                    }}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#0F4F68]/40 text-[#0F4F68] focus:ring-[#0F4F68]"
                  />
                  <span>
                    Ich habe die{" "}
                    <Link
                      href="/impressum#agb"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#0F4F68] underline underline-offset-2 hover:no-underline"
                    >
                      AGB
                    </Link>{" "}
                    und die{" "}
                    <Link
                      href="/datenschutz"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#0F4F68] underline underline-offset-2 hover:no-underline"
                    >
                      Datenschutzerklärung
                    </Link>{" "}
                    gelesen und akzeptiere diese. *
                  </span>
                </label>
              </div>

              {wizardSubmitError ? (
                <p className="text-center text-sm font-medium text-red-700" role="alert">
                  {wizardSubmitError}
                </p>
              ) : null}

              <button
                type="button"
                disabled={isSubmitting || !wizardLegalConsent}
                onClick={() => {
                  void submitWizard();
                }}
                className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-[#0F4F68] px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Wird gesendet …" : "Bewerbung abschicken"}
              </button>
            </div>
          )}

          {step === 7 && (
            <div className="flex flex-col items-center px-3 py-6 text-center sm:px-5 sm:py-10">
              <h2
                id={titleId}
                className="text-balance text-xl font-bold leading-snug text-[#0F4F68] sm:text-2xl"
              >
                Vielen Dank für Ihre Bewerbung!
              </h2>
              <p className="mt-5 max-w-md text-pretty text-sm leading-relaxed text-neutral-700 sm:text-base">
                Wir werden uns umgehend bei Ihnen melden. Bei Rückfragen erreichen Sie Daniel Niebauer über das
                Bewerbungsformular auf der Karriere-Seite.
              </p>
              <div className="mt-8 flex w-full justify-center sm:mt-10">
                <Link
                  href="/karriere#bewerbung-form"
                  title="Zum Kontakt- und Bewerbungsformular (Daniel Niebauer)"
                  className="inline-flex min-h-[48px] w-full max-w-[16.5rem] items-center justify-center rounded-xl bg-[#F78F2E] px-6 py-3 text-base font-bold text-white shadow-[0_8px_24px_rgba(247,143,46,0.35)] transition hover:bg-[#ea8328] hover:shadow-[0_10px_28px_rgba(247,143,46,0.42)] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 sm:max-w-xs sm:py-3.5"
                  onClick={() => dialogRef.current?.close()}
                >
                  Kontakt
                </Link>
              </div>
            </div>
          )}
        </div>

        <div
          className={cn(
            "flex shrink-0 flex-col gap-2 border-t border-[#0F4F68]/10 bg-white px-4 py-4 sm:flex-row sm:px-6 sm:py-4",
            isSuccessStep ? "justify-center sm:justify-center" : step === 6 ? "sm:justify-start" : "sm:justify-between",
          )}
        >
          <button
            type="button"
            disabled={isSubmitting && step !== 0 && step !== 7}
            onClick={
              step === 0 || step === 7 ? () => dialogRef.current?.close() : goBack
            }
            className="order-2 min-h-[48px] rounded-xl border-2 border-[#0F4F68]/20 px-4 text-sm font-semibold text-[#0F4F68] transition hover:bg-[#F2F9FA] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45 sm:order-1"
          >
            {step === 0 || step === 7 ? "Schließen" : "Zurück"}
          </button>
          {step < maxStep && step !== 6 ? (
            <button
              type="button"
              disabled={!canNext}
              onClick={goNext}
              className="order-1 min-h-[48px] rounded-xl bg-[#F78F2E] px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45 sm:order-2 sm:min-w-[11rem]"
            >
              Weiter
            </button>
          ) : null}
        </div>

        {isSubmitting ? (
          <div className="absolute inset-0 z-[85] flex items-center justify-center bg-[#0F4F68]/55 p-4 backdrop-blur-[3px]">
            <div
              className="relative z-[86] w-full max-w-[min(22rem,calc(100vw-2.5rem))] rounded-2xl border-2 border-[#0F4F68]/18 bg-white p-6 shadow-[0_24px_70px_-12px_rgba(15,79,104,0.45)] sm:max-w-sm sm:p-7"
              role="status"
              aria-live="polite"
              aria-busy="true"
            >
              <div className="text-center">
                <p className="text-base font-bold text-[#0F4F68] sm:text-lg">Bewerbung wird gesendet …</p>
                <p className="mt-2 text-xs leading-snug text-neutral-600 sm:text-sm">
                  Bitte kurz warten – bei mehreren Anhängen kann es etwas länger dauern.
                </p>
              </div>
              <div className="mt-5 w-full">
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#0F4F68]/12 shadow-[inset_0_1px_3px_rgba(15,79,104,0.12)] ring-1 ring-[#0F4F68]/10">
                  <div
                    className="h-full min-w-[8%] rounded-full bg-gradient-to-r from-[#0F4F68] via-[#1a6d8a] to-[#F78F2E] shadow-[0_0_12px_rgba(247,143,46,0.32)] transition-[width] duration-200 ease-out motion-reduce:transition-none"
                    style={{ width: `${Math.min(100, Math.max(10, submitProgress))}%` }}
                  />
                </div>
                <p className="mt-2 text-center text-[11px] font-semibold tabular-nums tracking-wide text-[#0F4F68]/85 sm:text-xs">
                  {Math.round(Math.min(100, submitProgress))} %
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {mobilitaetModalOpen ? (
          <div
            className="absolute inset-0 z-[70] flex items-center justify-center bg-[#0F4F68]/40 p-4 backdrop-blur-[2px]"
            role="presentation"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobilitaet-hinweis-title"
              className="w-full max-w-md rounded-3xl border-2 border-[#0F4F68]/15 bg-gradient-to-b from-[#FFF7ED] via-white to-[#F2F9FA] p-6 shadow-[0_20px_60px_-12px_rgba(15,79,104,0.35)]"
              onClick={(e) => e.stopPropagation()}
            >
              <p id="mobilitaet-hinweis-title" className="text-base font-bold text-[#0F4F68]">
                Hinweis zur Mobilität
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-800">{MOBILITAET_HINWEIS}</p>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="min-h-[48px] rounded-xl border-2 border-[#0F4F68]/25 bg-white px-4 text-sm font-semibold text-[#0F4F68] transition hover:bg-[#F2F9FA] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                  onClick={() => {
                    setMobilitaetModalOpen(false);
                    dialogRef.current?.close();
                  }}
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  className="min-h-[48px] rounded-xl bg-[#F78F2E] px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2"
                  onClick={() => {
                    setMobilitaetModalOpen(false);
                    setAnswers((p) => ({ ...p, mobilitaet: "" }));
                  }}
                >
                  Zurück zur Auswahl
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </dialog>
  );
}
