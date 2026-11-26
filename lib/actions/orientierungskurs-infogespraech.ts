"use server";

import { revalidatePath } from "next/cache";
import { formatDateLongDe } from "@/lib/betrieblich-info-termin/slots";
import { isTransactionalSmtpConfigured } from "@/lib/email/internal-smtp";
import { INFO_APPOINTMENT_ADVISORS } from "@/lib/orientierungskurs/config";
import { sendCourseMail } from "@/lib/orientierungskurs/email";
import { INFO_APPOINTMENT_TIMES, infoAppointmentTimeLabel, isInfoAppointmentBookable } from "@/lib/orientierungskurs/info-slots";
import { loadInfoSlots, saveInfoAppointment } from "@/lib/orientierungskurs/info-store";
import { courseMonthDates, earliestCourseDate, validCourseMonth } from "@/lib/orientierungskurs/slots";
import { sendCourseMailOnce } from "@/lib/orientierungskurs/store";
import { rateLimitWithConfig } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/security";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import { courseInfoAppointmentSchema, type CourseInfoAppointmentInput } from "@/lib/validations/orientierungskurs";

type ErrorResult = { ok: false; message: string; refresh?: boolean };
const unavailable = "Das Infogespräch kann gerade nicht gebucht werden. Bitte versuchen Sie es später erneut.";

export async function getCourseInfoAvailability(month: string): Promise<
  ErrorResult | { ok: true; times: Record<string, string[]> }
> {
  const now = new Date();
  if (typeof month !== "string" || !validCourseMonth(month) || month < earliestCourseDate(now).slice(0, 7)) {
    return { ok: false, message: "Bitte wählen Sie einen aktuellen oder zukünftigen Monat." };
  }
  if (!rateLimitWithConfig("course-info-calendar:" + await getClientIp(), 90, 60_000).success) {
    return { ok: false, message: "Bitte warten Sie kurz, bevor Sie den Kalender erneut laden." };
  }
  const client = createSupabaseServiceRoleClient();
  const booked = client && await loadInfoSlots(client, month);
  if (!booked) return { ok: false, message: "Der Terminkalender ist gerade nicht verfügbar." };
  const unavailableSlots = new Set(booked.map((slot) => slot.slot_date + " " + slot.slot_time.slice(0, 5)));
  const times: Record<string, string[]> = {};
  for (const date of courseMonthDates(month)) {
    if (date) {
      times[date] = INFO_APPOINTMENT_TIMES.filter((time) =>
        isInfoAppointmentBookable(date, time, now) && !unavailableSlots.has(date + " " + time));
    }
  }
  return { ok: true, times };
}

export async function bookCourseInfoAppointment(input: CourseInfoAppointmentInput): Promise<
  ErrorResult | { ok: true; emailComplete: boolean }
> {
  const parsed = courseInfoAppointmentSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const ip = await getClientIp();
  if (!rateLimitWithConfig("course-info-booking:" + ip, 18, 15 * 60_000).success ||
    !rateLimitWithConfig("course-info-email:" + parsed.data.email, 8, 15 * 60_000).success) {
    return { ok: false, message: "Zu viele Versuche. Bitte warten Sie einen Moment und versuchen Sie es erneut." };
  }
  const client = createSupabaseServiceRoleClient();
  if (!client || !isTransactionalSmtpConfigured()) return { ok: false, message: unavailable };
  const saved = await saveInfoAppointment(client, parsed.data);
  if ("error" in saved) {
    if (saved.error === "storage") return { ok: false, message: unavailable };
    return { ok: false, refresh: true, message: "Dieser Termin ist inzwischen vergeben oder nicht mehr verfügbar. Bitte wählen Sie einen anderen." };
  }

  const appointment = saved.appointment;
  const key = "info-appointment:" + appointment.id;
  const when = formatDateLongDe(appointment.slot_date) + ", " + infoAppointmentTimeLabel(appointment.slot_time);
  const rows = [
    { label: "Termin", value: when },
    { label: "Dauer", value: "10 Minuten" },
    { label: "Ansprechpersonen", value: INFO_APPOINTMENT_ADVISORS.map(({ name }) => name).join(" und ") },
    { label: "Rückrufnummer", value: appointment.contact_phone },
  ];
  const confirmations = await Promise.all([
    sendCourseMailOnce(client, key + ":guest", () => sendCourseMail({
      to: appointment.contact_email,
      subject: "Bestätigung für Ihr kostenloses Infogespräch zum Orientierungskurs",
      headline: "Ihr Infogespräch ist gebucht",
      message: "Vielen Dank für Ihr Interesse am Orientierungskurs zur Vereinbarkeit von Beruf und Pflege. Wir rufen Sie zum vereinbarten Zeitpunkt unter der angegebenen Telefonnummer an.",
      rows,
    })),
    ...INFO_APPOINTMENT_ADVISORS.map((advisor) => sendCourseMailOnce(client, key + ":" + advisor.email, () => sendCourseMail({
      to: advisor.email,
      subject: "Neues Infogespräch zum Orientierungskurs",
      headline: "Infogespräch gebucht",
      message: "Ein kostenloser telefonischer Infotermin zur Vereinbarkeit von Beruf und Pflege wurde gebucht.",
      rows: [
        ...rows,
        { label: "Kontakt", value: appointment.contact_name },
        { label: "E-Mail", value: appointment.contact_email },
        ...(appointment.company ? [{ label: "Firma", value: appointment.company }] : []),
      ],
    }))),
  ]);
  revalidatePath("/partner/pflegekurse");
  revalidatePath("/partner/admin/pflegekurse");
  return { ok: true, emailComplete: confirmations.every(Boolean) };
}
