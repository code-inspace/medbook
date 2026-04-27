import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto grid w-full max-w-sm gap-6 px-4 py-16">
      <h1 className="text-2xl font-semibold">Medbook</h1>
      <LoginForm />
    </main>
  );
}
