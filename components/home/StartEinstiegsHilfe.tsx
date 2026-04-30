"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  HILFEFINDER_FALLBACK_BAD_GROENENBACH,
  HILFEFINDER_SERVICE_OPTIONEN,
  type HilfefinderServiceKey,
} from "@/config/hilfefinder-services";
import {
  HilfefinderSelectMark,
  HilfefinderServiceOptionButton,
  HilfefinderStepFlatIcon,
  hilfefinderOptionButtonClass,
} from "@/components/hilfefinder/HilfefinderServiceMarkups";
import { findStandortByPlz, type Standort } from "@/config/standorte";
import { cn } from "@/lib/utils";

type ServiceKey = HilfefinderServiceKey;

type KontaktArt = "rueckruf" | "selbst";
type StandortInfo = Standort;

const PFLEGEGRADE = [
  "Kein Pflegegrad",
  "Pflegegrad 1",
  "Pflegegrad 2",
  "Pflegegrad 3",
  "Pflegegrad 4",
  "Pflegegrad 5",
] as const;

const FUER_WEN_OPTIONEN = [
  { id: "selbst", label: "Für mich" },
  { id: "andere", label: "Für Angehörige/Bekannte" },
] as const;

const SCHRITT_MOTIVATION: Record<number, string> = {
  1: "Okay, fangen wir an.",
  2: "Super, jetzt geht's weiter.",
  3: "Klasse, nur noch ein paar Fragen.",
  4: "Top, damit sind wir fast durch.",
  5: "Super, hier ist Ihr Ergebnis.",
  6: "Sehr gut, jetzt nur noch Ihren Standort finden.",
  7: "Geschafft! Wählen Sie Ihren bevorzugten Kontaktweg.",
};

const BAD_GROENENBACH_STANDORT: StandortInfo = HILFEFINDER_FALLBACK_BAD_GROENENBACH;

const HilfefinderCtx = createContext<{ open: () => void } | null>(null);

export function HilfefinderOpenButton({ className = "" }: { className?: string }) {
  const ctx = useContext(HilfefinderCtx);
  return (
    <button
      type="button"
      onClick={() => ctx?.open()}
      className={cn(
        "inline-flex min-h-[50px] items-center justify-center rounded-xl bg-[#F78F2E] px-6 py-3 text-base font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e67e22] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4F68]",
        className,
      )}
    >
      In 60 Sekunden die passende Hilfe finden
    </button>
  );
}

export function HilfefinderProvider({ children }: { children: ReactNode }) {
  const [started, setStarted] = useState(false);
  /** Portal-Ziel erst nach Mount: Overlay liegt dann außerhalb transformierter Vorfahren (z. B. Startseite scale-90). */
  const [portalReady, setPortalReady] = useState(false);
  const [step, setStep] = useState(1);

  const [leistungen, setLeistungen] = useState<ServiceKey[]>([]);
  const [pflegegrad, setPflegegrad] = useState<string>("");
  const [fuerWen, setFuerWen] = useState<string>("");
  const [plz, setPlz] = useState("");
  const [kontaktArt, setKontaktArt] = useState<KontaktArt | "">("");

  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [telefon, setTelefon] = useState("");
  const [besteZeit, setBesteZeit] = useState("");
  const [email, setEmail] = useState("");
  const [kontaktWunsch, setKontaktWunsch] = useState("");
  const [nachricht, setNachricht] = useState("");
  const [datenschutz, setDatenschutz] = useState(false);

  const [error, setError] = useState("");

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

  const plzNorm = plz.replace(/\D/g, "").slice(0, 5);
  const standort: Standort | undefined = useMemo(
    () => (plzNorm.length === 5 ? findStandortByPlz(plzNorm) : undefined),
    [plzNorm]
  );
  const finalerStandort: StandortInfo = standort ?? BAD_GROENENBACH_STANDORT;

  const toggleLeistung = (key: ServiceKey) => {
    setLeistungen((prev) => (prev.includes(key) ? prev.filter((v) => v !== key) : [...prev, key]));
  };

  const resetFlow = () => {
    setStep(1);
    setLeistungen([]);
    setPflegegrad("");
    setFuerWen("");
    setPlz("");
    setKontaktArt("");
    setVorname("");
    setNachname("");
    setTelefon("");
    setBesteZeit("");
    setEmail("");
    setKontaktWunsch("");
    setNachricht("");
    setDatenschutz(false);
    setError("");
  };

  const weiter = () => {
    setError("");

    if (step === 2 && !pflegegrad) {
      setError("Bitte wählen Sie Ihren Pflegegrad aus.");
      return;
    }
    if (step === 3 && !fuerWen) {
      setError("Bitte wählen Sie aus, für wen Sie Unterstützung suchen.");
      return;
    }
    if (step === 4 && leistungen.length === 0) {
      setError("Bitte wählen Sie mindestens eine Hilfsleistung aus.");
      return;
    }
    if (step === 6 && plzNorm.length !== 5) {
      setError("Bitte geben Sie eine gültige 5-stellige PLZ ein.");
      return;
    }
    if (step === 7 && !kontaktArt) {
      setError("Bitte wählen Sie eine Kontaktart aus.");
      return;
    }

    setStep((s) => Math.min(7, s + 1));
  };

  const zurueck = () => {
    setError("");
    setStep((s) => Math.max(1, s - 1));
  };

  const ausgewaehlteLeistungen = useMemo(
    () => HILFEFINDER_SERVICE_OPTIONEN.filter((s) => leistungen.includes(s.key)),
    [leistungen]
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
  const leistungsText = useMemo(
    () => ausgewaehlteLeistungen.map((s) => `- ${s.label}`).join("\n"),
    [ausgewaehlteLeistungen]
  );
  const mailtoHref = useMemo(() => {
    const body = [
      "Anfrage aus dem Hilfe-Finder",
      "",
      `Pflegegrad: ${pflegegrad || "-"}`,
      `Für wen: ${fuerWen === "selbst" ? "Für mich" : fuerWen === "andere" ? "Für Angehörige/Bekannte" : "-"}`,
      `PLZ: ${plzNorm || "-"}`,
      "",
      "Ausgewählte Leistungen:",
      leistungsText || "-",
      "",
      `Vorname: ${vorname || "-"}`,
      `Nachname: ${nachname || "-"}`,
      `Telefon: ${telefon || "-"}`,
      `E-Mail: ${email || "-"}`,
      `Passender Tag/Uhrzeit: ${besteZeit || "-"}`,
      `Hinweis: ${kontaktWunsch || "-"}`,
      `Nachricht: ${nachricht || "-"}`,
    ].join("\n");
    return `mailto:info@alltagshilfe-sued.de?subject=${encodeURIComponent("Anfrage über Hilfe-Finder")}&body=${encodeURIComponent(body)}`;
  }, [besteZeit, email, fuerWen, kontaktWunsch, leistungsText, nachricht, pflegegrad, plzNorm, nachname, telefon, vorname]);

  const absenden = () => {
    setError("");
    if (!kontaktArt) {
      setError("Bitte wählen Sie eine Kontaktart aus.");
      return;
    }
    if (!vorname.trim() || !nachname.trim() || !telefon.trim() || !email.trim()) {
      setError("Bitte füllen Sie Vorname, Nachname, Telefonnummer und E-Mail aus.");
      return;
    }
    if (!datenschutz) {
      setError(
        "Bitte bestätigen Sie, dass Sie die Datenschutzerklärung gelesen haben und der Verarbeitung Ihrer Daten zustimmen.",
      );
      return;
    }
    if (kontaktArt !== "selbst") window.location.href = mailtoHref;
    setStep(8);
  };

  const openFinder = useCallback(() => setStarted(true), []);

  return (
    <HilfefinderCtx.Provider value={{ open: openFinder }}>
      {children}
      {started && portalReady ? (
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#0F4F68]/45 p-3 backdrop-blur-[2px] sm:p-6">
            <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto animate-fade-in-up rounded-2xl border border-[#0F4F68]/15 bg-white p-5 shadow-2xl sm:p-7">
            <div className="mb-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <p className="justify-self-start text-sm font-bold uppercase tracking-wide text-[#0F4F68]/80">Schritt {Math.min(step, 7)} von 7</p>
              <p className="text-center text-xl font-extrabold text-[#0F4F68] sm:text-2xl">{SCHRITT_MOTIVATION[step]}</p>
              <button
                type="button"
                onClick={() => {
                  setStarted(false);
                  resetFlow();
                }}
                className="justify-self-end inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#0F4F68]/25 text-2xl font-extrabold leading-none text-[#0F4F68] hover:bg-[#F2F9FA]"
                aria-label="Hilfe-Finder schließen"
              >
                ×
              </button>
            </div>

            {step === 1 ? (
              <div className="mt-6 animate-fade-in-up">
                <h3 className="text-lg font-bold text-[#0F4F68] sm:text-xl">Kurze Information vor dem Start</h3>
                <p className="mt-3 flex items-start gap-2 text-neutral-700">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F78F2E] text-white" aria-hidden>
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </span>
                  <span>Sie müssen für das Ergebnis keine persönlichen Daten eingeben. Sie erhalten das Ergebnis direkt am Ende.</span>
                </p>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="mt-6 animate-fade-in-up">
              <h3 className="text-lg font-bold text-[#0F4F68] sm:text-xl">Welchen Pflegegrad haben Sie aktuell?</h3>
              <ul className="mt-4 grid list-none gap-2 sm:grid-cols-2">
                {PFLEGEGRADE.map((p) => (
                  <li key={p}>
                    <button
                      type="button"
                      onClick={() => setPflegegrad(p)}
                      className={cn(
                        hilfefinderOptionButtonClass,
                        "transition-all duration-300",
                        pflegegrad === p && "border-[#F78F2E]/65 bg-[#fff8f2] shadow-[0_6px_16px_rgba(247,143,46,0.14)]"
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <HilfefinderSelectMark active={pflegegrad === p} />
                        <HilfefinderStepFlatIcon kind="pflegegrad" />
                        <span>{p}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="mt-6 animate-fade-in-up">
              <h3 className="text-lg font-bold text-[#0F4F68] sm:text-xl">Für wen suchen Sie die Unterstützung?</h3>
              <ul className="mt-4 grid list-none gap-2 sm:grid-cols-2">
                {FUER_WEN_OPTIONEN.map((f) => (
                  <li key={f.id}>
                    <button
                      type="button"
                      onClick={() => setFuerWen(f.id)}
                      className={cn(
                        hilfefinderOptionButtonClass,
                        "transition-all duration-300",
                        fuerWen === f.id && "border-[#F78F2E]/65 bg-[#fff8f2] shadow-[0_6px_16px_rgba(247,143,46,0.14)]"
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <HilfefinderSelectMark active={fuerWen === f.id} />
                        <HilfefinderStepFlatIcon kind="person" />
                        <span>{f.label}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="mt-6 animate-fade-in-up">
                <h3 className="text-lg font-bold text-[#0F4F68] sm:text-xl">Was für Hilfsleistungen benötigen Sie aktuell?</h3>
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

            {step === 5 ? (
              <div className="mt-6 animate-fade-in-up space-y-4">
                <h3 className="text-lg font-bold text-[#0F4F68] sm:text-xl">Gute Nachricht!</h3>
                <p className="text-neutral-700">Wir haben für folgende Dienstleistungen freie Kapazitäten:</p>
                <ul className="space-y-2">
                  {leistungenFuerErgebnis
                    .filter((l) => l.verfuegbarkeit === "direkt")
                    .concat(leistungenFuerErgebnis.filter((l) => l.verfuegbarkeit === "partner"))
                    .map((l, i) => (
                    <li
                      key={l.key}
                      className="flex items-start gap-2.5 rounded-xl border border-[#0F4F68]/12 bg-[#f8fcfd] px-3 py-2 opacity-0 animate-fade-in-up"
                      style={{ animationDelay: `${0.08 * (i + 1)}s` }}
                    >
                      <span className={cn("mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-white", l.verfuegbarkeit === "direkt" ? "bg-emerald-600" : "bg-[#F78F2E]")}>
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#0F4F68] sm:text-base">{l.label}</p>
                        <p className={cn("text-xs sm:text-sm", l.verfuegbarkeit === "direkt" ? "text-emerald-700" : "text-[#c86d1f]")}>
                          {l.verfuegbarkeit === "direkt" ? "Verfügbar direkt über uns" : "Verfügbar über unsere Kooperationspartner"}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {step === 6 ? (
              <div className="mt-6 space-y-4 animate-fade-in-up">
                <h3 className="text-lg font-bold text-[#0F4F68] sm:text-xl">Erhalten Sie sofort Ihren richtigen Ansprechpartner unserer Standorte</h3>
                <label htmlFor="hilfefinder-plz" className="block text-sm font-medium text-[#0F4F68]">PLZ</label>
                <input
                  id="hilfefinder-plz"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={5}
                  value={plz}
                  onChange={(e) => setPlz(e.target.value.replace(/\D/g, "").slice(0, 5))}
                  className="w-full max-w-xs rounded-xl border border-[#0F4F68]/20 px-4 py-3 text-base outline-none ring-0 transition focus:border-[#0F4F68]/45"
                  placeholder="z. B. 87700"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPlz("");
                    setStep(7);
                  }}
                  className="inline-flex min-h-[42px] items-center rounded-lg border border-[#0F4F68]/30 px-4 py-2 text-sm font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]"
                >
                  Überspringen
                </button>
              </div>
            ) : null}

            {step === 7 ? (
              <div className="mt-6 animate-fade-in-up">
                <h3 className="text-lg font-bold text-[#0F4F68] sm:text-xl">Wie möchten Sie den Kontakt?</h3>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setKontaktArt("rueckruf");
                      setDatenschutz(false);
                    }}
                    className={cn(hilfefinderOptionButtonClass, "transition-all duration-300", kontaktArt === "rueckruf" && "border-[#F78F2E]/65 bg-[#fff8f2] shadow-[0_6px_16px_rgba(247,143,46,0.14)]")}
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
                    className={cn(hilfefinderOptionButtonClass, "transition-all duration-300", kontaktArt === "selbst" && "border-[#F78F2E]/65 bg-[#fff8f2] shadow-[0_6px_16px_rgba(247,143,46,0.14)]")}
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
                    <input required value={vorname} onChange={(e) => setVorname(e.target.value)} placeholder="Vorname *" className="rounded-xl border border-[#0F4F68]/20 px-4 py-3" />
                    <input required value={nachname} onChange={(e) => setNachname(e.target.value)} placeholder="Nachname *" className="rounded-xl border border-[#0F4F68]/20 px-4 py-3" />
                    <input required value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="Telefonnummer *" className="rounded-xl border border-[#0F4F68]/20 px-4 py-3 sm:col-span-2" />
                    <input value={besteZeit} onChange={(e) => setBesteZeit(e.target.value)} placeholder="Passender Tag/Uhrzeit *" className="rounded-xl border border-[#0F4F68]/20 px-4 py-3 sm:col-span-2" />
                    <input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail *" type="email" className="rounded-xl border border-[#0F4F68]/20 px-4 py-3 sm:col-span-2" />
                    <textarea value={nachricht} onChange={(e) => setNachricht(e.target.value)} placeholder="Ihre Nachricht an uns (optional)" className="min-h-[92px] rounded-xl border border-[#0F4F68]/20 px-4 py-3 sm:col-span-2" />
                  </div>
                ) : null}

                {kontaktArt === "selbst" ? (
                  <div className="mt-4 rounded-xl border border-[#0F4F68]/15 bg-[#f8fcfd] p-4 text-sm text-neutral-700">
                    <p className="font-semibold text-[#0F4F68]">Ihr Ansprechpartner für Ihre PLZ</p>
                    <div className="mt-2 space-y-1">
                      <p className="font-medium text-[#0F4F68]">{finalerStandort.name}</p>
                      <p>{finalerStandort.address}</p>
                      <p>
                        Telefon: <a className="font-bold text-[#0F4F68] underline" href={finalerStandort.phoneHref}>{finalerStandort.phone}</a>
                      </p>
                      <p>
                        E-Mail: <a className="text-[#0F4F68] underline" href={`mailto:${finalerStandort.email}`}>{finalerStandort.email}</a>
                      </p>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <input required value={vorname} onChange={(e) => setVorname(e.target.value)} placeholder="Vorname *" className="rounded-xl border border-[#0F4F68]/20 px-4 py-3" />
                      <input required value={nachname} onChange={(e) => setNachname(e.target.value)} placeholder="Nachname *" className="rounded-xl border border-[#0F4F68]/20 px-4 py-3" />
                      <input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail *" type="email" className="rounded-xl border border-[#0F4F68]/20 px-4 py-3 sm:col-span-2" />
                      <input required value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="Telefonnummer *" className="rounded-xl border border-[#0F4F68]/20 px-4 py-3 sm:col-span-2" />
                      <textarea value={nachricht} onChange={(e) => setNachricht(e.target.value)} placeholder="Ihre Nachricht *" className="min-h-[96px] rounded-xl border border-[#0F4F68]/20 px-4 py-3 sm:col-span-2" />
                    </div>
                  </div>
                ) : null}

                {kontaktArt === "rueckruf" || kontaktArt === "selbst" ? (
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
                        <Link href="/datenschutz" className="font-semibold text-[#0F4F68] underline underline-offset-2 hover:no-underline">
                          Datenschutzerklärung
                        </Link>{" "}
                        gelesen und stimme der Verarbeitung meiner Daten zum Zweck der Kontaktaufnahme zu. *
                      </span>
                    </label>
                  </div>
                ) : null}
              </div>
            ) : null}

            {step === 8 ? (
              <div className="mt-6 animate-fade-in-up space-y-5">
                <div className="rounded-2xl bg-white p-6 text-center opacity-0 animate-fade-in-up">
                  <h3 className="text-2xl font-extrabold text-[#0F4F68] sm:text-3xl">
                    Vielen Dank! Ihre Anfrage ist bei uns eingegangen.
                  </h3>
                  <p className="mt-2 text-base text-neutral-700 sm:text-lg">
                    Wir melden uns in Kürze bei Ihnen zurück.
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-5 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.22s" }}>
                  <p className="flex items-start justify-center gap-2 text-center text-lg font-extrabold text-[#c86d1f]">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#F78F2E] text-white" aria-hidden>
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 8h.01" />
                        <path d="M11 12h1v4h1" />
                        <circle cx="12" cy="12" r="9" />
                      </svg>
                    </span>
                    <span>Jetzt neu: Unser Onlineshop ist ab sofort für Sie verfügbar.</span>
                  </p>
                  <p className="mt-2 text-center text-[#7a4d28]">
                    Entdecken Sie hochwertige Produkte, die Sie bei der täglichen Pflege zuverlässig unterstützen. Geprüfte Qualität und von Pflegekräften empfohlen.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-3">
                    <a
                      href="https://www.deinpflegebedarf.de"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#0F4F68] px-5 py-2.5 font-semibold text-white hover:bg-[#0c3d52]"
                    >
                      Zum Shop
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setStarted(false);
                        resetFlow();
                      }}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#0F4F68]/30 px-5 py-2.5 font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]"
                    >
                      Schließen
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {error ? <p className="mt-4 text-sm text-red-600" role="alert">{error}</p> : null}

            <div className="mt-6 flex flex-wrap gap-3">
              {step > 1 && step < 8 ? (
                <button
                  type="button"
                  onClick={zurueck}
                  className="inline-flex min-h-[50px] items-center justify-center rounded-xl border border-[#0F4F68]/30 px-6 py-2.5 text-[1.03rem] font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]"
                >
                  Zurück
                </button>
              ) : null}

              {step < 7 ? (
                <button
                  type="button"
                  onClick={weiter}
                  className="inline-flex min-h-[50px] items-center justify-center rounded-xl bg-[#F78F2E] px-6 py-2.5 text-[1.03rem] font-semibold text-white hover:bg-[#e67e22]"
                >
                  Weiter
                </button>
              ) : null}

              {step === 7 ? (
                <button
                  type="button"
                  onClick={absenden}
                  className="inline-flex min-h-[50px] items-center justify-center rounded-xl bg-[#F78F2E] px-6 py-2.5 text-[1.03rem] font-semibold text-white hover:bg-[#e67e22]"
                >
                  Anfrage senden
                </button>
              ) : null}
            </div>
            </div>
          </div>,
          document.body
        )
      ) : null}
    </HilfefinderCtx.Provider>
  );
}
