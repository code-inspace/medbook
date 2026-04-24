import { z } from "zod";

// Limites alignées sur les règles du domaine côté API (15 à 120 minutes).
export const DURATIONS = [15, 30, 45, 60, 90, 120] as const;

export const scheduleAppointmentSchema = z.object({
  patientId: z.string().min(1, "Choisissez un patient"),
  startsAt: z.string().min(1, "Choisissez une date et une heure"),
  durationMinutes: z.coerce.number().int().min(15).max(120),
});

export type ScheduleAppointmentForm = z.input<typeof scheduleAppointmentSchema>;
export type ScheduleAppointmentValues = z.output<typeof scheduleAppointmentSchema>;
