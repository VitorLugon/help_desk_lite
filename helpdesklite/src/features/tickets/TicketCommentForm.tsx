"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  createTicketCommentSchema,
  type CreateTicketCommentInput,
} from "./schemas";

type TicketCommentFormProps = {
  ticketId: string;
};

export function TicketCommentForm({ ticketId }: TicketCommentFormProps) {
  const router = useRouter();
  const [formMessage, setFormMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateTicketCommentInput>({
    defaultValues: {
      content: "",
    },
  });

  function onSubmit(data: CreateTicketCommentInput) {
    setFormMessage("");
    const parsedData = createTicketCommentSchema.safeParse(data);

    if (!parsedData.success) {
      setError("content", {
        message:
          parsedData.error.issues[0]?.message ??
          "Verifique o comentário informado.",
      });
      return;
    }

    startTransition(async () => {
      const response = await fetch(`/api/tickets/${ticketId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData.data),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setFormMessage(result.message ?? "Não foi possível comentar.");
        return;
      }

      reset();
      router.refresh();
    });
  }

  return (
    <form className="mt-5 space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <label className="text-sm font-medium text-slate-800" htmlFor="content">
        Novo comentário
      </label>
      <textarea
        className="min-h-28 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
        id="content"
        placeholder="Escreva uma atualização sobre o chamado."
        {...register("content")}
      />
      {errors.content?.message ? (
        <FeedbackMessage tone="error" message={errors.content.message} />
      ) : null}
      {formMessage ? <FeedbackMessage tone="error" message={formMessage} /> : null}
      <button
        className="h-10 rounded-md bg-cyan-700 px-4 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Enviando..." : "Comentar"}
      </button>
    </form>
  );
}

function FeedbackMessage({
  message,
  tone,
}: {
  message: string;
  tone: "error";
}) {
  const className =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <p className={`rounded-md border px-3 py-2 text-sm ${className}`}>
      {message}
    </p>
  );
}
