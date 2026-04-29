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
    <div className="mt-6 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
      {items.map((faq) => {
        const open = openId === faq.id;
        return (
          <div key={faq.id} className="bg-white">
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`faq-panel-${faq.id}`}
              id={`faq-trigger-${faq.id}`}
              onClick={() => setOpenId(open ? null : faq.id)}
              className="flex w-full items-start gap-4 px-4 py-4 text-left transition hover:bg-neutral-50/80 sm:px-5 sm:py-4"
            >
              <span className="min-w-0 flex-1 text-[1.0625rem] font-semibold leading-snug text-[#0F4F68]">
                {faq.question}
              </span>
              <Chevron open={open} />
            </button>
            {open ? (
              <div id={`faq-panel-${faq.id}`} role="region" aria-labelledby={`faq-trigger-${faq.id}`}>
                <p className="border-t border-neutral-100 px-4 pb-4 pt-0 text-[1.0625rem] leading-relaxed text-neutral-700 sm:px-5 sm:pb-5">
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
