import "server-only";

import { Prisma, TicketStatus, UserRole } from "@/generated/prisma/client";
import type { CurrentUser } from "@/server/auth/current-user";

export function getTicketWhereForUser(
  user: CurrentUser,
): Prisma.TicketWhereInput {
  if (user.role === UserRole.ADMIN) {
    return {};
  }

  if (user.role === UserRole.TECHNICIAN) {
    return { assigneeId: user.id };
  }

  return { requesterId: user.id };
}

export function canViewAllTickets(user: CurrentUser) {
  return user.role === UserRole.ADMIN;
}

export function canCreateTicket(user: CurrentUser) {
  return user.role === UserRole.REQUESTER;
}

export function canCommentOnTicket(
  user: CurrentUser,
  ticket: {
    status: TicketStatus;
    requesterId: string;
    assigneeId: string | null;
  },
) {
  const canView =
    user.role === UserRole.ADMIN ||
    ticket.requesterId === user.id ||
    ticket.assigneeId === user.id;

  if (!canView) {
    return false;
  }

  return ticket.status !== TicketStatus.CLOSED || user.role === UserRole.ADMIN;
}

export function canChangeTicketStatus(
  user: CurrentUser,
  ticket: {
    assigneeId: string | null;
  },
) {
  return user.role === UserRole.ADMIN || ticket.assigneeId === user.id;
}

export function canAssignTicket(user: CurrentUser) {
  return user.role === UserRole.ADMIN;
}

export function canSetTicketStatus(user: CurrentUser, status: TicketStatus) {
  if (user.role === UserRole.ADMIN) {
    return true;
  }

  const technicianAllowedStatuses: TicketStatus[] = [
    TicketStatus.IN_PROGRESS,
    TicketStatus.WAITING_USER,
    TicketStatus.RESOLVED,
  ];

  return technicianAllowedStatuses.includes(status);
}
