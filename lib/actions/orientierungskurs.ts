"use server";

import { createHash } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isTransactionalSmtpConfigured } from "@/lib/email/internal-smtp";
import { getSystemAdminSession } from "@/lib/partner/system-admin-session";
import { rateLimitWithConfig } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/security";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import {
  courseBookingSchema, courseEmail, courseParticipantSchema, type CourseBookingInput, type CourseParticipantInput,
} from "@/lib/validations/orientierungskurs";
import { getCourseOperator } from "@/lib/orientierungskurs/access";
import { courseSiteOrigin, newOnlineMeetingUrl, participationUrl } from "@/lib/orientierungskurs/config";
import {
  sendBookingConfirmation, sendEmployerInvitation, sendParticipantConfirmation, sendShareableInvitation,
} from "@/lib/orientierungskurs/email";
import {
  COURSE_STAFF, findCourse, loadCourseMonth, saveCourse, saveParticipant, sendCourseMailOnce,
} from "@/lib/orientierungskurs/store";
import {
  availableCourseTimes, courseMonthDates, earliestCourseDate, validCourseMonth,
} from "@/lib/orientierungskurs/slots";

const UNAVAILABLE = "Das hat gerade nicht geklappt. Bitte versuchen Sie es erneut.";
const RATE_MESSAGE = "Zu viele Versuche. Bitte warten Sie einen Moment und versuchen Sie es erneut.";
type ActionError = { ok: false; message: string };
type BookingResult = ActionError & { reloadCalendar?: boolean } |
  { ok: true; url: string; confirmationSent: boolean; invitationSent: boolean };
type ParticipantResult = ActionError | { ok: true; needsMailRetry: boolean };

export async function getCourseAvailability(month: string): Promise<ActionError |
  { ok: true; times: Record<string, string[]>; earliestDate: string }> {
  const now = new Date();
  const earliestDate = earliestCourseDate(now);
  if (typeof month !== "string" || !validCourseMonth(month) || month < earliestDate.slice(0, 7)) {
    return { ok: false, message: "Bitte wählen Sie einen aktuellen oder zukünftigen Monat." };
  }
  if (!rateLimitWithConfig("course-calendar:" + await getClientIp(), 90, 60_000).success) {
    return { ok: false, message: RATE_MESSAGE };
  }
  const client = createSupabaseServiceRoleClient();
  const bookings = client && await loadCourseMonth(client, month);
  if (!bookings) return { ok: false, message: "Der Kurskalender ist gerade nicht verfügbar." };
  const times: Record<string, string[]> = {};
  for (const date of courseMonthDates(month)) {
    if (date) {
      times[date] = availableCourseTimes(date, bookings.filter((row) => row.slot_date === date)
        .map((row) => row.slot_time), now);
    }
  }
  return { ok: true, times, earliestDate };
}

export async function bookOrientationCourse(input: CourseBookingInput): Promise<BookingResult> {
  const parsed = courseBookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const ip = await getClientIp();
  if (!rateLimitWithConfig("course-booking:" + ip, 15, 15 * 60_000).success ||
    !rateLimitWithConfig("course-booking-email:" + parsed.data.email, 10, 15 * 60_000).success) {
    return { ok: false, message: RATE_MESSAGE };
  }
  const client = createSupabaseServiceRoleClient();
  const origin = courseSiteOrigin();
  if (!client || !origin || !isTransactionalSmtpConfigured()) {
    return { ok: false, message: "Die Online-Buchung ist momentan nicht verfügbar. Bitte versuchen Sie es später erneut." };
  }

  const result = await saveCourse(client, parsed.data, parsed.data.format === "online" ? newOnlineMeetingUrl() : null);
  if ("error" in result) {
    if (result.error === "online") return { ok: false, message: "Online-Kurse sind momentan nicht buchbar." };
    if (result.error === "closed") return { ok: false, message: "Dieser Termin ist nicht buchbar. Bitte wählen Sie einen freien Werktag.", reloadCalendar: true };
    if (result.error === "storage") return { ok: false, message: UNAVAILABLE };
    return { ok: false, message: "Dieser Termin ist inzwischen belegt oder vergangen. Bitte wählen Sie einen anderen.", reloadCalendar: true };
  }
  const course = result.booking;
  const url = participationUrl(origin, course.registration_code);
  const confirmationSent = await sendCourseMailOnce(client, "booking:" + course.id, () => sendBookingConfirmation(course));
  const invitationSent = confirmationSent &&
    await sendCourseMailOnce(client, "share:" + course.id, () => sendShareableInvitation(course, url));
  return { ok: true, url, confirmationSent, invitationSent };
}

export async function registerCourseParticipant(input: CourseParticipantInput): Promise<ParticipantResult> {
  const parsed = courseParticipantSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const { code, email, firstName, id } = parsed.data;
  const ip = await getClientIp();
  if (!rateLimitWithConfig("course-participant:" + ip, 120, 15 * 60_000).success ||
    !rateLimitWithConfig("course-participant-email:" + code + ":" + email, 6, 15 * 60_000).success) {
    return { ok: false, message: RATE_MESSAGE };
  }
  const client = createSupabaseServiceRoleClient();
  if (!client || !isTransactionalSmtpConfigured()) return { ok: false, message: UNAVAILABLE };
  const course = await findCourse(client, code);
  if (course === undefined) return { ok: false, message: UNAVAILABLE };
  if (!course) return { ok: false, message: "Dieser Kurs wurde nicht gefunden." };
  const result = await saveParticipant(client, course, parsed.data);
  if (result === "past") return { ok: false, message: "Die Anmeldung zu diesem Kurs ist geschlossen." };
  if (result === "storage") return { ok: false, message: UNAVAILABLE };
  if (result === "already") return { ok: true, needsMailRetry: false };
  const latest = await findCourse(client, code);
  if (latest === undefined) return { ok: true, needsMailRetry: true };
  if (!latest || latest.cancelled_at) return { ok: false, message: "Die Anmeldung zu diesem Kurs ist geschlossen." };
  const mailSent = await sendCourseMailOnce(client, "participant:" + id,
    () => sendParticipantConfirmation(latest, email, firstName));
  return { ok: true, needsMailRetry: !mailSent };
}

export async function inviteCourseEmployer(input: {
  email: string; id: string; recipient?: { salutation: "frau" | "herr"; lastName: string };
}): Promise<{ ok: boolean; message: string }> {
  const sender = await getCourseOperator();
  if (!sender) return { ok: false, message: "Sie haben keine Berechtigung, Kurseinladungen zu versenden." };
  const parsed = z.object({
    email: courseEmail,
    id: z.string().uuid(),
    recipient: z.object({
      salutation: z.enum(["frau", "herr"]),
      lastName: z.string().trim().min(1, "Bitte geben Sie den Nachnamen für die Anrede an.").max(80),
    }).optional(),
  }).safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const { email, id, recipient } = parsed.data;
  if (!rateLimitWithConfig("course-invite:" + sender, 40, 15 * 60_000).success ||
    !rateLimitWithConfig("course-invite-recipient:" + email, 5, 15 * 60_000).success) {
    return { ok: false, message: RATE_MESSAGE };
  }
  const client = createSupabaseServiceRoleClient();
  const origin = courseSiteOrigin();
  if (!client || !origin || !isTransactionalSmtpConfigured()) {
    return { ok: false, message: "Der Einladungsversand ist noch nicht eingerichtet." };
  }
  const key = createHash("sha256").update(JSON.stringify([sender, id, email, recipient])).digest("hex");
  const sent = await sendCourseMailOnce(client, "invite:" + key,
    () => sendEmployerInvitation(client, email, origin, recipient));
  return sent ? { ok: true, message: "Einladung an " + email + " versendet." } :
    { ok: false, message: "Die Einladung konnte nicht versendet werden. Bitte erneut versuchen." };
}

export async function updateCourseAccess(
  _previous: { ok: boolean; message: string },
  formData: FormData,
): Promise<{ ok: boolean; message: string }> {
  if (!(await getSystemAdminSession())) return { ok: false, message: "Nicht autorisiert." };
  const parsed = z.object({ id: z.string().uuid(), change: z.enum(["grant", "revoke"]) }).safeParse({
    id: formData.get("profileId"), change: formData.get("change"),
  });
  const client = createSupabaseServiceRoleClient();
  if (!parsed.success || !client) return { ok: false, message: "Bitte wählen Sie ein verfügbares Konto." };
  const { id, change } = parsed.data;
  const result = change === "grant"
    ? await client.from(COURSE_STAFF).upsert({ profile_id: id }, { onConflict: "profile_id", ignoreDuplicates: true })
    : await client.from(COURSE_STAFF).delete().eq("profile_id", id);
  if (result.error) return { ok: false, message: "Zugriff konnte nicht geändert werden." };
  revalidatePath("/partner/admin");
  revalidatePath("/partner/admin/pflegekurse");
  return { ok: true, message: change === "grant" ? "Pflegekurse freigeschaltet." : "Freigabe entfernt." };
}

export async function getCourseAccessForAdmin(profileId: string): Promise<boolean | null> {
  if (!(await getSystemAdminSession()) || !z.string().uuid().safeParse(profileId).success) return null;
  const client = createSupabaseServiceRoleClient();
  if (!client) return null;
  const { data, error } = await client.from(COURSE_STAFF)
    .select("profile_id").eq("profile_id", profileId).maybeSingle();
  return error ? null : Boolean(data);
}
