import { getRatgeberBeitragReadMinutes } from "@/config/ratgeber-betraege";
import { DecorativeIcon } from "@/components/ratgeber/pflegegrad-beantragen/pflegegrad-visual-primitives";
import { RatgeberArticleQualityLines } from "@/components/ratgeber/RatgeberArticleQualityLines";

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

export function Pflegegrad1ArticleMetaRow() {
  return (
    <div className="mt-8 flex flex-col gap-4 border-t border-neutral-200 pt-6">
      <div className="flex flex-wrap gap-x-8 gap-y-3">
        <p className="flex items-center gap-2 text-sm text-neutral-600">
          <IconCalendar />
          Aktualisiert: April 2026
        </p>
        <p className="flex items-center gap-2 text-sm text-neutral-600">
          <IconClock />
          Lesezeit: ca. {getRatgeberBeitragReadMinutes("pflegegrad-1")} Minuten
        </p>
      </div>
      <RatgeberArticleQualityLines />
    </div>
  );
}
