import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ParticipantForm } from "@/components/orientierungskurs/ParticipantForm";
import { CoursePage, courseCard } from "@/components/orientierungskurs/ui";
import { formatDateLongDe } from "@/lib/betrieblich-info-termin/slots";
import { COURSE_FORMAT_LABEL, courseTimeLabel, startsInFuture } from "@/lib/orientierungskurs/slots";
import { findCourse } from "@/lib/orientierungskurs/store";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Zum Orientierungskurs anmelden" };

export default async function TeilnahmePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!z.string().uuid().safeParse(code).success) notFound();
  const client = createSupabaseServiceRoleClient();
  const course = client ? await findCourse(client, code) : undefined;
  if (course === null) notFound();

  return (
    <CoursePage title="Zum Orientierungskurs anmelden"
      description="Melden Sie sich für den Termin Ihres Unternehmens an. Die Details zur Teilnahme erhalten Sie per E-Mail.">
      <div className={courseCard}>
        {course ? (
          <>
            <p className="mb-5 rounded-xl bg-[#edf6f8] p-4 font-bold text-[#123947]">
              {formatDateLongDe(course.slot_date)} · {courseTimeLabel(course.slot_time)} · {COURSE_FORMAT_LABEL[course.format]}
            </p>
            {startsInFuture(course.slot_date, course.slot_time)
              ? <ParticipantForm code={code} />
              : <p>Die Anmeldung zu diesem Kurs ist geschlossen.</p>}
          </>
        ) : <p>Die Kursanmeldung ist gerade nicht verfügbar. Bitte versuchen Sie es später erneut.</p>}
      </div>
    </CoursePage>
  );
}
