import {
  addDaysYmd, berlinTodayYmd, calendarCellsForMonth, isWeekendYmd, minutesToHhmm, ymdToYearMonth,
} from "@/lib/betrieblich-info-termin/slots";

export const FIRST_COURSE_DATE = "2026-04-01";
export const COURSE_PARTICIPANT_LIMIT = 10;
export const COURSE_WAITLIST_MESSAGE = "Die zehn Kursplätze sind vergeben. Sie können sich auf die Warteliste setzen lassen.";
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

// Gemeinsamer Kurskalender für Bayern und Baden-Württemberg, einschließlich regionaler Ruhetage.
const fixedHolidays: Readonly<Record<string, string>> = {
  "01-01": "Neujahr",
  "01-06": "Heilige Drei Könige",
  "05-01": "Tag der Arbeit",
  "08-08": "Augsburger Friedensfest",
  "08-15": "Mariä Himmelfahrt",
  "10-03": "Tag der Deutschen Einheit",
  "11-01": "Allerheiligen",
  "12-25": "Erster Weihnachtstag",
  "12-26": "Zweiter Weihnachtstag",
};

const easterHolidays = [
  [-2, "Karfreitag"], [1, "Ostermontag"], [39, "Christi Himmelfahrt"],
  [50, "Pfingstmontag"], [60, "Fronleichnam"],
] as const;

function easterSunday(year: number): string {
  // Gregorianische Osterrechnung nach Meeus/Jones/Butcher.
  const goldenNumber = year % 19;
  const century = Math.floor(year / 100);
  const yearInCentury = year % 100;
  const leapCenturies = Math.floor(century / 4);
  const lunarCorrection = Math.floor((century - Math.floor((century + 8) / 25) + 1) / 3);
  const epact = (19 * goldenNumber + century - leapCenturies - lunarCorrection + 15) % 30;
  const weekday = (32 + 2 * (century % 4) + 2 * Math.floor(yearInCentury / 4) - epact - yearInCentury % 4) % 7;
  const exception = Math.floor((goldenNumber + 11 * epact + 22 * weekday) / 451);
  const dayOfSpring = epact + weekday - 7 * exception + 114;
  const month = Math.floor(dayOfSpring / 31);
  const day = dayOfSpring % 31 + 1;
  return String(year) + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0");
}

export function courseHoliday(date: string): string | undefined {
  const fixed = fixedHolidays[date.slice(5)];
  if (fixed) return fixed;
  const month = Number(date.slice(5, 7));
  if (month < 3 || month > 6) return undefined;
  const easter = easterSunday(Number(date.slice(0, 4)));
  return easterHolidays.find(([offset]) => addDaysYmd(easter, offset) === date)?.[1];
}

export function isCourseWorkday(date: string): boolean {
  return validCourseDate(date) && !isWeekendYmd(date) && !courseHoliday(date);
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
  if (!isCourseWorkday(date)) return [];
  return COURSE_TIMES.filter((start) =>
    startsInFuture(date, start, now) && bookings.every((booked) =>
      Math.abs(Number(start.slice(0, 2)) - Number(booked.slice(0, 2))) >= DURATION_HOURS + BUFFER_HOURS,
    ),
  );
}
