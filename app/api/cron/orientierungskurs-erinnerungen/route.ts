import { NextResponse } from "next/server";
import { z } from "zod";
import { COURSE_TEAM, courseSiteOrigin } from "@/lib/orientierungskurs/config";
import { sendCourseReminderDueNotice } from "@/lib/orientierungskurs/email";
import { courseReminderStillDue, loadDueCourseOutreach, markCourseOutreachNotified } from "@/lib/orientierungskurs/outreach";
import { sendCourseMailOnce } from "@/lib/orientierungskurs/store";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";

export const maxDuration = 120;

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  const token = z.string().uuid().safeParse(authorization?.startsWith("Bearer ") ? authorization.slice(7) : undefined);
  if (!token.success) return NextResponse.json({ ok: false }, { status: 401 });
  const client = createSupabaseServiceRoleClient();
  const origin = courseSiteOrigin();
  if (!client || !origin) return NextResponse.json({ ok: false }, { status: 503 });
  const check = await client.rpc("orientierungskurs_consume_cron_token", { presented: token.data });
  if (check.error || check.data !== true) return NextResponse.json({ ok: false }, { status: 401 });
  const { data, error } = await loadDueCourseOutreach(client);
  if (error || !data) return NextResponse.json({ ok: false }, { status: 500 });

  let notified = 0;
  let failed = 0;
  for (let offset = 0; offset < data.length; offset += 4) {
    const batch = await Promise.allSettled(data.slice(offset, offset + 4).map(async (entry) => {
      if (!await courseReminderStillDue(client, entry.email)) return "skipped";
      const deliveries = await Promise.all(COURSE_TEAM.map(({ email }) =>
        sendCourseMailOnce(client, "outreach-due:" + entry.code + ":" + email,
          () => sendCourseReminderDueNotice(client, email, entry.email, entry.sent_at, origin))));
      return deliveries.every(Boolean) && await markCourseOutreachNotified(client, entry.email) ? "sent" : "failed";
    }));
    notified += batch.filter((result) => result.status === "fulfilled" && result.value === "sent").length;
    failed += batch.filter((result) => result.status === "rejected" || result.value === "failed").length;
  }
  return NextResponse.json({ ok: failed === 0, notified, failed }, { status: failed ? 502 : 200 });
}
