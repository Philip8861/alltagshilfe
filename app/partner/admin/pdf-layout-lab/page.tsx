import { unstable_noStore as noStore } from "next/cache";
import type { Metadata } from "next";
import { PdfLayoutLab } from "@/components/partner/admin/PdfLayoutLab";
import { requireSystemAdmin } from "@/lib/partner/system-admin-guard";

export const metadata: Metadata = {
  title: "PDF-Layout-Labor",
  robots: { index: false, follow: false },
};

export default async function PdfLayoutLabPage() {
  noStore();
  await requireSystemAdmin();
  return <PdfLayoutLab />;
}
