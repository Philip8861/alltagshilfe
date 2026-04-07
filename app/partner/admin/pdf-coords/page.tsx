import { unstable_noStore as noStore } from "next/cache";
import { PdfFormFieldEditor } from "@/components/partner/admin/PdfFormFieldEditor";
import { requireSystemAdmin } from "@/lib/partner/system-admin-guard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF-Formularfelder",
  robots: { index: false, follow: false },
};

export default async function PdfCoordsAdminPage() {
  noStore();
  await requireSystemAdmin();
  return <PdfFormFieldEditor />;
}
