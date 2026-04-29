"use client";

import { useState } from "react";

import type { PflegegradFaqItem } from "@/components/ratgeber/pflegegrad-beantragen/pflegegrad-beantragen-faq-data";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 text-neutral-400 transition-transform ${open ? "-rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path d="m18 15-6-6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Dezentes FAQ-Accordion (nur diese Seite) */
export function PflegegradFaqAccordion({ items }: { items: PflegegradFaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200/95 bg-white shadow-[0_2px_14px_-8px_rgba(15,79,104,0.12)]">
      {items.map((faq, index) => {
        const open = openId === faq.id;
        const num = String(index + 1).padStart(2, "0");
        return (
          <div key={faq.id} className="border-b border-neutral-100 last:border-b-0">
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`faq-panel-${faq.id}`}
              id={`faq-trigger-${faq.id}`}
              onClick={() => setOpenId(open ? null : faq.id)}
              className="flex w-full items-start gap-3 px-4 py-4 text-left transition hover:bg-[#fafcfc] sm:gap-4 sm:px-5 sm:py-[1.05rem]"
            >
              <span
                aria-hidden
                className="mt-0.5 flex h-9 w-10 shrink-0 items-center justify-center rounded-lg border border-[#0F4F68]/12 bg-gradient-to-br from-[#f3f9fa] to-white text-[0.8rem] font-bold tabular-nums text-[#0F4F68]"
              >
                {num}
              </span>
              <span className="min-w-0 flex-1 pt-0.5 text-[1.0625rem] font-semibold leading-snug text-[#0F4F68]">
                {faq.question}
              </span>
              <Chevron open={open} />
            </button>
            {open ? (
              <div id={`faq-panel-${faq.id}`} role="region" aria-labelledby={`faq-trigger-${faq.id}`}>
                <p className="mx-4 mb-5 border-t border-neutral-100/95 bg-[linear-gradient(180deg,#ffffff_0%,#fafcfc_100%)] px-3 pb-1 pt-3 text-[1.0625rem] leading-relaxed text-neutral-700 sm:mx-5 sm:px-5">
                  {faq.answer}
                </p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
