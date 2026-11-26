"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCourseOperator } from "@/lib/orientierungskurs/access";
import { cancelCourse, updateCourse } from "@/lib/orientierungskurs/store";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import { courseBookingSchema, type CourseBookingInput } from "@/lib/validations/orientierungskurs";

type CourseChangeResult = { ok: boolean; message: string };
const identity = z.object({ id: z.string().uuid(), revision: z.number().int().nonnegative() });
const errors = {
  storage: "Der Kurs konnte gerade nicht gespeichert werden. Bitte versuchen Sie es erneut.",
  stale: "Die Kursdaten wurden zwischenzeitlich geändert. Bitte laden Sie die Seite neu.",
  closed: "Bitte wählen Sie einen künftigen Werktag, an dem kein Feiertag ist.",
  taken: "Diese Uhrzeit ist belegt oder lässt weniger als eine Stunde Pause zu einem anderen Kurs.",
  online: "Ein Wechsel zu Online ist möglich, sobald ein Videodienst eingerichtet ist.",
};

function refreshCourseDashboards() {
  revalidatePath("/partner/pflegekurse");
  revalidatePath("/partner/admin/pflegekurse");
}

export async function editOrientationCourse(input: CourseBookingInput, revision: number): Promise<CourseChangeResult> {
  if (!(await getCourseOperator())) return { ok: false, message: "Sie haben keine Berechtigung, Kurse zu ändern." };
  const parsed = courseBookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  if (!identity.safeParse({ id: parsed.data.id, revision }).success) return { ok: false, message: errors.stale };
  const client = createSupabaseServiceRoleClient();
  if (!client) return { ok: false, message: errors.storage };
  const error = await updateCourse(client, parsed.data, revision);
  if (error) return { ok: false, message: errors[error] };
  refreshCourseDashboards();
  return { ok: true, message: "Kurs gespeichert." };
}

export async function archiveOrientationCourse(input: { id: string; revision: number }): Promise<CourseChangeResult> {
  if (!(await getCourseOperator())) return { ok: false, message: "Sie haben keine Berechtigung, Kurse zu löschen." };
  const parsed = identity.safeParse(input);
  if (!parsed.success) return { ok: false, message: errors.stale };
  const client = createSupabaseServiceRoleClient();
  if (!client) return { ok: false, message: errors.storage };
  const error = await cancelCourse(client, parsed.data.id, parsed.data.revision);
  if (error) return { ok: false, message: errors[error] };
  refreshCourseDashboards();
  return { ok: true, message: "Kurs gelöscht und im Archiv gespeichert." };
}
