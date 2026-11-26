import type { Metadata } from "next";
import { BookingWizard } from "@/components/orientierungskurs/BookingWizard";
import { CoursePage } from "@/components/orientierungskurs/ui";
import { newOnlineMeetingUrl } from "@/lib/orientierungskurs/config";
import { earliestCourseDate } from "@/lib/orientierungskurs/slots";

export const metadata: Metadata = {
  title: "Orientierungskurs buchen",
  description: "Buchen Sie einen zweistündigen Orientierungskurs von Alltagshilfe-Süd für Ihre Belegschaft.",
};

export const dynamic = "force-dynamic";

export default function OrientierungskursPage() {
  return (
    <CoursePage title="Orientierungskurs buchen"
      description="Wählen Sie einen Termin für Ihre Belegschaft. Nach der Buchung erhalten Sie einen Anmeldelink, einen QR-Code und einen Aushang zum Weitergeben.">
      <BookingWizard earliestDate={earliestCourseDate()} onlineAvailable={Boolean(newOnlineMeetingUrl())} />
    </CoursePage>
  );
}
