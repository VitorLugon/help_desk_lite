import Link from "next/link";
import { TicketPriority, TicketStatus } from "@/generated/prisma/client";
import {
  parseTicketFilters,
  ticketPriorityOptions,
  ticketStatusOptions,
} from "./filters";
import { priorityLabels, statusLabels } from "./labels";

type TicketFiltersFormProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export function TicketFiltersForm({ searchParams }: TicketFiltersFormProps) {
  const parsedFilters = parseTicketFilters(searchParams);
  const filters = parsedFilters.success ? parsedFilters.data : {};

  return (
    <form className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_1fr_auto_auto]">
      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-800">Status</span>
        <select
          className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
          defaultValue={filters.status ?? ""}
          name="status"
        >
          <option value="">Todos</option>
          {ticketStatusOptions.map((status: TicketStatus) => (
            <option key={status} value={status}>
              {statusLabels[status]}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2">
        <span className="text-sm font-medium text-slate-800">Prioridade</span>
        <select
          className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
          defaultValue={filters.priority ?? ""}
          name="priority"
        >
          <option value="">Todas</option>
          {ticketPriorityOptions.map((priority: TicketPriority) => (
            <option key={priority} value={priority}>
              {priorityLabels[priority]}
            </option>
          ))}
        </select>
      </label>

      <button
        className="h-11 self-end rounded-md bg-cyan-700 px-4 text-sm font-semibold text-white transition hover:bg-cyan-800"
        type="submit"
      >
        Filtrar
      </button>

      <Link
        className="flex h-11 items-center justify-center self-end rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        href="/tickets"
      >
        Limpar
      </Link>
    </form>
  );
}
