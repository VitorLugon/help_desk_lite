import "server-only";

import { Prisma, TicketStatus, UserRole } from "@/generated/prisma/client";
import type { CurrentUser } from "@/server/auth/current-user";
import {
  canAssignTicketByRole,
  canChangeTicketStatusByRole,
  canCommentOnTicketByRole,
  canCreateTicketByRole,
  canTransitionTicketStatusByRole,
} from "./authorization-rules";

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
  return canCreateTicketByRole(user);
}

export function canCommentOnTicket(
  user: CurrentUser,
  ticket: {
    status: TicketStatus;
    requesterId: string;
    assigneeId: string | null;
  },
) {
  return canCommentOnTicketByRole(user, ticket);
}

export function canChangeTicketStatus(
  user: CurrentUser,
  ticket: {
    assigneeId: string | null;
  },
) {
  return canChangeTicketStatusByRole(user, ticket);
}

export function canAssignTicket(user: CurrentUser) {
  return canAssignTicketByRole(user);
}

export function canTransitionTicketStatus(
  user: CurrentUser,
  currentStatus: TicketStatus,
  nextStatus: TicketStatus,
) {
  return canTransitionTicketStatusByRole(user, currentStatus, nextStatus);
}
