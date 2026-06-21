"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type Technician = {
  id: string;
  name: string;
  email: string;
};

type TicketAssigneeFormProps = {
  currentAssigneeId: string | null;
  technicians: Technician[];
  ticketId: string;
};

export function TicketAssigneeForm({
  currentAssigneeId,
  technicians,
  ticketId,
}: TicketAssigneeFormProps) {
  const router = useRouter();
  const [assigneeId, setAssigneeId] = useState(currentAssigneeId ?? "");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function submitAssignee() {
    setMessage("");

    startTransition(async () => {
      const response = await fetch(`/api/tickets/${ticketId}/assignee`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assigneeId }),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setMessage(result.message ?? "Não foi possível atribuir o chamado.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Atribuir técnico
      </h2>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <select
          className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
          onChange={(event) => setAssigneeId(event.target.value)}
          value={assigneeId}
        >
          <option value="">Selecione um técnico</option>
          {technicians.map((technician) => (
            <option key={technician.id} value={technician.id}>
              {technician.name} ({technician.email})
            </option>
          ))}
        </select>
        <button
          className="h-10 rounded-md bg-cyan-700 px-4 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={isPending}
          onClick={submitAssignee}
          type="button"
        >
          {isPending ? "Salvando..." : "Atribuir"}
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
