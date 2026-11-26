import type { Metadata } from "next";
import { InfoAppointmentForm } from "@/components/orientierungskurs/InfoAppointmentForm";
import { CoursePage } from "@/components/orientierungskurs/ui";
import { INFO_APPOINTMENT_ADVISORS } from "@/lib/orientierungskurs/config";
import { earliestCourseDate } from "@/lib/orientierungskurs/slots";

export const metadata: Metadata = { title: "Kostenloses Infogespräch zum Orientierungskurs buchen" };
export const dynamic = "force-dynamic";

export default function CourseInfoAppointmentPage() {
  return (
    <CoursePage title="Kostenloses Infogespräch buchen"
      description="In einem zehnminütigen Rückruf beantworten wir Ihre Fragen zum Orientierungskurs zur Vereinbarkeit von Beruf und Pflege.">
      <p className="mb-4 text-sm text-slate-700">
        <strong>Ansprechpersonen</strong> · {INFO_APPOINTMENT_ADVISORS.map(({ name }) => name).join(" und ")}
      </p>
      <InfoAppointmentForm earliestDate={earliestCourseDate()} />
    </CoursePage>
  );
}
