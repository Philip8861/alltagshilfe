/** Europa/Berlin – Buchung nur Werktage, frühestens Folgetag, 09:00–16:30. */

export const BETRIEBLICH_INFO_CONTACT = {
  phone: "08334 / 9893330",
  phoneHref: "tel:+4983349893330",
  email: "info@alltagshilfe-sued.de",
} as const;

export const BETRIEBLICH_INFO_COMPANY_SIZES = [
  { value: "1-10", label: "1–10 Mitarbeitende" },
  { value: "11-50", label: "11–50 Mitarbeitende" },
  { value: "51-250", label: "51–250 Mitarbeitende" },
  { value: "250+", label: "250+ Mitarbeitende" },
] as const;

export const SLOT_START_MINUTES = 9 * 60;
export const SLOT_END_MINUTES = 16 * 60 + 30;
export const SLOT_STEP_MINUTES = 15;
export const BOOKING_HORIZON_DAYS = 56;

const WEEKDAY_SHORT = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"] as const;
const MONTH_LONG = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
] as const;

export function berlinTodayYmd(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function addDaysYmd(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

/** 0 = Sonntag … 6 = Samstag (Kalendertag, ohne Zeitzonenverschiebung). */
export function weekdayUtc(ymd: string): number {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function isWeekendYmd(ymd: string): boolean {
  const wd = weekdayUtc(ymd);
  return wd === 0 || wd === 6;
}

export function nextBusinessDayAfter(ymd: string): string {
  let next = addDaysYmd(ymd, 1);
  while (isWeekendYmd(next)) next = addDaysYmd(next, 1);
  return next;
}

/** Frühester buchbarer Tag: nächster Werktag (Mo→Di, Fr→Mo). */
export function earliestBookableYmd(now = new Date()): string {
  return nextBusinessDayAfter(berlinTodayYmd(now));
}

export function latestBookableYmd(now = new Date()): string {
  return addDaysYmd(berlinTodayYmd(now), BOOKING_HORIZON_DAYS);
}

export function minutesToHhmm(total: number): string {
  const h = Math.floor(total / 60);
  const min = total % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

export function allSlotTimes(): string[] {
  const out: string[] = [];
  for (let m = SLOT_START_MINUTES; m <= SLOT_END_MINUTES; m += SLOT_STEP_MINUTES) {
    out.push(minutesToHhmm(m));
  }
  return out;
}

export const SLOT_TIMES = allSlotTimes();

const SLOT_TIME_SET = new Set(SLOT_TIMES);

export function isAllowedSlotTime(hhmm: string): boolean {
  return SLOT_TIME_SET.has(hhmm);
}

export function isBookableDate(ymd: string, now = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return false;
  if (isWeekendYmd(ymd)) return false;
  const earliest = earliestBookableYmd(now);
  const latest = latestBookableYmd(now);
  return ymd >= earliest && ymd <= latest;
}

export function isBookableSlot(ymd: string, hhmm: string, now = new Date()): boolean {
  return isBookableDate(ymd, now) && isAllowedSlotTime(hhmm);
}

export function monthLabelDe(year: number, month1: number): string {
  return `${MONTH_LONG[month1 - 1] ?? ""} ${year}`;
}

export function weekdayShortDeFromYmd(ymd: string): string {
  const wd = weekdayUtc(ymd);
  return WEEKDAY_SHORT[wd === 0 ? 6 : wd - 1] ?? "";
}

export function formatDateLongDe(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Kalenderzellen: Montag zuerst, inkl. leerer Vorspann-Tage. */
export function calendarCellsForMonth(year: number, month1: number): (string | null)[] {
  const first = `${year}-${String(month1).padStart(2, "0")}-01`;
  const firstWd = weekdayUtc(first);
  const leading = firstWd === 0 ? 6 : firstWd - 1;
  const daysInMonth = new Date(Date.UTC(year, month1, 0)).getUTCDate();
  const cells: (string | null)[] = [];
  for (let i = 0; i < leading; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(`${year}-${String(month1).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function ymdToYearMonth(ymd: string): { year: number; month: number } {
  return { year: Number(ymd.slice(0, 4)), month: Number(ymd.slice(5, 7)) };
}

export function addMonths(year: number, month1: number, delta: number): { year: number; month: number } {
  const idx = year * 12 + (month1 - 1) + delta;
  return { year: Math.floor(idx / 12), month: (idx % 12) + 1 };
}

export const WEEKDAY_HEADERS_DE = WEEKDAY_SHORT;

export function companySizeLabel(value: string): string {
  return BETRIEBLICH_INFO_COMPANY_SIZES.find((s) => s.value === value)?.label ?? value;
}
