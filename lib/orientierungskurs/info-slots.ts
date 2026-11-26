import { hhmmToMinutes, minutesToHhmm } from "@/lib/betrieblich-info-termin/slots";
import { isCourseWorkday, startsInFuture } from "./slots";

export const INFO_APPOINTMENT_TIMES = Array.from({ length: 16 }, (_, index) => minutesToHhmm(8 * 60 + index * 30));

export function infoAppointmentTimeLabel(time: string): string {
  return time.slice(0, 5) + "–" + minutesToHhmm(hhmmToMinutes(time) + 10) + " Uhr";
}

export function isInfoAppointmentBookable(date: string, time: string, now = new Date()): boolean {
  return INFO_APPOINTMENT_TIMES.includes(time) && isCourseWorkday(date) && startsInFuture(date, time, now);
}
