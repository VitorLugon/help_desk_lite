export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-[88vh] w-full max-w-6xl flex-col justify-center gap-10 px-6 py-10 sm:px-8 lg:px-10">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-cyan-700">
              Projeto fullstack júnior
            </p>
            <h1 className="text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              HelpDesk Lite
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
              Sistema de chamados de suporte técnico para solicitantes,
              técnicos e administradores, construído com Next.js, TypeScript,
              Prisma e PostgreSQL.
            </p>
            <a
              className="mt-8 inline-flex h-11 items-center rounded-md bg-cyan-700 px-4 text-sm font-semibold text-white transition hover:bg-cyan-800"
              href="/login"
            >
              Acessar sistema
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Solicitante",
                description:
                  "Abre chamados, acompanha status e conversa com o suporte.",
              },
              {
                title: "Técnico",
                description:
                  "Atende chamados atribuídos e atualiza o andamento do suporte.",
              },
              {
                title: "Admin",
                description:
                  "Gerencia usuários, atribuições e indicadores operacionais.",
              },
            ].map((item) => (
              <article
                className="rounded-lg border border-slate-200 bg-slate-50 p-5"
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
          </div>

          <div className="flex flex-wrap gap-3 text-sm font-medium text-slate-700">
            {[
              "Next.js App Router",
              "React",
              "TypeScript",
              "Tailwind CSS",
              "Prisma",
              "PostgreSQL",
              "Zod",
              "React Hook Form",
              "Vitest",
            ].map((tech) => (
              <span
                className="rounded-md border border-slate-200 bg-white px-3 py-2"
                key={tech}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto w-full max-w-6xl px-6 py-8 text-sm text-slate-600 sm:px-8 lg:px-10">
        MVP em preparação: a próxima etapa será criar migrations, seed e a
        base de autenticação.
      </section>
    </main>
  );
}
