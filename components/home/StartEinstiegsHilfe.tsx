"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { findStandortByPlz, getOrtByPlz, ortToSlugSegment, type Standort } from "@/config/standorte";
import { cn } from "@/lib/utils";

type ServiceKey =
  | "haushalt"
  | "pflegeberatung"
  | "pflegebox"
  | "koerperpflege"
  | "medizinisch"
  | "umbau"
  | "hausnotruf"
  | "hilfsmittel";

type KontaktArt = "rueckruf" | "email" | "selbst";

const SERVICE_OPTIONEN: { key: ServiceKey; label: string; verfuegbarkeit: "direkt" | "partner" }[] = [
  { key: "haushalt", label: "Alltagsbegleitung & Haushaltsreinigung", verfuegbarkeit: "partner" },
  { key: "pflegeberatung", label: "Halb-, vierteljaehrliche Pflegeberatung nach §37.3", verfuegbarkeit: "partner" },
  { key: "pflegebox", label: "Kostenlose Pflegebox (Utensilien zur Pflege)", verfuegbarkeit: "partner" },
  { key: "koerperpflege", label: "Koerperliche Pflege", verfuegbarkeit: "partner" },
  { key: "medizinisch", label: "Medizinische Versorgung (Verbandswechsel, Medikamentengabe)", verfuegbarkeit: "direkt" },
  { key: "umbau", label: "Umbaumassnahmen im Haus (Barrierefreiheit)", verfuegbarkeit: "direkt" },
  { key: "hausnotruf", label: "Hausnotruf", verfuegbarkeit: "direkt" },
  { key: "hilfsmittel", label: "Pflegehilfsmittel (Rollator, Duschhocker, Haltegriffe usw.)", verfuegbarkeit: "direkt" },
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
  5: "Stark! Hier ist Ihr Ergebnis.",
  6: "Sehr gut, jetzt nur noch Ihren Standort finden.",
  7: "Geschafft! Wählen Sie Ihren bevorzugten Kontaktweg.",
};

const optionButtonClass =
  "min-h-[48px] w-full rounded-xl border border-[#0F4F68]/18 bg-white px-4 py-3 text-left text-base font-medium text-[#0F4F68] transition-colors hover:border-[#0F4F68]/40 hover:bg-[#F2F9FA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4F68]";

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
  if (service === "haushalt" || service === "umbau") {
    return (
      <svg className="h-5 w-5 text-[#0F4F68]/75" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 3.2 3.5 10v10.3h6.2v-6.3h4.6v6.3h6.2V10L12 3.2z" />
      </svg>
    );
  }
  if (service === "pflegeberatung") {
    return (
      <svg className="h-5 w-5 text-[#0F4F68]/75" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M4 4h16v11H7.6L4 18.6V4zm4 4v2h8V8H8zm0 4v2h5v-2H8z" />
      </svg>
    );
  }
  if (service === "pflegebox" || service === "hilfsmittel") {
    return (
      <svg className="h-5 w-5 text-[#0F4F68]/75" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M3 7.2 12 3l9 4.2v9.6L12 21l-9-4.2V7.2zm9 8.5 6.8-3.2V8.6L12 11.8 5.2 8.6v3.9l6.8 3.2z" />
      </svg>
    );
  }
  if (service === "koerperpflege") {
    return (
      <svg className="h-5 w-5 text-[#0F4F68]/75" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2 4 5.2v6.1c0 5.1 3.4 9.8 8 10.7 4.6-.9 8-5.6 8-10.7V5.2L12 2zm-1 13.2-3-3 1.4-1.4 1.6 1.6 3.6-3.6 1.4 1.4-5 5z" />
      </svg>
    );
  }
  if (service === "medizinisch") {
    return (
      <svg className="h-5 w-5 text-[#0F4F68]/75" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M7 4H4v2h1.3l2 9.1h9.6l1.7-6.8H8.5L8 6h12V4H7zm2 13a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5 text-[#0F4F68]/75" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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

const serviceZuLink: Record<ServiceKey, string> = {
  haushalt: "/leistungen/haushaltshilfe",
  pflegeberatung: "/pflegeberatung",
  pflegebox: "/pflegebox",
  koerperpflege: "/leistungen/betreuung-beschaeftigung",
  medizinisch: "/kontakt",
  umbau: "/kontakt",
  hausnotruf: "/kontakt",
  hilfsmittel: "/pflegeshop",
};

export function StartEinstiegsHilfe() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(1);

  const [leistungen, setLeistungen] = useState<ServiceKey[]>([]);
  const [pflegegrad, setPflegegrad] = useState<string>("");
  const [fuerWen, setFuerWen] = useState<string>("");
  const [plz, setPlz] = useState("");
  const [kontaktArt, setKontaktArt] = useState<KontaktArt | "">("");
  const [showStandort, setShowStandort] = useState(false);

  const [vorname, setVorname] = useState("");
  const [nachname, setNachname] = useState("");
  const [telefon, setTelefon] = useState("");
  const [besteZeit, setBesteZeit] = useState("");
  const [email, setEmail] = useState("");
  const [kontaktWunsch, setKontaktWunsch] = useState("");

  const [error, setError] = useState("");

  const plzNorm = plz.replace(/\D/g, "").slice(0, 5);
  const ort = useMemo(() => (plzNorm.length === 5 ? getOrtByPlz(plzNorm) : undefined), [plzNorm]);
  const standort: Standort | undefined = useMemo(
    () => (plzNorm.length === 5 ? findStandortByPlz(plzNorm) : undefined),
    [plzNorm]
  );

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
    setShowStandort(false);
    setVorname("");
    setNachname("");
    setTelefon("");
    setBesteZeit("");
    setEmail("");
    setKontaktWunsch("");
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
  const direktVerfuegbar = useMemo(
    () => ausgewaehlteLeistungen.filter((s) => s.verfuegbarkeit === "direkt"),
    [ausgewaehlteLeistungen]
  );
  const partnerVerfuegbar = useMemo(
    () => ausgewaehlteLeistungen.filter((s) => s.verfuegbarkeit === "partner"),
    [ausgewaehlteLeistungen]
  );
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
    ].join("\n");
    return `mailto:info@alltagshilfe-sued.de?subject=${encodeURIComponent("Anfrage über Hilfe-Finder")}&body=${encodeURIComponent(body)}`;
  }, [besteZeit, email, fuerWen, kontaktWunsch, leistungsText, pflegegrad, plzNorm, nachname, telefon, vorname]);

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
      ) : (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0F4F68]/45 p-3 backdrop-blur-[2px] sm:items-center sm:p-6">
          <div className="w-full max-w-4xl animate-fade-in-up rounded-2xl border border-[#0F4F68]/15 bg-white p-5 shadow-2xl sm:p-7">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#0F4F68]/70">Schritt {Math.min(step, 7)} von 7</p>
              <button
                type="button"
                onClick={() => {
                  setStarted(false);
                  resetFlow();
                }}
                className="inline-flex min-h-[40px] items-center rounded-lg border border-[#0F4F68]/20 px-3 py-1.5 text-sm font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]"
                aria-label="Hilfe-Finder schließen"
              >
                Schließen
              </button>
            </div>
            <p className="mb-2 text-sm font-semibold text-[#0F4F68]/75">{SCHRITT_MOTIVATION[step]}</p>

            {step === 1 ? (
              <div className="mt-3 animate-fade-in-up">
                <h3 className="text-lg font-bold text-[#0F4F68] sm:text-xl">Kurze Information vor dem Start</h3>
                <p className="mt-2 text-neutral-700">
                  Sie müssen für das Ergebnis keine persönlichen Daten eingeben. Sie erhalten das Ergebnis direkt am Ende in wenigen Schritten.
                </p>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="mt-3 animate-fade-in-up">
              <h3 className="text-lg font-bold text-[#0F4F68] sm:text-xl">Welchen Pflegegrad gibt es aktuell?</h3>
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
              <div className="mt-3 animate-fade-in-up">
              <h3 className="text-lg font-bold text-[#0F4F68] sm:text-xl">Für wen suchen Sie Unterstützung?</h3>
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
              <div className="mt-3 animate-fade-in-up">
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
              <div className="mt-3 animate-fade-in-up space-y-4">
                <h3 className="text-lg font-bold text-[#0F4F68] sm:text-xl">Gute Nachricht!</h3>
                <p className="text-neutral-700">Wir haben für folgende Dienstleistungen freie Kapazitäten:</p>
                <ul className="space-y-2">
                  {ausgewaehlteLeistungen.map((l, i) => (
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
                          {l.verfuegbarkeit === "direkt" ? "Sofort verfügbar über uns" : "Freie Kapazitäten über unsere Kooperationspartner"}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                {direktVerfuegbar.length > 0 ? <p className="text-sm text-emerald-700">Sofort verfügbar über uns: {direktVerfuegbar.map((l) => l.label).join(", ")}.</p> : null}
                {partnerVerfuegbar.length > 0 ? <p className="text-sm text-[#c86d1f]">Freie Kapazitäten über unsere Kooperationspartner: {partnerVerfuegbar.map((l) => l.label).join(", ")}.</p> : null}
              </div>
            ) : null}

            {step === 6 ? (
              <div className="mt-3 space-y-4 animate-fade-in-up">
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
                {plzNorm.length === 5 && standort ? (
                  <div className="rounded-xl border border-[#0F4F68]/15 bg-[#f8fcfd] p-4">
                    <p className="font-semibold text-[#0F4F68]">{standort.name}</p>
                    <p className="text-sm text-neutral-700">{plzNorm}{ort ? ` ${ort}` : ""}</p>
                    <button type="button" onClick={() => setShowStandort((v) => !v)} className="mt-3 inline-flex min-h-[40px] items-center rounded-lg bg-[#0F4F68] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#0c3d52]">
                      Standort anzeigen
                    </button>
                    {showStandort ? (
                      <div className="mt-3 space-y-1 text-sm text-neutral-700">
                        <p>{standort.address}</p>
                        <p>Telefon: <a className="text-[#0F4F68] underline" href={standort.phoneHref}>{standort.phone}</a></p>
                        <p>E-Mail: <a className="text-[#0F4F68] underline" href={`mailto:${standort.email}`}>{standort.email}</a></p>
                        <Link href={ort ? `/standorte/${plzNorm}-${ortToSlugSegment(ort)}` : "/standorte"} className="inline-flex min-h-[40px] items-center rounded-lg border border-[#0F4F68]/35 px-3 py-1.5 font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]">Zur Standortseite</Link>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}

            {step === 7 ? (
              <div className="mt-3 animate-fade-in-up">
                <h3 className="text-lg font-bold text-[#0F4F68] sm:text-xl">Wie möchten Sie den Kontakt?</h3>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setKontaktArt("rueckruf")}
                    className={cn(optionButtonClass, "transition-all duration-300", kontaktArt === "rueckruf" && "border-[#F78F2E]/65 bg-[#fff8f2] shadow-[0_6px_16px_rgba(247,143,46,0.14)]")}
                  >
                    <span className="flex items-center gap-2.5">
                      <SelectMark active={kontaktArt === "rueckruf"} />
                      <StepFlatIcon kind="kontakt" />
                      <span>Ich wünsche einen Rückruf</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setKontaktArt("email")}
                    className={cn(optionButtonClass, "transition-all duration-300", kontaktArt === "email" && "border-[#F78F2E]/65 bg-[#fff8f2] shadow-[0_6px_16px_rgba(247,143,46,0.14)]")}
                  >
                    <span className="flex items-center gap-2.5">
                      <SelectMark active={kontaktArt === "email"} />
                      <StepFlatIcon kind="kontakt" />
                      <span>Ich wünsche Kontakt per E-Mail</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setKontaktArt("selbst")}
                    className={cn(optionButtonClass, "transition-all duration-300", kontaktArt === "selbst" && "border-[#F78F2E]/65 bg-[#fff8f2] shadow-[0_6px_16px_rgba(247,143,46,0.14)]")}
                  >
                    <span className="flex items-center gap-2.5">
                      <SelectMark active={kontaktArt === "selbst"} />
                      <StepFlatIcon kind="kontakt" />
                      <span>Ich möchte selbst kontaktieren</span>
                    </span>
                  </button>
                </div>

                {kontaktArt === "rueckruf" ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <input value={vorname} onChange={(e) => setVorname(e.target.value)} placeholder="Vorname *" className="rounded-xl border border-[#0F4F68]/20 px-4 py-3" />
                    <input value={nachname} onChange={(e) => setNachname(e.target.value)} placeholder="Nachname *" className="rounded-xl border border-[#0F4F68]/20 px-4 py-3" />
                    <input value={telefon} onChange={(e) => setTelefon(e.target.value)} placeholder="Telefonnummer *" className="rounded-xl border border-[#0F4F68]/20 px-4 py-3 sm:col-span-2" />
                    <input value={besteZeit} onChange={(e) => setBesteZeit(e.target.value)} placeholder="Passender Tag/Uhrzeit *" className="rounded-xl border border-[#0F4F68]/20 px-4 py-3 sm:col-span-2" />
                  </div>
                ) : null}

                {kontaktArt === "email" ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <input value={vorname} onChange={(e) => setVorname(e.target.value)} placeholder="Vorname *" className="rounded-xl border border-[#0F4F68]/20 px-4 py-3" />
                    <input value={nachname} onChange={(e) => setNachname(e.target.value)} placeholder="Nachname *" className="rounded-xl border border-[#0F4F68]/20 px-4 py-3" />
                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Mail *" type="email" className="rounded-xl border border-[#0F4F68]/20 px-4 py-3 sm:col-span-2" />
                  </div>
                ) : null}

                {kontaktArt ? (
                  <textarea
                    value={kontaktWunsch}
                    onChange={(e) => setKontaktWunsch(e.target.value)}
                    placeholder="Hinweis (optional)"
                    className="mt-3 min-h-[90px] w-full rounded-xl border border-[#0F4F68]/20 px-4 py-3"
                  />
                ) : null}

                {kontaktArt && kontaktArt !== "selbst" ? (
                  <div className="mt-4 rounded-xl border border-[#0F4F68]/15 bg-[#f8fcfd] p-4">
                    <p className="text-sm font-semibold text-[#0F4F68]">Ausgewählte Leistungen (werden übermittelt):</p>
                    <pre className="mt-2 whitespace-pre-wrap text-sm text-neutral-700">{leistungsText || "-"}</pre>
                    <a href={mailtoHref} className="mt-3 inline-flex min-h-[42px] items-center rounded-lg bg-[#0F4F68] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c3d52]">
                      Anfrage senden
                    </a>
                  </div>
                ) : null}

                {kontaktArt === "selbst" ? (
                  <div className="mt-4 rounded-xl border border-[#0F4F68]/15 bg-[#f8fcfd] p-4 text-sm text-neutral-700">
                    <p className="font-semibold text-[#0F4F68]">Einfaches Kontaktformular</p>
                    <p className="mt-2">Ihre ausgewählten Leistungen können Sie dort direkt im Anliegen einfügen.</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {ausgewaehlteLeistungen.map((l) => (
                        <Link key={l.key} href={serviceZuLink[l.key]} className="inline-flex min-h-[38px] items-center rounded-lg border border-[#0F4F68]/35 px-3 py-1.5 text-xs font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]">{l.label}</Link>
                      ))}
                    </div>
                    <Link href={`/kontakt${plzNorm ? `?plz=${plzNorm}` : ""}`} className="mt-3 inline-flex min-h-[42px] items-center rounded-lg border border-[#0F4F68]/35 px-4 py-2 font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]">
                      Zum Kontaktformular
                    </Link>
                  </div>
                ) : null}
              </div>
            ) : null}

            {error ? <p className="mt-4 text-sm text-red-600" role="alert">{error}</p> : null}

            <div className="mt-6 flex flex-wrap gap-3">
              {step > 1 && step < 7 ? (
                <button
                  type="button"
                  onClick={zurueck}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-xl border border-[#0F4F68]/30 px-5 py-2 text-base font-semibold text-[#0F4F68] hover:bg-[#F2F9FA]"
                >
                  Zurück
                </button>
              ) : null}

              {step < 7 ? (
                <button
                  type="button"
                  onClick={weiter}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-[#0F4F68] px-5 py-2 text-base font-semibold text-white hover:bg-[#0c3d52]"
                >
                  Weiter
                </button>
              ) : null}

              {step === 7 ? (
                <button
                  type="button"
                  onClick={resetFlow}
                  className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-[#F78F2E] px-5 py-2 text-base font-semibold text-white hover:bg-[#e67e22]"
                >
                  Neu starten
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
