import { unstable_noStore as noStore } from "next/cache";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireSystemAdmin } from "@/lib/partner/system-admin-guard";

export const metadata: Metadata = {
  title: "PDF-Layout-Labor",
  robots: { index: false, follow: false },
};

/** Frühere URL — alles in einem Editor unter /partner/admin/pdf-coords */
export default async function PdfLayoutLabRedirectPage() {
  noStore();
  await requireSystemAdmin();
  redirect("/partner/admin/pdf-coords");
}
