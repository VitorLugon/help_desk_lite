import { requireCurrentUser } from "@/server/auth/current-user";

const roleLabels = {
  ADMIN: "Administrador",
  TECHNICIAN: "Técnico",
  REQUESTER: "Solicitante",
} as const;

export default async function DashboardPage() {
  const currentUser = await requireCurrentUser();
  const roleLabel =
    roleLabels[currentUser.role as keyof typeof roleLabels] ?? currentUser.role;

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
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Chamados",
            description: "Listagem e filtros serão implementados na próxima fase.",
          },
          {
            title: "Usuários",
            description: "Gestão de usuários será restrita ao perfil admin.",
          },
          {
            title: "Dashboard",
            description: "Indicadores operacionais entrarão após os chamados.",
          },
        ].map((item) => (
          <article
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            key={item.title}
          >
            <h2 className="text-base font-semibold text-slate-950">
              {item.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {item.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
