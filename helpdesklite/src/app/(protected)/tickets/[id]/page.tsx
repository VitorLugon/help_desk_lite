import Link from "next/link";
import { notFound } from "next/navigation";
import { priorityLabels, statusLabels } from "@/features/tickets/labels";
import { getTicketForUser } from "@/features/tickets/queries";
import { requireCurrentUser } from "@/server/auth/current-user";

type TicketDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function TicketDetailPage({
  params,
}: TicketDetailPageProps) {
  const currentUser = await requireCurrentUser();
  const { id } = await params;
  const ticket = await getTicketForUser(currentUser, id);

  if (!ticket) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-8 sm:px-8 lg:px-10">
      <Link className="text-sm font-medium text-cyan-700" href="/tickets">
        Voltar para chamados
      </Link>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{ticket.id}</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-950">
              {ticket.title}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
              {statusLabels[ticket.status]}
            </span>
            <span className="rounded-md bg-cyan-50 px-2 py-1 text-xs font-medium text-cyan-800">
              {priorityLabels[ticket.priority]}
            </span>
          </div>
        </div>

        <p className="mt-6 text-sm leading-6 text-slate-700">
          {ticket.description}
        </p>

        <dl className="mt-6 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Categoria
            </dt>
            <dd className="mt-1 text-sm text-slate-800">{ticket.category}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Solicitante
            </dt>
            <dd className="mt-1 text-sm text-slate-800">
              {ticket.requester.name}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Responsável
            </dt>
            <dd className="mt-1 text-sm text-slate-800">
              {ticket.assignee?.name ?? "Sem técnico"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Criado em
            </dt>
            <dd className="mt-1 text-sm text-slate-800">
              {formatDateTime(ticket.createdAt)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">Comentários</h2>
        {ticket.comments.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {ticket.comments.map((comment) => (
              <li className="rounded-md bg-slate-50 p-4" key={comment.id}>
                <p className="text-sm text-slate-700">{comment.content}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {comment.author.name} · {formatDateTime(comment.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-600">
            Este chamado ainda não possui comentários.
          </p>
        )}
      </section>
    </main>
  );
}
