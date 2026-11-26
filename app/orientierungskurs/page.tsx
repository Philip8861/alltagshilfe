import type { Metadata } from "next";
import Link from "next/link";
import { z } from "zod";
import { BookingWizard } from "@/components/orientierungskurs/BookingWizard";
import { CoursePage } from "@/components/orientierungskurs/ui";
import { INFO_APPOINTMENT_PATH, newOnlineMeetingUrl } from "@/lib/orientierungskurs/config";
import { earliestCourseDate } from "@/lib/orientierungskurs/slots";

export const metadata: Metadata = {
  title: "Orientierungskurs buchen",
  description: "Buchen Sie einen zweistündigen Orientierungskurs von Alltagshilfe-Süd für Ihre Belegschaft.",
};

export const dynamic = "force-dynamic";

export default async function OrientierungskursPage({ searchParams }: {
  searchParams: Promise<{ einladung?: string | string[] }>;
}) {
  const outreach = z.string().uuid().safeParse((await searchParams).einladung);
  return (
    <CoursePage title="Orientierungskurs buchen"
      description="Wählen Sie einen Termin für Ihre Belegschaft. Nach der Buchung erhalten Sie einen Anmeldelink, einen QR-Code und einen Aushang zum Weitergeben.">
      <BookingWizard earliestDate={earliestCourseDate()} onlineAvailable={Boolean(newOnlineMeetingUrl())}
        outreachCode={outreach.success ? outreach.data : undefined} />
      <p className="mt-4 text-sm text-slate-700">
        Sie möchten erst mehr erfahren?{" "}
        <Link href={INFO_APPOINTMENT_PATH} className="font-bold text-[#0F4F68] underline">Kostenloses Infogespräch buchen</Link>
      </p>
    </CoursePage>
  );
}
