import { z } from "zod";
import { TicketPriority, TicketStatus } from "@/generated/prisma/enums";

const ticketPriorityValues = [
  TicketPriority.LOW,
  TicketPriority.MEDIUM,
  TicketPriority.HIGH,
  TicketPriority.CRITICAL,
] as const;

export const createTicketSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Informe um título com pelo menos 5 caracteres.")
    .max(120, "O título deve ter no máximo 120 caracteres."),
  description: z
    .string()
    .trim()
    .min(20, "Descreva o problema com pelo menos 20 caracteres.")
    .max(2000, "A descrição deve ter no máximo 2000 caracteres."),
  category: z
    .string()
    .trim()
    .min(2, "Informe uma categoria.")
    .max(60, "A categoria deve ter no máximo 60 caracteres."),
  priority: z.enum(ticketPriorityValues, {
    message: "Selecione uma prioridade válida.",
  }),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;

const ticketStatusValues = [
  TicketStatus.OPEN,
  TicketStatus.IN_PROGRESS,
  TicketStatus.WAITING_USER,
  TicketStatus.RESOLVED,
  TicketStatus.CLOSED,
  TicketStatus.CANCELED,
] as const;

export const createTicketCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(2, "Escreva um comentário com pelo menos 2 caracteres.")
    .max(1500, "O comentário deve ter no máximo 1500 caracteres."),
});

export const updateTicketStatusSchema = z.object({
  status: z.enum(ticketStatusValues, {
    message: "Selecione um status válido.",
  }),
});

export const assignTicketSchema = z.object({
  assigneeId: z.string().min(1, "Selecione um técnico."),
});

export type CreateTicketCommentInput = z.infer<
  typeof createTicketCommentSchema
>;
export type UpdateTicketStatusInput = z.infer<typeof updateTicketStatusSchema>;
export type AssignTicketInput = z.infer<typeof assignTicketSchema>;
