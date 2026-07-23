import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { analyticsDayBerlin } from "@/lib/site-analytics/berlin-day";
import { deviceCategoryFromHeaders } from "@/lib/site-analytics/device-category";
import {
  normalizePathForSiteAnalytics,
  shouldRecordClientSpaNavigation,
} from "@/lib/site-analytics/record-page-view";
import {
  applyUniqueVisitorDayCookie,
  shouldCountUniqueVisitorSpa,
} from "@/lib/site-analytics/unique-visitor";
import { hasAnalyticsConsentFromCookieValue } from "@/lib/consent-server";
import { rateLimitSiteAnalyticsNavigation } from "@/lib/rate-limit";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

const bodySchema = z.object({
  path: z.string().min(1).max(2048),
});

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip")?.trim() ?? "unknown";
}

function isSameSiteRequest(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const selfOrigin = request.nextUrl.origin;
  if (origin) return origin === selfOrigin;
  if (referer) {
    try {
      return new URL(referer).origin === selfOrigin;
    } catch {
      return false;
    }
  }
  return true;
}

export async function POST(request: NextRequest) {
  if (!isSameSiteRequest(request)) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  if (!hasAnalyticsConsentFromCookieValue(request.cookies.get("cookie_consent")?.value)) {
    return NextResponse.json({ ok: true, skipped: true, reason: "no_consent" });
  }

  const ip = clientIp(request);
  const limited = rateLimitSiteAnalyticsNavigation(ip);
  if (!limited.success) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const normalized = normalizePathForSiteAnalytics(parsed.data.path);
  if (!shouldRecordClientSpaNavigation(normalized)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const svc = createSupabaseServiceRoleClient();
  if (!svc) {
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  const day = analyticsDayBerlin();
  const device = deviceCategoryFromHeaders(request.headers);
  const countUnique = shouldCountUniqueVisitorSpa(request, normalized);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const { error } = await (svc as any).rpc("increment_site_page_view", {
    p_day: day,
    p_path: normalized,
    p_device: device,
  });
  if (error) {
    console.warn("[site-analytics/navigation]", error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  if (countUnique) {
    const uniqueRes = await (svc as any).rpc("increment_site_unique_visitor", { p_day: day });
    if (uniqueRes.error) {
      console.warn("[site-analytics/navigation/unique]", uniqueRes.error.message);
    }
  }

  const res = NextResponse.json({ ok: true });
  if (countUnique) applyUniqueVisitorDayCookie(res, day);
  return res;
}
