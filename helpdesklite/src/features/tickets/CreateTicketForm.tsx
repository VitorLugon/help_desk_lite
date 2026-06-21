"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { TicketPriority } from "@/generated/prisma/enums";
import { priorityLabels } from "./labels";
import { createTicketSchema, type CreateTicketInput } from "./schemas";

const priorityOptions = [
  TicketPriority.LOW,
  TicketPriority.MEDIUM,
  TicketPriority.HIGH,
  TicketPriority.CRITICAL,
] as const;

export function CreateTicketForm() {
  const router = useRouter();
  const [formMessage, setFormMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CreateTicketInput>({
    defaultValues: {
      title: "",
      description: "",
      category: "",
      priority: TicketPriority.MEDIUM,
    },
  });

  function onSubmit(data: CreateTicketInput) {
    setFormMessage("");
    clearErrors();

    const parsedData = createTicketSchema.safeParse(data);

    if (!parsedData.success) {
      for (const issue of parsedData.error.issues) {
        const fieldName = issue.path[0];

        if (
          fieldName === "title" ||
          fieldName === "description" ||
          fieldName === "category" ||
          fieldName === "priority"
        ) {
          setError(fieldName, { message: issue.message });
        }
      }

      return;
    }

    startTransition(async () => {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData.data),
      });
      const result = (await response.json()) as {
        ticketId?: string;
        message?: string;
      };

      if (!response.ok || !result.ticketId) {
        setFormMessage(result.message ?? "Não foi possível abrir o chamado.");
        return;
      }

      router.push(`/tickets/${result.ticketId}`);
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <FieldError message={formMessage} />

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-800" htmlFor="title">
          Título
        </label>
        <input
          className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
          id="title"
          placeholder="Ex.: Notebook não conecta ao Wi-Fi"
          type="text"
          {...register("title")}
        />
        <FieldError message={errors.title?.message} />
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium text-slate-800"
          htmlFor="description"
        >
          Descrição
        </label>
        <textarea
          className="min-h-36 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
          id="description"
          placeholder="Explique o problema, quando começou e qual impacto está causando."
          {...register("description")}
        />
        <FieldError message={errors.description?.message} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-800"
            htmlFor="category"
          >
            Categoria
          </label>
          <input
            className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            id="category"
            placeholder="Hardware, Rede, Acesso..."
            type="text"
            {...register("category")}
          />
          <FieldError message={errors.category?.message} />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-800"
            htmlFor="priority"
          >
            Prioridade sugerida
          </label>
          <select
            className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
            id="priority"
            {...register("priority")}
          >
            {priorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priorityLabels[priority]}
              </option>
            ))}
          </select>
          <FieldError message={errors.priority?.message} />
        </div>
      </div>

      <button
        className="h-11 rounded-md bg-cyan-700 px-5 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Abrindo chamado..." : "Abrir chamado"}
      </button>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {message}
    </p>
  );
}
