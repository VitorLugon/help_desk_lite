"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { TicketStatus, UserRole } from "@/generated/prisma/enums";
import { statusLabels } from "./labels";

type TicketStatusFormProps = {
  currentStatus: TicketStatus;
  currentUserRole: UserRole;
  ticketId: string;
};

const technicianStatuses = [
  TicketStatus.IN_PROGRESS,
  TicketStatus.WAITING_USER,
  TicketStatus.RESOLVED,
] as const;

const adminStatuses = [
  TicketStatus.OPEN,
  TicketStatus.IN_PROGRESS,
  TicketStatus.WAITING_USER,
  TicketStatus.RESOLVED,
  TicketStatus.CLOSED,
  TicketStatus.CANCELED,
] as const;

export function TicketStatusForm({
  currentStatus,
  currentUserRole,
  ticketId,
}: TicketStatusFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<TicketStatus>(currentStatus);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const options =
    currentUserRole === UserRole.ADMIN ? adminStatuses : technicianStatuses;

  function submitStatus() {
    setMessage("");

    startTransition(async () => {
      const response = await fetch(`/api/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setMessage(result.message ?? "Não foi possível alterar o status.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Alterar status</h2>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <select
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
          onChange={(event) => setStatus(event.target.value as TicketStatus)}
          value={status}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {statusLabels[option]}
            </option>
          ))}
        </select>
        <button
          className="h-10 rounded-md bg-cyan-700 px-4 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={isPending}
          onClick={submitStatus}
          type="button"
        >
          {isPending ? "Salvando..." : "Salvar status"}
        </button>
      </div>
      {message ? (
        <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {message}
        </p>
      ) : null}
    </div>
  );
}
