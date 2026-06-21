import Link from "next/link";
import { notFound } from "next/navigation";
import {
  canAssignTicket,
  canChangeTicketStatus,
  canCommentOnTicket,
} from "@/features/tickets/authorization";
import { priorityLabels, statusLabels } from "@/features/tickets/labels";
import {
  getTicketForUser,
  listActiveTechnicians,
} from "@/features/tickets/queries";
import { TicketAssigneeForm } from "@/features/tickets/TicketAssigneeForm";
import { TicketCommentForm } from "@/features/tickets/TicketCommentForm";
import { TicketStatusForm } from "@/features/tickets/TicketStatusForm";
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

  const userCanComment = canCommentOnTicket(currentUser, ticket);
  const userCanChangeStatus = canChangeTicketStatus(currentUser, ticket);
  const userCanAssign = canAssignTicket(currentUser);
  const technicians = userCanAssign ? await listActiveTechnicians() : [];

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8 sm:px-8 lg:px-10">
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

        <dl className="mt-6 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Categoria" value={ticket.category} />
          <InfoItem label="Solicitante" value={ticket.requester.name} />
          <InfoItem
            label="Responsável"
            value={ticket.assignee?.name ?? "Sem técnico"}
          />
          <InfoItem label="Criado em" value={formatDateTime(ticket.createdAt)} />
          <InfoItem
            label="Atualizado em"
            value={formatDateTime(ticket.updatedAt)}
          />
          <InfoItem
            label="Resolvido em"
            value={ticket.resolvedAt ? formatDateTime(ticket.resolvedAt) : "-"}
          />
        </dl>
      </section>

      {(userCanChangeStatus || userCanAssign) && (
        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          {userCanChangeStatus ? (
            <TicketStatusForm
              currentStatus={ticket.status}
              currentUserRole={currentUser.role}
              ticketId={ticket.id}
            />
          ) : null}

          {userCanAssign ? (
            <TicketAssigneeForm
              currentAssigneeId={ticket.assigneeId}
              technicians={technicians}
              ticketId={ticket.id}
            />
          ) : null}
        </section>
      )}

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

        {userCanComment ? (
          <TicketCommentForm ticketId={ticket.id} />
        ) : (
          <p className="mt-5 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            Você não pode comentar neste chamado no status atual.
          </p>
        )}
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">
          Histórico de status
        </h2>
        {ticket.statusHistory.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {ticket.statusHistory.map((history) => (
              <li
                className="rounded-md border border-slate-200 bg-slate-50 p-4"
                key={history.id}
              >
                <p className="text-sm text-slate-700">
                  {history.fromStatus
                    ? statusLabels[history.fromStatus]
                    : "Criado"}{" "}
                  → {statusLabels[history.toStatus]}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {history.changedBy.name} ·{" "}
                  {formatDateTime(history.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-600">
            Ainda não há histórico de status.
          </p>
        )}
      </section>
    </main>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-slate-800">{value}</dd>
    </div>
  );
}
