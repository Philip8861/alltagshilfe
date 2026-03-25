"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Bewertung = {
  name: string;
  meta: string;
  text: string;
};

const BEWERTUNGEN: Bewertung[] = [
  {
    name: "Tati",
    meta: "5 Rezensionen · vor 2 Monaten",
    text: "Sehr freundliche telefonische Beratung. Absolut empfehlenswert.",
  },
  {
    name: "Elmas Sert",
    meta: "1 Rezension · vor einem Monat",
    text: "Wir haben eine sehr freundliche Beratung vor Ort erhalten. Unterstützung wurde nach kurzer Zeit unkompliziert geschickt. Vielen Dank!",
  },
  {
    name: "Elena Zimmermann",
    meta: "Local Guide · 11 Rezensionen · vor 2 Wochen",
    text: "Ich bin rundum zufrieden mit der Alltagshilfe-Süd. Der Kontakt ist immer freundlich, zuverlässig und unkompliziert. Die Unterstützung im Alltag ist eine große Hilfe und alles wird sehr sorgfältig und engagiert erledigt. Man merkt, dass hier mit viel Herz gearbeitet wird. Vielen Dank für die tolle Unterstützung – ich kann den Service absolut weiterempfehlen!",
  },
  {
    name: "Ta K.",
    meta: "2 Rezensionen · 17 Fotos · vor einem Jahr",
    text: "Nach einem Beratungsgespräch wurde der Bedarf konkret geklärt und zeitnah eine hauswirtschaftliche Fachkraft eingesetzt. Neben den Reinigungsarbeiten und dem Kochen wurden auch Begleitungen übernommen. Besonders wertvoll: flexible, bedarfsgerechte Unterstützung, direkte Abrechnung mit den Kassen und immer erreichbare Ansprechpartnerinnen.",
  },
  {
    name: "Patricia Schmidt",
    meta: "6 Rezensionen · vor einer Woche",
    text: "Herzlichen Dank. Angerufen und am gleichen Tag noch einen Termin bekommen. Frau Riegel hat mich sehr freundlich und kompetent beraten und direkt eine passende Unterstützung organisiert. Diesen Service kann ich absolut empfehlen.",
  },
  {
    name: "Alf Laumann",
    meta: "1 Rezension · vor einer Woche",
    text: "Nach meinem Oberschenkelhalsbruch war ich auf Hilfe angewiesen. Die Unterstützung kam pünktlich, sehr hilfsbereit und zuverlässig. Auch der Kontakt mit dem Büro war perfekt. Vielen Dank für den großartigen Service.",
  },
  {
    name: "Kathi Bühler",
    meta: "2 Rezensionen · vor 2 Monaten",
    text: "Unsere Oma wird wöchentlich unterstützt, wodurch wir Angehörigen sehr entlastet werden. Vielen Dank für die professionelle und liebevolle Betreuung. Von Pflegeberatung über Hilfeleistungen bis zu Formularen fühlt man sich hier fachgerecht begleitet.",
  },
  {
    name: "Iris Huber",
    meta: "2 Rezensionen · vor 4 Monaten",
    text: "Ich war in einer Notlage und mir und meiner Familie wurde sofort auf die beste Art und Weise geholfen. Das gesamte Team ist sehr kompetent und sehr freundlich. Vielen Dank für die Unterstützung!",
  },
  {
    name: "E. A.",
    meta: "10 Rezensionen · vor 5 Monaten",
    text: "Alles bestens, top Service.",
  },
  {
    name: "Petra Kupzok",
    meta: "5 Rezensionen · vor 10 Monaten",
    text: "Herzlichen Dank für die vielfältige Unterstützung. Egal ob Termine oder Anträge – wir bekommen immer Hilfe und wichtige Infos. Das Personal ist hilfsbereit und nicht aufdringlich. Ich fühle mich bei der Alltagshilfe-Süd sehr gut aufgehoben.",
  },
];

export function KundenstimmenCarousel() {
  const [index, setIndex] = useState(0);
  const [starCount, setStarCount] = useState(0);

  const count = useMemo(() => BEWERTUNGEN.length, []);

  useEffect(() => {
    if (count <= 1) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, 8000);
    return () => window.clearInterval(id);
  }, [count]);

  useEffect(() => {
    setStarCount(0);
    const id = window.setInterval(() => {
      setStarCount((prev) => {
        if (prev >= 5) {
          window.clearInterval(id);
          return 5;
        }
        return prev + 1;
      });
    }, 120);
    return () => window.clearInterval(id);
  }, [index]);

  return (
    <section className="relative z-20 mt-10 w-full px-4 sm:mt-12 sm:px-6 lg:px-8" aria-label="Kundenstimmen">
      <div className="mx-auto w-full max-w-6xl p-5 text-center sm:p-7">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Image
              key={`star-${i}`}
              src="/images/star.png"
              alt=""
              aria-hidden
              width={22}
              height={22}
              unoptimized
              className={cn(
                "h-[22px] w-[22px] transition-all duration-300",
                i < starCount ? "scale-100 opacity-100" : "scale-75 opacity-25"
              )}
            />
          ))}
        </div>
        <p className="mt-2 text-sm font-semibold text-[#0F4F68]/75">Google-Rezensionen · 5,0 Sterne</p>
        <h2 className="mt-1 text-2xl font-bold text-[#0F4F68] sm:text-3xl">Das sagen unsere Kunden*innen</h2>

        <div className="relative mt-5 min-h-[250px] sm:min-h-[220px]">
          {BEWERTUNGEN.map((b, i) => {
            const active = i === index;
            return (
              <article
                key={`${b.name}-${i}`}
                className={cn(
                  "absolute inset-0 p-1 text-left transition-all duration-500",
                  active
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-1 opacity-0"
                )}
                aria-hidden={!active}
              >
                <p className="text-base leading-relaxed text-neutral-700 sm:text-lg">
                  <span aria-hidden>&bdquo;</span>
                  {b.text}
                  <span aria-hidden>&ldquo;</span>
                </p>
                <p className="mt-4 text-sm font-semibold text-[#0F4F68]">{b.name}</p>
                <p className="mt-0.5 text-xs text-neutral-500">{b.meta}</p>
                <div className="mt-3 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, starIdx) => (
                    <Image
                      key={`${b.name}-row-star-${starIdx}`}
                      src="/images/star.png"
                      alt=""
                      aria-hidden
                      width={16}
                      height={16}
                      unoptimized
                      className="h-4 w-4"
                    />
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2" aria-label="Bewertung auswählen">
          {BEWERTUNGEN.map((_, i) => (
            <button
              key={`dot-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "inline-flex h-6 w-6 items-center justify-center rounded-full border transition-colors",
                i === index
                  ? "border-[#F78F2E] bg-[#F78F2E] text-white"
                  : "border-[#0F4F68]/25 bg-white text-[#0F4F68]/45 hover:border-[#0F4F68]/45 hover:text-[#0F4F68]/65"
              )}
              aria-label={`Bewertung ${i + 1} anzeigen`}
            >
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

