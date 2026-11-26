import { z } from "zod";
import { COURSE_TIMES, validCourseDate } from "@/lib/orientierungskurs/slots";
import { INFO_APPOINTMENT_TIMES } from "@/lib/orientierungskurs/info-slots";

export const courseEmail = z.string().trim().max(254)
  .email("Bitte geben Sie eine gültige E-Mail-Adresse an.")
  .transform((value) => value.toLowerCase());
const requiredText = (max: number, message: string) => z.string().trim().min(1, message).max(max);
const personalSalutation = z.enum(["frau", "herr"], { message: "Bitte wählen Sie eine Anrede." });
const salutationLastName = requiredText(80, "Bitte geben Sie den Nachnamen für die Anrede an.");
const courseContactGreeting = z.object({
  salutation: z.union([personalSalutation, z.literal("unknown")]),
  lastName: z.string().trim().max(80),
}).refine(({ salutation, lastName }) => salutation === "unknown" || lastName.length > 0, {
  path: ["lastName"], message: "Bitte geben Sie den Nachnamen für die Anrede an.",
});
const phone = z.string().trim().max(40).refine(
  (value) => /^[+0-9\s()./\-]+$/.test(value) && value.replace(/\D/g, "").length >= 5,
  "Bitte geben Sie eine gültige Telefonnummer an.",
);
const bookingFields = z.object({
  id: z.string().uuid(),
  date: z.string().refine(validCourseDate, "Bitte wählen Sie einen gültigen Kurstag."),
  time: z.string().refine((value) => COURSE_TIMES.includes(value), "Bitte wählen Sie eine freie Uhrzeit."),
  company: requiredText(160, "Bitte geben Sie den Firmennamen an."),
  outreachCode: z.string().uuid().optional(),
  contactName: requiredText(120, "Bitte geben Sie den Namen der Ansprechperson an."),
  contactGreeting: courseContactGreeting.optional(),
  email: courseEmail,
  phone,
  website: z.string().max(0).optional(),
});

export const courseBookingSchema = z.discriminatedUnion("format", [
  bookingFields.extend({
    format: z.literal("onsite"),
    address: requiredText(240, "Bitte geben Sie die Adresse des Schulungsorts an."),
    room: requiredText(100, "Bitte geben Sie den Schulungsraum an."),
    parking: z.string().trim().max(300).optional(),
  }),
  bookingFields.extend({ format: z.literal("online") }),
]);

export const courseParticipantSchema = z.object({
  id: z.string().uuid(),
  code: z.string().uuid(),
  firstName: requiredText(80, "Bitte geben Sie Ihren Vornamen an."),
  lastName: requiredText(80, "Bitte geben Sie Ihren Nachnamen an."),
  email: courseEmail,
  website: z.string().max(0).optional(),
});

export type CourseBookingInput = z.input<typeof courseBookingSchema>;
export type CourseContactSalutation = z.input<typeof courseContactGreeting>["salutation"];
export type CourseParticipantInput = z.input<typeof courseParticipantSchema>;

export const courseInfoAppointmentSchema = z.object({
  id: z.string().uuid(),
  date: z.string().refine(validCourseDate, "Bitte wählen Sie einen gültigen Tag."),
  time: z.string().refine((value) => INFO_APPOINTMENT_TIMES.includes(value), "Bitte wählen Sie eine freie Uhrzeit."),
  contactName: requiredText(120, "Bitte geben Sie Ihren Namen an."),
  email: courseEmail,
  phone,
  company: z.string().trim().max(160).optional(),
  website: z.string().max(0).optional(),
});

export type CourseInfoAppointmentInput = z.input<typeof courseInfoAppointmentSchema>;

export const courseInvitationSchema = z.object({
  email: courseEmail,
  id: z.string().uuid(),
  recipient: z.discriminatedUnion("kind", [
    z.object({
      kind: z.literal("named"),
      salutation: personalSalutation,
      lastName: salutationLastName,
    }),
    z.object({ kind: z.literal("unknown") }),
  ], { errorMap: () => ({ message: "Bitte geben Sie Anrede und Nachname an oder wählen Sie „Nicht bekannt“." }) }),
});

export type CourseInvitationInput = z.input<typeof courseInvitationSchema>;

export const manualCourseOutreachSchema = z.object({
  email: courseEmail,
  note: z.string().trim().max(400),
  sentDate: z.string().date("Bitte geben Sie ein gültiges Versanddatum an.").optional(),
});

export type ManualCourseOutreachInput = z.input<typeof manualCourseOutreachSchema>;
