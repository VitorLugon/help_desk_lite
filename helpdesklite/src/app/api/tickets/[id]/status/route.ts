import { NextResponse } from "next/server";
import {
  canChangeTicketStatus,
  canSetTicketStatus,
} from "@/features/tickets/authorization";
import { updateTicketStatusSchema } from "@/features/tickets/schemas";
import { getCurrentUser } from "@/server/auth/current-user";
import { prisma } from "@/server/db/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { message: "Faça login para alterar o status." },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      assigneeId: true,
    },
  });

  if (!ticket || !canChangeTicketStatus(currentUser, ticket)) {
    return NextResponse.json(
      { message: "Você não tem permissão para alterar este chamado." },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsedBody = updateTicketStatusSchema.safeParse(body);

  if (!parsedBody.success || !canSetTicketStatus(currentUser, parsedBody.data.status)) {
    return NextResponse.json(
      { message: "Status inválido para o seu perfil." },
      { status: 400 },
    );
  }

  if (ticket.status === parsedBody.data.status) {
    return NextResponse.json({ ok: true });
  }

  await prisma.$transaction([
    prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: parsedBody.data.status,
        resolvedAt:
          parsedBody.data.status === "RESOLVED" ? new Date() : undefined,
        closedAt: parsedBody.data.status === "CLOSED" ? new Date() : undefined,
      },
    }),
    prisma.ticketStatusHistory.create({
      data: {
        ticketId: ticket.id,
        changedById: currentUser.id,
        fromStatus: ticket.status,
        toStatus: parsedBody.data.status,
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
