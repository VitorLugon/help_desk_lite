import Link from "next/link";
import { UserRole } from "@/generated/prisma/client";
import { requireCurrentUser } from "@/server/auth/current-user";
import { roleLabels } from "@/features/tickets/labels";

export default async function DashboardPage() {
  const currentUser = await requireCurrentUser();
  const roleLabel = roleLabels[currentUser.role];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-8 lg:px-10">
      <section className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
          Área interna
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">
          Olá, {currentUser.name}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Seu acesso está ativo como {roleLabel}. As próximas etapas do MVP vão
          adicionar listagem de chamados, usuários e indicadores.
        </p>
        {currentUser.role === UserRole.REQUESTER ? (
          <Link
            className="mt-6 inline-flex h-11 items-center rounded-md bg-cyan-700 px-4 text-sm font-semibold text-white transition hover:bg-cyan-800"
            href="/tickets/new"
          >
            Abrir chamado
          </Link>
        ) : null}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[ 
          {
            title: "Chamados",
            description:
              "Consulte chamados com filtros por status e prioridade.",
            href: "/tickets",
          },
          {
            title: "Usuários",
            description: "Gestão de usuários será restrita ao perfil admin.",
            href: null,
          },
          {
            title: "Dashboard",
            description: "Indicadores operacionais entrarão após os chamados.",
            href: null,
          },
        ].map((item) => {
          const content = (
            <>
              <h2 className="text-base font-semibold text-slate-950">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            </>
          );

          return item.href ? (
            <Link
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50"
              href={item.href}
              key={item.title}
            >
              {content}
            </Link>
          ) : (
          <article
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            key={item.title}
          >
            {content}
          </article>
          );
        })}
      </section>
    </main>
  );
}
