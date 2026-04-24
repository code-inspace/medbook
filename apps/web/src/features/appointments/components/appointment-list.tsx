"use client";

import { usePatients } from "@/features/patients/hooks/use-patients";
import { errorMessage } from "@/shared/lib/error-message";
import { useCancelAppointment } from "../hooks/use-appointments";
import type { Appointment } from "../types/appointment";

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const timeFormat = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
});

type Props = { appointments: Appointment[] };

export function AppointmentList({ appointments }: Props) {
  const { data: patients = [] } = usePatients();
  const cancel = useCancelAppointment();

  const patientName = (id: string) => {
    const patient = patients.find((p) => p.id === id);
    return patient ? `${patient.firstName} ${patient.lastName}` : "Patient inconnu";
  };

  if (appointments.length === 0) {
    return <p className="text-sm text-zinc-500">Aucun rendez-vous pour le moment.</p>;
  }

  return (
    <div className="grid gap-2">
      {cancel.isError && (
        <p role="alert" className="text-sm text-red-600">
          {errorMessage(cancel.error)}
        </p>
      )}
      <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {appointments.map((appointment) => {
          const cancelled = appointment.status === "CANCELLED";
          return (
            <li
              key={appointment.id}
              className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
            >
              <div className={cancelled ? "text-zinc-400 line-through" : ""}>
                <p className="font-medium">
                  {patientName(appointment.patientId)}
                </p>
                <p className="text-sm text-zinc-500">
                  {dateFormat.format(new Date(appointment.startsAt))} à{" "}
                  {timeFormat.format(new Date(appointment.endsAt))}
                </p>
              </div>
              {cancelled ? (
                <span className="text-xs font-medium text-zinc-500">Annulé</span>
              ) : (
                <button
                  type="button"
                  onClick={() => cancel.mutate(appointment.id)}
                  disabled={cancel.isPending}
                  className="rounded-md border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  Annuler
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
