import { api } from "@/shared/api/api";

type LoginInput = {
  email: string;
  password: string;
};

export async function login(data: LoginInput) {
  const response = await api.post("/auth/login", data);

  return response.data;
}
