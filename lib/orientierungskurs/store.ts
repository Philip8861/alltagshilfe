import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { courseBookingSchema, courseParticipantSchema } from "@/lib/validations/orientierungskurs";
import { newOnlineMeetingUrl } from "./config";
import { isCourseWorkday, startsInFuture, type CourseSlot } from "./slots";

export const COURSE_BOOKINGS = "orientierungskurs_bookings";
export const COURSE_PARTICIPANTS = "orientierungskurs_participants";
export const COURSE_STAFF = "orientierungskurs_staff";
const MAIL_DELIVERIES = "orientierungskurs_mail_deliveries";

export type Booking = CourseSlot & {
  id: string;
  registration_code: string;
  company: string;
  company_address: string | null;
  contact_name: string;
  contact_salutation: "frau" | "herr" | null;
  contact_last_name: string | null;
  contact_email: string;
  contact_phone: string;
  address: string | null;
  room: string | null;
  parking: string | null;
  meeting_url: string | null;
  cancelled_at: string | null;
  split_from: string | null;
  outreach_code: string | null;
  revision: number;
};

export type Participant = { id: string; first_name: string; last_name: string; email: string; waitlisted: boolean };
export type DashboardBooking = Booking & { orientierungskurs_participants: Participant[] };
type BookingInput = z.output<typeof courseBookingSchema>;
type CourseUpdateError = "taken" | "closed" | "online" | "storage" | "stale";

export async function loadCourseMonth(client: SupabaseClient, month: string, exceptCourse?: string): Promise<CourseSlot[] | null> {
  const query = client.from(COURSE_BOOKINGS).select("slot_date,slot_time,format")
    .is("cancelled_at", null).gte("slot_date", month + "-01").lte("slot_date", monthEnd(month));
  const { data, error } = await (exceptCourse ? query.neq("id", exceptCourse) : query);
  return error ? null : data as CourseSlot[];
}

function monthEnd(month: string): string {
  const [year, number] = month.split("-").map(Number);
  return new Date(Date.UTC(year, number, 0)).toISOString().slice(0, 10);
}

export async function loadCourseDashboard(client: SupabaseClient, month: string): Promise<DashboardBooking[] | null> {
  const { data, error } = await client.from(COURSE_BOOKINGS)
    .select("*,orientierungskurs_participants(id,first_name,last_name,email,waitlisted)")
    .gte("slot_date", month + "-01").lte("slot_date", monthEnd(month))
    .order("slot_date").order("slot_time")
    .order("last_name", { referencedTable: COURSE_PARTICIPANTS })
    .order("first_name", { referencedTable: COURSE_PARTICIPANTS });
  return error ? null : data as DashboardBooking[];
}

export async function findCourse(client: SupabaseClient, code: string): Promise<Booking | null | undefined> {
  const { data, error } = await client.from(COURSE_BOOKINGS).select("*").eq("registration_code", code).maybeSingle();
  return error ? undefined : data as Booking | null;
}

export async function courseParticipantCount(client: SupabaseClient, courseId: string): Promise<number | null> {
  const { count, error } = await client.from(COURSE_PARTICIPANTS).select("id", { count: "exact", head: true })
    .eq("course_id", courseId).eq("waitlisted", false);
  if (error) console.error("[orientierungskurs] participant count", error.code);
  return error ? null : count;
}

function bookingFields(input: BookingInput) {
  const greeting = input.contactGreeting;
  return {
    slot_date: input.date,
    slot_time: input.time + ":00",
    format: input.format,
    company: input.company,
    ...(input.companyAddress !== undefined && { company_address: input.companyAddress || null }),
    contact_name: input.contactName,
    ...(greeting && {
      contact_salutation: greeting.salutation === "unknown" ? null : greeting.salutation,
      contact_last_name: greeting.salutation === "unknown" ? null : greeting.lastName,
    }),
    contact_email: input.email,
    contact_phone: input.phone,
    address: input.format === "onsite" ? input.address : null,
    room: input.format === "onsite" ? input.room || null : null,
    parking: input.format === "onsite" ? input.parking || null : null,
  };
}

async function findBookingById(client: SupabaseClient, id: string) {
  return client.from(COURSE_BOOKINGS).select("*").eq("id", id).maybeSingle<Booking>();
}

export async function findDashboardBooking(client: SupabaseClient, id: string): Promise<DashboardBooking | null | undefined> {
  const { data, error } = await client.from(COURSE_BOOKINGS)
    .select("*,orientierungskurs_participants(id,first_name,last_name,email,waitlisted)").eq("id", id)
    .order("last_name", { referencedTable: COURSE_PARTICIPANTS })
    .order("first_name", { referencedTable: COURSE_PARTICIPANTS }).maybeSingle<DashboardBooking>();
  return error ? undefined : data;
}

export async function saveCourse(
  client: SupabaseClient,
  input: BookingInput,
  meetingUrl: string | null,
  outreachCode: string | null,
): Promise<{ booking: Booking } | { error: "taken" | "past" | "closed" | "online" | "storage" }> {
  const fields = bookingFields(input);

  async function existing(): Promise<Booking | null> {
    const { data } = await findBookingById(client, input.id);
    if (!data || !Object.entries(fields).every(([key, value]) => data[key as keyof Booking] === value)) return null;
    return data;
  }

  const saved = await existing();
  if (saved) return saved.cancelled_at ? { error: "closed" } : { booking: saved };
  if (!startsInFuture(input.date, input.time)) return { error: "past" };
  if (!isCourseWorkday(input.date)) return { error: "closed" };
  if (input.format === "online" && !meetingUrl) return { error: "online" };

  const { data, error } = await client.from(COURSE_BOOKINGS)
    .insert({ id: input.id, ...fields, meeting_url: meetingUrl, outreach_code: outreachCode }).select().single<Booking>();
  if (!error) return { booking: data };
  if (error.code === "23505" || error.code === "23P01") {
    const repeated = await existing();
    if (repeated?.cancelled_at) return { error: "closed" };
    return repeated ? { booking: repeated } : { error: "taken" };
  }
  console.error("[orientierungskurs] booking", error.code);
  return { error: "storage" };
}

export async function updateCourse(
  client: SupabaseClient,
  input: BookingInput,
  revision: number,
): Promise<CourseUpdateError | null> {
  const { data: current, error: readError } = await findBookingById(client, input.id);
  if (readError) return "storage";
  if (!current || current.cancelled_at || current.revision !== revision) return "stale";
  const moved = current.slot_date !== input.date || current.slot_time.slice(0, 5) !== input.time;
  if (moved && (!isCourseWorkday(input.date) || !startsInFuture(input.date, input.time))) return "closed";
  const meetingUrl = input.format === "online" ? current.meeting_url ?? newOnlineMeetingUrl() : null;
  if (input.format === "online" && !meetingUrl) return "online";

  const { data, error } = await client.from(COURSE_BOOKINGS)
    .update({ ...bookingFields(input), meeting_url: meetingUrl, revision: revision + 1 })
    .eq("id", input.id).eq("revision", revision).is("cancelled_at", null).select("id").maybeSingle();
  if (error?.code === "23P01") return "taken";
  return error ? "storage" : data ? null : "stale";
}

export async function cancelCourse(
  client: SupabaseClient, id: string, revision: number,
): Promise<"storage" | "stale" | null> {
  const { data, error } = await client.from(COURSE_BOOKINGS)
    .update({ cancelled_at: new Date().toISOString(), revision: revision + 1 })
    .eq("id", id).eq("revision", revision).is("cancelled_at", null).select("id").maybeSingle();
  return error ? "storage" : data ? null : "stale";
}

export async function moveCourse(
  client: SupabaseClient, id: string, revision: number, date: string, time: string,
): Promise<"storage" | "stale" | "taken" | "same" | null> {
  const { data: course, error: readError } = await findBookingById(client, id);
  if (readError) return "storage";
  if (!course || course.cancelled_at || course.revision !== revision) return "stale";
  if (course.slot_date === date && course.slot_time.slice(0, 5) === time) return "same";

  const { data, error } = await client.from(COURSE_BOOKINGS)
    .update({ slot_date: date, slot_time: time + ":00", revision: revision + 1 })
    .eq("id", id).eq("revision", revision).is("cancelled_at", null).select("id").maybeSingle();
  if (error?.code === "23P01") return "taken";
  return error ? "storage" : data ? null : "stale";
}

export async function saveParticipant(
  client: SupabaseClient,
  booking: Booking,
  input: z.output<typeof courseParticipantSchema>,
): Promise<"saved" | "waitlisted" | "already" | "past" | "storage"> {
  if (booking.cancelled_at) return "past";
  const participant = { first_name: input.firstName, last_name: input.lastName, email: input.email };
  const query = await client.from(COURSE_PARTICIPANTS).select("id,email,first_name,last_name,waitlisted")
    .eq("course_id", booking.id).eq("email", input.email)
    .maybeSingle<Participant>();
  if (query.error) return "storage";
  if (query.data) {
    return query.data.id === input.id && query.data.first_name === participant.first_name &&
      query.data.last_name === participant.last_name ? (query.data.waitlisted ? "waitlisted" : "saved") : "already";
  }
  if (!startsInFuture(booking.slot_date, booking.slot_time)) return "past";
  const { data, error } = await client.from(COURSE_PARTICIPANTS)
    .insert({ id: input.id, course_id: booking.id, ...participant }).select("waitlisted").single<Pick<Participant, "waitlisted">>();
  if (!error) return data.waitlisted ? "waitlisted" : "saved";
  if (error.code === "23514" && error.message === "Course registration is closed") return "past";
  if (error.code === "23505") {
    const { data } = await client.from(COURSE_PARTICIPANTS).select("waitlisted")
      .eq("id", input.id).eq("course_id", booking.id).eq("email", input.email)
      .eq("first_name", participant.first_name).eq("last_name", participant.last_name).maybeSingle();
    return data ? (data.waitlisted ? "waitlisted" : "saved") : "already";
  }
  console.error("[orientierungskurs] participant", error.code);
  return "storage";
}

export async function sendCourseMailOnce(
  client: SupabaseClient,
  key: string,
  send: () => Promise<boolean>,
): Promise<boolean> {
  const { error: setupError } = await client.from(MAIL_DELIVERIES)
    .upsert({ delivery_key: key }, { onConflict: "delivery_key", ignoreDuplicates: true });
  if (setupError) return false;

  const now = new Date();
  const lease = crypto.randomUUID();
  const { data, error } = await client.from(MAIL_DELIVERIES)
    .update({ lease_id: lease, lease_until: new Date(now.getTime() + 180_000).toISOString() })
    .eq("delivery_key", key).is("sent_at", null).or("lease_until.is.null,lease_until.lt." + now.toISOString())
    .select("delivery_key").maybeSingle();
  if (error) return false;
  if (!data) {
    const { data: delivery } = await client.from(MAIL_DELIVERIES)
      .select("sent_at").eq("delivery_key", key).maybeSingle();
    return Boolean(delivery?.sent_at);
  }

  let sent = false;
  try {
    sent = await send();
  } catch {
    console.error("[orientierungskurs] E-Mail-Vorbereitung fehlgeschlagen");
  }
  const { error: saveError } = await client.from(MAIL_DELIVERIES)
    .update({ lease_id: null, lease_until: null, sent_at: sent ? new Date().toISOString() : null })
    .eq("delivery_key", key).eq("lease_id", lease);
  if (saveError) console.error("[orientierungskurs] E-Mail-Status", saveError.code);
  return sent;
}
