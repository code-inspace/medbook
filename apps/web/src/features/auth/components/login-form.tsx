"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { errorMessage } from "@/shared/lib/error-message";
import { login } from "../api/login";
import { register } from "../api/register";

const field =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900";

export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    setPending(true);
    setError(null);
    try {
      if (mode === "register") {
        await register({
          email,
          password,
          firstName: String(form.get("firstName")),
          lastName: String(form.get("lastName")),
        });
      }
      await login({ email, password });
      queryClient.clear();
      router.push("/appointments");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {mode === "register" && (
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1 text-sm font-medium">
            Prénom
            <input name="firstName" required minLength={2} className={field} />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Nom
            <input name="lastName" required minLength={2} className={field} />
          </label>
        </div>
      )}

      <label className="grid gap-1 text-sm font-medium">
        Email
        <input name="email" type="email" required className={field} />
      </label>

      <label className="grid gap-1 text-sm font-medium">
        Mot de passe
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className={field}
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
      >
        {mode === "login" ? "Se connecter" : "Créer mon compte"}
      </button>

      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
        className="text-sm underline"
      >
        {mode === "login"
          ? "Pas encore de compte ? Créer un compte"
          : "J'ai déjà un compte"}
      </button>
    </form>
  );
}
