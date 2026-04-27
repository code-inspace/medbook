import { api } from "@/shared/api/api";
import type { User } from "../types/user";

export async function getMe(): Promise<User> {
  const response = await api.get("/auth/me");

  return response.data;
}
