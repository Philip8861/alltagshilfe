import { z } from "zod";
import { getCourseOperator } from "@/lib/orientierungskurs/access";
import { COURSE_FORMAT_LABEL, courseTimeLabel } from "@/lib/orientierungskurs/slots";
import { findDashboardBooking } from "@/lib/orientierungskurs/store";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

const privateHeaders = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };

function csvCell(value: string): string {
  // Der Inhalt soll auch in Excel immer als Text behandelt werden.
  const text = /^[\s\uFEFF]*[=+\-@]/.test(value) ? "'" + value : value;
  return '"' + text.replaceAll('"', '""') + '"';
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success || !(await getCourseOperator())) {
    return new Response("Nicht gefunden.", { status: 404, headers: privateHeaders });
  }
  const client = createSupabaseServiceRoleClient();
  const course = client ? await findDashboardBooking(client, id) : undefined;
  if (course === undefined) return new Response("Kursdaten konnten nicht geladen werden.", { status: 503, headers: privateHeaders });
  if (!course) return new Response("Kurs nicht gefunden.", { status: 404, headers: privateHeaders });

  const courseData = [course.company, course.slot_date, courseTimeLabel(course.slot_time),
    COURSE_FORMAT_LABEL[course.format], course.cancelled_at ? "Abgesagt" : "Gebucht",
    course.address ?? "", course.room ?? "", course.parking ?? ""];
  const rows = [
    ["Firma", "Datum", "Uhrzeit", "Kursformat", "Status", "Adresse", "Raum", "Parkhinweis",
      "Art", "Name", "E-Mail", "Telefon", "Firmenadresse"],
    [...courseData, "Ansprechperson", course.contact_name, course.contact_email, course.contact_phone, course.company_address ?? ""],
    ...course.orientierungskurs_participants.map((person) => [
      ...courseData, person.waitlisted ? "Warteliste" : "Teilnahme", person.first_name + " " + person.last_name, person.email, "", course.company_address ?? "",
    ]),
  ];
  const csv = "\uFEFF" + rows.map((row) => row.map(csvCell).join(";")).join("\r\n");
  return new Response(csv, { headers: {
    ...privateHeaders,
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": 'attachment; filename="pflegekurs-' + course.slot_date + '.csv"',
  } });
}
