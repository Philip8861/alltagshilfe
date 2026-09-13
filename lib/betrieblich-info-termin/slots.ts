/** Europa/Berlin – Buchung nur Werktage, frühestens Folgetag, 09:00–16:30. */

export const BETRIEBLICH_INFO_CONTACT = {
  phone: "08334 / 9893330",
  phoneHref: "tel:+4983349893330",
  email: "info@alltagshilfe-sued.de",
} as const;

function buildCompanySizes(): { value: string; label: string }[] {
  const out: { value: string; label: string }[] = [];
  for (let end = 100; end <= 500; end += 100) {
    const start = end === 100 ? 1 : end - 99;
    out.push({
      value: `${start}-${end}`,
      label: `${start}–${end} Mitarbeitende`,
    });
  }
  out.push({ value: "500+", label: "500+ Mitarbeitende" });
  return out;
}

/** 100er-Schritte bis 500, Plus erst bei 500+. */
export const BETRIEBLICH_INFO_COMPANY_SIZES = buildCompanySizes();

export const SLOT_START_MINUTES = 9 * 60;
export const SLOT_END_MINUTES = 16 * 60 + 30;
export const SLOT_STEP_MINUTES = 15;
/** Pause nach jedem 15-Min-Termin – der folgende Slot wird nicht angeboten. */
export const SLOT_BUFFER_MINUTES = 15;
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

/**
 * Freitag → Montag.
 * Samstag/Sonntag → Dienstag (Montag am Wochenende nicht buchbar).
 * Mo–Do → nächster Werktag.
 */
export function earliestBookableYmd(now = new Date()): string {
  const today = berlinTodayYmd(now);
  const wd = weekdayUtc(today);
  if (wd === 6) return addDaysYmd(today, 3);
  if (wd === 0) return addDaysYmd(today, 2);
  return nextBusinessDayAfter(today);
}

/** Kommender Montag, der am Wochenende nur optisch „voll“ wirkt. */
export function weekendBlockedMondayYmd(now = new Date()): string | null {
  const today = berlinTodayYmd(now);
  const wd = weekdayUtc(today);
  if (wd === 6) return addDaysYmd(today, 2);
  if (wd === 0) return addDaysYmd(today, 1);
  return null;
}

export function isVisuallyFullyBookedDate(ymd: string, now = new Date()): boolean {
  const blocked = weekendBlockedMondayYmd(now);
  return blocked !== null && ymd === blocked;
}

export function isSelectableCalendarDate(ymd: string, now = new Date()): boolean {
  return isBookableDate(ymd, now) || isVisuallyFullyBookedDate(ymd, now);
}

export function latestBookableYmd(now = new Date()): string {
  return addDaysYmd(berlinTodayYmd(now), BOOKING_HORIZON_DAYS);
}

export function minutesToHhmm(total: number): string {
  const h = Math.floor(total / 60);
  const min = total % 60;
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

export function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Verschiebt eine Slot-Uhrzeit um delta Minuten; null wenn außerhalb des Rasterfensters. */
export function slotTimeOffset(hhmm: string, deltaMinutes: number): string | null {
  const next = hhmmToMinutes(hhmm) + deltaMinutes;
  if (next < SLOT_START_MINUTES || next > SLOT_END_MINUTES) return null;
  if ((next - SLOT_START_MINUTES) % SLOT_STEP_MINUTES !== 0) return null;
  return minutesToHhmm(next);
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

/** Gebuchte Slots plus 15-Min-Pause danach – diese Zeiten werden nicht angeboten. */
export function blockedTimesForBookings(booked: string[]): Set<string> {
  const blocked = new Set<string>();
  for (const time of booked) {
    if (!isAllowedSlotTime(time)) continue;
    blocked.add(time);
    const after = slotTimeOffset(time, SLOT_BUFFER_MINUTES);
    if (after) blocked.add(after);
  }
  return blocked;
}

export function isSlotSelectable(hhmm: string, booked: string[]): boolean {
  if (!isAllowedSlotTime(hhmm)) return false;
  return !blockedTimesForBookings(booked).has(hhmm);
}

/** Zeiten, die im Kalender angezeigt werden dürfen (ohne belegte und Puffer-Slots). */
export function selectableSlotTimes(booked: string[]): string[] {
  const blocked = blockedTimesForBookings(booked);
  return SLOT_TIMES.filter((time) => !blocked.has(time));
}

export function isSlotAvailableForBooking(
  ymd: string,
  hhmm: string,
  bookedForDay: string[],
  now = new Date(),
): boolean {
  return isBookableSlot(ymd, hhmm, now) && isSlotSelectable(hhmm, bookedForDay);
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
