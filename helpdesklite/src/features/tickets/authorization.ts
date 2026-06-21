import "server-only";

import { Prisma, UserRole } from "@/generated/prisma/client";
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
