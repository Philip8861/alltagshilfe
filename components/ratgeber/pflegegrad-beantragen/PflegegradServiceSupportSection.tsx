"use client";

import Link from "next/link";

import { RatgeberBeratungCtaButton } from "@/components/ratgeber/RatgeberBeratungDialog";
import { features } from "@/config/features";

const ITEMS = (
  [
    "Unterstützung beim Pflegegrad-Antrag",
    "Hilfe beim Widerspruch",
    "Private Pflegeberatung",
    "Haushaltsreinigung",
    "Alltagsbegleitung & Betreuung",
    "Entlastungsbetrag über Alltagshilfe-Süd nutzbar",
    "Ersatzpflege / Verhinderungspflege",
    "Pflegehilfsmittel im Wert von bis zu 42 €",
    "Inkontinenzversorgung über Rezept",
    "Pflegeshop",
    "Essen auf Rädern",
    "Hausnotruf über Kooperationspartner",
    "Treppenlift über Kooperationspartner",
    "Begehbare Dusche über Kooperationspartner",
    "Abrechnung über alle Kranken- und Pflegekassen möglich",
  ] as const
).filter((t) => t !== "Essen auf Rädern" || features.essenAufRaederVisible);

function CheckBullet() {
  return (
    <span className="mt-0.5 flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center rounded-sm border border-[#F78F2E]/50 text-[0.65rem] font-bold text-[#F78F2E]">
      ✓
    </span>
  );
}

export function PflegegradServiceSupportSection() {
  return (
    <aside
      className="relative overflow-hidden rounded-2xl border border-neutral-200/90 bg-[linear-gradient(180deg,#fafcfc_0%,#ffffff_40%)] px-5 py-7 shadow-[0_2px_16px_-8px_rgba(15,79,104,0.12)] sm:px-8 sm:py-9"
      aria-labelledby="ahs-service-support-heading"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0F4F68] via-[#3d9aaa] to-[#F78F2E]/90"
      />
      <h2 id="ahs-service-support-heading" className="mt-1 text-xl font-semibold tracking-tight text-[#0F4F68] sm:text-[1.35rem]">
        Wir unterstützen Sie beim Pflegegrad-Antrag
      </h2>
      <p className="mt-3 max-w-[40rem] text-[1.0625rem] leading-relaxed text-neutral-700">
        Alltagshilfe-Süd hilft beim Antrag, bei der Begutachtung und bei weiteren Versorgungsfragen – verständlich und
        abgestimmt auf Ihre Situation. Pflegeberatung erfolgt hier im Rahmen der{" "}
        <Link href="/pflegeberatung/private-pflegeberatung" className="font-medium text-[#0F4F68] underline underline-offset-2 hover:text-[#0c3d52]">
          privaten Pflegeberatung
        </Link>
        .
      </p>

      <ul className="mt-6 grid gap-x-10 gap-y-3 sm:grid-cols-2">
        {ITEMS.map((t) => (
          <li key={t} className="flex gap-3 text-[1rem] leading-snug text-neutral-800">
            <CheckBullet />
            <span>{t}</span>
          </li>
        ))}
      </ul>

      <RatgeberBeratungCtaButton
        className="mt-8 inline-flex min-h-[2.875rem] w-full items-center justify-center px-6 sm:w-auto"
        preselectedServices={["pflegegrad_beantrag_widerspruch", "haushalt"]}
        contextNote="Ratgeber: Pflegegrad beantragen – Wir unterstützen Sie"
      >
        Jetzt kostenlos beraten lassen
      </RatgeberBeratungCtaButton>
    </aside>
  );
}
