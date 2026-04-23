"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  KARRIERE_BEWERBUNG_PREFILL_KEY,
  jobTitleToStellenangebot,
  type KarriereBewerbungPrefill,
} from "@/lib/karriere-job-map";
import {
  istKarriereAnhangErlaubt,
  KARRIERE_FILE_INPUT_ACCEPT,
  KARRIERE_MAX_ANHAENGE,
  KARRIERE_MAX_BYTES_GESAMT,
  KARRIERE_MAX_BYTES_PRO_DATEI,
} from "@/lib/karriere-attachments";
import { useKarriereApply } from "@/components/karriere/karriereApplyContext";
import { cn } from "@/lib/utils";

type BewerbungsWizardDialogProps = {
  jobTitle: string;
  onDismiss: () => void;
};

/** Gleiche Stellen wie auf der Karriere-Seite (Anzeige-Titel). */
export const KARRIERE_WIZARD_OFFENE_STELLEN = [
  "Alltagshelfer*in (m/w/d)",
  "Pflegeberater*in (m/w/d)",
  "Buchhalter*in (m/w/d)",
  "Standortleiter*in (m/w/d)",
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
  { id: "quer", label: "Quereinstieg – motiviert und lernbereit" },
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
  "Erreichbarkeit",
  "Fertig",
] as const;

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
  erreichbarkeit: "",
};

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
    <div className="mt-4 grid max-h-[min(52vh,28rem)] gap-2.5 overflow-y-auto overscroll-contain pr-1 sm:grid-cols-2">
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

export function BewerbungsWizardDialog({ jobTitle, onDismiss }: BewerbungsWizardDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { setPendingKarriereFiles } = useKarriereApply();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>(INITIAL);
  const [additionalJobTitles, setAdditionalJobTitles] = useState<string[]>([]);
  const [wizardFiles, setWizardFiles] = useState<File[]>([]);
  const [fileHint, setFileHint] = useState<string | null>(null);

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

  const maxStep = STEP_LABELS.length - 1;
  const progressPct = useMemo(() => Math.round(((step + 1) / STEP_LABELS.length) * 100), [step]);

  const toggleAdditionalJob = useCallback((title: string) => {
    setAdditionalJobTitles((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  }, []);

  const onWizardFilesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFileHint(null);
    const picked = e.target.files;
    if (!picked?.length) return;
    const next: File[] = [...wizardFiles];
    for (const f of [...picked]) {
      if (!istKarriereAnhangErlaubt(f.name)) {
        setFileHint(`Dateityp nicht erlaubt: „${f.name}“. Erlaubt sind u. a. PDF, Word und gängige Bildformate.`);
        e.target.value = "";
        return;
      }
      if (f.size > KARRIERE_MAX_BYTES_PRO_DATEI) {
        setFileHint(`„${f.name}“ ist zu groß (max. 8 MB pro Datei).`);
        e.target.value = "";
        return;
      }
      if (next.length >= KARRIERE_MAX_ANHAENGE) {
        setFileHint(`Maximal ${KARRIERE_MAX_ANHAENGE} Dateien.`);
        e.target.value = "";
        return;
      }
      const sum = next.reduce((s, x) => s + x.size, 0) + f.size;
      if (sum > KARRIERE_MAX_BYTES_GESAMT) {
        setFileHint("Die gewählten Dateien überschreiten zusammen 24 MB.");
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
      return (
        answers.vorname.trim().length > 0 &&
        answers.nachname.trim().length > 0 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email.trim()) &&
        answers.phone.trim().length > 3
      );
    }
    if (step === 6) return Boolean(answers.erreichbarkeit);
    return true;
  }, [step, answers]);

  const goNext = useCallback(() => {
    if (step === 4 && answers.mobilitaet === "nein") {
      window.alert(MOBILITAET_HINWEIS);
      return;
    }
    setStep((s) => Math.min(s + 1, maxStep));
  }, [maxStep, step, answers.mobilitaet]);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const finishToForm = useCallback(() => {
    const stellenangebot = jobTitleToStellenangebot(jobTitle);
    const dateiNamen = wizardFiles.map((f) => f.name);
    const anmerkung = buildAnmerkung(jobTitle, additionalJobTitles, answers, dateiNamen);
    const payload: KarriereBewerbungPrefill = {
      vorname: answers.vorname.trim(),
      nachname: answers.nachname.trim(),
      email: answers.email.trim(),
      phone: answers.phone.trim(),
      stellenangebot,
      anmerkung,
    };
    setPendingKarriereFiles(wizardFiles);
    try {
      sessionStorage.setItem(KARRIERE_BEWERBUNG_PREFILL_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
    dialogRef.current?.close();
    window.requestAnimationFrame(() => {
      window.location.hash = "bewerbung";
      document.getElementById("bewerbung")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [answers, additionalJobTitles, jobTitle, setPendingKarriereFiles, wizardFiles]);

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
        "fixed inset-0 z-[110] m-0 max-h-none min-h-0 w-full max-w-none border-0 bg-transparent p-3 sm:p-5 md:p-8",
        "open:flex open:items-center open:justify-center",
        "[&::backdrop]:bg-[#0F4F68]/45 [&::backdrop]:backdrop-blur-[2px]",
      )}
    >
      <div
        className={cn(
          "flex min-w-0 max-h-[min(92dvh,calc(100dvh-1.5rem))] w-full max-w-[min(36rem,calc(100dvw-1.25rem))] flex-col overflow-hidden rounded-3xl border-2 border-[#0F4F68]/15 bg-white shadow-[0_25px_80px_-12px_rgba(15,79,104,0.35)] sm:max-w-[min(40rem,calc(100dvw-2rem))]",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#0F4F68]/10 bg-gradient-to-r from-[#FFF7ED] via-[#F2F9FA] to-white px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0 pr-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#F78F2E] sm:text-xs">Bewerbung</p>
            <h2 id={titleId} className="mt-1 text-balance text-lg font-bold leading-tight text-[#0F4F68] sm:text-xl">
              Kurzcheck – Schritt für Schritt
            </h2>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-xl border border-[#0F4F68]/10 bg-white/90 px-3 py-2 text-xs font-semibold text-[#0F4F68] shadow-sm transition hover:bg-[#F2F9FA] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 sm:px-4 sm:text-sm"
            onClick={() => dialogRef.current?.close()}
          >
            Abbrechen
          </button>
        </div>

        <div className="shrink-0 border-b border-[#0F4F68]/8 bg-[#f1f9fb]/90 px-3 py-3 sm:px-5">
          <div className="relative mx-auto flex max-w-full items-center justify-between gap-0.5 sm:gap-1">
            <div
              className="pointer-events-none absolute left-[8%] right-[8%] top-1/2 z-0 h-0.5 -translate-y-1/2 bg-[#0F4F68]/25"
              aria-hidden
            />
            {STEP_LABELS.map((label, i) => {
              const active = i === step;
              const done = i < step;
              return (
                <div key={label} className="relative z-[1] flex min-w-0 flex-1 flex-col items-center gap-1">
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold sm:h-9 sm:w-9 sm:text-sm",
                      active
                        ? "border-[#0F4F68] bg-white text-[#0F4F68] shadow-sm"
                        : done
                          ? "border-[#0F4F68] bg-[#0F4F68] text-white"
                          : "border-[#0F4F68]/30 bg-white text-[#0F4F68]/45",
                    )}
                    aria-current={active ? "step" : undefined}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <span
                    className={cn(
                      "hidden max-w-[4.5rem] truncate text-center text-[10px] font-semibold leading-tight sm:block sm:max-w-none sm:text-[11px]",
                      active ? "text-[#0F4F68]" : "text-neutral-500",
                    )}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mx-auto mt-3 h-2 max-w-md overflow-hidden rounded-full bg-white shadow-inner">
            <div
              className="h-full rounded-full bg-[#0F4F68] transition-[width] duration-300 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6">
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
                    diese hier. Im Formular bleibt Ihre Hauptstelle vorausgewählt; die weiteren Interessen fügen wir
                    bei.
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
              <p className="mt-5 text-sm leading-relaxed text-neutral-700">
                In wenigen Schritten erfassen wir, was für unsere Personalplanung hilfreich ist: Startzeitpunkt,
                Pensum, Erfahrung und Mobilität. Anschließend übernehmen wir Ihre Angaben ins Bewerbungsformular – Sie
                ergänzen nur noch die AGB-Bestätigung und können Lebenslauf und Zeugnisse anhängen bzw. nachreichen.
                Zum neuen Job in wenigen Minuten. Wir freuen uns auf Ihre Bewerbung!
              </p>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="text-sm font-semibold text-[#0F4F68]">Wann könnten Sie starten?</p>
              <p className="mt-1 text-xs text-neutral-600 sm:text-sm">
                Hilft uns, Einsatzplanung und Einarbeitung realistisch einzuschätzen.
              </p>
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
              <p className="mt-1 text-xs text-neutral-600 sm:text-sm">Transparent für die Dienstplanung.</p>
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
                rows={3}
                maxLength={500}
                className="mt-1.5 w-full resize-y rounded-xl border border-[#0F4F68]/25 px-3 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-[#0F4F68] focus:outline-none focus:ring-1 focus:ring-[#0F4F68]"
                placeholder="z. B. bisherige Tätigkeit in der Betreuung …"
              />
              <p className="mt-1 text-xs text-neutral-500">{answers.erfahrungDetail.length}/500</p>

              <div className="mt-6 rounded-2xl border border-[#0F4F68]/12 bg-[#F2F9FA]/40 p-4">
                <p className="text-sm font-semibold text-[#0F4F68]">Lebenslauf und Zeugnisse (optional)</p>
                <p className="mt-1 text-xs text-neutral-600 sm:text-sm">
                  Sie können hier mehrere Dateien auswählen – PDF, Word und gängige Bildformate (z. B. JPG, PNG,
                  WebP). Maximal {KARRIERE_MAX_ANHAENGE} Dateien, je max. 8 MB. Die Dateien werden mit Ihrer Bewerbung
                  mitgesendet, wenn Sie das Formular absenden.
                </p>
                <input
                  type="file"
                  multiple
                  accept={KARRIERE_FILE_INPUT_ACCEPT}
                  className="mt-3 block w-full max-w-full text-sm text-neutral-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#0F4F68] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#0c3d52]"
                  onChange={onWizardFilesChange}
                />
                {fileHint ? (
                  <p className="mt-2 text-sm font-medium text-red-700" role="alert">
                    {fileHint}
                  </p>
                ) : null}
                {wizardFiles.length > 0 ? (
                  <ul className="mt-3 space-y-2 text-sm text-neutral-800">
                    {wizardFiles.map((f, i) => (
                      <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-2 rounded-lg bg-white/90 px-3 py-2">
                        <span className="min-w-0 truncate">{f.name}</span>
                        <button
                          type="button"
                          className="shrink-0 rounded-md border border-[#0F4F68]/20 px-2 py-1 text-xs font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]"
                          onClick={() => removeWizardFile(i)}
                        >
                          Entfernen
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <p className="text-sm font-semibold text-[#0F4F68]">Mobilität</p>
              <p className="mt-1 text-xs text-neutral-600 sm:text-sm">
                Bitte geben Sie an, ob Sie <strong>Führerschein Klasse B</strong> und einen <strong>PKW</strong> zur
                Verfügung haben (beides zusammen).
              </p>
              <ChipGroup
                name="mobilitaet"
                options={MOBILITAET_OPTIONS}
                value={answers.mobilitaet}
                onChange={(id) => setAnswers((p) => ({ ...p, mobilitaet: id }))}
              />
            </div>
          )}

          {step === 5 && (
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
            </div>
          )}

          {step === 6 && (
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
          )}

          {step === 7 && (
            <div>
              <p className="text-sm font-semibold text-[#0F4F68]">Zusammenfassung</p>
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
                {wizardFiles.length > 0 ? (
                  <li>
                    <span className="font-semibold text-[#0F4F68]">Anhänge:</span>{" "}
                    {wizardFiles.map((f) => f.name).join(", ")}
                  </li>
                ) : null}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-neutral-600">
                Mit „Zum Bewerbungsformular“ springen Sie zum offiziellen Formular. Dort bestätigen Sie die AGB. Ihre
                Schnellcheck-Antworten und gewählte Dateien werden übernommen bzw. mitgesendet.
              </p>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-2 border-t border-[#0F4F68]/10 bg-white px-4 py-4 sm:flex-row sm:justify-between sm:px-6 sm:py-4">
          <button
            type="button"
            onClick={step === 0 ? () => dialogRef.current?.close() : goBack}
            className="order-2 min-h-[48px] rounded-xl border-2 border-[#0F4F68]/20 px-4 text-sm font-semibold text-[#0F4F68] transition hover:bg-[#F2F9FA] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 sm:order-1"
          >
            {step === 0 ? "Schließen" : "Zurück"}
          </button>
          {step < maxStep ? (
            <button
              type="button"
              disabled={!canNext}
              onClick={goNext}
              className="order-1 min-h-[48px] rounded-xl bg-[#F78F2E] px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#F78F2E] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45 sm:order-2 sm:min-w-[11rem]"
            >
              Weiter
            </button>
          ) : (
            <button
              type="button"
              onClick={finishToForm}
              className="order-1 min-h-[48px] rounded-xl bg-[#0F4F68] px-5 text-sm font-semibold text-white shadow-md transition hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 sm:order-2 sm:min-w-[14rem]"
            >
              Zum Bewerbungsformular
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
}
