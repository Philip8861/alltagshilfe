"use client";

import Link from "next/link";
import { useCallback, useId, useMemo, useState } from "react";
import {
  EINSTIEG_CTA,
  EINSTIEG_KOPF,
  ergebnisAktionen,
  ergebnisInhalte,
  HAUPT_KARTEN,
  MINI_ASSISTENT_SCHRITTE,
  type HauptKartenId,
  type ServiceErgebnisKey,
  UNTER_BEREICHE,
} from "@/config/start-einstieg";
import { cn } from "@/lib/utils";

function sortAktionenNachPrioritaet(
  aktionen: { label: string; href: string }[],
  prio?: string
): { label: string; href: string }[] {
  const copy = [...aktionen];
  const idxKontakt = copy.findIndex((a) => a.href.includes("/kontakt"));
  const idxMehr = copy.findIndex((a) => !a.href.includes("/kontakt"));
  if (prio === "kontakt" || prio === "rueckruf") {
    if (idxKontakt > 0) {
      const [k] = copy.splice(idxKontakt, 1);
      copy.unshift(k);
    }
  } else if (prio === "info" || prio === "leistung") {
    if (idxMehr >= 0 && idxMehr > 0) {
      const [m] = copy.splice(idxMehr, 1);
      copy.unshift(m);
    }
  }
  return copy;
}

function ErgebnisBlock({
  serviceKey,
  zusatzText,
  prioritaet,
}: {
  serviceKey: ServiceErgebnisKey;
  zusatzText?: string;
  prioritaet?: string;
}) {
  const inh = ergebnisInhalte[serviceKey];
  const aktionen = useMemo(
    () => sortAktionenNachPrioritaet(ergebnisAktionen[serviceKey], prioritaet),
    [serviceKey, prioritaet]
  );

  return (
    <div
      className="rounded-2xl border border-[#0F4F68]/15 bg-gradient-to-br from-[#f8fcfd] to-white p-5 shadow-sm sm:p-6"
      role="status"
    >
      <p className="text-sm font-semibold text-[#0F4F68]">{inh.titel}</p>
      <p className="mt-1 text-lg font-bold text-[#0F4F68]">{inh.leistung}</p>
      <p className="mt-3 text-base leading-relaxed text-neutral-700">{inh.text}</p>
      {zusatzText ? (
        <p className="mt-3 text-sm italic leading-relaxed text-neutral-600">{zusatzText}</p>
      ) : null}
      {inh.essenHinweis ? (
        <p className="mt-3 text-sm font-medium text-[#8a6a55]">{inh.essenHinweis}</p>
      ) : null}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {aktionen.map((a) => (
          <Link
            key={a.href + a.label}
            href={a.href}
            className={cn(
              "inline-flex min-h-[48px] min-w-[10rem] items-center justify-center rounded-xl px-5 py-3 text-center text-base font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4F68]",
              a.href.includes("/kontakt")
                ? "border-2 border-[#0F4F68] bg-white text-[#0F4F68] hover:bg-[#F2F9FA]"
                : "bg-[#0F4F68] text-white hover:bg-[#0c3d52]"
            )}
          >
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

const kartenButtonClass =
  "group flex w-full min-h-[52px] flex-col rounded-2xl border-2 border-[#0F4F68]/14 bg-white p-5 text-left shadow-sm transition-all hover:border-[#0F4F68]/35 hover:bg-[#f8fcfd] hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4F68] active:scale-[0.99] motion-reduce:transition-none sm:min-h-[56px] sm:p-6";

const optionButtonClass =
  "min-h-[48px] w-full rounded-xl border border-[#0F4F68]/18 bg-white px-4 py-3 text-left text-base font-medium text-[#0F4F68] transition-colors hover:border-[#0F4F68]/40 hover:bg-[#F2F9FA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4F68]";

export function StartEinstiegsHilfe() {
  const uid = useId();
  const [offeneHaupt, setOffeneHaupt] = useState<HauptKartenId | null>(null);
  const [direktErgebnis, setDirektErgebnis] = useState<ServiceErgebnisKey | null>(null);

  const [assistentOffen, setAssistentOffen] = useState(false);
  const [assistSchritt, setAssistSchritt] = useState<1 | 2 | 3 | 4>(1);
  const [assistThema, setAssistThema] = useState<ServiceErgebnisKey | undefined>();
  const [assistFuer, setAssistFuer] = useState<string | undefined>();
  const [assistPrio, setAssistPrio] = useState<string | undefined>();

  const waehleHaupt = useCallback((id: HauptKartenId) => {
    setDirektErgebnis(null);
    setOffeneHaupt((prev) => (prev === id ? null : id));
  }, []);

  const startAssistent = useCallback(() => {
    setAssistentOffen(true);
    setAssistSchritt(1);
    setAssistThema(undefined);
    setAssistFuer(undefined);
    setAssistPrio(undefined);
  }, []);

  const schliesseAssistent = useCallback(() => {
    setAssistentOffen(false);
    setAssistSchritt(1);
    setAssistThema(undefined);
    setAssistFuer(undefined);
    setAssistPrio(undefined);
  }, []);

  const assistentZusatz = useMemo(() => {
    if (!assistFuer) return undefined;
    if (assistFuer === "mich") return "Wir denken mit Ihnen mit.";
    if (assistFuer === "angehoerige") {
      return "Für die Unterstützung von Angehörigen sind Sie bei uns richtig.";
    }
    return "Nehmen Sie sich die Zeit, die Sie brauchen – wir sind für Sie da.";
  }, [assistFuer]);

  const unter = offeneHaupt ? UNTER_BEREICHE[offeneHaupt] : null;

  return (
    <section
      className="mt-12 w-full sm:mt-14 lg:mt-16"
      aria-labelledby={`${uid}-h2`}
    >
      <h2
        id={`${uid}-h2`}
        className="text-2xl font-bold leading-tight text-[#0F4F68] sm:text-3xl lg:text-[1.85rem]"
      >
        {EINSTIEG_KOPF.headline}
      </h2>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-neutral-700 sm:text-lg">
        {EINSTIEG_KOPF.subline}
      </p>
      <p className="mt-4 text-sm font-medium text-[#0F4F68]/85 sm:text-base">
        {EINSTIEG_KOPF.vertrauen}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
        {HAUPT_KARTEN.map((k) => {
          const expanded = offeneHaupt === k.id;
          const panelId = `${uid}-panel-${k.id}`;
          return (
            <button
              key={k.id}
              type="button"
              aria-expanded={expanded}
              aria-controls={panelId}
              className={cn(kartenButtonClass, expanded && "border-[#0F4F68]/45 bg-[#f0f7f9]")}
              onClick={() => waehleHaupt(k.id)}
            >
              <span className="text-lg font-bold text-[#0F4F68] sm:text-xl">{k.titel}</span>
              <span className="mt-2 text-sm leading-snug text-neutral-600 sm:text-[0.95rem]">
                {k.text}
              </span>
            </button>
          );
        })}
      </div>

      {unter ? (
        <div
          id={`${uid}-panel-${offeneHaupt}`}
          role="region"
          aria-label="Weitere Auswahl"
          className="mt-6 rounded-2xl border border-[#e9c8a8]/35 bg-gradient-to-br from-[#fffbf8]/90 to-white p-5 sm:p-7"
        >
          <h3 className="text-xl font-bold text-[#0F4F68] sm:text-2xl">
            {unter.ueberschrift}
          </h3>
          {unter.text ? (
            <p className="mt-2 max-w-3xl text-base leading-relaxed text-neutral-700">
              {unter.text}
            </p>
          ) : null}
          <ul className="mt-5 grid list-none grid-cols-1 gap-3 sm:grid-cols-2">
            {unter.optionen.map((opt) => (
              <li key={opt.key + opt.label}>
                <button
                  type="button"
                  className={optionButtonClass}
                  onClick={() => setDirektErgebnis(opt.key)}
                >
                  <span className="block">{opt.label}</span>
                  {opt.hinweis ? (
                    <span className="mt-1 block text-sm font-normal text-neutral-500">
                      {opt.hinweis}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {direktErgebnis ? (
        <div className="mt-6 space-y-3">
          <ErgebnisBlock serviceKey={direktErgebnis} />
          <button
            type="button"
            className="text-sm font-semibold text-[#0F4F68] underline underline-offset-2 hover:text-[#0c3d52] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4F68]"
            onClick={() => {
              setDirektErgebnis(null);
            }}
          >
            Andere Auswahl treffen
          </button>
        </div>
      ) : null}

      <div className="mt-10 rounded-2xl border border-[#0F4F68]/12 bg-[#F2F9FA]/50 p-5 sm:p-7">
        <h3 className="text-lg font-bold text-[#0F4F68] sm:text-xl">
          {EINSTIEG_CTA.headline}
        </h3>
        <p className="mt-2 max-w-2xl text-base text-neutral-700">{EINSTIEG_CTA.text}</p>
        <button
          type="button"
          className="mt-4 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#F78F2E] px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#e67e22] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F4F68]"
          aria-expanded={assistentOffen}
          aria-controls={`${uid}-assistent`}
          onClick={() => (assistentOffen ? schliesseAssistent() : startAssistent())}
        >
          {assistentOffen ? "Hilfe-Finder schließen" : EINSTIEG_CTA.button}
        </button>

        {assistentOffen ? (
          <div
            id={`${uid}-assistent`}
            className="mt-6 rounded-2xl border border-[#0F4F68]/15 bg-white p-5 sm:p-6"
            role="group"
            aria-label="Kurze Orientierung in drei Schritten"
          >
            {assistSchritt < 4 ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#0F4F68]/70">
                  Schritt {assistSchritt} von 3
                </p>
                {assistSchritt === 1 ? (
                  <>
                    <p className="mt-2 text-lg font-bold text-[#0F4F68]">
                      {MINI_ASSISTENT_SCHRITTE.schritt1.frage}
                    </p>
                    <ul className="mt-4 grid list-none gap-2 sm:grid-cols-2">
                      {MINI_ASSISTENT_SCHRITTE.schritt1.optionen.map((o) => (
                        <li key={o.key}>
                          <button
                            type="button"
                            className={optionButtonClass}
                            onClick={() => {
                              setAssistThema(o.key);
                              setAssistSchritt(2);
                            }}
                          >
                            {o.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {assistSchritt === 2 ? (
                  <>
                    <p className="mt-2 text-lg font-bold text-[#0F4F68]">
                      {MINI_ASSISTENT_SCHRITTE.schritt2.frage}
                    </p>
                    <ul className="mt-4 grid list-none gap-2 sm:grid-cols-1">
                      {MINI_ASSISTENT_SCHRITTE.schritt2.optionen.map((o) => (
                        <li key={o.id}>
                          <button
                            type="button"
                            className={optionButtonClass}
                            onClick={() => {
                              setAssistFuer(o.id);
                              setAssistSchritt(3);
                            }}
                          >
                            {o.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="mt-4 text-sm font-semibold text-[#0F4F68] underline underline-offset-2"
                      onClick={() => setAssistSchritt(1)}
                    >
                      Zurück
                    </button>
                  </>
                ) : null}

                {assistSchritt === 3 ? (
                  <>
                    <p className="mt-2 text-lg font-bold text-[#0F4F68]">
                      {MINI_ASSISTENT_SCHRITTE.schritt3.frage}
                    </p>
                    <ul className="mt-4 grid list-none gap-2 sm:grid-cols-1">
                      {MINI_ASSISTENT_SCHRITTE.schritt3.optionen.map((o) => (
                        <li key={o.id}>
                          <button
                            type="button"
                            className={optionButtonClass}
                            onClick={() => {
                              setAssistPrio(o.id);
                              setAssistSchritt(4);
                            }}
                          >
                            {o.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="mt-4 text-sm font-semibold text-[#0F4F68] underline underline-offset-2"
                      onClick={() => setAssistSchritt(2)}
                    >
                      Zurück
                    </button>
                  </>
                ) : null}
              </>
            ) : assistThema ? (
              <div className="space-y-4">
                <ErgebnisBlock
                  serviceKey={assistThema}
                  zusatzText={assistentZusatz}
                  prioritaet={assistPrio}
                />
                <button
                  type="button"
                  className="text-sm font-semibold text-[#0F4F68] underline underline-offset-2"
                  onClick={() => {
                    setAssistSchritt(1);
                    setAssistThema(undefined);
                    setAssistFuer(undefined);
                    setAssistPrio(undefined);
                  }}
                >
                  Von vorn beginnen
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
