import Link from "next/link";
import { logoutAction } from "@/features/auth/actions";
import { requireCurrentUser } from "@/server/auth/current-user";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await requireCurrentUser();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-6">
            <Link className="text-lg font-bold text-slate-950" href="/dashboard">
              HelpDesk Lite
            </Link>
            <nav className="hidden items-center gap-4 text-sm font-medium text-slate-600 md:flex">
              <Link className="transition hover:text-slate-950" href="/dashboard">
                Dashboard
              </Link>
              <Link className="transition hover:text-slate-950" href="/tickets">
                Chamados
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-900">
                {currentUser.name}
              </p>
              <p className="text-xs text-slate-500">{currentUser.role}</p>
            </div>
            <form action={logoutAction}>
              <button
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                type="submit"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
