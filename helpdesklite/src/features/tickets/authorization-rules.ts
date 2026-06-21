import { TicketStatus, UserRole } from "@/generated/prisma/enums";

export type AuthorizationUser = {
  id: string;
  role: UserRole;
};

export type TicketAccessSubject = {
  assigneeId: string | null;
  requesterId: string;
  status: TicketStatus;
};

export function isTicketVisibleToUser(
  user: AuthorizationUser,
  ticket: Pick<TicketAccessSubject, "assigneeId" | "requesterId">,
) {
  return (
    user.role === UserRole.ADMIN ||
    ticket.requesterId === user.id ||
    ticket.assigneeId === user.id
  );
}

export function canCreateTicketByRole(user: AuthorizationUser) {
  return user.role === UserRole.REQUESTER;
}

export function canCommentOnTicketByRole(
  user: AuthorizationUser,
  ticket: TicketAccessSubject,
) {
  if (!isTicketVisibleToUser(user, ticket)) {
    return false;
  }

  return ticket.status !== TicketStatus.CLOSED || user.role === UserRole.ADMIN;
}

export function canChangeTicketStatusByRole(
  user: AuthorizationUser,
  ticket: Pick<TicketAccessSubject, "assigneeId">,
) {
  return user.role === UserRole.ADMIN || ticket.assigneeId === user.id;
}

export function canAssignTicketByRole(user: AuthorizationUser) {
  return user.role === UserRole.ADMIN;
}

export function canTransitionTicketStatusByRole(
  user: AuthorizationUser,
  currentStatus: TicketStatus,
  nextStatus: TicketStatus,
) {
  if (user.role === UserRole.ADMIN) {
    return true;
  }

  if (
    currentStatus === TicketStatus.CLOSED ||
    currentStatus === TicketStatus.CANCELED
  ) {
    return false;
  }

  const technicianTransitions: Record<TicketStatus, TicketStatus[]> = {
    [TicketStatus.OPEN]: [TicketStatus.IN_PROGRESS],
    [TicketStatus.IN_PROGRESS]: [
      TicketStatus.WAITING_USER,
      TicketStatus.RESOLVED,
    ],
    [TicketStatus.WAITING_USER]: [
      TicketStatus.IN_PROGRESS,
      TicketStatus.RESOLVED,
    ],
    [TicketStatus.RESOLVED]: [],
    [TicketStatus.CLOSED]: [],
    [TicketStatus.CANCELED]: [],
  };

  return technicianTransitions[currentStatus].includes(nextStatus);
}
