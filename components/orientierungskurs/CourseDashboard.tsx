import Link from "next/link";
import type { ReactNode } from "react";
import { formatDateLongDe, monthLabelDe, ymdToYearMonth } from "@/lib/betrieblich-info-termin/slots";
import { BOOKING_PATH, courseSiteOrigin, newOnlineMeetingUrl, participationUrl } from "@/lib/orientierungskurs/config";
import { infoAppointmentTimeLabel } from "@/lib/orientierungskurs/info-slots";
import { loadInfoAppointments, type InfoAppointment } from "@/lib/orientierungskurs/info-store";
import { loadCourseOutreach } from "@/lib/orientierungskurs/outreach";
import {
  COURSE_FORMAT_LABEL, COURSE_PARTICIPANT_LIMIT, FIRST_COURSE_DATE,
  courseHoliday, courseTimeLabel, earliestCourseDate, validCourseDate, validCourseMonth,
} from "@/lib/orientierungskurs/slots";
import { COURSE_BOOKINGS, COURSE_STAFF, loadCourseDashboard, type DashboardBooking, type Participant } from "@/lib/orientierungskurs/store";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/service";
import { CourseAccessForm, type CourseProfileOption } from "./CourseAccessForm";
import { CourseManageForm } from "./CourseManageForm";
import { CourseOutreachPanel } from "./CourseOutreachPanel";
import { CourseRescheduleForm } from "./CourseRescheduleForm";
import { CourseSplitForm } from "./CourseSplitForm";
import { InviteEmployerForm } from "./InviteEmployerForm";
import { CourseCalendar, adjacentMonth, courseCard, courseSecondary } from "./ui";

export type CourseDashboardSearch = { month?: string; day?: string; bereich?: string; verschoben?: string };
const sections = [
  { id: "kurse", label: "Aktive Kurse" },
  { id: "versand", label: "Einladungen & Versand" },
  { id: "infogespraeche", label: "Infogespräche" },
  { id: "archiv", label: "Archiv" },
  { id: "zugriff", label: "Zugriffsverwaltung" },
] as const;
const linkClass = "break-all font-bold text-[#0F4F68] underline underline-offset-2";

function CourseParticipantList({ title, participants }: { title: string; participants: Participant[] }) {
  return (
    <div className="rounded-xl bg-[#f2f8f9] p-3">
      <h4 className="font-extrabold text-[#123947]">{title}</h4>
      {participants.length === 0 ? <p className="mt-1 text-sm text-slate-700">Es liegen noch keine Anmeldungen vor.</p> : (
        <ul className="mt-2 divide-y divide-[#d0e3e7]">
          {participants.map((person) => (
            <li key={person.id} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-2 text-sm">
              <span className="min-w-0 break-words font-bold">{person.first_name} {person.last_name}</span>
              <a className={linkClass} href={"mailto:" + person.email}>{person.email}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CourseDetails({ course, open, origin, onlineAvailable }: {
  course: DashboardBooking; open: boolean; origin: string | null; onlineAvailable: boolean;
}) {
  const participants = course.orientierungskurs_participants.filter((person) => !person.waitlisted);
  const waitlist = course.orientierungskurs_participants.filter((person) => person.waitlisted);
  const archived = Boolean(course.cancelled_at);
  const attendance = participants.length + " / " + COURSE_PARTICIPANT_LIMIT + " Plätze";
  const items: [string, ReactNode][] = [
    ["Ansprechperson", course.contact_name],
    ["E-Mail", <a key="email" className={linkClass} href={"mailto:" + course.contact_email}>{course.contact_email}</a>],
    ["Telefon", <a key="phone" className={linkClass} href={"tel:" + course.contact_phone.replace(/[^+\d]/g, "")}>{course.contact_phone}</a>],
  ];
  if (course.company_address) items.push(["Firmenadresse", course.company_address]);
  if (course.address && course.address !== course.company_address) items.push(["Schulungsadresse", course.address]);
  if (course.room) items.push(["Raum", course.room]);
  if (course.parking) items.push(["Parkhinweis", course.parking]);
  if (course.meeting_url && !archived) {
    items.push(["Online-Kurs", <a key="meeting" className={linkClass} href={course.meeting_url} target="_blank" rel="noreferrer">Videokonferenz öffnen</a>]);
  }
  if (origin && !archived) items.push(["Teilnahme", <a key="registration" className={linkClass} href={participationUrl(origin, course.registration_code)}>Anmeldeseite öffnen</a>]);

  return (
    <details id={"kurs-" + course.registration_code} open={open} className="rounded-xl border border-[#cfe2e7] bg-white">
      <summary className="cursor-pointer rounded-xl px-4 py-3 focus-visible:outline focus-visible:outline-[#0F4F68]">
        <span className="break-words font-extrabold text-[#123947]">{course.company}</span>
        <span className="mt-1 block text-sm text-slate-700">
          {formatDateLongDe(course.slot_date)} · {courseTimeLabel(course.slot_time)} · {COURSE_FORMAT_LABEL[course.format]} · {attendance}
          {archived && " · Abgesagt"}
          {!archived && participants.length >= COURSE_PARTICIPANT_LIMIT && " · Ausgebucht"}
          {waitlist.length > 0 && " · Warteliste (" + waitlist.length + ")"}
          {course.split_from && " · Folgetermin"}
        </span>
      </summary>
      <div className="space-y-4 border-t border-[#d9e8eb] px-4 py-4">
        <dl className="grid gap-3 sm:grid-cols-2">
          {items.map(([label, value]) => (
            <div key={label} className="min-w-0">
              <dt className="text-sm font-bold text-slate-600">{label}</dt>
              <dd className="whitespace-pre-line break-words">{value}</dd>
            </div>
          ))}
        </dl>
        <CourseParticipantList title="Bestätigte Teilnehmende" participants={participants} />
        {waitlist.length > 0 && <CourseParticipantList title="Warteliste" participants={waitlist} />}
        {!archived && <CourseSplitForm id={course.id} waiting={waitlist} followup={Boolean(course.split_from)} />}
        {!archived && <CourseRescheduleForm id={course.id} code={course.registration_code} revision={course.revision}
          date={course.slot_date} time={course.slot_time} earliestDate={earliestCourseDate()} />}
        <a className={courseSecondary} href={"/partner/pflegekurse/" + course.id + "/export"}>Kursdaten als CSV herunterladen</a>
        {!archived && (
          <CourseManageForm onlineAvailable={onlineAvailable} course={{
            id: course.id, revision: course.revision, slot_date: course.slot_date, slot_time: course.slot_time,
            format: course.format, company: course.company, company_address: course.company_address,
            contact_name: course.contact_name, contact_email: course.contact_email,
            contact_salutation: course.contact_salutation, contact_last_name: course.contact_last_name,
            contact_phone: course.contact_phone, address: course.address, room: course.room, parking: course.parking,
          }} />
        )}
      </div>
    </details>
  );
}

async function CourseAccessSection() {
  const client = createSupabaseServiceRoleClient();
  if (!client) return null;
  const [profiles, grants] = await Promise.all([
    client.from("partner_profiles").select("id,display_name,organization_name,account_disabled_at").order("display_name"),
    client.from(COURSE_STAFF).select("profile_id"),
  ]);
  const ids = new Set(grants.data?.map((grant) => String(grant.profile_id)));
  return (
    <section className={courseCard}>
      <h2 className="text-lg font-extrabold text-[#123947]">Zugriff auf Pflegekurse verwalten</h2>
      {profiles.error || grants.error ? <p className="mt-3" role="status">Kursfreigaben konnten nicht geladen werden.</p> : (
        <>
          <p className="mb-4 mt-2 text-sm text-slate-700">
            Freigeschaltete Konten sehen die Kurse und Teilnehmenden und können Buchungseinladungen versenden.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <CourseAccessForm change="grant" profiles={(profiles.data ?? []).filter((p) => !p.account_disabled_at && !ids.has(p.id)) as CourseProfileOption[]} />
            <CourseAccessForm change="revoke" profiles={(profiles.data ?? []).filter((p) => ids.has(p.id)) as CourseProfileOption[]} />
          </div>
          <Link className={linkClass + " mt-4 inline-block"} href="/partner/admin?bereich=anlegen">Neues Konto anlegen</Link>
        </>
      )}
    </section>
  );
}

function InfoAppointmentList({ appointments }: { appointments: InfoAppointment[] | null }) {
  return (
    <section className={courseCard}>
      <h2 className="text-lg font-extrabold text-[#123947]">
        Infogespräche im Monat{appointments && " (" + appointments.length + ")"}
      </h2>
      {appointments === null ? <p className="mt-3" role="status">Infogespräche konnten gerade nicht geladen werden.</p> :
        appointments.length === 0 ? <p className="mt-3">In diesem Monat gibt es keine gebuchten Infogespräche.</p> :
        <ul className="mt-3 divide-y divide-[#d0e3e7]">
          {appointments.map((appointment) => (
            <li key={appointment.id} className="space-y-1 py-3">
              <p className="font-extrabold text-[#123947]">{formatDateLongDe(appointment.slot_date)} · {infoAppointmentTimeLabel(appointment.slot_time)}</p>
              <p className="break-words">{[appointment.contact_name, appointment.company].filter(Boolean).join(" · ")}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                <a className={linkClass} href={"tel:" + appointment.contact_phone.replace(/[^+\d]/g, "")}>{appointment.contact_phone}</a>
                <a className={linkClass} href={"mailto:" + appointment.contact_email}>{appointment.contact_email}</a>
              </div>
            </li>
          ))}
        </ul>}
    </section>
  );
}

async function ActiveCourses({ month, day, today, url }: {
  month: string; day: string; today: string; url: (month: string, day?: string) => string;
}) {
  const client = createSupabaseServiceRoleClient();
  const [bookings, next] = client ? await Promise.all([
    loadCourseDashboard(client, month),
    client.from(COURSE_BOOKINGS).select("slot_date").gt("slot_date", month + "-01")
      .is("cancelled_at", null).gte("slot_date", today).order("slot_date").order("slot_time").limit(1).maybeSingle(),
  ]) : [null, null];
  const active = bookings?.filter((course) => !course.cancelled_at && course.slot_date >= today) ?? [];
  const selected = day ? active.filter((course) => course.slot_date === day) : active;
  const nextDate = next?.data?.slot_date as string | undefined;
  const origin = courseSiteOrigin();
  const onlineAvailable = Boolean(newOnlineMeetingUrl());
  const attendees = selected.flatMap((course) => course.orientierungskurs_participants);
  const overview = [
    [day ? "Kurse am gewählten Tag" : "Kurse im gewählten Monat", bookings ? selected.length : null],
    ["Bestätigte Teilnahmen", bookings ? attendees.filter((person) => !person.waitlisted).length : null],
    ["Auf der Warteliste", bookings ? attendees.filter((person) => person.waitlisted).length : null],
  ] as const;

  return (
    <>
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {overview.map(([label, value]) => (
          <div className={courseCard} key={label}>
            <dt className="text-sm font-semibold text-slate-700">{label}</dt>
            <dd className="text-2xl font-extrabold text-[#123947]">{value ?? "–"}</dd>
          </div>
        ))}
      </dl>
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <section className={courseCard} aria-label="Kurskalender">
          <h2 className="mb-4 text-xl font-extrabold text-[#123947]">Kurskalender</h2>
          <CourseCalendar month={month}
            previous={month > FIRST_COURSE_DATE.slice(0, 7)
              ? <Link className={courseSecondary + " px-3"} aria-label="Vorheriger Monat" href={url(adjacentMonth(month, -1))}>‹</Link>
              : <button type="button" className={courseSecondary + " px-3"} aria-label="Vorheriger Monat" disabled>‹</button>}
            next={month < "9999-12"
              ? <Link className={courseSecondary + " px-3"} aria-label="Nächster Monat" href={url(adjacentMonth(month, 1))}>›</Link>
              : <button type="button" className={courseSecondary + " px-3"} aria-label="Nächster Monat" disabled>›</button>}
            renderDay={(date) => {
              const count = active.filter((course) => course.slot_date === date).length;
              const holiday = courseHoliday(date);
              return count ? (
                <Link href={url(month, date)} aria-current={date === day ? "date" : undefined}
                  aria-label={formatDateLongDe(date) + ", " + count + (count === 1 ? " Kurs" : " Kurse")}
                  className={"flex min-h-11 flex-col items-center justify-center rounded-lg text-sm font-extrabold leading-tight " +
                    (date === day ? "bg-[#0F4F68] text-white" : "bg-[#e8f3f5] text-[#0F4F68] hover:bg-[#d9ecef]")}>
                  {Number(date.slice(-2))}<span aria-hidden="true" className="text-[10px] font-semibold">{count} {count === 1 ? "Kurs" : "Kurse"}</span>
                </Link>
              ) : (
                <span title={holiday} aria-label={holiday ? formatDateLongDe(date) + ", " + holiday : undefined}
                  className={"grid min-h-11 place-items-center rounded-lg text-sm text-slate-500 " + (holiday ? "bg-amber-50" : "")}>
                  {Number(date.slice(-2))}
                </span>
              );
            }} />
          {nextDate && !nextDate.startsWith(month) && <Link className={linkClass + " mt-3 inline-block text-sm"} href={url(nextDate.slice(0, 7), nextDate)}>Zum nächsten gebuchten Kurs</Link>}
        </section>
        <section className={courseCard}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-extrabold text-[#123947]">{day ? formatDateLongDe(day) : "Gebuchte Kurse im Monat"}</h2>
            {day && <Link className={courseSecondary} href={url(month)}>Ganzer Monat</Link>}
          </div>
          {bookings === null ? <p role="status">Kurse konnten gerade nicht geladen werden.</p> :
            selected.length ? (
              <div className="grid gap-2">
                {selected.map((course) => <CourseDetails key={course.id} course={course} origin={origin} open={Boolean(day)} onlineAvailable={onlineAvailable} />)}
              </div>
            ) : <p>Für diesen Zeitraum sind keine Kurse gebucht.</p>}
        </section>
      </div>
    </>
  );
}

export async function CourseDashboard({ search, admin = false }: { search: CourseDashboardSearch; admin?: boolean }) {
  const tabs = admin ? sections : sections.slice(0, -1);
  const section = tabs.find((tab) => tab.id === search.bereich)?.id ?? "kurse";
  const today = earliestCourseDate();
  const month = typeof search.month === "string" && validCourseMonth(search.month) ? search.month : today.slice(0, 7);
  const day = typeof search.day === "string" && validCourseDate(search.day) && search.day.startsWith(month) ? search.day : "";
  const root = admin ? "/partner/admin/pflegekurse" : "/partner/pflegekurse";
  const url = (selected: typeof section, time = month, selectedDay?: string) =>
    root + "?bereich=" + selected + "&month=" + time + (selectedDay ? "&day=" + selectedDay : "");
  const client = createSupabaseServiceRoleClient();
  let content: ReactNode;
  if (section === "versand") {
    const outreach = client ? await loadCourseOutreach(client) : null;
    content = (
      <>
        <InviteEmployerForm />
        <CourseOutreachPanel entries={outreach} dashboardPath={root} today={today} />
      </>
    );
  } else if (section === "zugriff") {
    content = <CourseAccessSection />;
  } else if (section === "infogespraeche") {
    content = <InfoAppointmentList appointments={client ? await loadInfoAppointments(client, month) : null} />;
  } else if (section === "archiv") {
    const bookings = client ? await loadCourseDashboard(client, month) : null;
    const archived = bookings?.filter((course) => course.cancelled_at || course.slot_date < today);
    const origin = courseSiteOrigin();
    const onlineAvailable = Boolean(newOnlineMeetingUrl());
    content = (
      <section className={courseCard}>
        <h2 className="text-xl font-extrabold text-[#123947]">Vergangene und abgesagte Kurse</h2>
        {archived ? (
          archived.length ? <div className="mt-3 grid gap-2">
            {archived.map((course) => <CourseDetails key={course.id} course={course} origin={origin}
              open={course.slot_date === day} onlineAvailable={onlineAvailable} />)}
          </div> : <p className="mt-3">In diesem Monat gibt es keine Kurse im Archiv.</p>
        ) : <p className="mt-3" role="status">Das Archiv konnte gerade nicht geladen werden.</p>}
      </section>
    );
  } else {
    content = <ActiveCourses month={month} day={day} today={today} url={(dateMonth, date) => url("kurse", dateMonth, date)} />;
  }
  const { year, month: monthNumber } = ymdToYearMonth(month);

  return (
    <section className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-7 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#123947] sm:text-4xl">Pflegekurse</h1>
        <Link className={courseSecondary} href={BOOKING_PATH}>Buchungsseite</Link>
      </div>
      <nav className="flex flex-wrap gap-2" aria-label="Verwaltungsbereiche der Pflegekurse">
        {tabs.map(({ id, label }) => (
          <Link key={id} href={url(id)} aria-current={id === section ? "page" : undefined}
            className={courseSecondary + (id === section ? " border-[#0F4F68] !bg-[#0F4F68] !text-white" : "")}>
            {label}
          </Link>
        ))}
      </nav>
      {section === "kurse" && search.verschoben === "1" && (
        <p className="rounded-xl bg-emerald-50 p-3 font-semibold text-emerald-800" role="status">Der Termin wurde verschoben.</p>
      )}
      {(section === "infogespraeche" || section === "archiv") && (
        <div className="flex flex-wrap items-center gap-3">
          {month > FIRST_COURSE_DATE.slice(0, 7) && <Link className={courseSecondary + " px-3"} aria-label="Vorheriger Monat"
            href={url(section, adjacentMonth(month, -1))}>‹</Link>}
          <strong>{monthLabelDe(year, monthNumber)}</strong>
          {month < "9999-12" && <Link className={courseSecondary + " px-3"} aria-label="Nächster Monat"
            href={url(section, adjacentMonth(month, 1))}>›</Link>}
        </div>
      )}
      {content}
    </section>
  );
}
