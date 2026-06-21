import Link from "next/link";
import { UserRole } from "@/generated/prisma/client";
import { DashboardCharts } from "@/features/dashboard/DashboardCharts";
import { getDashboardData } from "@/features/dashboard/queries";
import {
  priorityLabels,
  roleLabels,
  statusLabels,
} from "@/features/tickets/labels";
import { requireCurrentUser } from "@/server/auth/current-user";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export default async function DashboardPage() {
  const currentUser = await requireCurrentUser();
  const roleLabel = roleLabels[currentUser.role];
  const dashboardData = await getDashboardData(currentUser);
  const statusData = dashboardData.ticketsByStatus.map((item) => ({
    label: statusLabels[item.status],
    total: item.total,
  }));
  const priorityData = dashboardData.ticketsByPriority.map((item) => ({
    label: priorityLabels[item.priority],
    total: item.total,
  }));

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-8 lg:px-10">
      <section className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
            Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">
            Olá, {currentUser.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Você está acessando como {roleLabel}. Os indicadores respeitam seu
            papel e mostram apenas os chamados que você pode visualizar.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            href="/tickets"
          >
            Ver chamados
          </Link>
          {currentUser.role === UserRole.REQUESTER ? (
            <Link
              className="inline-flex h-11 items-center justify-center rounded-md bg-cyan-700 px-4 text-sm font-semibold text-white transition hover:bg-cyan-800"
              href="/tickets/new"
            >
              Abrir chamado
            </Link>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Chamados abertos"
          value={dashboardData.metrics.openTickets}
        />
        <MetricCard
          label="Em andamento"
          value={dashboardData.metrics.inProgressTickets}
        />
        <MetricCard
          label="Chamados críticos"
          value={dashboardData.metrics.criticalTickets}
        />
        <MetricCard
          label="Resolvidos no mês"
          value={dashboardData.metrics.resolvedThisMonth}
        />
      </section>

      <div className="mt-6">
        <DashboardCharts priorityData={priorityData} statusData={statusData} />
      </div>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-950">
            Últimos chamados criados
          </h2>
        </div>

        {dashboardData.recentTickets.length > 0 ? (
          <ul className="divide-y divide-slate-200">
            {dashboardData.recentTickets.map((ticket) => (
              <li key={ticket.id}>
                <Link
                  className="grid gap-3 px-5 py-4 transition hover:bg-slate-50 md:grid-cols-[1fr_130px_110px_120px] md:items-center"
                  href={`/tickets/${ticket.id}`}
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      {ticket.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Solicitante: {ticket.requester.name} · Responsável:{" "}
                      {ticket.assignee?.name ?? "Sem técnico"}
                    </p>
                  </div>
                  <span className="w-fit rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                    {statusLabels[ticket.status]}
                  </span>
                  <span className="w-fit rounded-md bg-cyan-50 px-2 py-1 text-xs font-medium text-cyan-800">
                    {priorityLabels[ticket.priority]}
                  </span>
                  <span className="text-sm text-slate-600">
                    {formatDate(ticket.createdAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <h3 className="text-base font-semibold text-slate-950">
              Nenhum chamado encontrado
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Os chamados criados aparecerão aqui conforme seu perfil de acesso.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
    </article>
  );
}
