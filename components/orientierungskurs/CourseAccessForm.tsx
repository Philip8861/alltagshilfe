"use client";

import { useActionState, useId } from "react";
import { updateCourseAccess } from "@/lib/actions/orientierungskurs";
import { courseButton, courseField, courseSecondary } from "./ui";

export type CourseProfileOption = { id: string; display_name: string | null; organization_name: string | null };
const initial = { ok: false, message: "" };

export function CourseAccessForm({ profiles, change }: { profiles: CourseProfileOption[]; change: "grant" | "revoke" }) {
  const [state, action, pending] = useActionState(updateCourseAccess, initial);
  const profileId = useId();
  const grant = change === "grant";
  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="change" value={change} />
      <label htmlFor={profileId} className="block text-sm font-bold text-[#123947]">
        {grant ? "Konto freischalten" : "Freigabe entfernen"}
      </label>
      <select id={profileId} name="profileId" required className={courseField} disabled={pending || !profiles.length} defaultValue="">
        <option value="" disabled>{profiles.length ? "Konto auswählen" : "Keine Konten verfügbar"}</option>
        {profiles.map((profile) => (
          <option key={profile.id} value={profile.id}>
            {[profile.display_name || profile.id, profile.organization_name].filter(Boolean).join(" · ")}
          </option>
        ))}
      </select>
      <button className={grant ? courseButton : courseSecondary} disabled={pending || !profiles.length} type="submit">
        {pending ? "Wird gespeichert …" : grant ? "Freischalten" : "Freigabe entfernen"}
      </button>
      {state.message && <p role={state.ok ? "status" : "alert"} className={state.ok ? "text-emerald-800" : "text-red-800"}>{state.message}</p>}
    </form>
  );
}
