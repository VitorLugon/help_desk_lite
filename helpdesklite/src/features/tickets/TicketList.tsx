import Link from "next/link";
import { priorityLabels, statusLabels } from "./labels";

type TicketListProps = {
  tickets: Array<{
    id: string;
    title: string;
    status: keyof typeof statusLabels;
    priority: keyof typeof priorityLabels;
    category: string;
    createdAt: Date;
    requester: {
      name: string;
      email: string;
    };
    assignee: {
      name: string;
      email: string;
    } | null;
    _count: {
      comments: number;
    };
  }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function TicketList({ tickets }: TicketListProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="hidden grid-cols-[1fr_140px_120px_150px_100px] gap-4 border-b border-slate-200 bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 md:grid">
        <span>Chamado</span>
        <span>Status</span>
        <span>Prioridade</span>
        <span>Responsável</span>
        <span>Aberto em</span>
      </div>

      <ul className="divide-y divide-slate-200">
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            <Link
              className="grid gap-3 px-4 py-4 transition hover:bg-slate-50 md:grid-cols-[1fr_140px_120px_150px_100px] md:items-center md:gap-4"
              href={`/tickets/${ticket.id}`}
            >
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  {ticket.title}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {ticket.category} · Solicitante: {ticket.requester.name} ·{" "}
                  {ticket._count.comments} comentário(s)
                </p>
              </div>

              <span className="w-fit rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                {statusLabels[ticket.status]}
              </span>
              <span className="w-fit rounded-md bg-cyan-50 px-2 py-1 text-xs font-medium text-cyan-800">
                {priorityLabels[ticket.priority]}
              </span>
              <span className="text-sm text-slate-600">
                {ticket.assignee?.name ?? "Sem técnico"}
              </span>
              <span className="text-sm text-slate-600">
                {formatDate(ticket.createdAt)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
