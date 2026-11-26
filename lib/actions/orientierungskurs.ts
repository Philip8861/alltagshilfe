"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { berlinTodayYmd } from "@/lib/betrieblich-info-termin/slots";
import { isTransactionalSmtpConfigured } from "@/lib/email/internal-smtp";
import { getSystemAdminSession } from "@/lib/partner/system-admin-session";
import { rateLimitWithConfig } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/security";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import {
  courseBookingSchema, courseEmail, courseInvitationSchema, courseParticipantSchema, manualCourseOutreachSchema,
  type CourseBookingInput, type CourseInvitationInput, type CourseParticipantInput, type ManualCourseOutreachInput,
} from "@/lib/validations/orientierungskurs";
import { getCourseOperator } from "@/lib/orientierungskurs/access";
import { COURSE_TEAM, courseSiteOrigin, newOnlineMeetingUrl, participationUrl } from "@/lib/orientierungskurs/config";
import {
  sendBookingConfirmation, sendCourseFullNotice, sendCourseTeamFullNotice, sendCourseWaitlistConfirmation,
  sendEmployerInvitation, sendParticipantConfirmation, sendShareableInvitation,
} from "@/lib/orientierungskurs/email";
import {
  courseReminderStillDue, finishCourseOutreach, finishCourseReminder, lookupOutreachCode,
  recordCourseOutreach, reserveCourseOutreach, reserveCourseReminder,
} from "@/lib/orientierungskurs/outreach";
import {
  COURSE_STAFF, courseParticipantCount, findCourse, loadCourseMonth, saveCourse, saveParticipant, sendCourseMailOnce,
} from "@/lib/orientierungskurs/store";
import {
  availableCourseTimes, COURSE_PARTICIPANT_LIMIT, courseMonthDates, earliestCourseDate, validCourseMonth,
} from "@/lib/orientierungskurs/slots";

const UNAVAILABLE = "Das hat gerade nicht geklappt. Bitte versuchen Sie es erneut.";
const RATE_MESSAGE = "Zu viele Versuche. Bitte warten Sie einen Moment und versuchen Sie es erneut.";
type ActionError = { ok: false; message: string };
type BookingResult = ActionError & { reloadCalendar?: boolean } |
  { ok: true; url: string; confirmationSent: boolean; invitationSent: boolean };
type ParticipantResult = ActionError | { ok: true; status: "confirmed" | "waitlisted" | "existing"; needsMailRetry: boolean };

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

  const outreachCode = parsed.data.outreachCode ? await lookupOutreachCode(client, parsed.data.outreachCode) : null;
  const result = await saveCourse(client, parsed.data, parsed.data.format === "online" ? newOnlineMeetingUrl() : null, outreachCode);
  if ("error" in result) {
    if (result.error === "online") return { ok: false, message: "Online-Kurse sind momentan nicht buchbar." };
    if (result.error === "closed") return { ok: false, message: "Dieser Termin ist nicht buchbar. Bitte wählen Sie einen freien Werktag.", reloadCalendar: true };
    if (result.error === "storage") return { ok: false, message: UNAVAILABLE };
    return { ok: false, message: "Dieser Termin ist inzwischen belegt oder vergangen. Bitte wählen Sie einen anderen.", reloadCalendar: true };
  }
  const course = result.booking;
  refreshCourseOutreach();
  const url = participationUrl(origin, course.registration_code);
  const confirmationSent = await sendCourseMailOnce(client, "booking:" + course.id, () => sendBookingConfirmation(course));
  const invitationSent = confirmationSent &&
    await sendCourseMailOnce(client, "share:" + course.id, () => sendShareableInvitation(client, course, url));
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
  const status = result === "already" ? "existing" : result === "waitlisted" ? "waitlisted" : "confirmed";
  const latest = await findCourse(client, code);
  if (latest === undefined) return { ok: true, status, needsMailRetry: result !== "already" };
  if (!latest || latest.cancelled_at) return { ok: false, message: "Die Anmeldung zu diesem Kurs ist geschlossen." };
  const notifyWhenFull = async () => {
    const count = await courseParticipantCount(client, latest.id);
    if (count === null || count < COURSE_PARTICIPANT_LIMIT) return;
    const origin = courseSiteOrigin();
    const staff = origin ? COURSE_TEAM : [];
    await Promise.all([
      ...(origin ? staff.map(({ email: recipient }) => sendCourseMailOnce(client, "full-team:" + latest.id + ":" + recipient,
        () => sendCourseTeamFullNotice(latest, recipient, origin))) : []),
      ...(!staff.some(({ email }) => email === latest.contact_email)
        ? [sendCourseMailOnce(client, "full:" + latest.id, () => sendCourseFullNotice(latest))] : []),
    ]);
  };
  const [mailSent] = await Promise.all([
    result === "saved" ? sendCourseMailOnce(client, "participant:" + id, () => sendParticipantConfirmation(latest, email, firstName)) :
      result === "waitlisted" ? sendCourseMailOnce(client, "waitlist:" + id, () => sendCourseWaitlistConfirmation(latest, email, firstName)) : true,
    notifyWhenFull(),
  ]);
  return { ok: true, status, needsMailRetry: !mailSent };
}

export async function inviteCourseEmployer(input: CourseInvitationInput): Promise<{ ok: boolean; message: string }> {
  const sender = await getCourseOperator();
  if (!sender) return { ok: false, message: "Sie haben keine Berechtigung, Kurseinladungen zu versenden." };
  const parsed = courseInvitationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const { email, recipient } = parsed.data;
  if (!rateLimitWithConfig("course-invite:" + sender, 40, 15 * 60_000).success ||
    !rateLimitWithConfig("course-invite-recipient:" + email, 5, 15 * 60_000).success) {
    return { ok: false, message: RATE_MESSAGE };
  }
  const client = createSupabaseServiceRoleClient();
  if (!client) {
    return { ok: false, message: "Der Einladungsversand ist noch nicht eingerichtet." };
  }
  const greeting = recipient.kind === "named" ? recipient : undefined;
  const reservation = await reserveCourseOutreach(client, email, sender, greeting);
  if (reservation === "sent") return { ok: false, message: "Für diese E-Mail-Adresse ist bereits ein Versand erfasst." };
  if (reservation === "pending") return { ok: false, message: "Für diese E-Mail-Adresse läuft der Versand oder der Status ist unklar. Bitte prüfen Sie das Versandprotokoll." };
  if (reservation === "storage") return { ok: false, message: "Das Versandprotokoll ist gerade nicht verfügbar." };

  let status: "sent" | "failed" | "unconfirmed" = "failed";
  const origin = courseSiteOrigin();
  try {
    if (origin) status = await sendEmployerInvitation(client, email, origin, reservation.code, greeting);
  } catch {
    console.error("[orientierungskurs] Einladung konnte nicht vorbereitet werden");
  }
  const recorded = await finishCourseOutreach(client, email, status);
  refreshCourseOutreach();
  if (!recorded || status === "unconfirmed") {
    return { ok: false, message: "Der Versandstatus ist unklar. Bitte prüfen Sie das Versandprotokoll, bevor Sie die Adresse erneut kontaktieren." };
  }
  return status === "sent" ? { ok: true, message: "Einladung an " + email + " versendet." } :
    { ok: false, message: "Der Versand ist fehlgeschlagen. Der Fehler wurde protokolliert. Sie können den Versand erneut versuchen." };
}

function refreshCourseOutreach() {
  revalidatePath("/partner/pflegekurse");
  revalidatePath("/partner/admin/pflegekurse");
}

export async function documentCourseEmployerOutreach(input: ManualCourseOutreachInput): Promise<{ ok: boolean; message: string }> {
  const sender = await getCourseOperator();
  if (!sender) return { ok: false, message: "Sie haben keine Berechtigung, Einladungen zu dokumentieren." };
  const parsed = manualCourseOutreachSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  if (!rateLimitWithConfig("course-outreach-record:" + sender, 60, 15 * 60_000).success) {
    return { ok: false, message: RATE_MESSAGE };
  }
  const client = createSupabaseServiceRoleClient();
  if (!client) return { ok: false, message: UNAVAILABLE };
  const { email, note, sentDate } = parsed.data;
  if (sentDate && sentDate > berlinTodayYmd(new Date())) {
    return { ok: false, message: "Das Versanddatum darf nicht in der Zukunft liegen." };
  }
  const result = await recordCourseOutreach(client, email, sender, note, sentDate);
  if (result === "sent") return { ok: false, message: "Für diese E-Mail-Adresse ist bereits ein Versand erfasst." };
  if (result === "pending") return { ok: false, message: "Für diese E-Mail-Adresse läuft gerade der Versand. Bitte warten Sie kurz." };
  if (result === "storage") return { ok: false, message: UNAVAILABLE };
  refreshCourseOutreach();
  return { ok: true, message: "Der frühere Versand wurde dokumentiert." };
}

export async function sendCourseOutreachReminder(input: string): Promise<{ ok: boolean; message: string }> {
  const operator = await getCourseOperator();
  if (!operator) return { ok: false, message: "Sie haben keine Berechtigung, Erinnerungen zu versenden." };
  const parsed = courseEmail.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  if (!rateLimitWithConfig("course-outreach-reminder:" + operator, 40, 15 * 60_000).success) {
    return { ok: false, message: RATE_MESSAGE };
  }
  const email = parsed.data;
  const origin = courseSiteOrigin();
  const client = createSupabaseServiceRoleClient();
  if (!origin || !client) return { ok: false, message: UNAVAILABLE };
  const reserved = await reserveCourseReminder(client, email);
  if (reserved === "not-due") return { ok: false, message: "Für diese Adresse ist keine Erinnerung fällig." };
  if (reserved === "reserved") return { ok: false, message: "Die Erinnerung läuft, wurde bereits versendet oder ihr Versandstatus ist unklar." };
  if (reserved === "storage") return { ok: false, message: UNAVAILABLE };
  const greeting = reserved.salutation && reserved.last_name ? { salutation: reserved.salutation, lastName: reserved.last_name } : undefined;
  let status: "sent" | "failed" | "unconfirmed" | null = "failed";
  try {
    status = await courseReminderStillDue(client, email)
      ? await sendEmployerInvitation(client, email, origin, reserved.code, greeting, true) : null;
  } catch {
    console.error("[orientierungskurs] Erinnerung konnte nicht vorbereitet werden");
  }
  const recorded = await finishCourseReminder(client, email, status);
  refreshCourseOutreach();
  if (!recorded || status === "unconfirmed") return { ok: false, message: "Der Versandstatus der Erinnerung ist unklar." };
  if (status === null) return { ok: false, message: "Es liegt bereits eine passende Buchung vor." };
  return status === "sent" ? { ok: true, message: "Erinnerung an " + email + " versendet." }
    : { ok: false, message: "Die Erinnerung konnte nicht versendet werden. Sie können es erneut versuchen." };
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
