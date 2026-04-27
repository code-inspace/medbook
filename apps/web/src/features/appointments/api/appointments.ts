import { api } from "@/shared/api/api";
import type { Appointment } from "../types/appointment";

export type ScheduleAppointmentInput = {
  patientId: string;
  startsAt: string;
  durationMinutes: number;
};

export async function getAppointments(): Promise<Appointment[]> {
  const response = await api.get<Appointment[]>("/appointments");
  return response.data;
}

export async function scheduleAppointment(
  input: ScheduleAppointmentInput,
): Promise<Appointment> {
  const response = await api.post<Appointment>("/appointments", input);
  return response.data;
}

export async function cancelAppointment(id: string): Promise<Appointment> {
  const response = await api.patch<Appointment>(`/appointments/${id}/cancel`);
  return response.data;
}
