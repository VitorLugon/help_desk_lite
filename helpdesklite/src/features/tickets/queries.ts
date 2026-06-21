import "server-only";

import { Prisma } from "@/generated/prisma/client";
import type { CurrentUser } from "@/server/auth/current-user";
import { prisma } from "@/server/db/prisma";
import { getTicketWhereForUser } from "./authorization";
import type { TicketFilters } from "./filters";

function buildTicketWhere(
  user: CurrentUser,
  filters: TicketFilters,
): Prisma.TicketWhereInput {
  const filterWhere: Prisma.TicketWhereInput = {
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.priority ? { priority: filters.priority } : {}),
  };

  return {
    AND: [getTicketWhereForUser(user), filterWhere],
  };
}

export async function listTicketsForUser(
  user: CurrentUser,
  filters: TicketFilters,
) {
  return prisma.ticket.findMany({
    where: buildTicketWhere(user, filters),
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      category: true,
      createdAt: true,
      requester: {
        select: {
          name: true,
          email: true,
        },
      },
      assignee: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
}

export async function getTicketForUser(user: CurrentUser, ticketId: string) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      AND: [getTicketWhereForUser(user), { id: ticketId }],
    },
    select: {
      id: true,
      requesterId: true,
      assigneeId: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      category: true,
      createdAt: true,
      updatedAt: true,
      resolvedAt: true,
      closedAt: true,
      requester: {
        select: {
          name: true,
          email: true,
        },
      },
      assignee: {
        select: {
          name: true,
          email: true,
        },
      },
      comments: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: {
            select: {
              name: true,
            },
          },
        },
      },
      statusHistory: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          fromStatus: true,
          toStatus: true,
          createdAt: true,
          changedBy: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return ticket;
}

export async function listActiveTechnicians() {
  return prisma.user.findMany({
    where: {
      role: "TECHNICIAN",
      status: "ACTIVE",
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}
