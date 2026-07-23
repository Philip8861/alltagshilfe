import type { NextRequest, NextResponse } from "next/server";
import { analyticsDayBerlin } from "@/lib/site-analytics/berlin-day";
import {
  normalizePathForSiteAnalytics,
  shouldRecordClientSpaNavigation,
  shouldRecordSitePageView,
} from "@/lib/site-analytics/record-page-view";

/** First-Party-Cookie: speichert nur den Berlin-Kalendertag, an dem der Visitor bereits gezählt wurde. */
export const UNIQUE_VISITOR_DAY_COOKIE = "ahs_uv_day";

/** Cookie-Laufzeit: bis max. ~2 Tage; fachliche Deduplizierung über Cookie-Wert === heutiger Tag. */
const UNIQUE_VISITOR_COOKIE_MAX_AGE_SEC = 60 * 60 * 48;

export function hasUniqueVisitorCountedToday(request: NextRequest, day = analyticsDayBerlin()): boolean {
  const raw = request.cookies.get(UNIQUE_VISITOR_DAY_COOKIE)?.value?.trim() ?? "";
  return raw === day;
}

export function applyUniqueVisitorDayCookie(response: NextResponse, day = analyticsDayBerlin()): void {
  response.cookies.set({
    name: UNIQUE_VISITOR_DAY_COOKIE,
    value: day,
    path: "/",
    maxAge: UNIQUE_VISITOR_COOKIE_MAX_AGE_SEC,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
}

export function clearUniqueVisitorDayCookie(response: NextResponse): void {
  response.cookies.set({
    name: UNIQUE_VISITOR_DAY_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    httpOnly: true,
  });
}

/** Document-Request: Unique nur mitzählen, wenn auch ein Page-View zählbar wäre. */
export function shouldCountUniqueVisitorDocument(
  request: NextRequest,
  pathnameForAnalytics: string,
): boolean {
  const path = normalizePathForSiteAnalytics(pathnameForAnalytics);
  if (!shouldRecordSitePageView(request, path)) return false;
  return !hasUniqueVisitorCountedToday(request);
}

/** SPA-Navigation: gleiche Pfadregeln, ohne sec-fetch-Prüfungen. */
export function shouldCountUniqueVisitorSpa(
  request: NextRequest,
  pathnameForAnalytics: string,
): boolean {
  const path = normalizePathForSiteAnalytics(pathnameForAnalytics);
  if (!shouldRecordClientSpaNavigation(path)) return false;
  return !hasUniqueVisitorCountedToday(request);
}
