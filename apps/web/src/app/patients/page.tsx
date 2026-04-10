"use client";

import { PatientForm } from "@/features/patients/components/patient-form";
import { PatientList } from "@/features/patients/components/patient-list";
import { usePatients } from "@/features/patients/hooks/use-patients";

export default function PatientsPage() {
  const { data, isPending, error } = usePatients();

  if (isPending) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>Une erreur est survenue.</p>;
  }

  return (
    <main>
      <h1>Patients</h1>

      <PatientForm />

      <PatientList patients={data ?? []} />
    </main>
  );
}
