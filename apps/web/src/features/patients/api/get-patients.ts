import { api } from "@/shared/api/api";
import { Patient } from "../types/patient";

export async function getPatients(): Promise<Patient[]> {
  const response = await api.get<Patient[]>("/patients");

  return response.data;
}
