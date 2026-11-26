import type { SupabaseClient } from "@supabase/supabase-js";
import type { CourseInfoAppointmentInput } from "@/lib/validations/orientierungskurs";
import { isInfoAppointmentBookable } from "./info-slots";

const appointments = "orientierungskurs_info_appointments";

type InfoSlot = { slot_date: string; slot_time: string };
export type InfoAppointment = InfoSlot & {
  id: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  company: string | null;
};

function monthEnd(month: string): string {
  const [year, number] = month.split("-").map(Number);
  return new Date(Date.UTC(year, number, 0)).toISOString().slice(0, 10);
}

export async function loadInfoSlots(client: SupabaseClient, month: string): Promise<InfoSlot[] | null> {
  const { data, error } = await client.from(appointments).select("slot_date,slot_time")
    .gte("slot_date", month + "-01").lte("slot_date", monthEnd(month));
  return error ? null : data as InfoSlot[];
}

export async function loadInfoAppointments(client: SupabaseClient, month: string): Promise<InfoAppointment[] | null> {
  const { data, error } = await client.from(appointments).select("id,slot_date,slot_time,contact_name,contact_email,contact_phone,company")
    .gte("slot_date", month + "-01").lte("slot_date", monthEnd(month)).order("slot_date").order("slot_time");
  return error ? null : data as InfoAppointment[];
}

export async function saveInfoAppointment(
  client: SupabaseClient,
  input: CourseInfoAppointmentInput,
): Promise<{ appointment: InfoAppointment } | { error: "taken" | "closed" | "storage" }> {
  const fields = {
    id: input.id, slot_date: input.date, slot_time: input.time + ":00",
    contact_name: input.contactName, contact_email: input.email, contact_phone: input.phone,
    company: input.company || null,
  };
  const repeated = async () => {
    const { data } = await client.from(appointments).select("*").eq("id", input.id).maybeSingle<InfoAppointment>();
    return data && Object.entries(fields).every(([key, value]) => data[key as keyof InfoAppointment] === value) ? data : null;
  };

  const existing = await repeated();
  if (existing) return { appointment: existing };
  if (!isInfoAppointmentBookable(input.date, input.time)) return { error: "closed" };
  const { data, error } = await client.from(appointments).insert(fields).select().single<InfoAppointment>();
  if (!error) return { appointment: data };
  if (error.code === "23505") {
    const saved = await repeated();
    return saved ? { appointment: saved } : { error: "taken" };
  }
  console.error("[orientierungskurs] Infotermin", error.code);
  return { error: "storage" };
}
