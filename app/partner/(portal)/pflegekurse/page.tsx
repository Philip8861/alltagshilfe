import type { Metadata } from "next";
import { CourseDashboard, type CourseDashboardSearch } from "@/components/orientierungskurs/CourseDashboard";
import { hasCourseAccess } from "@/lib/orientierungskurs/access";
import { isPartnerAccountDisabled, requirePartnerLogin } from "@/lib/partner/auth";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Pflegekurse" };
export const maxDuration = 120;

export default async function PflegekursePage({ searchParams }: {
  searchParams: Promise<CourseDashboardSearch>;
}) {
  const { profile, userId } = await requirePartnerLogin();
  if (isPartnerAccountDisabled(profile) || !(await hasCourseAccess(userId))) notFound();
  return <CourseDashboard search={await searchParams} />;
}
