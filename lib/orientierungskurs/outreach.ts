import type { SupabaseClient } from "@supabase/supabase-js";

const OUTREACH = "orientierungskurs_outreach";
const OUTREACH_STATUS = "orientierungskurs_outreach_status";
const fields = "email,status,source,note,updated_at,sent_at,due,reminder_status,reminder_at,booked_registration_code,booked_company,booked_contact,booked_email,booked_date,match_method";
type DeliveryStatus = "sent" | "failed" | "unconfirmed";
export type OutreachGreeting = { salutation: "frau" | "herr"; lastName: string };
export type CourseOutreach = {
  email: string;
  status: "sending" | DeliveryStatus;
  source: "dashboard" | "manual";
  note: string | null;
  updated_at: string;
  sent_at: string | null;
  due: boolean;
  reminder_status: "sending" | DeliveryStatus | null;
  reminder_at: string | null;
  booked_registration_code: string | null;
  booked_company: string | null;
  booked_contact: string | null;
  booked_email: string | null;
  booked_date: string | null;
  match_method: "link" | "email" | "domain" | null;
};

export async function lookupOutreachCode(client: SupabaseClient, code: string): Promise<string | null> {
  const { data } = await client.from(OUTREACH).select("code").eq("code", code).in("status", ["sending", "sent"]).maybeSingle();
  return data?.code ?? null;
}

export async function loadCourseOutreach(client: SupabaseClient): Promise<CourseOutreach[] | null> {
  const pageSize = 500;
  const entries: CourseOutreach[] = [];
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await client.from(OUTREACH_STATUS).select(fields)
      .order("updated_at", { ascending: false }).order("email").range(offset, offset + pageSize - 1);
    if (error || !data) return null;
    entries.push(...data as CourseOutreach[]);
    if (data.length < pageSize) return entries;
  }
}

export async function reserveCourseOutreach(client: SupabaseClient, email: string, actor: string, greeting?: OutreachGreeting) {
  const record = {
    email, actor, status: "sending", source: "dashboard", updated_at: new Date().toISOString(),
    salutation: greeting?.salutation ?? null, last_name: greeting?.lastName ?? null,
  };
  const inserted = await client.from(OUTREACH).upsert(record, { onConflict: "email", ignoreDuplicates: true })
    .select("code").maybeSingle<{ code: string }>();
  if (inserted.error) return "storage";
  if (inserted.data) return inserted.data;

  const retried = await client.from(OUTREACH).update(record).eq("email", email).eq("status", "failed")
    .select("code").maybeSingle<{ code: string }>();
  if (retried.error) return "storage";
  if (retried.data) return retried.data;
  const current = await client.from(OUTREACH).select("status").eq("email", email).maybeSingle();
  return current.error ? "storage" : current.data?.status === "sent" ? "sent" : "pending";
}

export async function finishCourseOutreach(client: SupabaseClient, email: string, status: DeliveryStatus): Promise<boolean> {
  const now = new Date().toISOString();
  const { data, error } = await client.from(OUTREACH)
    .update({ status, updated_at: now, sent_at: status === "sent" ? now : null })
    .eq("email", email).eq("status", "sending").select("email").maybeSingle();
  return !error && Boolean(data);
}

export async function recordCourseOutreach(
  client: SupabaseClient, email: string, actor: string, note: string, sentDate?: string,
): Promise<"recorded" | "pending" | "sent" | "storage"> {
  const now = new Date();
  const record = {
    email, actor, status: "sent", source: "manual", note: note || null,
    updated_at: now.toISOString(), sent_at: sentDate ? sentDate + "T00:00:00.000Z" : now.toISOString(),
  };
  const inserted = await client.from(OUTREACH).upsert(record, { onConflict: "email", ignoreDuplicates: true })
    .select("email").maybeSingle();
  if (inserted.error) return "storage";
  if (inserted.data) return "recorded";

  const staleSend = new Date(now.getTime() - 5 * 60_000).toISOString();
  const updated = await client.from(OUTREACH).update(record).eq("email", email)
    .or("status.in.(failed,unconfirmed),and(status.eq.sending,updated_at.lt." + staleSend + ")")
    .select("email").maybeSingle();
  if (updated.error) return "storage";
  if (updated.data) return "recorded";
  const current = await client.from(OUTREACH).select("status").eq("email", email).maybeSingle();
  return current.error ? "storage" : current.data?.status === "sent" ? "sent" : "pending";
}

export async function reserveCourseReminder(client: SupabaseClient, email: string) {
  const due = await client.from(OUTREACH_STATUS).select("due").eq("email", email).maybeSingle();
  if (due.error) return "storage";
  if (!due.data?.due) return "not-due";
  const { data, error } = await client.from(OUTREACH)
    .update({ reminder_status: "sending", reminder_at: new Date().toISOString() })
    .eq("email", email).or("reminder_status.is.null,reminder_status.eq.failed")
    .select("code,salutation,last_name").maybeSingle<{ code: string; salutation: OutreachGreeting["salutation"] | null; last_name: string | null }>();
  return error ? "storage" : data ?? "reserved";
}

export async function courseReminderStillDue(client: SupabaseClient, email: string): Promise<boolean> {
  const { data, error } = await client.from(OUTREACH_STATUS).select("due").eq("email", email).maybeSingle();
  if (error) throw error;
  return Boolean(data?.due);
}

export async function finishCourseReminder(client: SupabaseClient, email: string, status: DeliveryStatus | null): Promise<boolean> {
  const { data, error } = await client.from(OUTREACH)
    .update({ reminder_status: status, reminder_at: status ? new Date().toISOString() : null })
    .eq("email", email).eq("reminder_status", "sending").select("email").maybeSingle();
  return !error && Boolean(data);
}

export async function loadDueCourseOutreach(client: SupabaseClient) {
  return client.from(OUTREACH_STATUS).select("email,code,sent_at")
    .is("notice_sent_at", null).eq("due", true)
    .or("reminder_status.is.null,reminder_status.eq.failed").order("sent_at").limit(20)
    .returns<{ email: string; code: string; sent_at: string }[]>();
}

export async function markCourseOutreachNotified(client: SupabaseClient, email: string): Promise<boolean> {
  const { error } = await client.from(OUTREACH).update({ notice_sent_at: new Date().toISOString() }).eq("email", email);
  return !error;
}
