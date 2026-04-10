"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createPatientSchema,
  type CreatePatientForm,
} from "../schemas/create-patient.schema";

import { useCreatePatient } from "../hooks/use-create-patient";

export function PatientForm() {
  const mutation = useCreatePatient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePatientForm>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  async function onSubmit(data: CreatePatientForm) {
    await mutation.mutateAsync(data);

    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input placeholder="First name" {...register("firstName")} />

        {errors.firstName && <p>{errors.firstName.message}</p>}
      </div>

      <div>
        <input placeholder="Last name" {...register("lastName")} />

        {errors.lastName && <p>{errors.lastName.message}</p>}
      </div>

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Creating..." : "Create patient"}
      </button>
    </form>
  );
}
