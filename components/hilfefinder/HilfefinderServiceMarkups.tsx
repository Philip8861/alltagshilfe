"use client";

import type { HilfefinderServiceKey } from "@/config/hilfefinder-services";
import { cn } from "@/lib/utils";

export const hilfefinderOptionButtonClass =
  "min-h-[54px] w-full rounded-xl border border-[#0F4F68]/18 bg-white px-4 py-3.5 text-left text-[1.03rem] font-medium text-[#0F4F68] transition-colors hover:border-[#F78F2E]/60 hover:bg-[#fff8f2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F78F2E]";

export function HilfefinderSelectMark({ active }: { active: boolean }) {
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

export function HilfefinderServiceIcon({ service }: { service: HilfefinderServiceKey }) {
  if (service === "pflegegrad_beantrag_widerspruch") {
    return (
      <svg
        className="h-6 w-6 text-[#0F4F68]/75"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h8" />
        <path d="M8 9h2" />
      </svg>
    );
  }
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

export function HilfefinderStepFlatIcon({ kind }: { kind: "pflegegrad" | "person" | "kontakt" }) {
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

/** Hilfefinder-Service-Button mit Icon und Mark (Mehrfachauswahl). */
export function HilfefinderServiceOptionButton({
  opt,
  active,
  onToggle,
}: {
  opt: { key: HilfefinderServiceKey; label: string };
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onToggle}
      className={cn(
        hilfefinderOptionButtonClass,
        "transition-all duration-300",
        active && "border-[#F78F2E]/65 bg-[#fff8f2] shadow-[0_6px_16px_rgba(247,143,46,0.14)]",
      )}
    >
      <span className="flex items-start gap-2.5">
        <HilfefinderSelectMark active={active} />
        <HilfefinderServiceIcon service={opt.key} />
        <span className="block">{opt.label}</span>
      </span>
    </button>
  );
}
