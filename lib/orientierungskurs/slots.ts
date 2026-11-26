import {
  berlinTodayYmd, calendarCellsForMonth, minutesToHhmm, ymdToYearMonth,
} from "@/lib/betrieblich-info-termin/slots";

export const FIRST_COURSE_DATE = "2026-04-01";
const DURATION_HOURS = 2;
const BUFFER_HOURS = 1;
export const COURSE_TIMES = Array.from({ length: 8 }, (_, index) => minutesToHhmm((8 + index) * 60));
const berlinClock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});

export type CourseFormat = "onsite" | "online";
export type CourseSlot = { slot_date: string; slot_time: string; format: CourseFormat };

export const COURSE_FORMAT_LABEL = { onsite: "Vor Ort", online: "Online" } as const;

export function earliestCourseDate(now = new Date()): string {
  const today = berlinTodayYmd(now);
  return today < FIRST_COURSE_DATE ? FIRST_COURSE_DATE : today;
}

export function startsInFuture(date: string, time: string, now = new Date()): boolean {
  const today = berlinTodayYmd(now);
  return date > today || (date === today && time.slice(0, 5) > berlinClock.format(now));
}

export function validCourseDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < FIRST_COURSE_DATE) return false;
  const parsed = new Date(date + "T00:00:00Z");
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

export function courseMonthDates(month: string): (string | null)[] {
  const { year, month: number } = ymdToYearMonth(month);
  return calendarCellsForMonth(year, number);
}

export function validCourseMonth(month: string): boolean {
  return /^\d{4}-\d{2}$/.test(month) && validCourseDate(month + "-01");
}

export function courseTimeLabel(slotTime: string): string {
  const start = slotTime.slice(0, 5);
  const end = minutesToHhmm((Number(start.slice(0, 2)) + DURATION_HOURS) * 60);
  return start + "–" + end + " Uhr";
}

export function availableCourseTimes(date: string, bookings: string[], now = new Date()): string[] {
  if (!validCourseDate(date)) return [];
  return COURSE_TIMES.filter((start) =>
    startsInFuture(date, start, now) && bookings.every((booked) =>
      Math.abs(Number(start.slice(0, 2)) - Number(booked.slice(0, 2))) >= DURATION_HOURS + BUFFER_HOURS,
    ),
  );
}
