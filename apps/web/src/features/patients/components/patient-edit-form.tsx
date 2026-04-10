"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createPatientSchema,
  type CreatePatientForm,
} from "../schemas/create-patient.schema";

import { useUpdatePatient } from "../hooks/use-update-patient";
import type { Patient } from "../types/patient";

type Props = {
  patient: Patient;
  onSuccess?: () => void;
};

export function PatientEditForm({ patient, onSuccess }: Props) {
  const mutation = useUpdatePatient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePatientForm>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      firstName: patient.firstName,
      lastName: patient.lastName,
    },
  });

  // useEffect(() => {
  //   reset({
  //     firstName: patient.firstName,
  //     lastName: patient.lastName,
  //   });
  // }, [patient, reset]);

  async function onSubmit(data: CreatePatientForm) {
    console.log("🔥 SUBMIT", data);
    console.log("🔥 PATIENT", patient);

    await mutation.mutateAsync({
      id: patient.id,
      ...data,
    });

    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {mutation.isError && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          Erreur :{" "}
          {mutation.error.message || "Impossible de modifier le patient"}
        </div>
      )}

      <div>
        <input {...register("firstName")} />

        {errors.firstName && <p>{errors.firstName.message}</p>}
      </div>

      <div>
        <input {...register("lastName")} />

        {errors.lastName && <p>{errors.lastName.message}</p>}
      </div>

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
