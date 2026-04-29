import Link from "next/link";

import { DecorativeIcon } from "@/components/ratgeber/pflegegrad-beantragen/pflegegrad-visual-primitives";

function IconClock() {
  return (
    <DecorativeIcon className="h-4 w-4 shrink-0 text-neutral-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2.5 1.5M12 3a9 9 0 100 18 9 9 0 000-18z" />
    </DecorativeIcon>
  );
}

function IconCalendar() {
  return (
    <DecorativeIcon className="h-4 w-4 shrink-0 text-neutral-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5m8 2V5M5 11h14M5 19h14a2 2 0 002-2v-6H3v6a2 2 0 002 2z" />
    </DecorativeIcon>
  );
}

function IconShield() {
  return (
    <DecorativeIcon className="h-4 w-4 shrink-0 text-neutral-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v5c0 5-3.5 9-7 10-3.5-1-7-5-7-10V7l7-4z" />
    </DecorativeIcon>
  );
}

/** Metazeile unter dem Hero (kleine Icons, kein farbiger Kasten) */
export function PflegegradArticleMetaRow() {
  return (
    <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-neutral-200 pt-6">
      <p className="flex items-center gap-2 text-sm text-neutral-600">
        <IconCalendar />
        Aktualisiert: April 2026
      </p>
      <p className="flex items-center gap-2 text-sm text-neutral-600">
        <IconClock />
        Lesezeit: ca. 8 Minuten
      </p>
      <p className="flex min-w-0 items-center gap-2 text-sm text-neutral-600">
        <IconShield />
        <span>
          Fachlich geprüft von{" "}
          <Link href="/pflegeberatung/private-pflegeberatung" className="font-medium text-[#0F4F68] underline-offset-2 hover:underline">
            Alltagshilfe-Süd Pflegeberatung
          </Link>
        </span>
      </p>
    </div>
  );
}
