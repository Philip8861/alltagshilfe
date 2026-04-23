"use client";

import Link from "next/link";
import { type ReactNode, useId, useRef } from "react";
import { useKarriereApplyOptional } from "@/components/karriere/karriereApplyContext";
import { cn } from "@/lib/utils";

const EINLEITUNG =
  "Sie legen Wert auf flexible Arbeitszeiten, die sich Ihrem Alltag anpassen? Check! Sie sind Quereinsteiger und suchen eine neue berufliche Herausforderung? Kein Problem! Wichtig ist die Freude im Umgang mit Menschen und die Bereitschaft, diese in ihren alltäglichen Herausforderungen zu unterstützen. Als Alltagshelfer sind Sie nicht für pflegerische Maßnahmen zuständig, sondern helfen im Bereich Betreuung und Hauswirtschaft.";

function OrangeCheck({ className }: { className?: string }) {
  return (
    <svg
      className={cn("mt-0.5 h-4 w-4 shrink-0 text-[#F78F2E] sm:h-[1.125rem] sm:w-[1.125rem]", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const WIR_BIETEN = [
  "ein freundliches, offenes Arbeitsklima",
  "flexible Arbeitszeiten",
  "leistungsgerechte, attraktive Vergütung",
  "Sachbezugskarte / Wellpass",
  "Gesundheitsbonus",
  "Kilometergeld",
  "30 Urlaubstage (angerechnet auf eine 5-Tage-Woche)",
  "Fort- und Weiterbildungen",
  "eine verantwortungsvolle und abwechslungsreiche Arbeit",
  "Vergütung für Fahrzeiten zwischen den Einsätzen",
] as const;

const BETREUUNG = [
  "soziale Aktivitäten",
  "Begleitungen wie z. B. Einkäufe, Alltagserledigungen",
  "Hilfe zur Entwicklung und Aufrechterhaltung einer Tagesstruktur",
  "Botengänge wie z. B. Apothekenbesuche, Postaufgaben",
] as const;

const HAUSHALT = [
  "Lebensmitteleinkauf",
  "Zubereiten von Mahlzeiten",
  "Reinigung des Lebensbereiches",
  "Trennung und Entsorgung des Abfalls",
  "Wäschewaschen, -bügeln, -falten und in den Kleiderschrank einräumen",
  "Bewässern der Zimmerpflanzen",
  "Versorgung von Haustieren",
] as const;

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-2 space-y-2.5 text-sm leading-relaxed text-neutral-700 sm:text-base">
      {items.map((t) => (
        <li key={t} className="flex gap-2.5">
          <OrangeCheck />
          <span className="min-w-0 flex-1 break-words text-pretty">{t}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3
      className={cn(
        "mt-8 border-b border-[#0F4F68]/12 pb-2.5 text-sm font-bold uppercase tracking-wide text-[#0F4F68] sm:mt-10 sm:text-base",
        className,
      )}
    >
      {children}
    </h3>
  );
}

function SubTitle({ children }: { children: ReactNode }) {
  return <h4 className="mt-4 text-sm font-semibold text-[#0F4F68] sm:text-base">{children}</h4>;
}

type StellenbeschreibungDialogTriggerProps = {
  jobTitle: string;
  className?: string;
};

export function StellenbeschreibungDialogTrigger({ jobTitle, className }: StellenbeschreibungDialogTriggerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const bewerbenHref = `/kontakt?betreff=Bewerbung%20${encodeURIComponent(jobTitle)}`;
  const karriereApply = useKarriereApplyOptional();

  return (
    <>
      <button
        type="button"
        className={className}
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
      >
        Stellenbeschreibung ansehen
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className={cn(
          /* Kein `flex` außer mit `open:` – sonst überschreibt Tailwind `display:none` des geschlossenen <dialog>. */
          "fixed inset-0 z-[100] m-0 max-h-none min-h-0 w-full max-w-none border-0 bg-transparent p-3 sm:p-5 md:p-8",
          "open:flex open:items-center open:justify-center",
          "[&::backdrop]:bg-[#0F4F68]/45 [&::backdrop]:backdrop-blur-[2px]",
        )}
      >
        {/* Innen-Panel: UA-Styles vom <dialog> umgehen; Rand immer sichtbar, nie breiter als Viewport. */}
        <div
          className={cn(
            "flex min-w-0 max-h-[min(88dvh,calc(100dvh-2.5rem))] w-full max-w-[min(60rem,calc(100dvw-1.5rem))] flex-col overflow-hidden rounded-3xl border-2 border-[#0F4F68]/15 bg-white shadow-[0_25px_80px_-12px_rgba(15,79,104,0.35)]",
            "sm:max-w-[min(60rem,calc(100dvw-2.5rem))]",
          )}
        >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#0F4F68]/8 bg-gradient-to-r from-[#FFF9F4]/95 via-[#F5FAFB]/92 to-white px-5 py-5 sm:px-8 sm:py-6">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#E8894A]/95 sm:text-sm">Karriere</p>
            <h2
              id={titleId}
              className="mt-1.5 text-balance text-xl font-bold leading-tight text-[#0F4F68] sm:text-2xl"
            >
              {jobTitle}
            </h2>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-xl border border-[#0F4F68]/10 bg-white/90 px-4 py-2.5 text-sm font-semibold text-[#0F4F68] shadow-sm transition hover:bg-[#F2F9FA] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2 sm:px-5"
            onClick={() => dialogRef.current?.close()}
          >
            Schließen
          </button>
        </div>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain break-words px-5 py-6 sm:px-8 sm:py-8 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))]">
          <p className="text-pretty text-sm font-medium leading-relaxed text-neutral-800 sm:text-base">
            {EINLEITUNG}
          </p>

          <div className="mt-6 rounded-2xl bg-[#F2F9FA]/38 px-5 py-4 sm:mt-8 sm:px-6 sm:py-5">
            <SectionTitle className="!mt-0 sm:!mt-0">Was wir Ihnen bieten</SectionTitle>
            <BulletList items={WIR_BIETEN} />
          </div>

          <SectionTitle>Zu Ihren Aufgaben gehören</SectionTitle>
          <SubTitle>Betreuungsmaßnahmen</SubTitle>
          <BulletList items={BETREUUNG} />
          <SubTitle>Haushaltshilfe</SubTitle>
          <BulletList items={HAUSHALT} />

          <SectionTitle>Ihr Profil</SectionTitle>
          <ul className="mt-2 space-y-3 text-sm leading-relaxed text-neutral-700 sm:text-base">
            <li className="flex gap-2.5">
              <OrangeCheck className="mt-1" />
              <span className="text-pretty">Ein unkomplizierter Quereinstieg ist jederzeit möglich.</span>
            </li>
            <li className="flex gap-2.5">
              <OrangeCheck className="mt-1" />
              <span className="text-pretty">
                Eine zuverlässige, verantwortungsbewusste und selbstständige Arbeitsweise.
              </span>
            </li>
          </ul>
          <p className="mt-4 text-pretty text-sm leading-relaxed text-neutral-700 sm:text-base">
            Vorkenntnisse sind nicht erforderlich. Sie sollten jedoch bereit sein, an einer Weiterbildung zum/r
            Alltagshelfer/in gemäß § 45b SGB XI teilzunehmen. Diese Weiterbildung umfasst insgesamt 22 Stunden
            und wird von uns voll finanziert. Der Unterricht kann bequem von zu Hause aus besucht werden. Sie
            benötigen lediglich ein Smartphone, einen Laptop oder einen Computer mit Internetanschluss. Wir
            unterstützen Sie bei allen Schritten, um Ihnen eine stressfreie Weiterbildung zu ermöglichen.
          </p>
          <p className="mt-4 text-pretty text-sm leading-relaxed text-neutral-700 sm:text-base">
            Ein Führerschein der Klasse B (PKW) ist bei uns zwingend erforderlich, da wir unsere Klienten zuhause
            besuchen und betreuen. Zusätzlich ist ein Privat-PKW notwendig. Sie erhalten eine volle
            Fahrtkostenerstattung.
          </p>
          <p className="mt-4 text-pretty text-sm font-medium leading-relaxed text-[#0F4F68] sm:text-base">
            Ab sofort suchen wir Mitarbeiter (m/w/d) aus folgenden Bereichen: Alltagshelfer (m/w/d),
            Betreuungskraft (m/w/d), Seniorenbegleiter (m/w/d), Haushaltshilfe mit Betreuungstätigkeit (m/w/d),
            Persönlicher Alltagsassistent (m/w/d), Mitarbeiter für soziale Betreuung und Alltagsunterstützung
            (m/w/d).
          </p>

          <div className="mt-8 border-t border-[#0F4F68]/10 pt-6 sm:mt-10 sm:pt-8">
            {karriereApply ? (
              <button
                type="button"
                className="inline-flex w-full min-h-[48px] items-center justify-center rounded-xl bg-[#0F4F68] px-5 py-3 text-center text-base font-semibold text-white shadow-md transition hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                onClick={() => {
                  dialogRef.current?.close();
                  window.requestAnimationFrame(() => karriereApply.openBewerbungsWizard(jobTitle));
                }}
              >
                Jetzt bewerben
              </button>
            ) : (
              <Link
                href={bewerbenHref}
                className="inline-flex w-full min-h-[48px] items-center justify-center rounded-xl bg-[#0F4F68] px-5 py-3 text-center text-base font-semibold text-white shadow-md transition hover:bg-[#0c3d52] focus:outline-none focus:ring-2 focus:ring-[#0F4F68] focus:ring-offset-2"
                onClick={() => dialogRef.current?.close()}
              >
                Jetzt bewerben
              </Link>
            )}
          </div>
        </div>
        </div>
      </dialog>
    </>
  );
}
