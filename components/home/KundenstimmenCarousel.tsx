"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Bewertung = {
  name: string;
  ort: string;
  text: string;
};

const BEWERTUNGEN: Bewertung[] = [
  {
    name: "Sabine M.",
    ort: "Memmingen",
    text: "Sehr herzliches Team. Wir haben schnell die passende Unterstützung bekommen und fühlen uns wirklich gut begleitet.",
  },
  {
    name: "Thomas M.",
    ort: "Augsburg",
    text: "Freundlich, zuverlässig und verständlich erklärt. Besonders die Pflegeberatung hat uns enorm geholfen.",
  },
  {
    name: "Elena K.",
    ort: "Wangen",
    text: "Die Alltagsbegleitung ist eine große Entlastung für unsere Familie. Termine klappen verlässlich und menschlich.",
  },
  {
    name: "Petra M.",
    ort: "Kempten",
    text: "Vom ersten Kontakt an hatten wir ein gutes Gefühl. Alles lief ruhig, transparent und ohne komplizierte Schritte.",
  },
  {
    name: "Johann S.",
    ort: "Engen",
    text: "Tolle Unterstützung im Alltag. Wir wurden sehr respektvoll behandelt und jederzeit kompetent beraten.",
  },
];

export function KundenstimmenCarousel() {
  const [index, setIndex] = useState(0);

  const count = useMemo(() => BEWERTUNGEN.length, []);

  useEffect(() => {
    if (count <= 1) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, 5000);
    return () => window.clearInterval(id);
  }, [count]);

  return (
    <section className="relative z-20 mt-10 w-full px-4 sm:mt-12 sm:px-6 lg:px-8" aria-label="Kundenstimmen">
      <div className="mx-auto w-full max-w-6xl rounded-3xl border border-[#0F4F68]/12 bg-white/95 p-5 shadow-[0_10px_24px_rgba(15,79,104,0.07)] sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Image
              key={`star-${i}`}
              src="/images/star.png"
              alt=""
              aria-hidden
              width={22}
              height={22}
              className="h-[22px] w-[22px]"
            />
          ))}
        </div>
        <h2 className="mt-3 text-2xl font-bold text-[#0F4F68] sm:text-3xl">Das sagen unsere Kunden*in</h2>

        <div className="relative mt-4 min-h-[150px] sm:min-h-[130px]">
          {BEWERTUNGEN.map((b, i) => {
            const active = i === index;
            return (
              <article
                key={`${b.name}-${i}`}
                className={cn(
                  "absolute inset-0 transition-all duration-500",
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
                <p className="mt-4 text-sm font-semibold text-[#0F4F68]">
                  {b.name} - {b.ort}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-4 flex gap-2" aria-label="Bewertung auswählen">
          {BEWERTUNGEN.map((_, i) => (
            <button
              key={`dot-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "h-2.5 w-2.5 rounded-full transition-colors",
                i === index ? "bg-[#F78F2E]" : "bg-[#0F4F68]/22 hover:bg-[#0F4F68]/38"
              )}
              aria-label={`Bewertung ${i + 1} anzeigen`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

