"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type FaqItem = { question: string; answer: string };

type FaqAccordionProps = { items: FaqItem[] };

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <ul className="divide-y divide-[#0F4F68]/15 rounded-xl border border-[#0F4F68]/15 bg-white">
      {items.map((item, i) => (
        <li key={i}>
          <h3>
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium text-neutral-900 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-neutral-500"
              aria-expanded={openIndex === i}
              aria-controls={`faq-answer-${i}`}
              id={`faq-question-${i}`}
            >
              {item.question}
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded transition-transform",
                  openIndex === i && "rotate-180"
                )}
                aria-hidden
              >
                <svg
                  className="h-5 w-5 text-neutral-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </button>
          </h3>
          <div
            id={`faq-answer-${i}`}
            role="region"
            aria-labelledby={`faq-question-${i}`}
            className={cn(
              "overflow-hidden transition-all",
              openIndex === i ? "block" : "hidden"
            )}
          >
            <p className="border-t border-[#0F4F68]/10 px-5 py-4 text-neutral-600">
              {item.answer}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
