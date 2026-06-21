import Link from "next/link";
import { UserRole } from "@/generated/prisma/client";
import { CreateTicketForm } from "@/features/tickets/CreateTicketForm";
import { requireCurrentUser } from "@/server/auth/current-user";

export default async function NewTicketPage() {
  const currentUser = await requireCurrentUser();

  if (currentUser.role !== UserRole.REQUESTER) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-8 sm:px-8 lg:px-10">
        <Link className="text-sm font-medium text-cyan-700" href="/tickets">
          Voltar para chamados
        </Link>

        <section className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-6">
          <h1 className="text-xl font-bold text-amber-900">
            Acesso restrito
          </h1>
          <p className="mt-3 text-sm leading-6 text-amber-800">
            Apenas solicitantes podem abrir chamados. Técnicos e admins podem
            acompanhar e tratar chamados pelas telas operacionais.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-8 sm:px-8 lg:px-10">
      <Link className="text-sm font-medium text-cyan-700" href="/tickets">
        Voltar para chamados
      </Link>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
          Novo chamado
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">
          Abrir chamado de suporte
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Descreva o problema com clareza. O chamado será criado como aberto e
          ficará disponível para acompanhamento.
        </p>

        <div className="mt-8">
          <CreateTicketForm />
        </div>
      </section>
    </main>
  );
}
