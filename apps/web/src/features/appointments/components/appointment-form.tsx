"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { usePatients } from "@/features/patients/hooks/use-patients";
import { errorMessage } from "@/shared/lib/error-message";
import { useScheduleAppointment } from "../hooks/use-appointments";
import {
  DURATIONS,
  scheduleAppointmentSchema,
  type ScheduleAppointmentForm,
  type ScheduleAppointmentValues,
} from "../schemas/schedule-appointment.schema";

const field =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";

export function AppointmentForm() {
  const { data: patients = [] } = usePatients();
  const mutation = useScheduleAppointment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ScheduleAppointmentForm, unknown, ScheduleAppointmentValues>({
    resolver: zodResolver(scheduleAppointmentSchema),
    defaultValues: { patientId: "", startsAt: "", durationMinutes: 30 },
  });

  async function onSubmit(values: ScheduleAppointmentValues) {
    await mutation.mutateAsync({
      patientId: values.patientId,
      // datetime-local est sans fuseau : on l'interprète dans le fuseau du navigateur.
      startsAt: new Date(values.startsAt).toISOString(),
      durationMinutes: values.durationMinutes,
    });
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 rounded-lg border border-zinc-200 p-4 sm:grid-cols-[2fr_2fr_1fr_auto] sm:items-end dark:border-zinc-800"
    >
      <label className="grid gap-1 text-sm font-medium">
        Patient
        <select className={field} {...register("patientId")}>
          <option value="">Choisir...</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.firstName} {patient.lastName}
            </option>
          ))}
        </select>
        {errors.patientId && (
          <span className="text-xs text-red-600">{errors.patientId.message}</span>
        )}
      </label>

      <label className="grid gap-1 text-sm font-medium">
        Début
        <input
          type="datetime-local"
          className={field}
          {...register("startsAt")}
        />
        {errors.startsAt && (
          <span className="text-xs text-red-600">{errors.startsAt.message}</span>
        )}
      </label>

      <label className="grid gap-1 text-sm font-medium">
        Durée
        <select className={field} {...register("durationMinutes")}>
          {DURATIONS.map((minutes) => (
            <option key={minutes} value={minutes}>
              {minutes} min
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
      >
        {mutation.isPending ? "Envoi..." : "Planifier"}
      </button>

      {mutation.isError && (
        <p role="alert" className="text-sm text-red-600 sm:col-span-full">
          {errorMessage(mutation.error)}
        </p>
      )}
    </form>
  );
}
