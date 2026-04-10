import { api } from "@/shared/api/api";
import type { Patient } from "../types/patient";

export type UpdatePatientInput = {
  id: string;
  firstName?: string;
  lastName?: string;
};

export async function updatePatient(
  data: UpdatePatientInput,
): Promise<Patient> {
  const { id, ...payload } = data;

  const response = await api.patch<Patient>(`/patients/${id}`, payload);

  return response.data;
}
