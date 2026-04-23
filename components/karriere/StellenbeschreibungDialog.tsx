"use client";

import { type ReactNode, useId, useRef } from "react";
import { cn } from "@/lib/utils";

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

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-8 border-b border-[#0F4F68]/12 pb-2.5 text-sm font-bold uppercase tracking-wide text-[#0F4F68] first:mt-0 sm:mt-10 sm:text-base">
      {children}
    </h3>
  );
}

function SubTitle({ children }: { children: ReactNode }) {
  return <h4 className="mt-4 text-sm font-semibold text-[#0F4F68] sm:text-base">{children}</h4>;
}

export function StellenbeschreibungDialogTrigger({ className }: { className?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

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
          "fixed inset-0 z-[100] m-0 flex max-h-none min-h-0 w-full max-w-none items-center justify-center border-0 bg-transparent p-3 sm:p-5 md:p-8",
          "open:flex",
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
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#0F4F68]/10 bg-gradient-to-r from-[#FFF7ED] via-[#F2F9FA] to-white px-5 py-5 sm:px-8 sm:py-6">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#F78F2E] sm:text-sm">Karriere</p>
            <h2
              id={titleId}
              className="mt-1.5 text-balance text-xl font-bold leading-tight text-[#0F4F68] sm:text-2xl"
            >
              Stellenbeschreibung
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
          <div className="rounded-2xl bg-[#F2F9FA]/60 px-5 py-4 sm:px-6 sm:py-5">
            <SectionTitle>Was wir Ihnen bieten</SectionTitle>
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

          <SectionTitle>Über uns</SectionTitle>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-neutral-700 sm:text-base">
            Die Alltagshilfe-Süd unterstützt seit vielen Jahren hilfs- und pflegebedürftige Menschen dabei, so
            lange wie möglich selbstständig und selbstbestimmt zu Hause zu leben.
          </p>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-neutral-700 sm:text-base">
            Durch gute Beratung und eine herzliche Betreuung möchten wir sicherstellen, dass jede hilfsbedürftige
            Person die benötigte Unterstützung im Alltag erhält.
          </p>

          <div className="mt-8 rounded-xl border border-[#0F4F68]/15 bg-gradient-to-br from-[#F2F9FA] to-white px-4 py-3 text-center sm:px-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0F4F68]/80">Arbeitsort</p>
            <p className="mt-1 text-base font-bold text-[#0F4F68]">Vor Ort</p>
          </div>
        </div>
        </div>
      </dialog>
    </>
  );
}
