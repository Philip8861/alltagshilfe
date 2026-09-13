import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import { analyticsDayBerlin } from "@/lib/site-analytics/berlin-day";
import { isConversionTrackingDay } from "@/lib/site-analytics/conversion-stats-start";

export type BookedByDate = Record<string, string[]>;

const memoryBooked = new Set<string>();

function slotKey(ymd: string, hhmm: string): string {
  return `${ymd}|${hhmm}`;
}

function normalizeDate(raw: string): string {
  return raw.slice(0, 10);
}

function normalizeTime(raw: string): string {
  return raw.slice(0, 5);
}

function addSlot(map: BookedByDate, ymd: string, hhmm: string) {
  const date = normalizeDate(ymd);
  const time = normalizeTime(hhmm);
  const list = map[date] ?? [];
  if (!list.includes(time)) list.push(time);
  map[date] = list;
}

export async function listBookedSlots(fromYmd: string, toYmd: string): Promise<BookedByDate> {
  const map: BookedByDate = {};
  for (const key of memoryBooked) {
    const [d, t] = key.split("|");
    if (d && t && d >= fromYmd && d <= toYmd) addSlot(map, d, t);
  }

  const svc = createSupabaseServiceRoleClient();
  if (!svc) return map;

  const { data, error } = await svc
    .from("betrieblich_info_appointments")
    .select("slot_date, slot_time")
    .gte("slot_date", fromYmd)
    .lte("slot_date", toYmd);

  if (error) {
    console.warn("[betrieblich-info] Slots lesen:", error.message);
    return map;
  }

  for (const row of data ?? []) {
    addSlot(map, String(row.slot_date ?? ""), String(row.slot_time ?? ""));
  }
  return map;
}

export type InsertAppointmentInput = {
  slotDate: string;
  slotTime: string;
  fullName: string;
  email: string;
  companyName: string;
  companyPosition: string;
  companySize: string;
};

export async function insertAppointment(
  input: InsertAppointmentInput,
): Promise<{ ok: true } | { ok: false; reason: "taken" | "unavailable" }> {
  const key = slotKey(input.slotDate, input.slotTime);
  const svc = createSupabaseServiceRoleClient();

  if (svc) {
    const { error } = await svc.from("betrieblich_info_appointments").insert({
      slot_date: input.slotDate,
      slot_time: input.slotTime,
      full_name: input.fullName,
      email: input.email,
      company_name: input.companyName,
      company_position: input.companyPosition,
      company_size: input.companySize,
    });

    if (!error) {
      memoryBooked.add(key);
      return { ok: true };
    }
    if (error.code === "23505") return { ok: false, reason: "taken" };
    console.warn("[betrieblich-info] Insert fehlgeschlagen:", error.message);
    return { ok: false, reason: "unavailable" };
  }

  if (memoryBooked.has(key)) return { ok: false, reason: "taken" };
  memoryBooked.add(key);
  return { ok: true };
}

export async function recordInfoTerminConversion(): Promise<void> {
  const svc = createSupabaseServiceRoleClient();
  if (!svc) return;
  try {
    const day = analyticsDayBerlin();
    if (!isConversionTrackingDay(day)) return;
    /* eslint-disable @typescript-eslint/no-explicit-any -- RPC nicht im generierten DB-Typ */
    const conv = await (svc as any).rpc("increment_site_conversion_completion", {
      p_day: day,
      p_kind: "betrieblich-info",
    });
    if (conv?.error) {
      console.warn("[betrieblich-info] Conversion-Zähler:", conv.error.message);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    console.warn("[betrieblich-info] Conversion-Zähler:", msg);
  }
}
