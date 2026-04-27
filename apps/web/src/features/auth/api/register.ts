import { api } from "@/shared/api/api";

export type RegisterInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export async function register(data: RegisterInput) {
  const response = await api.post("/auth/register", data);
  return response.data;
}
