import type { Metadata } from "next";
import { CourseDashboard, type CourseDashboardSearch } from "@/components/orientierungskurs/CourseDashboard";
import { requireSystemAdmin } from "@/lib/partner/system-admin-guard";

export const metadata: Metadata = { title: "Pflegekurse verwalten", robots: { index: false, follow: false } };
export const maxDuration = 120;

export default async function AdminPflegekursePage({ searchParams }: {
  searchParams: Promise<CourseDashboardSearch>;
}) {
  await requireSystemAdmin();
  return <CourseDashboard search={await searchParams} admin />;
}
