"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { findStandortByPlz, type Standort } from "@/config/standorte";
import { cn } from "@/lib/utils";

type ServiceKey =
  | "haushalt"
  | "pflegeberatung"
  | "pflegebox"
  | "koerperpflege"
  | "medizinisch"
  | "umbau"
  | "hausnotruf"
  | "hilfsmittel"
  | "essen";

type KontaktArt = "rueckruf" | "selbst";
type StandortInfo = Standort;

const SERVICE_OPTIONEN: { key: ServiceKey; label: string; verfuegbarkeit: "direkt" | "partner" }[] = [
  { key: "haushalt", label: "Alltagsbegleitung & Haushaltsreinigung", verfuegbarkeit: "direkt" },
  { key: "pflegeberatung", label: "Halb-, vierteljährliche Pflegeberatung nach §37.3", verfuegbarkeit: "direkt" },
  { key: "pflegebox", label: "Kostenlose Pflegebox (Einmalhandschuhe, Händedesinfektionsmittel usw.)", verfuegbarkeit: "direkt" },
  { key: "koerperpflege", label: "Körperliche Pflege", verfuegbarkeit: "partner" },
  { key: "medizinisch", label: "Medizinische Versorgung (Verbandswechsel, Medikamentengabe)", verfuegbarkeit: "partner" },
  { key: "umbau", label: "Umbaumaßnahmen im Haus (Barrierefreiheit)", verfuegbarkeit: "partner" },
  { key: "hausnotruf", label: "Hausnotruf", verfuegbarkeit: "partner" },
  { key: "hilfsmittel", label: "Pflegehilfsmittel (Rollator, Duschhocker usw.)", verfuegbarkeit: "direkt" },
  { key: "essen", label: "Essen auf Rädern", verfuegbarkeit: "direkt" },
];

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

const BAD_GROENENBACH_STANDORT: StandortInfo = {
  name: "Standort Bad Grönenbach",
  pageSlug: "allgaeu",
  heroLocationGeneral: "im Allgäu und der Region",
  address: "Hinter den Gärten 10, 87730 Bad Grönenbach",
  phone: "08334 / 9893330",
  phoneHref: "tel:+4983349893330",
  email: "info@alltagshilfe-sued.de",
  hours: "Mo-Do 08:30-12:00 & 13:00-16:00, Fr 08:30-12:00",
  plzList: [],
  localIntro: [
    "Ihr Ergebnis wird von unserem Team in Bad Grönenbach koordiniert.",
    "Unter der angezeigten Rufnummer erreichen Sie dieses Büro direkt.",
  ],
  schemaAddress: {
    streetAddress: "Hinter den Gärten 10",
    postalCode: "87730",
    addressLocality: "Bad Grönenbach",
    addressCountry: "DE",
  },
};

const optionButtonClass =
  "min-h-[54px] w-full rounded-xl border border-[#0F4F68]/18 bg-white px-4 py-3.5 text-left text-[1.03rem] font-medium text-[#0F4F68] transition-colors hover:border-[#F78F2E]/60 hover:bg-[#fff8f2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F78F2E]";

function SelectMark({ active }: { active: boolean }) {
  if (active) {
    return (
      <span
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F78F2E] text-white"
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </span>
    );
  }
  return <span className="inline-flex h-5 w-5 shrink-0 rounded-full border border-[#0F4F68]/30" aria-hidden />;
}

function ServiceIcon({ service }: { service: ServiceKey }) {
  if (service === "haushalt") {
    return (
      <svg className="h-6 w-6 text-[#0F4F68]/75" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" />
      </svg>
    );
  }
  if (service === "pflegeberatung") {
    return (
      <svg className="h-6 w-6 text-[#0F4F68]/75" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M4 4h16v11H7.6L4 18.6V4zm4 4v2h8V8H8zm0 4v2h5v-2H8z" />
      </svg>
    );
  }
  if (service === "pflegebox") {
    return (
      <svg className="h-6 w-6 text-[#0F4F68]/75" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M3 7.2 12 3l9 4.2v9.6L12 21l-9-4.2V7.2zm2.4 1.5 6.6 3.1 6.6-3.1-6.6-3.1-6.6 3.1z" />
      </svg>
    );
  }
  if (service === "hilfsmittel") {
    return (
      <svg className="h-6 w-6 text-[#0F4F68]/75" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="8" cy="18" r="1.7" />
        <circle cx="16" cy="18" r="1.7" />
        <path d="M8 16V7.5a2.5 2.5 0 0 1 5 0V10" />
        <path d="M13 10h3.2a1.8 1.8 0 0 1 1.8 1.8V16" />
        <path d="M8 13h6" />
      </svg>
    );
  }
  if (service === "koerperpflege") {
    return (
      <svg className="h-6 w-6 text-[#0F4F68]/75" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2 4 5.2v6.1c0 5.1 3.4 9.8 8 10.7 4.6-.9 8-5.6 8-10.7V5.2L12 2zm-1 13.2-3-3 1.4-1.4 1.6 1.6 3.6-3.6 1.4 1.4-5 5z" />
      </svg>
    );
  }
  if (service === "medizinisch") {
    return (
      <svg className="h-6 w-6 text-[#0F4F68]/75" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M4 4h16v16H4zM10 7v3H7v4h3v3h4v-3h3v-4h-3V7z" />
      </svg>
    );
  }
  if (service === "hausnotruf") {
    return (
      <svg className="h-6 w-6 text-[#0F4F68]/75" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
      </svg>
    );
  }
  if (service === "essen") {
    return (
      <svg className="h-6 w-6 text-[#0F4F68]/75" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M7 3v8" />
        <path d="M4.5 3v5.5" />
        <path d="M9.5 3v5.5" />
        <path d="M4.5 8.5h5" />
        <path d="M7 11v10" />
        <path d="M16 3c2.2 0 4 1.8 4 4v14" />
        <path d="M20 7h-4" />
      </svg>
    );
  }
  if (service === "umbau") {
    return (
      <svg className="h-6 w-6 text-[#0F4F68]/75" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 3.2 3.5 10v10.3h6.2v-6.3h4.6v6.3h6.2V10L12 3.2z" />
      </svg>
    );
  }
  return (
    <svg className="h-6 w-6 text-[#0F4F68]/75" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 4v7" />
      <path d="M7 4v7" />
      <path d="M4 8h3" />
      <path d="M6 11v9" />
      <path d="M14 4c2.2 0 4 1.8 4 4v12" />
      <path d="M18 8h-4" />
    </svg>
  );
}

function StepFlatIcon({ kind }: { kind: "pflegegrad" | "person" | "kontakt" }) {
  if (kind === "pflegegrad") {
    return (
      <svg className="h-5 w-5 text-[#0F4F68]/75" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2 3 6v6c0 5 3.4 9.6 9 10 5.6-.4 9-5 9-10V6l-9-4zm-1 13-3-3 1.4-1.4 1.6 1.6 3.6-3.6L16 10l-5 5z" />
      </svg>
    );
  }
  if (kind === "person") {
    return (
      <svg className="h-5 w-5 text-[#0F4F68]/75" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.4 0-8 2-8 4.5V21h16v-2.5C20 16 16.4 14 12 14z" />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5 text-[#0F4F68]/75" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 4h16v11H7.6L4 18.6V4zm4 4v2h8V8H8zm0 4v2h5v-2H8z" />
    </svg>
  );
}

export function StartEinstiegsHilfe() {
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
    () => SERVICE_OPTIONEN.filter((s) => leistungen.includes(s.key)),
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

  return (
    <section className="mt-12 w-full sm:mt-14 lg:mt-16" aria-labelledby="hilfefinder-headline">
      <h2 id="hilfefinder-headline" className="text-2xl font-bold leading-tight text-[#0F4F68] sm:text-3xl lg:text-[1.85rem]">
        Welche Unterstützung benötigen Sie aktuell?
      </h2>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-neutral-700 sm:text-lg">
        Finden Sie in nur 60 Sekunden die passende Hilfe.
      </p>

      {!started ? (
        <div className="mt-6 animate-fade-in-up">
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="inline-flex min-h-[50px] items-center justify-center rounded-xl bg-[#F78F2E] px-6 py-3 text-base font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e67e22] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4F68]"
          >
            Passende Hilfe finden
          </button>
          <p className="mt-3 text-sm text-neutral-600">Sie müssen nicht alles schon wissen - wir führen Sie Schritt für Schritt.</p>
        </div>
      ) : portalReady ? (
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
                        optionButtonClass,
                        "transition-all duration-300",
                        pflegegrad === p && "border-[#F78F2E]/65 bg-[#fff8f2] shadow-[0_6px_16px_rgba(247,143,46,0.14)]"
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <SelectMark active={pflegegrad === p} />
                        <StepFlatIcon kind="pflegegrad" />
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
                        optionButtonClass,
                        "transition-all duration-300",
                        fuerWen === f.id && "border-[#F78F2E]/65 bg-[#fff8f2] shadow-[0_6px_16px_rgba(247,143,46,0.14)]"
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <SelectMark active={fuerWen === f.id} />
                        <StepFlatIcon kind="person" />
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
                  {SERVICE_OPTIONEN.map((opt) => {
                    const active = leistungen.includes(opt.key);
                    return (
                      <li key={opt.key}>
                        <button
                          type="button"
                          aria-pressed={active}
                          onClick={() => toggleLeistung(opt.key)}
                          className={cn(
                            optionButtonClass,
                            "transition-all duration-300",
                            active && "border-[#F78F2E]/65 bg-[#fff8f2] shadow-[0_6px_16px_rgba(247,143,46,0.14)]"
                          )}
                        >
                          <span className="flex items-start gap-2.5">
                            <SelectMark active={active} />
                            <ServiceIcon service={opt.key} />
                            <span className="block">{opt.label}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
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
                    className={cn(optionButtonClass, "transition-all duration-300", kontaktArt === "rueckruf" && "border-[#F78F2E]/65 bg-[#fff8f2] shadow-[0_6px_16px_rgba(247,143,46,0.14)]")}
                  >
                    <span className="flex items-center gap-2.5">
                      <SelectMark active={kontaktArt === "rueckruf"} />
                      <StepFlatIcon kind="kontakt" />
                      <span>Ich wünsche einen Anruf</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setKontaktArt("selbst");
                      setDatenschutz(false);
                    }}
                    className={cn(optionButtonClass, "transition-all duration-300", kontaktArt === "selbst" && "border-[#F78F2E]/65 bg-[#fff8f2] shadow-[0_6px_16px_rgba(247,143,46,0.14)]")}
                  >
                    <span className="flex items-center gap-2.5">
                      <SelectMark active={kontaktArt === "selbst"} />
                      <StepFlatIcon kind="kontakt" />
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
    </section>
  );
}
