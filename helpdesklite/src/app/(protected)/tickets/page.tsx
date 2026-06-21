import Link from "next/link";
import { UserRole } from "@/generated/prisma/client";
import { TicketFiltersForm } from "@/features/tickets/TicketFiltersForm";
import { TicketList } from "@/features/tickets/TicketList";
import { parseTicketFilters, type TicketFilters } from "@/features/tickets/filters";
import { listTicketsForUser } from "@/features/tickets/queries";
import { requireCurrentUser } from "@/server/auth/current-user";

type TicketsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TicketsPage({ searchParams }: TicketsPageProps) {
  const currentUser = await requireCurrentUser();
  const resolvedSearchParams = await searchParams;
  const parsedFilters = parseTicketFilters(resolvedSearchParams);
  let tickets: Awaited<ReturnType<typeof listTicketsForUser>> = [];
  let errorMessage = "";

  if (!parsedFilters.success) {
    errorMessage =
      "Os filtros informados são inválidos. Limpe os filtros e tente novamente.";
  }

  if (parsedFilters.success) {
    try {
      tickets = await listTicketsForUser(
        currentUser,
        parsedFilters.data as TicketFilters,
      );
    } catch {
      errorMessage =
        "Não foi possível carregar os chamados agora. Tente novamente em instantes.";
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-8 lg:px-10">
      <TicketPageHeader canCreateTicket={currentUser.role === UserRole.REQUESTER} />
      <TicketFiltersForm searchParams={resolvedSearchParams} />

      <section className="mt-6">
        {errorMessage ? (
          <TicketErrorState message={errorMessage} />
        ) : tickets.length > 0 ? (
          <TicketList tickets={tickets} />
        ) : (
          <TicketEmptyState />
        )}
      </section>
    </main>
  );
}

function TicketPageHeader({ canCreateTicket }: { canCreateTicket: boolean }) {
  return (
    <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
          Chamados
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">
          Listagem de chamados
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          A lista respeita seu perfil: solicitantes veem seus próprios chamados,
          técnicos veem os atribuídos a eles e admins veem todos.
        </p>
      </div>

      {canCreateTicket ? (
        <Link
          className="inline-flex h-11 items-center justify-center rounded-md bg-cyan-700 px-4 text-sm font-semibold text-white transition hover:bg-cyan-800"
          href="/tickets/new"
        >
          Novo chamado
        </Link>
      ) : null}
    </section>
  );
}

function TicketEmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
      <h2 className="text-lg font-semibold text-slate-950">
        Nenhum chamado encontrado
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
        Não há chamados para os filtros selecionados ou para o seu perfil de
        acesso.
      </p>
    </div>
  );
}

function TicketErrorState({ message }: { message: string }) {
  return (
    <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-5">
      <h2 className="text-base font-semibold text-red-800">
        Erro ao carregar chamados
      </h2>
      <p className="mt-2 text-sm leading-6 text-red-700">{message}</p>
    </div>
  );
}
