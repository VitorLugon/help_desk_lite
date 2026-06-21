import "server-only";

import { Prisma, TicketPriority, TicketStatus } from "@/generated/prisma/client";
import type { CurrentUser } from "@/server/auth/current-user";
import { prisma } from "@/server/db/prisma";
import { getTicketWhereForUser } from "@/features/tickets/authorization";

function startOfCurrentMonth() {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function withUserScope(
  user: CurrentUser,
  where: Prisma.TicketWhereInput,
): Prisma.TicketWhereInput {
  return {
    AND: [getTicketWhereForUser(user), where],
  };
}

export async function getDashboardData(user: CurrentUser) {
  const userScope = getTicketWhereForUser(user);
  const resolvedMonthStart = startOfCurrentMonth();

  const [
    openTickets,
    inProgressTickets,
    criticalTickets,
    resolvedThisMonth,
    ticketsByStatus,
    ticketsByPriority,
    recentTickets,
  ] = await Promise.all([
    prisma.ticket.count({
      where: withUserScope(user, { status: TicketStatus.OPEN }),
    }),
    prisma.ticket.count({
      where: withUserScope(user, { status: TicketStatus.IN_PROGRESS }),
    }),
    prisma.ticket.count({
      where: withUserScope(user, { priority: TicketPriority.CRITICAL }),
    }),
    prisma.ticket.count({
      where: withUserScope(user, {
        status: TicketStatus.RESOLVED,
        resolvedAt: {
          gte: resolvedMonthStart,
        },
      }),
    }),
    prisma.ticket.groupBy({
      by: ["status"],
      where: userScope,
      _count: {
        _all: true,
      },
    }),
    prisma.ticket.groupBy({
      by: ["priority"],
      where: userScope,
      _count: {
        _all: true,
      },
    }),
    prisma.ticket.findMany({
      where: userScope,
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        createdAt: true,
        requester: {
          select: {
            name: true,
          },
        },
        assignee: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  return {
    metrics: {
      openTickets,
      inProgressTickets,
      criticalTickets,
      resolvedThisMonth,
    },
    ticketsByStatus: ticketsByStatus.map((item) => ({
      status: item.status,
      total: item._count._all,
    })),
    ticketsByPriority: ticketsByPriority.map((item) => ({
      priority: item.priority,
      total: item._count._all,
    })),
    recentTickets,
  };
}
