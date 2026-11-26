"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCourseOperator } from "@/lib/orientierungskurs/access";
import { courseSiteOrigin, newOnlineMeetingUrl } from "@/lib/orientierungskurs/config";
import { notifyCourseTeamOfBooking, sendParticipantConfirmation } from "@/lib/orientierungskurs/email";
import {
  availableCourseTimes, COURSE_PARTICIPANT_LIMIT, COURSE_TIMES, courseMonthDates, earliestCourseDate,
  isCourseWorkday, startsInFuture, validCourseDate, validCourseMonth,
} from "@/lib/orientierungskurs/slots";
import {
  cancelCourse, findDashboardBooking, loadCourseMonth, moveCourse, sendCourseMailOnce, updateCourse, type Booking, type Participant,
} from "@/lib/orientierungskurs/store";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import { courseBookingSchema, type CourseBookingInput } from "@/lib/validations/orientierungskurs";

type CourseChangeResult = { ok: boolean; message: string };
const identity = z.object({ id: z.string().uuid(), revision: z.number().int().nonnegative() });
const newSlot = {
  date: z.string().refine(validCourseDate),
  time: z.string().refine((value) => COURSE_TIMES.includes(value)),
};
const splitInput = z.object({
  sourceId: z.string().uuid(),
  followupId: z.string().uuid(),
  ...newSlot,
  participantIds: z.array(z.string().uuid()).min(1).max(COURSE_PARTICIPANT_LIMIT)
    .refine((ids) => new Set(ids).size === ids.length),
});
const errors = {
  storage: "Der Kurs konnte gerade nicht gespeichert werden. Bitte versuchen Sie es erneut.",
  stale: "Die Kursdaten wurden zwischenzeitlich geändert. Bitte laden Sie die Seite neu.",
  closed: "Bitte wählen Sie einen künftigen Werktag, an dem kein Feiertag ist.",
  taken: "Diese Uhrzeit ist belegt oder lässt weniger als eine Stunde Pause zu einem anderen Kurs.",
  online: "Ein Wechsel zu Online ist möglich, sobald ein Videodienst eingerichtet ist.",
};

function refreshCourseDashboards() {
  revalidatePath("/partner/pflegekurse");
  revalidatePath("/partner/admin/pflegekurse");
}

export async function editOrientationCourse(input: CourseBookingInput, revision: number): Promise<CourseChangeResult> {
  if (!(await getCourseOperator())) return { ok: false, message: "Sie haben keine Berechtigung, Kurse zu ändern." };
  const parsed = courseBookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  if (!identity.safeParse({ id: parsed.data.id, revision }).success) return { ok: false, message: errors.stale };
  const client = createSupabaseServiceRoleClient();
  if (!client) return { ok: false, message: errors.storage };
  const error = await updateCourse(client, parsed.data, revision);
  if (error) return { ok: false, message: errors[error] };
  refreshCourseDashboards();
  return { ok: true, message: "Kurs gespeichert." };
}

export async function archiveOrientationCourse(input: { id: string; revision: number }): Promise<CourseChangeResult> {
  if (!(await getCourseOperator())) return { ok: false, message: "Sie haben keine Berechtigung, Kurse zu löschen." };
  const parsed = identity.safeParse(input);
  if (!parsed.success) return { ok: false, message: errors.stale };
  const client = createSupabaseServiceRoleClient();
  if (!client) return { ok: false, message: errors.storage };
  const error = await cancelCourse(client, parsed.data.id, parsed.data.revision);
  if (error) return { ok: false, message: errors[error] };
  refreshCourseDashboards();
  return { ok: true, message: "Kurs gelöscht und im Archiv gespeichert." };
}

export async function getCourseRescheduleAvailability(id: string, month: string): Promise<
  { ok: true; times: Record<string, string[]> } | { ok: false; message: string }
> {
  const now = new Date();
  if (!(await getCourseOperator())) return { ok: false, message: "Sie haben keine Berechtigung, Kurse zu verschieben." };
  if (!z.string().uuid().safeParse(id).success || typeof month !== "string" ||
    !validCourseMonth(month) || month < earliestCourseDate(now).slice(0, 7)) {
    return { ok: false, message: "Bitte wählen Sie einen aktuellen oder zukünftigen Monat." };
  }
  const client = createSupabaseServiceRoleClient();
  const bookings = client && await loadCourseMonth(client, month, id);
  if (!bookings) return { ok: false, message: "Der Kurskalender ist gerade nicht verfügbar." };
  const times: Record<string, string[]> = {};
  for (const date of courseMonthDates(month)) {
    if (date) times[date] = availableCourseTimes(date,
      bookings.filter((course) => course.slot_date === date).map((course) => course.slot_time), now);
  }
  return { ok: true, times };
}

export async function rescheduleOrientationCourse(input: { id: string; revision: number; date: string; time: string }): Promise<CourseChangeResult> {
  if (!(await getCourseOperator())) return { ok: false, message: "Sie haben keine Berechtigung, Kurse zu verschieben." };
  const parsed = identity.extend(newSlot).safeParse(input);
  if (!parsed.success) return { ok: false, message: "Bitte wählen Sie einen neuen Tag und eine freie Uhrzeit." };
  const { id, revision, date, time } = parsed.data;
  if (!isCourseWorkday(date) || !startsInFuture(date, time)) return { ok: false, message: errors.closed };
  const client = createSupabaseServiceRoleClient();
  if (!client) return { ok: false, message: errors.storage };
  const error = await moveCourse(client, id, revision, date, time);
  if (error) return { ok: false, message: error === "same" ? "Bitte wählen Sie einen anderen Termin." : errors[error] };
  refreshCourseDashboards();
  return { ok: true, message: "Der Termin wurde verschoben." };
}

export async function splitOrientationCourse(input: z.input<typeof splitInput>): Promise<CourseChangeResult> {
  if (!(await getCourseOperator())) return { ok: false, message: "Sie haben keine Berechtigung, Folgetermine anzulegen." };
  const parsed = splitInput.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Wählen Sie einen Termin und 1 bis 10 Personen von der Warteliste." };
  const { sourceId, followupId, date, time, participantIds } = parsed.data;
  if (!isCourseWorkday(date) || !startsInFuture(date, time)) return { ok: false, message: errors.closed };
  const client = createSupabaseServiceRoleClient();
  if (!client) return { ok: false, message: errors.storage };
  const { error } = await client.rpc("orientierungskurs_split", {
    source_id: sourceId, followup_id: followupId, new_day: date, new_time: time,
    new_meeting_url: newOnlineMeetingUrl(), selected_ids: participantIds,
  });
  if (error) {
    if (error.code === "23P01") return { ok: false, message: errors.taken };
    if (error.code === "22023") return { ok: false, message: "Kurs oder Warteliste wurden inzwischen geändert. Laden Sie die Seite neu." };
    if (error.code === "23514") return { ok: false, message: "Bitte prüfen Sie den Termin und die Konfiguration für Online-Kurse." };
    console.error("[orientierungskurs] follow-up", error.code);
    return { ok: false, message: "Der Folgetermin konnte gerade nicht bestätigt werden. Versuchen Sie es erneut." };
  }
  refreshCourseDashboards();
  const course = await findDashboardBooking(client, followupId);
  const moved = course?.orientierungskurs_participants.filter((person) => participantIds.includes(person.id)) ?? [];
  const allSent = course && moved.length === participantIds.length && await deliverFollowupConfirmations(client, course, moved);
  return { ok: true, message: allSent
    ? "Folgetermin angelegt. Die umgebuchten Personen haben eine Teilnahmebestätigung erhalten."
    : "Folgetermin angelegt. Offene Teilnahmebestätigungen können Sie im Folgetermin erneut versenden." };
}

async function deliverFollowupConfirmations(
  client: NonNullable<ReturnType<typeof createSupabaseServiceRoleClient>>, course: Booking, participants: Participant[],
) {
  const origin = courseSiteOrigin();
  const results = await Promise.all([
    ...participants.map((person) => sendCourseMailOnce(client, "participant:" + person.id,
      () => sendParticipantConfirmation(course, person.email, person.first_name))),
    origin ? notifyCourseTeamOfBooking(client, course, origin) : false,
  ]);
  return results.every(Boolean);
}

export async function retryFollowupConfirmations(id: string): Promise<CourseChangeResult> {
  if (!(await getCourseOperator())) return { ok: false, message: "Sie haben keine Berechtigung, Bestätigungen zu versenden." };
  const client = createSupabaseServiceRoleClient();
  if (!client || !z.string().uuid().safeParse(id).success) return { ok: false, message: errors.storage };
  const course = await findDashboardBooking(client, id);
  if (!course?.split_from || course.cancelled_at || !startsInFuture(course.slot_date, course.slot_time)) {
    return { ok: false, message: "Dieser Folgetermin ist nicht verfügbar." };
  }
  const confirmed = course.orientierungskurs_participants.filter((person) => !person.waitlisted);
  const sent = await deliverFollowupConfirmations(client, course, confirmed);
  return sent ? { ok: true, message: "Alle Teilnahmebestätigungen für diesen Folgetermin sind versendet." }
    : { ok: false, message: "Es sind noch Bestätigungen offen. Versuchen Sie es erneut." };
}
