"use client";

import Link from "next/link";

import { AppointmentForm } from "@/features/appointments/components/appointment-form";
import { AppointmentList } from "@/features/appointments/components/appointment-list";
import { useAppointments } from "@/features/appointments/hooks/use-appointments";

export default function AppointmentsPage() {
  const { data, isPending, error } = useAppointments();

  return (
    <main className="mx-auto grid w-full max-w-3xl gap-6 px-4 py-10">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-semibold">Mon agenda</h1>
        <Link href="/patients" className="text-sm underline">
          Gérer mes patients
        </Link>
      </header>

      {isPending && <p>Chargement...</p>}

      {error && (
        <p role="alert">
          Vous devez être connecté pour voir votre agenda.{" "}
          <Link href="/login" className="underline">
            Se connecter
          </Link>
        </p>
      )}

      {data && (
        <>
          <AppointmentForm />
          <AppointmentList appointments={data} />
        </>
      )}
    </main>
  );
}
