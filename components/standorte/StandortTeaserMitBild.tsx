"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export type StandortTeaserMitBildProps = {
  plz: string;
  ort: string;
  phone: string;
  phoneHref: string;
  email: string;
  slug: string;
  leistungen: readonly string[];
};

/** Kurze Texte rund ums Bild (Marke / emotionale Ebene). */
const CAPTION_ABOVE = "Mit Herz und Kompetenz – direkt bei Ihnen in der Region.";
const CAPTION_BELOW = "Regional · persönlich · zuverlässig – Ihr Team von Alltagshilfe-Süd.";

export function StandortTeaserMitBild({
  plz,
  ort,
  phone,
  phoneHref,
  email,
  slug,
  leistungen,
}: StandortTeaserMitBildProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setOn(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const anim = on ? "is-on" : "";

  return (
    <section
      ref={rootRef}
      className="mt-10 sm:mt-12 w-full max-w-5xl mx-auto px-4 sm:px-6"
      aria-labelledby="standort-teaser-heading"
    >
      <div
        className="w-full rounded-2xl border border-[#0F4F68]/15 bg-[#F2F9FA] px-5 py-6 sm:px-8 sm:py-8"
        style={{
          boxShadow:
            "0 4px 14px rgba(15, 79, 104, 0.12), 0 10px 28px rgba(15, 79, 104, 0.1), 0 18px 44px rgba(15, 79, 104, 0.06)",
        }}
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-10 lg:justify-between">
          {/* Text + Aktionen */}
          <div className="min-w-0 flex-1 text-center lg:text-left">
            <h2
              id="standort-teaser-heading"
              className={`st-teaser-anim text-lg font-extrabold text-[#0F4F68] sm:text-xl ${anim}`}
            >
              Haushaltshilfe & Alltagsbegleitung in {plz} {ort}
            </h2>

            <p
              className={`st-teaser-anim st-teaser-delay-1 mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-neutral-800 lg:justify-start ${anim}`}
            >
              {leistungen.map((leistung, i) => (
                <span key={leistung} className="inline-flex items-center gap-1.5">
                  {i > 0 && (
                    <span className="text-[#0F4F68]/50" aria-hidden>
                      ·
                    </span>
                  )}
                  <span
                    className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#F78F2E] text-white"
                    aria-hidden
                  >
                    <svg
                      className="h-2.5 w-2.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>{leistung}</span>
                </span>
              ))}
            </p>

            <div
              className={`st-teaser-anim st-teaser-delay-2 mt-4 flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start lg:gap-x-6 text-sm ${anim}`}
            >
              <a
                href={phoneHref}
                className="font-semibold text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 focus:ring-offset-[#F2F9FA] rounded"
              >
                {phone}
              </a>
              <a
                href={`mailto:${email}`}
                className="break-all font-semibold text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 focus:ring-offset-[#F2F9FA] rounded"
              >
                {email}
              </a>
            </div>

            <div className={`st-teaser-anim st-teaser-delay-3 mt-4 flex justify-center lg:justify-start ${anim}`}>
              <Link
                href={`/standorte/${slug}`}
                className="inline-flex w-full max-w-xs items-center justify-center rounded-xl bg-[#0F4F68] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 focus:ring-offset-[#F2F9FA] lg:w-auto lg:min-w-[200px]"
              >
                Zum Standort
              </Link>
            </div>
          </div>

          {/* Bild mit Text darüber/darunter – Schatten nur am sichtbaren Motiv (drop-shadow) */}
          <div className="mx-auto w-full max-w-[280px] shrink-0 sm:max-w-xs lg:mx-0 lg:max-w-sm">
            <p
              className={`st-teaser-anim st-teaser-delay-1 mb-3 text-center text-xs font-semibold uppercase tracking-wide text-[#0F4F68]/85 sm:text-sm lg:text-left ${anim}`}
            >
              {CAPTION_ABOVE}
            </p>

            <div
              className={`st-teaser-anim st-teaser-delay-2 mx-auto w-fit max-w-full ${anim}`}
              style={{
                filter:
                  "drop-shadow(0 6px 16px rgba(15, 79, 104, 0.18)) drop-shadow(0 2px 6px rgba(15, 79, 104, 0.12))",
              }}
            >
              <div
                className="rotate-[2.5deg] rounded-[1.35rem] bg-white p-1.5 ring-[3px] ring-white shadow-none"
                style={{ transformOrigin: "center center" }}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
                  <Image
                    src="/images/Testbild.webp"
                    alt="Betreuung und Zuwendung: Team Alltagshilfe-Süd mit Seniorin im Freien"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 360px"
                    priority={false}
                  />
                </div>
              </div>
            </div>

            <p
              className={`st-teaser-anim st-teaser-delay-4 mt-4 text-center text-xs italic leading-snug text-neutral-600 sm:text-sm lg:text-left ${anim}`}
            >
              {CAPTION_BELOW}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
