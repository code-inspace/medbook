export type AppointmentStatus = "SCHEDULED" | "CANCELLED";

export interface Appointment {
  id: string;
  patientId: string;
  practitionerId: string;
  startsAt: string;
  endsAt: string;
  status: AppointmentStatus;
  createdAt: string;
}
