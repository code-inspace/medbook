"use client";

import { useState } from "react";

import type { Patient } from "../types/patient";
import { PatientEditForm } from "./patient-edit-form";

type Props = {
  patients: Patient[];
};

export function PatientList({ patients }: Props) {
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);

  const editingPatient = patients.find(
    (patient) => patient.id === editingPatientId,
  );

  return (
    <div>
      {patients.map((patient) => (
        <div key={patient.id}>
          <span>
            {patient.firstName} {patient.lastName}
          </span>

          <button type="button" onClick={() => setEditingPatientId(patient.id)}>
            Modifier
          </button>
        </div>
      ))}

      {editingPatient && (
        <PatientEditForm
          patient={editingPatient}
          onSuccess={() => setEditingPatientId(null)}
        />
      )}
    </div>
  );
}
