import { NextResponse } from "next/server";
import { runPartnerTipInBearbeitungReminders } from "@/lib/partner/run-partner-tip-in-bearbeitung-reminders";

/**
 * Täglicher Cron: Erinnerungs-Mail alle 3 Tage an Zuständige für Tipps mit Status „In Bearbeitung“.
 *
 * Auth: wie andere Crons – `Authorization: Bearer CRON_SECRET` oder `?secret=`.
 * In Vercel `CRON_SECRET` setzen und Cron in vercel.json eintragen.
 */
export async function GET(request: Request) {
  const secrets = [process.env.CRON_SECRET, process.env.PARTNER_PAYOUT_CRON_SECRET]
    .map((s) => s?.trim())
    .filter((s): s is string => Boolean(s && s.length > 0));

  if (secrets.length === 0) {
    return NextResponse.json(
      { ok: false, message: "CRON_SECRET oder PARTNER_PAYOUT_CRON_SECRET muss gesetzt sein." },
      { status: 503 },
    );
  }

  const url = new URL(request.url);
  const auth = request.headers.get("authorization");
  const querySecret = url.searchParams.get("secret");
  const authorized =
    secrets.some((s) => auth === `Bearer ${s}`) || secrets.some((s) => querySecret === s);
  if (!authorized) {
    return NextResponse.json({ ok: false, message: "Nicht autorisiert." }, { status: 401 });
  }

  const result = await runPartnerTipInBearbeitungReminders();

  return NextResponse.json(
    {
      ok: result.ok,
      eligibleRows: result.eligibleRows,
      dueCount: result.dueCount,
      sent: result.sent,
      migrationMissing: result.migrationMissing ?? false,
      errors: result.errors,
    },
    { status: result.ok ? 200 : 500 },
  );
}
