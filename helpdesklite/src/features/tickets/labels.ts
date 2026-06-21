import { TicketPriority, TicketStatus, UserRole } from "@/generated/prisma/enums";

export const statusLabels: Record<TicketStatus, string> = {
  [TicketStatus.OPEN]: "Aberto",
  [TicketStatus.IN_PROGRESS]: "Em andamento",
  [TicketStatus.WAITING_USER]: "Aguardando usuário",
  [TicketStatus.RESOLVED]: "Resolvido",
  [TicketStatus.CLOSED]: "Fechado",
  [TicketStatus.CANCELED]: "Cancelado",
};

export const priorityLabels: Record<TicketPriority, string> = {
  [TicketPriority.LOW]: "Baixa",
  [TicketPriority.MEDIUM]: "Média",
  [TicketPriority.HIGH]: "Alta",
  [TicketPriority.CRITICAL]: "Crítica",
};

export const roleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Administrador",
  [UserRole.TECHNICIAN]: "Técnico",
  [UserRole.REQUESTER]: "Solicitante",
};
