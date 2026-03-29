import { NextResponse } from "next/server";
import { getBerlinCalendarDay } from "@/lib/partner/payout-period";
import { runPartnerMonthlyPayoutSettlement } from "@/lib/partner/run-partner-monthly-payout-settlement";

const PERIOD_KEY_RE = /^\d{4}-\d{2}$/;

/**
 * Vercel Cron: Authorization: Bearer CRON_SECRET (in Vercel-Umgebung setzen).
 * Manuell: gleiches Secret als ?secret=… oder zweites Secret PARTNER_PAYOUT_CRON_SECRET.
 * Optional: &periodKey=YYYY-MM. Automatischer Lauf nur am 1. (Europe/Berlin), außer periodKey ist gesetzt.
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

  const periodKeyParam = url.searchParams.get("periodKey")?.trim() ?? "";
  if (periodKeyParam && !PERIOD_KEY_RE.test(periodKeyParam)) {
    return NextResponse.json({ ok: false, message: "periodKey muss YYYY-MM sein." }, { status: 400 });
  }

  const now = new Date();
  if (!periodKeyParam && getBerlinCalendarDay(now) !== 1) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      message: "Kein automatischer Lauf: heute ist nicht der 1. (Europe/Berlin). Mit periodKey manuell auslösen.",
    });
  }

  const result = await runPartnerMonthlyPayoutSettlement({
    periodKey: periodKeyParam || undefined,
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
