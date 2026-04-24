import { isAxiosError } from "axios";

/** Extrait le message renvoyé par l'API (erreur métier ou de validation). */
export function errorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string") return message;
  }
  return "Une erreur est survenue.";
}
