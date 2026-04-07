import { unstable_noStore as noStore } from "next/cache";
import { PdfCoordinatePicker } from "@/components/partner/admin/PdfCoordinatePicker";
import { requireSystemAdmin } from "@/lib/partner/system-admin-guard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF-Koordinaten",
  robots: { index: false, follow: false },
};

export default async function PdfCoordsAdminPage() {
  noStore();
  await requireSystemAdmin();
  return <PdfCoordinatePicker />;
}
