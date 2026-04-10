import { api } from "@/shared/api/api";
import { Patient } from "../types/patient";
import { CreatePatientForm } from "../schemas/create-patient.schema";

export async function createPatient(
  data: CreatePatientForm,
): Promise<Patient> {
  const response = await api.post<Patient>(
    "/patients",
    data,
  );

  return response.data;
}