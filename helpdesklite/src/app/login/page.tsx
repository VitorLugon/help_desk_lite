import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/LoginForm";
import { getCurrentUser } from "@/server/auth/current-user";

export default async function LoginPage() {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
            Acesso interno
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">
            Entrar no HelpDesk Lite
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Use um usuário criado pelo administrador para acessar o sistema.
          </p>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}
