"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GtmMailtoLink, GtmPhoneLink } from "@/components/analytics/GtmContactIntentLink";

export type StandortTeaserMitBildProps = {
  plz: string;
  ort: string;
  phone: string;
  phoneHref: string;
  email: string;
  slug: string;
  leistungen: readonly string[];
};

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
        <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
          <h2
            id="standort-teaser-heading"
            className={`st-teaser-anim text-2xl font-bold text-[#0F4F68] w-full ${anim}`}
          >
            Haushaltshilfe & Alltagsbegleitung in {plz} {ort}
          </h2>

          <p
            className={`st-teaser-anim st-teaser-delay-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-neutral-800 ${anim}`}
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
            className={`st-teaser-anim st-teaser-delay-2 flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 text-sm ${anim}`}
          >
            <GtmPhoneLink
              href={phoneHref}
              sourceComponent="standort_teaser_tel"
              plz={plz}
              service={slug}
              className="font-semibold text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 focus:ring-offset-[#F2F9FA] rounded"
            >
              {phone}
            </GtmPhoneLink>
            <GtmMailtoLink
              href={`mailto:${email}`}
              sourceComponent="standort_teaser_email"
              plz={plz}
              service={slug}
              className="break-all font-semibold text-[#0F4F68] hover:underline focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 focus:ring-offset-[#F2F9FA] rounded"
            >
              {email}
            </GtmMailtoLink>
          </div>

          <div className={`st-teaser-anim st-teaser-delay-3 flex justify-center ${anim}`}>
            <Link
              href={`/standorte/${slug}`}
              className="inline-flex w-full max-w-xs items-center justify-center rounded-xl bg-[#0F4F68] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 focus:ring-offset-[#F2F9FA] sm:w-auto sm:min-w-[200px]"
            >
              Zum Standort
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
