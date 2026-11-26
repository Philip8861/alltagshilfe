import { hhmmToMinutes, minutesToHhmm } from "@/lib/betrieblich-info-termin/slots";
import { isCourseWorkday, startsInFuture } from "./slots";

const firstStart = 8 * 60;
const lastStart = 16 * 60;
const interval = 30;
export const INFO_APPOINTMENT_TIMES = Array.from(
  { length: (lastStart - firstStart) / interval + 1 },
  (_, index) => minutesToHhmm(firstStart + index * interval),
);

export function infoAppointmentTimeLabel(time: string): string {
  return time.slice(0, 5) + "–" + minutesToHhmm(hhmmToMinutes(time) + 10) + " Uhr";
}

export function isInfoAppointmentBookable(date: string, time: string, now = new Date()): boolean {
  return INFO_APPOINTMENT_TIMES.includes(time) && isCourseWorkday(date) && startsInFuture(date, time, now);
}
